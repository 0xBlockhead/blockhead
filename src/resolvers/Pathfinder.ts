import {
	type ProviderContinuation,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type {
	BlockId,
	BlockWithTxHashes,
	Event,
	TransactionReceiptWithBlockInfo,
	TransactionWithHash,
} from '$/sources/_shared/interfaces/StarknetJsonRpc/types.ts'

type NetworkIdentity = EntitySelector<typeof schema, EntityType.Network>
type StarknetNetworkIdentity = EntitySelector<typeof schema, EntityType.StarknetNetwork>
type StarknetContractIdentity = EntitySelector<typeof schema, EntityType.StarknetContract>
type StarknetBlockIdentity = EntitySelector<typeof schema, EntityType.StarknetBlock>
type StarknetStorageEntryIdentity = EntitySelector<typeof schema, EntityType.StarknetStorageEntry>

const starknetNetworkApplicability = [
	{
		$network: {
			caip2: networkBySlug.starknet.caip2,
		},
	},
	{
		$network: {
			slug: networkBySlug.starknet.slug,
		},
	},
] as const

const starknetNestedNetworkApplicability = [
	{
		$network: starknetNetworkApplicability[0],
	},
	{
		$network: starknetNetworkApplicability[1],
	},
] as const

const starknetContractApplicability = starknetNestedNetworkApplicability

const assertStarknetMainnet = (network: NetworkIdentity) => {
	if (
		(
			'slug' in network
			&& network.slug === networkBySlug.starknet.slug
		)
		|| (
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.starknet.caip2.namespace
			&& network.caip2.reference === networkBySlug.starknet.caip2.reference
		)
	)
		return

	throw new Error('Pathfinder: unsupported network')
}

const validatedFelt = (
	value: string,
	fieldName: string
) => {
	if (!/^0x[\da-fA-F]{1,64}$/.test(value) || BigInt(value) >= 2n ** 251n)
		throw new Error(`Pathfinder: malformed ${fieldName}`)

	return value
}

const validatedBlockNumber = (
	value: number,
	fieldName: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`Pathfinder: malformed ${fieldName}`)

	return value
}

const unixSecondsToMs = (
	value: number,
	fieldName: string
) => (
	validatedBlockNumber(value, fieldName) * 1000
)

const resolveAccountState = async (
	contract: StarknetContractIdentity,
	blockNumber: number
) => {
	assertStarknetMainnet(contract.$network.$network)
	const address = validatedFelt(contract.address, 'contract address')
	const blockId = {
		block_number: validatedBlockNumber(blockNumber, 'block number'),
	} satisfies BlockId
	const { default: {
		getClassHashAt,
		getNonce,
	} } = await import('$/sources/Pathfinder/JsonRpc/queries.ts')
	const [nonce, classHash] = await Promise.all([
		getNonce(blockId, address),
		getClassHashAt(blockId, address),
	])

	return {
		nonce: validatedFelt(nonce, 'account nonce'),
		classHash: validatedFelt(classHash, 'class hash'),
		found: true,
	}
}

const eventFields = (
	event: Event,
	contract: StarknetContractIdentity
) => {
	if (
		BigInt(validatedFelt(event.from_address, 'event contract address'))
		!== BigInt(validatedFelt(contract.address, 'contract address'))
	)
		throw new Error('Pathfinder: event response does not match the contract')
	validatedBlockNumber(event.transaction_index, 'event transaction index')
	validatedBlockNumber(event.event_index, 'event index')
	if (event.block_number != null)
		validatedBlockNumber(event.block_number, 'event block number')
	if (event.block_hash != null)
		validatedFelt(event.block_hash, 'event block hash')

	return {
		[EntityMetaKey.Selector]: {
			$transaction: {
				$network: contract.$network,
				transactionHash: validatedFelt(event.transaction_hash, 'event transaction hash'),
			},
			eventIndex: event.event_index,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.StarknetEvent, [], '$fromContract')]: {
				[EntityMetaKey.Selector]: contract,
			},
			[entityFieldAddressKey(EntityType.StarknetEvent, [], 'keys')]: event.keys.map((key) => (
				validatedFelt(key, 'event key')
			)),
			[entityFieldAddressKey(EntityType.StarknetEvent, [], 'data')]: event.data.map((value) => (
				validatedFelt(value, 'event data')
			)),
		},
	}
}

const eventContinuation = (
	continuationToken: string | undefined,
	contract: StarknetContractIdentity
): ProviderContinuation => {
	if (continuationToken == null)
		return {
			operation: 'contract-events',
			target: contract.address,
			terminal: true,
		}
	if (continuationToken.length === 0)
		throw new Error('Pathfinder: malformed event continuation token')

	return {
		operation: 'contract-events',
		target: contract.address,
		terminal: false,
		token: continuationToken,
	}
}

const blockFields = (
	block: BlockWithTxHashes,
	network: StarknetNetworkIdentity
) => {
	const blockNumber = BigInt(validatedBlockNumber(block.block_number, 'block number'))
	const blockHash = validatedFelt(block.block_hash, 'block hash')

	return {
		blockNumber,
		blockHash,
		parentHash: validatedFelt(block.parent_hash, 'parent hash'),
		newRoot: validatedFelt(block.new_root, 'state root'),
		timestampMs: unixSecondsToMs(block.timestamp, 'block timestamp'),
		sequencerAddress: validatedFelt(block.sequencer_address, 'sequencer address'),
		l1GasPrice: block.l1_gas_price?.price_in_wei,
		l1DataGasPrice: block.l1_data_gas_price?.price_in_wei,
		status: block.status,
		$$transactions: block.transactions.map((transactionHash) => ({
			[EntityMetaKey.Selector]: {
				$network: network,
				transactionHash: validatedFelt(transactionHash, 'transaction hash'),
			},
		})),
	}
}

const resolveBlock = async (
	block: StarknetBlockIdentity,
	blockId: BlockId
) => {
	assertStarknetMainnet(block.$network.$network)
	const { default: { getBlockWithTxHashes } } = await import('$/sources/Pathfinder/JsonRpc/queries.ts')
	const details = await getBlockWithTxHashes(blockId)
	const fields = blockFields(details, block.$network)

	if (
		'block_number' in blockId
		&& fields.blockNumber !== BigInt(blockId.block_number)
	)
		throw new Error('Pathfinder: block number mismatch')
	if (
		'block_hash' in blockId
		&& BigInt(fields.blockHash) !== BigInt(validatedFelt(blockId.block_hash, 'block hash'))
	)
		throw new Error('Pathfinder: block hash mismatch')

	return fields
}

const resolveStorageAt = async (
	entry: StarknetStorageEntryIdentity,
	blockNumber: number
) => {
	assertStarknetMainnet(entry.$contract.$network.$network)
	const address = validatedFelt(entry.$contract.address, 'contract address')
	const storageKey = validatedFelt(entry.storageKey, 'storage key')
	const blockId = {
		block_number: validatedBlockNumber(blockNumber, 'block number'),
	} satisfies BlockId
	const { default: {
		getBlockWithTxHashes,
		getStorageAt,
	} } = await import('$/sources/Pathfinder/JsonRpc/queries.ts')
	const [value, block] = await Promise.all([
		getStorageAt(address, storageKey, blockId),
		getBlockWithTxHashes(blockId),
	])

	return {
		value: validatedFelt(value, 'storage value'),
		blockHash: validatedFelt(block.block_hash, 'block hash'),
	}
}

const transactionFields = (
	transaction: TransactionWithHash,
	receipt: TransactionReceiptWithBlockInfo,
	network: StarknetNetworkIdentity,
	timestampMs: number
) => {
	const transactionHash = validatedFelt(transaction.transaction_hash, 'transaction hash')
	if (BigInt(transactionHash) !== BigInt(validatedFelt(receipt.transaction_hash, 'receipt transaction hash')))
		throw new Error('Pathfinder: transaction hash mismatch')

	const senderAddress = (
		'sender_address' in transaction ?
			validatedFelt(transaction.sender_address, 'sender address')
		: 'contract_address' in transaction ?
			validatedFelt(transaction.contract_address, 'contract address')
		:
			undefined
	)
	const blockNumber = BigInt(validatedBlockNumber(receipt.block_number, 'receipt block number'))

	return {
		transactionKind: transaction.type,
		$block: {
			[EntityMetaKey.Selector]: {
				$network: network,
				blockNumber,
			},
		},
		senderAddress,
		$senderContract: (
			senderAddress == null ?
				undefined
			:
				{
					[EntityMetaKey.Selector]: {
						$network: network,
						address: senderAddress,
					},
				}
		),
		nonce: (
			transaction.nonce == null ?
				undefined
			:
				validatedFelt(transaction.nonce, 'transaction nonce')
		),
		version: transaction.version,
		maxFee: (
			transaction.max_fee == null ?
				undefined
			:
				BigInt(validatedFelt(transaction.max_fee, 'max fee'))
		),
		resourceBounds: (
			transaction.resource_bounds == null ?
				undefined
			:
				JSON.stringify(transaction.resource_bounds)
		),
		calldata: (
			transaction.calldata
				?.map((value) => validatedFelt(value, 'calldata limb'))
			?? []
		),
		signature: (
			transaction.signature
				?.map((value) => validatedFelt(value, 'signature limb'))
			?? []
		),
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: network,
					transactionHash,
				},
				timestampMs,
				source: Source.Pathfinder,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'blockNumber')]: blockNumber,
				[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'finalityStatus')]: receipt.finality_status,
				...(
					receipt.execution_status != null && {
						[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'executionStatus')]: receipt.execution_status,
					}
				),
				[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'actualFee')]: (
					BigInt(validatedFelt(receipt.actual_fee.amount, 'actual fee'))
				),
				...(
					receipt.revert_reason != null && {
						[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'revertReason')]: receipt.revert_reason,
					}
				),
				[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'messagesSent')]: (
					receipt.messages_sent.map((message) => message.to_address)
				),
				[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'eventsCount')]: receipt.events.length,
			},
		}],
	}
}

export default {
	source: Source.Pathfinder,

	resolvers: [
		defineResolver({
			entityType: EntityType.StarknetNetwork,
			resolve: {
				Network: {
					appliesTo: starknetNetworkApplicability,
					resolve: async (starknetNetwork) => {
						assertStarknetMainnet(starknetNetwork.$network)
						const { default: {
							getBlockWithTxHashes,
							getChainId,
							getSpecVersion,
							getSyncing,
						} } = await import('$/sources/Pathfinder/JsonRpc/queries.ts')
						const [
							chainId,
							syncing,
							protocolVersion,
							block,
						] = await Promise.all([
							getChainId(),
							getSyncing(),
							getSpecVersion(),
							getBlockWithTxHashes('latest'),
						])
						const fields = blockFields(block, starknetNetwork)

						return {
							chainId: validatedFelt(chainId, 'chain id'),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$network: starknetNetwork,
									timestampMs: fields.timestampMs,
									source: Source.Pathfinder,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.StarknetNetwork_Timestamp, [], 'latestBlockNumber')]: fields.blockNumber,
									[entityFieldAddressKey(EntityType.StarknetNetwork_Timestamp, [], 'latestBlockHash')]: fields.blockHash,
									[entityFieldAddressKey(EntityType.StarknetNetwork_Timestamp, [], 'syncing')]: syncing !== false,
									[entityFieldAddressKey(EntityType.StarknetNetwork_Timestamp, [], 'protocolVersion')]: protocolVersion,
								},
							}],
						}
					},
				},
			},
		})({
			chainId: (snapshot) => snapshot.chainId,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.StarknetBlock,
			resolve: {
				NetworkBlockNumber: {
					appliesTo: starknetNestedNetworkApplicability,
					resolve: async (block) => {
						if (block.blockNumber > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('Pathfinder: block number is too large')

						return resolveBlock(block, {
							block_number: Number(block.blockNumber),
						})
					},
				},
				NetworkBlockHash: {
					appliesTo: starknetNestedNetworkApplicability,
					resolve: async (block) => (
						resolveBlock(block, {
							block_hash: validatedFelt(block.blockHash, 'block hash'),
						})
					),
				},
			},
		})({
			blockNumber: (snapshot) => snapshot.blockNumber,
			blockHash: (snapshot) => snapshot.blockHash,
			parentHash: (snapshot) => snapshot.parentHash,
			newRoot: (snapshot) => snapshot.newRoot,
			timestampMs: (snapshot) => snapshot.timestampMs,
			sequencerAddress: (snapshot) => snapshot.sequencerAddress,
			l1GasPrice: (snapshot) => snapshot.l1GasPrice,
			l1DataGasPrice: (snapshot) => snapshot.l1DataGasPrice,
			status: (snapshot) => snapshot.status,
			$$transactions: (snapshot) => snapshot.$$transactions,
		}),

		defineResolver({
			entityType: EntityType.StarknetTransaction,
			resolve: {
				NetworkTransactionHash: {
					appliesTo: starknetNestedNetworkApplicability,
					resolve: async (transaction) => {
						assertStarknetMainnet(transaction.$network.$network)
						const transactionHash = validatedFelt(transaction.transactionHash, 'transaction hash')
						const { default: {
							getBlockWithTxHashes,
							getTransactionByHash,
							getTransactionReceipt,
						} } = await import('$/sources/Pathfinder/JsonRpc/queries.ts')
						const [
							details,
							receipt,
						] = await Promise.all([
							getTransactionByHash(transactionHash),
							getTransactionReceipt(transactionHash),
						])
						const block = await getBlockWithTxHashes({
							block_number: validatedBlockNumber(receipt.block_number, 'receipt block number'),
						})

						return transactionFields(
							details,
							receipt,
							transaction.$network,
							unixSecondsToMs(block.timestamp, 'block timestamp')
						)
					},
				},
			},
		})({
			transactionKind: (snapshot) => snapshot.transactionKind,
			$block: (snapshot) => snapshot.$block,
			senderAddress: (snapshot) => snapshot.senderAddress,
			$senderContract: (snapshot) => snapshot.$senderContract,
			nonce: (snapshot) => snapshot.nonce,
			version: (snapshot) => snapshot.version,
			maxFee: (snapshot) => snapshot.maxFee,
			resourceBounds: (snapshot) => snapshot.resourceBounds,
			calldata: (snapshot) => snapshot.calldata,
			signature: (snapshot) => snapshot.signature,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.StarknetContract,
			resolve: {
				NetworkAddress: {
					appliesTo: starknetContractApplicability,
					resolve: async (contract) => {
						assertStarknetMainnet(contract.$network.$network)
						validatedFelt(contract.address, 'contract address')
						const { default: { getBlockHashAndNumber } } = await import('$/sources/Pathfinder/JsonRpc/queries.ts')
						const head = await getBlockHashAndNumber()
						validatedFelt(head.block_hash, 'block hash')
						const blockNumber = validatedBlockNumber(head.block_number, 'block number')

						return {
							blockNumber,
							state: await resolveAccountState(contract, blockNumber),
						}
					},
				},
			},
		})({
			$$accountStates: (snapshot, contract) => [{
				[EntityMetaKey.Selector]: {
					$contract: contract,
					blockNumber: BigInt(snapshot.blockNumber),
					source: Source.Pathfinder,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'nonce')]: snapshot.state.nonce,
					[entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'classHash')]: snapshot.state.classHash,
					[entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'found')]: snapshot.state.found,
				},
			}],
		}),

		defineResolver({
			entityType: EntityType.StarknetAccount_Timestamp,
			resolve: {
				ContractBlockNumberSource: {
					appliesTo: [
						{
							$contract: starknetContractApplicability[0],
							source: Source.Pathfinder,
						},
						{
							$contract: starknetContractApplicability[1],
							source: Source.Pathfinder,
						},
					],
					resolve: async ({
						$contract,
						blockNumber,
						source,
					}) => {
						if (source !== Source.Pathfinder)
							throw new Error('Pathfinder: account observation source does not match')
						if (blockNumber > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('Pathfinder: account observation block number is too large')

						return resolveAccountState($contract, Number(blockNumber))
					},
				},
			},
		})({
			nonce: (state) => state.nonce,
			classHash: (state) => state.classHash,
			found: (state) => state.found,
		}),

		defineResolver({
			entityType: EntityType.StarknetStorageEntry,
			resolve: {
				ContractStorageKey: {
					appliesTo: [
						{
							$contract: starknetContractApplicability[0],
						},
						{
							$contract: starknetContractApplicability[1],
						},
					],
					resolve: async (entry) => {
						assertStarknetMainnet(entry.$contract.$network.$network)
						validatedFelt(entry.$contract.address, 'contract address')
						validatedFelt(entry.storageKey, 'storage key')
						const { default: { getBlockHashAndNumber } } = await import('$/sources/Pathfinder/JsonRpc/queries.ts')
						const head = await getBlockHashAndNumber()
						const blockNumber = validatedBlockNumber(head.block_number, 'block number')
						const observation = await resolveStorageAt(entry, blockNumber)

						return {
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$entry: entry,
									blockNumber: BigInt(blockNumber),
									source: Source.Pathfinder,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.StarknetStorageEntry_Timestamp, [], 'value')]: observation.value,
									[entityFieldAddressKey(EntityType.StarknetStorageEntry_Timestamp, [], 'blockHash')]: observation.blockHash,
								},
							}],
						}
					},
				},
			},
		})({
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.StarknetStorageEntry_Timestamp,
			resolve: {
				EntryBlockNumberSource: {
					appliesTo: [
						{
							$entry: {
								$contract: starknetContractApplicability[0],
							},
							source: Source.Pathfinder,
						},
						{
							$entry: {
								$contract: starknetContractApplicability[1],
							},
							source: Source.Pathfinder,
						},
					],
					resolve: async ({
						$entry,
						blockNumber,
						source,
					}) => {
						if (source !== Source.Pathfinder)
							throw new Error('Pathfinder: storage observation source does not match')
						if (blockNumber > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('Pathfinder: storage observation block number is too large')

						return resolveStorageAt($entry, Number(blockNumber))
					},
				},
			},
		})({
			value: (observation) => observation.value,
			blockHash: (observation) => observation.blockHash,
		}),

		defineResolver({
			entityType: EntityType.StarknetContract,
			resolve: {
				NetworkAddress: {
					appliesTo: starknetContractApplicability,
					resolve: async (contract, context) => {
						assertStarknetMainnet(contract.$network.$network)
						const address = validatedFelt(contract.address, 'contract address')
						const { default: { getEvents } } = await import('$/sources/Pathfinder/JsonRpc/queries.ts')

						return getEvents({
							address,
							chunk_size: resolverContextRowLimit(context),
							...(context.providerContinuationToken != null && {
								continuation_token: context.providerContinuationToken,
							}),
						})
					},
				},
			},
		})({
			$$events: {
				select: (chunk, contract) => chunk.events.map((event) => eventFields(event, contract)),
				continuation: (chunk, contract) => eventContinuation(
					chunk.continuation_token,
					contract
				),
			},
		}),
	],
} satisfies RegisteredSourceResolverModule

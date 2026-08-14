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
	ReceiptEvent,
	StateUpdate,
	StarknetClassDefinition,
	TransactionReceiptWithBlockInfo,
	TransactionWithHash,
} from '$/sources/_shared/interfaces/StarknetJsonRpc/types.ts'

type NetworkIdentity = EntitySelector<typeof schema, EntityType.Network>
type StarknetNetworkIdentity = EntitySelector<typeof schema, EntityType.StarknetNetwork>
type StarknetContractIdentity = EntitySelector<typeof schema, EntityType.StarknetContract>
type StarknetBlockIdentity = EntitySelector<typeof schema, EntityType.StarknetBlock>
type StarknetTransactionIdentity = EntitySelector<typeof schema, EntityType.StarknetTransaction>
type StarknetClassIdentity = EntitySelector<typeof schema, EntityType.StarknetClass>
type StarknetStorageEntryIdentity = EntitySelector<typeof schema, EntityType.StarknetStorageEntry>
type StarknetStateUpdateIdentity = EntitySelector<typeof schema, EntityType.StarknetStateUpdate>

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

const receiptEventFields = (
	event: ReceiptEvent,
	eventIndex: number,
	transaction: StarknetTransactionIdentity
) => {
	validatedBlockNumber(eventIndex, 'event index')
	const fromAddress = validatedFelt(event.from_address, 'event contract address')

	return {
		[EntityMetaKey.Selector]: {
			$transaction: {
				$network: transaction.$network,
				transactionHash: validatedFelt(transaction.transactionHash, 'transaction hash'),
			},
			eventIndex,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.StarknetEvent, [], '$fromContract')]: {
				[EntityMetaKey.Selector]: {
					$network: transaction.$network,
					address: fromAddress,
				},
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

const classFields = (
	definition: StarknetClassDefinition,
	klass: StarknetClassIdentity
) => {
	const classHash = validatedFelt(klass.classHash, 'class hash')
	if ('sierra_program' in definition) {
		if (definition.sierra_program.length === 0)
			throw new Error('Pathfinder: sierra class missing program')
		for (const limb of definition.sierra_program)
			validatedFelt(limb, 'sierra program limb')
		if (definition.contract_class_version.length === 0)
			throw new Error('Pathfinder: sierra class missing version')

		return {
			classHash,
			contractClassVersion: definition.contract_class_version,
		}
	}
	if (definition.program.length === 0)
		throw new Error('Pathfinder: deprecated class missing program')

	return {
		classHash,
		contractClassVersion: undefined,
	}
}

const networkBlockPageContinuation = (
	oldestBlockNumber: number,
	requestedLimit: number,
	fetchedCount: number
): ProviderContinuation => {
	if (fetchedCount === 0 || oldestBlockNumber <= 0 || fetchedCount < requestedLimit)
		return {
			operation: 'network-blocks',
			terminal: true,
		}

	return {
		operation: 'network-blocks',
		terminal: false,
		token: String(oldestBlockNumber - 1),
	}
}

const networkTransactionPageContinuation = (
	blockNumber: number,
	nextIndex: number,
	requestedLimit: number,
	fetchedCount: number,
	blockTransactionCount: number
): ProviderContinuation => {
	if (fetchedCount === 0 || fetchedCount < requestedLimit)
		return {
			operation: 'network-transactions',
			terminal: true,
		}
	if (nextIndex < blockTransactionCount)
		return {
			operation: 'network-transactions',
			terminal: false,
			token: `${blockNumber}:${nextIndex}`,
		}
	if (blockNumber <= 0)
		return {
			operation: 'network-transactions',
			terminal: true,
		}

	return {
		operation: 'network-transactions',
		terminal: false,
		token: `${blockNumber - 1}:0`,
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

const stateUpdateFields = (
	stateUpdate: StateUpdate,
	block: StarknetBlockIdentity
) => {
	if (!('block_hash' in stateUpdate))
		throw new Error('Pathfinder: state update does not identify a finalized block')

	const blockHash = validatedFelt(stateUpdate.block_hash, 'state update block hash')
	if (BigInt(blockHash) !== BigInt(validatedFelt(block.blockHash, 'block hash')))
		throw new Error('Pathfinder: state update block hash mismatch')

	const oldRoot = validatedFelt(stateUpdate.old_root, 'state update old root')
	const newRoot = validatedFelt(stateUpdate.new_root, 'state update new root')
	return {
		$block: {
			[EntityMetaKey.Selector]: {
				$network: block.$network,
				blockHash,
			},
		},
		oldRoot,
		newRoot,
		storageDiffs: stateUpdate.state_diff.storage_diffs,
		deprecatedDeclaredClassHashes: stateUpdate.state_diff.deprecated_declared_classes.map((classHash) => (
			validatedFelt(classHash, 'deprecated declared class hash')
		)),
		declaredClasses: stateUpdate.state_diff.declared_classes,
		deployedContracts: stateUpdate.state_diff.deployed_contracts,
		replacedClasses: stateUpdate.state_diff.replaced_classes,
		nonces: stateUpdate.state_diff.nonces,
	}
}

const resolveStateUpdateForBlock = async (
	block: StarknetBlockIdentity,
	blockId: BlockId
) => {
	const fields = await resolveBlock(block, blockId)
	const { default: { getStateUpdate } } = await import('$/sources/Pathfinder/JsonRpc/queries.ts')
	const stateUpdate = stateUpdateFields(
		await getStateUpdate({
			block_hash: fields.blockHash,
		}),
		{
			$network: block.$network,
			blockHash: fields.blockHash,
		}
	)
	if (BigInt(stateUpdate.newRoot) !== BigInt(fields.newRoot))
		throw new Error('Pathfinder: state update root does not match block root')

	return {
		blockHash: fields.blockHash,
		stateUpdate,
	}
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
	transactionIdentity: StarknetTransactionIdentity,
	timestampMs: number
) => {
	const network = transactionIdentity.$network
	const transactionHash = validatedFelt(transaction.transaction_hash, 'transaction hash')
	if (BigInt(transactionHash) !== BigInt(validatedFelt(receipt.transaction_hash, 'receipt transaction hash')))
		throw new Error('Pathfinder: transaction hash mismatch')
	if (BigInt(transactionHash) !== BigInt(validatedFelt(transactionIdentity.transactionHash, 'transaction hash')))
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
		$$events: receipt.events.map((event, eventIndex) => (
			receiptEventFields(event, eventIndex, transactionIdentity)
		)),
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
			entityType: EntityType.StarknetNetwork,
			resolve: {
				Network: {
					appliesTo: starknetNetworkApplicability,
					resolve: async (starknetNetwork, context) => {
						assertStarknetMainnet(starknetNetwork.$network)
						const limit = resolverContextRowLimit(context)
						const { default: {
							getBlockHashAndNumber,
							getBlockWithTxHashes,
						} } = await import('$/sources/Pathfinder/JsonRpc/queries.ts')
						const tip = (
							context.providerContinuationToken == null ?
								await getBlockHashAndNumber()
							:
								{
									block_number: validatedBlockNumber(
										Number(context.providerContinuationToken),
										'block page start'
									),
								}
						)
						const start = tip.block_number
						const blockNumbers = Array.from(
							{ length: Math.min(limit, start + 1) },
							(_, index) => start - index
						)
						const blocks = await Promise.all(
							blockNumbers.map(async (blockNumber) => {
								const details = await getBlockWithTxHashes({
									block_number: blockNumber,
								})
								return blockFields(details, starknetNetwork)
							})
						)

						return {
							limit,
							blocks,
						}
					},
				},
			},
		})({
			$$blocks: {
				select: ({ blocks }, starknetNetwork) => blocks.map((block) => ({
					[EntityMetaKey.Selector]: {
						$network: starknetNetwork,
						blockNumber: block.blockNumber,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.StarknetBlock, [], 'blockHash')]: block.blockHash,
						[entityFieldAddressKey(EntityType.StarknetBlock, [], 'parentHash')]: block.parentHash,
						[entityFieldAddressKey(EntityType.StarknetBlock, [], 'newRoot')]: block.newRoot,
						[entityFieldAddressKey(EntityType.StarknetBlock, [], 'timestampMs')]: block.timestampMs,
						[entityFieldAddressKey(EntityType.StarknetBlock, [], 'sequencerAddress')]: block.sequencerAddress,
						...(
							block.l1GasPrice != null && {
								[entityFieldAddressKey(EntityType.StarknetBlock, [], 'l1GasPrice')]: block.l1GasPrice,
							}
						),
						...(
							block.l1DataGasPrice != null && {
								[entityFieldAddressKey(EntityType.StarknetBlock, [], 'l1DataGasPrice')]: block.l1DataGasPrice,
							}
						),
						...(
							block.status != null && {
								[entityFieldAddressKey(EntityType.StarknetBlock, [], 'status')]: block.status,
							}
						),
					},
				})),
				continuation: ({ limit, blocks }) => (
					networkBlockPageContinuation(
						Number(blocks.at(-1)?.blockNumber ?? 0n),
						limit,
						blocks.length
					)
				),
			},
		}),

		defineResolver({
			entityType: EntityType.StarknetNetwork,
			resolve: {
				Network: {
					appliesTo: starknetNetworkApplicability,
					resolve: async (starknetNetwork, context) => {
						assertStarknetMainnet(starknetNetwork.$network)
						const limit = resolverContextRowLimit(context)
						const { default: {
							getBlockHashAndNumber,
							getBlockTransactionCount,
							getTransactionByBlockIdAndIndex,
						} } = await import('$/sources/Pathfinder/JsonRpc/queries.ts')
						const cursorMatch = context.providerContinuationToken?.match(/^(\d+):(\d+)$/)
						const cursor = (
							context.providerContinuationToken == null ?
								null
							: cursorMatch == null ?
								(() => {
									throw new Error('Pathfinder: malformed network transaction continuation')
								})()
							:
								{
									blockNumber: Number(cursorMatch[1]),
									index: Number(cursorMatch[2]),
								}
						)
						const tip = (
							cursor == null ?
								await getBlockHashAndNumber()
							:
								{
									block_number: validatedBlockNumber(cursor.blockNumber, 'transaction page block'),
								}
						)
						const blockNumber = tip.block_number
						const startIndex = cursor?.index ?? 0
						validatedBlockNumber(startIndex, 'transaction page index')
						const blockTransactionCount = validatedBlockNumber(
							await getBlockTransactionCount({
								block_number: blockNumber,
							}),
							'block transaction count'
						)
						const take = Math.min(limit, Math.max(0, blockTransactionCount - startIndex))
						const transactions = await Promise.all(
							Array.from({ length: take }, async (_, offset) => {
								const index = startIndex + offset
								const details = await getTransactionByBlockIdAndIndex(
									{ block_number: blockNumber },
									index
								)
								return {
									[EntityMetaKey.Selector]: {
										$network: starknetNetwork,
										transactionHash: validatedFelt(details.transaction_hash, 'transaction hash'),
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.StarknetTransaction, [], 'transactionKind')]: details.type,
										[entityFieldAddressKey(EntityType.StarknetTransaction, [], '$block')]: {
											[EntityMetaKey.Selector]: {
												$network: starknetNetwork,
												blockNumber: BigInt(blockNumber),
											},
										},
									},
								}
							})
						)

						return {
							limit,
							blockNumber,
							blockTransactionCount,
							nextIndex: startIndex + take,
							transactions,
						}
					},
				},
			},
		})({
			$$transactions: {
				select: ({ transactions }) => transactions,
				continuation: ({
					limit,
					blockNumber,
					blockTransactionCount,
					nextIndex,
					transactions,
				}) => (
					networkTransactionPageContinuation(
						blockNumber,
						nextIndex,
						limit,
						transactions.length,
						blockTransactionCount
					)
				),
			},
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
			entityType: EntityType.StarknetBlock,
			resolve: {
				NetworkBlockNumber: {
					appliesTo: starknetNestedNetworkApplicability,
					resolve: async (block) => {
						if (block.blockNumber > BigInt(Number.MAX_SAFE_INTEGER))
							throw new Error('Pathfinder: block number is too large')

						return resolveStateUpdateForBlock(block, {
							block_number: Number(block.blockNumber),
						})
					},
				},
				NetworkBlockHash: {
					appliesTo: starknetNestedNetworkApplicability,
					resolve: async (block) => {
						return resolveStateUpdateForBlock(block, {
							block_hash: validatedFelt(block.blockHash, 'block hash'),
						})
					},
				},
			},
		})({
			$$stateUpdates: (snapshot, block) => [{
				[EntityMetaKey.Selector]: {
					$network: block.$network,
					blockHash: snapshot.blockHash,
					source: Source.Pathfinder,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.StarknetStateUpdate, [], '$block')]: snapshot.stateUpdate.$block,
					[entityFieldAddressKey(EntityType.StarknetStateUpdate, [], 'oldRoot')]: snapshot.stateUpdate.oldRoot,
					[entityFieldAddressKey(EntityType.StarknetStateUpdate, [], 'newRoot')]: snapshot.stateUpdate.newRoot,
					[entityFieldAddressKey(EntityType.StarknetStateUpdate, [], 'storageDiffs')]: snapshot.stateUpdate.storageDiffs,
					[entityFieldAddressKey(EntityType.StarknetStateUpdate, [], 'deprecatedDeclaredClassHashes')]: snapshot.stateUpdate.deprecatedDeclaredClassHashes,
					[entityFieldAddressKey(EntityType.StarknetStateUpdate, [], 'declaredClasses')]: snapshot.stateUpdate.declaredClasses,
					[entityFieldAddressKey(EntityType.StarknetStateUpdate, [], 'deployedContracts')]: snapshot.stateUpdate.deployedContracts,
					[entityFieldAddressKey(EntityType.StarknetStateUpdate, [], 'replacedClasses')]: snapshot.stateUpdate.replacedClasses,
					[entityFieldAddressKey(EntityType.StarknetStateUpdate, [], 'nonces')]: snapshot.stateUpdate.nonces,
				},
			}],
		}),

		defineResolver({
			entityType: EntityType.StarknetStateUpdate,
			resolve: {
				NetworkBlockHashSource: {
					appliesTo: [
						{
							...starknetNestedNetworkApplicability[0],
							source: Source.Pathfinder,
						},
						{
							...starknetNestedNetworkApplicability[1],
							source: Source.Pathfinder,
						},
					],
					resolve: async ({
						$network,
						blockHash,
						source,
					}: StarknetStateUpdateIdentity) => {
						if (source !== Source.Pathfinder)
							throw new Error('Pathfinder: state update source does not match')

						assertStarknetMainnet($network.$network)
						const expectedBlockHash = validatedFelt(blockHash, 'state update block hash')
						const { default: {
							getBlockWithTxHashes,
							getStateUpdate,
						} } = await import('$/sources/Pathfinder/JsonRpc/queries.ts')
						const [
							block,
							stateUpdate,
						] = await Promise.all([
							getBlockWithTxHashes({
								block_hash: expectedBlockHash,
							}),
							getStateUpdate({
								block_hash: expectedBlockHash,
							}),
						])
						const fields = blockFields(block, $network)
						if (BigInt(fields.blockHash) !== BigInt(expectedBlockHash))
							throw new Error('Pathfinder: state update block response does not match requested block')

						const snapshot = stateUpdateFields(stateUpdate, {
							$network,
							blockHash: expectedBlockHash,
						})
						if (BigInt(snapshot.newRoot) !== BigInt(fields.newRoot))
							throw new Error('Pathfinder: state update root does not match block root')

						return snapshot
					},
				},
			},
		})({
			$block: (snapshot) => snapshot.$block,
			oldRoot: (snapshot) => snapshot.oldRoot,
			newRoot: (snapshot) => snapshot.newRoot,
			storageDiffs: (snapshot) => snapshot.storageDiffs,
			deprecatedDeclaredClassHashes: (snapshot) => snapshot.deprecatedDeclaredClassHashes,
			declaredClasses: (snapshot) => snapshot.declaredClasses,
			deployedContracts: (snapshot) => snapshot.deployedContracts,
			replacedClasses: (snapshot) => snapshot.replacedClasses,
			nonces: (snapshot) => snapshot.nonces,
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
							transaction,
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
			$$events: (snapshot) => snapshot.$$events,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.StarknetClass,
			resolve: {
				NetworkClassHash: {
					appliesTo: starknetNestedNetworkApplicability,
					resolve: async (klass) => {
						assertStarknetMainnet(klass.$network.$network)
						const classHash = validatedFelt(klass.classHash, 'class hash')
						const { default: { getClass } } = await import('$/sources/Pathfinder/JsonRpc/queries.ts')
						return classFields(
							await getClass('latest', classHash),
							klass
						)
					},
				},
			},
		})({
			classHash: (snapshot) => snapshot.classHash,
			contractClassVersion: (snapshot) => snapshot.contractClassVersion,
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

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

const networkApplicability = [
	{ $network: { caip2: networkBySlug.starknet.caip2 } },
	{ $network: { slug: networkBySlug.starknet.slug } },
] as const
const nestedNetworkApplicability = networkApplicability.map(($network) => ({ $network }))

const assertStarknet = (network: NetworkIdentity) => {
	if (
		('slug' in network && network.slug === networkBySlug.starknet.slug)
		|| ('caip2' in network
			&& network.caip2.namespace === networkBySlug.starknet.caip2.namespace
			&& network.caip2.reference === networkBySlug.starknet.caip2.reference)
	)
		return
	throw new Error('Juno_JsonRpc: unsupported network')
}

const felt = (value: string, name: string) => {
	if (!/^0x[\da-fA-F]{1,64}$/.test(value) || BigInt(value) >= 2n ** 251n)
		throw new Error(`Juno_JsonRpc: malformed ${name}`)
	return value
}

const blockNumber = (value: number, name: string) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`Juno_JsonRpc: malformed ${name}`)
	return value
}

const blockIdFor = (block: StarknetBlockIdentity): BlockId => (
	block.blockNumber > BigInt(Number.MAX_SAFE_INTEGER) ?
		(() => { throw new Error('Juno_JsonRpc: block number is too large') })()
	:
	{ block_number: blockNumber(Number(block.blockNumber), 'block number') }
)

const blockFields = (details: BlockWithTxHashes, network: StarknetNetworkIdentity) => ({
	blockNumber: BigInt(blockNumber(details.block_number, 'block number')),
	blockHash: felt(details.block_hash, 'block hash'),
	parentHash: felt(details.parent_hash, 'parent hash'),
	newRoot: felt(details.new_root, 'state root'),
	timestampMs: blockNumber(details.timestamp, 'block timestamp') * 1000,
	sequencerAddress: felt(details.sequencer_address, 'sequencer address'),
	l1GasPrice: details.l1_gas_price.price_in_wei,
	l1DataGasPrice: details.l1_data_gas_price.price_in_wei,
	status: details.status,
	$$transactions: details.transactions.map((hash) => ({
		[EntityMetaKey.Selector]: {
			$network: network,
			transactionHash: felt(hash, 'transaction hash'),
		},
	})),
})

const resolveBlock = async (block: StarknetBlockIdentity, id: BlockId) => {
	assertStarknet(block.$network.$network)
	const { getBlockWithTxHashes } = await import('$/sources/Juno/JsonRpc/queries.ts')
	const fields = blockFields(await getBlockWithTxHashes(id), block.$network)
	if ('block_number' in id && fields.blockNumber !== BigInt(id.block_number))
		throw new Error('Juno_JsonRpc: block number mismatch')
	if ('block_hash' in id && BigInt(fields.blockHash) !== BigInt(felt(id.block_hash, 'block hash')))
		throw new Error('Juno_JsonRpc: block hash mismatch')
	return fields
}

const accountState = async (contract: StarknetContractIdentity, number: number) => {
	assertStarknet(contract.$network.$network)
	const address = felt(contract.address, 'contract address')
	const id = { block_number: blockNumber(number, 'block number') } satisfies BlockId
	const { getClassHashAt, getNonce } = await import('$/sources/Juno/JsonRpc/queries.ts')
	const [nonce, classHash] = await Promise.all([
		getNonce(id, address),
		getClassHashAt(id, address),
	])
	return {
		nonce: felt(nonce, 'account nonce'),
		classHash: felt(classHash, 'class hash'),
		found: true,
	}
}

const storageAt = async (entry: StarknetStorageEntryIdentity, number: number) => {
	assertStarknet(entry.$contract.$network.$network)
	const address = felt(entry.$contract.address, 'contract address')
	const storageKey = felt(entry.storageKey, 'storage key')
	const id = { block_number: blockNumber(number, 'block number') } satisfies BlockId
	const { getBlockWithTxHashes, getStorageAt } = await import('$/sources/Juno/JsonRpc/queries.ts')
	const [value, details] = await Promise.all([
		getStorageAt(address, storageKey, id),
		getBlockWithTxHashes(id),
	])
	return {
		value: felt(value, 'storage value'),
		blockHash: felt(details.block_hash, 'block hash'),
	}
}

const classFields = (definition: StarknetClassDefinition, klass: StarknetClassIdentity) => {
	const classHash = felt(klass.classHash, 'class hash')
	if ('sierra_program' in definition) {
		if (definition.sierra_program.length === 0 || definition.contract_class_version.length === 0)
			throw new Error('Juno_JsonRpc: sierra class is incomplete')
		return {
			classHash,
			contractClassVersion: definition.contract_class_version,
		}
	}
	if (definition.program.length === 0)
		throw new Error('Juno_JsonRpc: deprecated class is incomplete')
	return { classHash, contractClassVersion: undefined }
}

const transactionFields = (
	transaction: TransactionWithHash,
	receipt: TransactionReceiptWithBlockInfo,
	identity: StarknetTransactionIdentity,
	timestampMs: number
) => {
	const hash = felt(transaction.transaction_hash, 'transaction hash')
	if (BigInt(hash) !== BigInt(felt(identity.transactionHash, 'transaction hash'))
		|| BigInt(hash) !== BigInt(felt(receipt.transaction_hash, 'receipt transaction hash')))
		throw new Error('Juno_JsonRpc: transaction hash mismatch')
	const senderAddress = 'sender_address' in transaction ?
		felt(transaction.sender_address, 'sender address')
	: 'contract_address' in transaction ?
		felt(transaction.contract_address, 'contract address')
	: undefined
	const number = BigInt(blockNumber(receipt.block_number, 'receipt block number'))
	return {
		transactionKind: transaction.type,
		$block: { [EntityMetaKey.Selector]: { $network: identity.$network, blockNumber: number } },
		senderAddress,
		$senderContract: senderAddress == null ? undefined : { [EntityMetaKey.Selector]: { $network: identity.$network, address: senderAddress } },
		nonce: transaction.nonce == null ? undefined : felt(transaction.nonce, 'transaction nonce'),
		version: transaction.version,
		maxFee: transaction.max_fee == null ? undefined : BigInt(felt(transaction.max_fee, 'max fee')),
		resourceBounds: transaction.resource_bounds == null ? undefined : JSON.stringify(transaction.resource_bounds),
		calldata: transaction.calldata?.map((value) => felt(value, 'calldata limb')) ?? [],
		signature: transaction.signature?.map((value) => felt(value, 'signature limb')) ?? [],
		$$timestamps: [{
			[EntityMetaKey.Selector]: { $transaction: { $network: identity.$network, transactionHash: hash }, timestampMs, source: Source.Juno_JsonRpc },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'blockNumber')]: number,
				[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'finalityStatus')]: receipt.finality_status,
				[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'executionStatus')]: receipt.execution_status,
				[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'actualFee')]: BigInt(felt(receipt.actual_fee.amount, 'actual fee')),
				...(receipt.revert_reason != null && { [entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'revertReason')]: receipt.revert_reason }),
				[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'messagesSent')]: receipt.messages_sent.map((message) => felt(message.to_address, 'message destination')),
				[entityFieldAddressKey(EntityType.StarknetTransaction_Timestamp, [], 'eventsCount')]: receipt.events.length,
			},
		}],
	}
}

export default {
	source: Source.Juno_JsonRpc,
	resolvers: [
		defineResolver({
			entityType: EntityType.StarknetNetwork,
			resolve: { Network: { appliesTo: networkApplicability, resolve: async ({ $network }, context) => {
				assertStarknet($network)
				const { getBlockWithTxHashes, getChainId, getSpecVersion, getSyncing } = await import('$/sources/Juno/JsonRpc/queries.ts')
				const [chainId, syncing, protocolVersion, block] = await Promise.all([
					getChainId(), getSyncing(), getSpecVersion(), getBlockWithTxHashes('latest'),
				])
				const fields = blockFields(block, { $network })
				return {
					chainId: felt(chainId, 'chain id'),
					$$timestamps: [{
						[EntityMetaKey.Selector]: { $network: { $network }, timestampMs: fields.timestampMs, source: Source.Juno_JsonRpc },
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.StarknetNetwork_Timestamp, [], 'latestBlockNumber')]: fields.blockNumber,
							[entityFieldAddressKey(EntityType.StarknetNetwork_Timestamp, [], 'latestBlockHash')]: fields.blockHash,
							[entityFieldAddressKey(EntityType.StarknetNetwork_Timestamp, [], 'syncing')]: syncing !== false,
							[entityFieldAddressKey(EntityType.StarknetNetwork_Timestamp, [], 'protocolVersion')]: protocolVersion,
						},
					}],
				}
			}, } },
		})({ chainId: (snapshot) => snapshot.chainId, $$timestamps: (snapshot) => snapshot.$$timestamps }),

		defineResolver({
			entityType: EntityType.StarknetBlock,
			resolve: { NetworkBlockNumber: { appliesTo: nestedNetworkApplicability, resolve: async (block) => resolveBlock(block, blockIdFor(block)) }, NetworkBlockHash: { appliesTo: nestedNetworkApplicability, resolve: async (block) => resolveBlock(block, { block_hash: felt(block.blockHash, 'block hash') }) } },
		})({ blockNumber: (snapshot) => snapshot.blockNumber, blockHash: (snapshot) => snapshot.blockHash, parentHash: (snapshot) => snapshot.parentHash, newRoot: (snapshot) => snapshot.newRoot, timestampMs: (snapshot) => snapshot.timestampMs, sequencerAddress: (snapshot) => snapshot.sequencerAddress, l1GasPrice: (snapshot) => snapshot.l1GasPrice, l1DataGasPrice: (snapshot) => snapshot.l1DataGasPrice, status: (snapshot) => snapshot.status, $$transactions: (snapshot) => snapshot.$$transactions }),

		defineResolver({ entityType: EntityType.StarknetClass, resolve: { NetworkClassHash: { appliesTo: nestedNetworkApplicability, resolve: async (klass) => { assertStarknet(klass.$network.$network); const { getClass } = await import('$/sources/Juno/JsonRpc/queries.ts'); return classFields(await getClass('latest', felt(klass.classHash, 'class hash')), klass) } } } })({ classHash: (snapshot) => snapshot.classHash, contractClassVersion: (snapshot) => snapshot.contractClassVersion }),

		defineResolver({ entityType: EntityType.StarknetContract, resolve: { NetworkAddress: { appliesTo: nestedNetworkApplicability, resolve: async (contract) => { assertStarknet(contract.$network.$network); felt(contract.address, 'contract address'); const { getBlockHashAndNumber } = await import('$/sources/Juno/JsonRpc/queries.ts'); const head = await getBlockHashAndNumber(); const number = blockNumber(head.block_number, 'block number'); return { blockNumber: number, state: await accountState(contract, number) } } } } })({ $$accountStates: (snapshot, contract) => [{ [EntityMetaKey.Selector]: { $contract: contract, blockNumber: BigInt(snapshot.blockNumber), source: Source.Juno_JsonRpc }, [EntityMetaKey.Fields]: { [entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'nonce')]: snapshot.state.nonce, [entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'classHash')]: snapshot.state.classHash, [entityFieldAddressKey(EntityType.StarknetAccount_Timestamp, [], 'found')]: snapshot.state.found } }] }),

		defineResolver({ entityType: EntityType.StarknetAccount_Timestamp, resolve: { ContractBlockNumberSource: { appliesTo: nestedNetworkApplicability.map(($contract) => ({ $contract, source: Source.Juno_JsonRpc })), resolve: async ({ $contract, blockNumber: number, source }) => { if (source !== Source.Juno_JsonRpc) throw new Error('Juno_JsonRpc: account observation source does not match'); if (number > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('Juno_JsonRpc: account observation block number is too large'); return accountState($contract, Number(number)) } } } })({ nonce: (state) => state.nonce, classHash: (state) => state.classHash, found: (state) => state.found }),

		defineResolver({ entityType: EntityType.StarknetStorageEntry, resolve: { ContractStorageKey: { appliesTo: nestedNetworkApplicability.map(($contract) => ({ $contract })), resolve: async (entry) => { assertStarknet(entry.$contract.$network.$network); const { getBlockHashAndNumber } = await import('$/sources/Juno/JsonRpc/queries.ts'); const head = await getBlockHashAndNumber(); const number = blockNumber(head.block_number, 'block number'); const observation = await storageAt(entry, number); return { $$timestamps: [{ [EntityMetaKey.Selector]: { $entry: entry, blockNumber: BigInt(number), source: Source.Juno_JsonRpc }, [EntityMetaKey.Fields]: { [entityFieldAddressKey(EntityType.StarknetStorageEntry_Timestamp, [], 'value')]: observation.value, [entityFieldAddressKey(EntityType.StarknetStorageEntry_Timestamp, [], 'blockHash')]: observation.blockHash } }] } } } } })({ $$timestamps: (snapshot) => snapshot.$$timestamps }),

		defineResolver({ entityType: EntityType.StarknetStorageEntry_Timestamp, resolve: { EntryBlockNumberSource: { appliesTo: nestedNetworkApplicability.map(($entry) => ({ $entry: { $contract: $entry }, source: Source.Juno_JsonRpc })), resolve: async ({ $entry, blockNumber: number, source }) => { if (source !== Source.Juno_JsonRpc) throw new Error('Juno_JsonRpc: storage observation source does not match'); if (number > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('Juno_JsonRpc: storage observation block number is too large'); return storageAt($entry, Number(number)) } } } })({ value: (observation) => observation.value, blockHash: (observation) => observation.blockHash }),

		defineResolver({ entityType: EntityType.StarknetTransaction, resolve: { NetworkTransactionHash: { appliesTo: nestedNetworkApplicability, resolve: async (transaction) => { assertStarknet(transaction.$network.$network); const hash = felt(transaction.transactionHash, 'transaction hash'); const { getBlockWithTxHashes, getTransactionByHash, getTransactionReceipt } = await import('$/sources/Juno/JsonRpc/queries.ts'); const [details, receipt] = await Promise.all([getTransactionByHash(hash), getTransactionReceipt(hash)]); const block = await getBlockWithTxHashes({ block_number: blockNumber(receipt.block_number, 'receipt block number') }); return transactionFields(details, receipt, transaction, blockNumber(block.timestamp, 'block timestamp') * 1000) } } } })({ transactionKind: (snapshot) => snapshot.transactionKind, $block: (snapshot) => snapshot.$block, senderAddress: (snapshot) => snapshot.senderAddress, $senderContract: (snapshot) => snapshot.$senderContract, nonce: (snapshot) => snapshot.nonce, version: (snapshot) => snapshot.version, maxFee: (snapshot) => snapshot.maxFee, resourceBounds: (snapshot) => snapshot.resourceBounds, calldata: (snapshot) => snapshot.calldata, signature: (snapshot) => snapshot.signature, $$timestamps: (snapshot) => snapshot.$$timestamps }),

		defineResolver({ entityType: EntityType.StarknetTransaction_Timestamp, resolve: { TransactionTimestampMsSource: { appliesTo: nestedNetworkApplicability.map(($transaction) => ({ $transaction, source: Source.Juno_JsonRpc })), resolve: async ({ $transaction, timestampMs, source }) => { if (source !== Source.Juno_JsonRpc) throw new Error('Juno_JsonRpc: transaction observation source does not match'); const { getBlockWithTxHashes, getTransactionReceipt, getTransactionByHash } = await import('$/sources/Juno/JsonRpc/queries.ts'); const hash = felt($transaction.transactionHash, 'transaction hash'); const receipt = await getTransactionReceipt(hash); const block = await getBlockWithTxHashes({ block_number: blockNumber(receipt.block_number, 'receipt block number') }); const snapshot = transactionFields(await getTransactionByHash(hash), receipt, $transaction, blockNumber(block.timestamp, 'block timestamp') * 1000); const expected = snapshot.$$timestamps[0][EntityMetaKey.Selector].timestampMs; if (expected !== timestampMs) throw new Error('Juno_JsonRpc: transaction observation timestamp mismatch'); return snapshot.$$timestamps[0][EntityMetaKey.Fields] } } } })({ blockNumber: (snapshot) => snapshot.blockNumber, finalityStatus: (snapshot) => snapshot.finalityStatus, executionStatus: (snapshot) => snapshot.executionStatus, actualFee: (snapshot) => snapshot.actualFee, revertReason: (snapshot) => snapshot.revertReason, messagesSent: (snapshot) => snapshot.messagesSent, eventsCount: (snapshot) => snapshot.eventsCount }),
	],
} satisfies RegisteredSourceResolverModule

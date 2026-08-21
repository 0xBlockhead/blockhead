import { networkBySlug } from '$/constants/Network.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import type { ResolverContext } from '$/resolvers/$resolvers.ts'
import { entityFieldAddressKey, EntityMetaKey, type EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type {
	KaspaNodeBlock,
	KaspaNodeBlockDagInfo,
	KaspaNodeServerInfo,
	KaspaNodeTransaction,
	KaspaNodeUtxo,
	KaspaNodeVirtualChain,
} from '$/sources/KaspaNode/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type KaspaNetworkId = EntitySelector<typeof schema, EntityType.KaspaNetwork>
type KaspaAddressId = EntitySelector<typeof schema, EntityType.KaspaAddress>

type KaspaNodeQueries = {
	getBlockDagInfo: () => Promise<KaspaNodeBlockDagInfo>
	getServerInfo: () => Promise<KaspaNodeServerInfo>
	getAddressBalance: (input: { address: string }) => Promise<{ address?: string; balance: string }>
	getAddressUtxos: (input: { address: string }) => Promise<{ entries: KaspaNodeUtxo[] } | KaspaNodeUtxo[]>
	getBlock: (input: { blockHash: string }) => Promise<KaspaNodeBlock | { block: KaspaNodeBlock }>
	getTransaction: (input: { transactionId: string }) => Promise<KaspaNodeTransaction | { transaction: KaspaNodeTransaction }>
	getVirtualChain: (input: { startHash: string; minConfirmationCount?: number }) => Promise<KaspaNodeVirtualChain>
}

const applicability = [{ $network: { slug: networkBySlug.kaspa.slug } }] as const
const addressApplicability = [{ $network: { $network: { slug: networkBySlug.kaspa.slug } } }] as const

const assertKaspaNetwork = (network: KaspaNetworkId) => {
	if ('slug' in network.$network && network.$network.slug === networkBySlug.kaspa.slug)
		return
	throw new Error('KaspaNode: unsupported network')
}

const assertKaspaAddress = (address: KaspaAddressId) => {
	assertKaspaNetwork(address.$network)
	if (address.address.startsWith('kaspa:'))
		return
	throw new Error('KaspaNode: invalid Kaspa address')
}

const blockValue = (value: KaspaNodeBlock | { block: KaspaNodeBlock }) => 'block' in value ? value.block : value
const transactionValue = (value: KaspaNodeTransaction | { transaction: KaspaNodeTransaction }) => 'transaction' in value ? value.transaction : value
const utxoValues = (value: { entries: KaspaNodeUtxo[] } | KaspaNodeUtxo[]) => 'entries' in value ? value.entries : value

const assertCurrentObservation = (timestampMs: number, context: ResolverContext, label: string) => {
	const requestedTimestamps = context.filters.flatMap((filter) => {
		if (filter.fieldPath.length !== 1 || filter.fieldPath[0] !== 'timestampMs')
			return []
		if (filter.operator === 'eq')
			return [filter.value]
		return Array.isArray(filter.value) ? filter.value : []
	})
	if (requestedTimestamps.some((requestedTimestamp) => requestedTimestamp !== timestampMs))
		throw new Error(`KaspaNode: historical ${label} observations are unsupported`)
}

const transactionFields = (transaction: KaspaNodeTransaction) => ({
	[entityFieldAddressKey(EntityType.KaspaTransaction, [], 'version')]: transaction.version,
	...(transaction.lockTime != null && { [entityFieldAddressKey(EntityType.KaspaTransaction, [], 'lockTime')]: BigInt(transaction.lockTime) }),
	...(transaction.subnetworkId != null && { [entityFieldAddressKey(EntityType.KaspaTransaction, [], 'subnetworkId')]: transaction.subnetworkId }),
	...(transaction.gas != null && { [entityFieldAddressKey(EntityType.KaspaTransaction, [], 'gas')]: BigInt(transaction.gas) }),
	...(transaction.payload != null && {
		[entityFieldAddressKey(EntityType.KaspaTransaction, [], 'payloadLength')]: transaction.payload.length / 2,
	}),
	...(transaction.mass != null && { [entityFieldAddressKey(EntityType.KaspaTransaction, [], 'mass')]: BigInt(transaction.mass) }),
	...(transaction.blockHash != null && { [entityFieldAddressKey(EntityType.KaspaTransaction, [], 'blockHashes')]: [transaction.blockHash] }),
})

const blockFields = (block: KaspaNodeBlock) => ({
	[entityFieldAddressKey(EntityType.KaspaBlock, [], 'version')]: block.header.version,
	[entityFieldAddressKey(EntityType.KaspaBlock, [], 'timestampMs')]: block.header.timestamp,
	[entityFieldAddressKey(EntityType.KaspaBlock, [], 'blueScore')]: BigInt(block.header.blueScore),
	[entityFieldAddressKey(EntityType.KaspaBlock, [], 'daaScore')]: BigInt(block.header.daaScore),
	[entityFieldAddressKey(EntityType.KaspaBlock, [], 'bits')]: block.header.bits,
	[entityFieldAddressKey(EntityType.KaspaBlock, [], 'nonce')]: BigInt(block.header.nonce),
	[entityFieldAddressKey(EntityType.KaspaBlock, [], 'hashMerkleRoot')]: block.header.hashMerkleRoot,
	[entityFieldAddressKey(EntityType.KaspaBlock, [], 'acceptedIdMerkleRoot')]: block.header.acceptedIdMerkleRoot,
	[entityFieldAddressKey(EntityType.KaspaBlock, [], 'utxoCommitment')]: block.header.utxoCommitment,
	[entityFieldAddressKey(EntityType.KaspaBlock, [], 'selectedParentHash')]: block.verboseData.selectedParentHash,
	[entityFieldAddressKey(EntityType.KaspaBlock, [], 'parentHashes')]: block.header.parents.flatMap((parents) => parents.parentHashes),
	[entityFieldAddressKey(EntityType.KaspaBlock, [], 'mergeSetBlues')]: block.verboseData.mergeSetBluesHashes,
	[entityFieldAddressKey(EntityType.KaspaBlock, [], 'mergeSetReds')]: block.verboseData.mergeSetRedsHashes,
})

export const createKaspaNodeResolverModule = (
	source: Source.KaspaNode_Rest | Source.KaspaNode_Wrpc,
	loadQueries: () => Promise<KaspaNodeQueries>
) => ({
	source,
	resolvers: [
		defineResolver({
			entityType: EntityType.KaspaNetwork,
			resolve: { Network: { appliesTo: applicability, resolve: async ({ $network }) => {
				assertKaspaNetwork({ $network })
				const queries = await loadQueries()
				const [dag, server] = await Promise.all([queries.getBlockDagInfo(), queries.getServerInfo()])
				const timestampMs = dag.pastMedianTime
				return [{
					[EntityMetaKey.Selector]: { $network: { $network }, timestampMs, source },
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.KaspaNetwork_Timestamp, [], 'virtualDaaScore')]: BigInt(dag.virtualDaaScore),
						...(dag.virtualBlueScore != null && { [entityFieldAddressKey(EntityType.KaspaNetwork_Timestamp, [], 'virtualBlueScore')]: BigInt(dag.virtualBlueScore) }),
						...(dag.virtualParentHashes[0] != null && { [entityFieldAddressKey(EntityType.KaspaNetwork_Timestamp, [], 'virtualSelectedParentHash')]: dag.virtualParentHashes[0] }),
						[entityFieldAddressKey(EntityType.KaspaNetwork_Timestamp, [], 'pruningPointHash')]: dag.pruningPointHash,
						[entityFieldAddressKey(EntityType.KaspaNetwork_Timestamp, [], 'sinkCount')]: dag.tipHashes.length,
						[entityFieldAddressKey(EntityType.KaspaNetwork_Timestamp, [], 'blockCount')]: dag.blockCount,
						[entityFieldAddressKey(EntityType.KaspaNetwork_Timestamp, [], 'difficulty')]: dag.difficulty,
						[entityFieldAddressKey(EntityType.KaspaNetwork_Timestamp, [], 'hasUtxoIndex')]: server.hasUtxoIndex,
						[entityFieldAddressKey(EntityType.KaspaNetwork_Timestamp, [], 'serverVersion')]: server.serverVersion,
					},
				}]
			} } },
		})({ $$timestamps: (rows) => rows }),
		defineResolver({
			entityType: EntityType.KaspaAddress,
			resolve: { NetworkAddress: { appliesTo: addressApplicability, resolve: async (address, context) => {
				assertKaspaAddress(address)
				const queries = await loadQueries()
				const [balance, utxos, dag] = await Promise.all([
					queries.getAddressBalance({ address: address.address }),
					queries.getAddressUtxos({ address: address.address }),
					queries.getBlockDagInfo(),
				])
				const timestampMs = dag.pastMedianTime
				assertCurrentObservation(timestampMs, context, 'address')
				const entries = utxoValues(utxos)
				return [{
					[EntityMetaKey.Selector]: { $address: address, timestampMs, source },
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.KaspaAddress_Timestamp, [], 'balanceSompi')]: BigInt(balance.balance),
						[entityFieldAddressKey(EntityType.KaspaAddress_Timestamp, [], 'utxoCount')]: entries.length,
					},
				}]
			} } },
		})({ $$timestamps: (rows) => rows }),
		defineResolver({
			entityType: EntityType.KaspaAddress,
			resolve: { NetworkAddress: { appliesTo: addressApplicability, resolve: async (address, context) => {
				assertKaspaAddress(address)
				const queries = await loadQueries()
				const [utxos, dag] = await Promise.all([
					queries.getAddressUtxos({ address: address.address }),
					queries.getBlockDagInfo(),
				])
				const entries = utxoValues(utxos)
				const timestampMs = dag.pastMedianTime
				assertCurrentObservation(timestampMs, context, 'address UTXO')
				return entries.map((utxo) => ({
					[EntityMetaKey.Selector]: { $address: address, outpointTransactionId: utxo.outpoint.transactionId, outpointIndex: utxo.outpoint.index, timestampMs, source },
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.KaspaAddressUtxo_Timestamp, [], 'amountSompi')]: BigInt(utxo.utxoEntry.amount),
						[entityFieldAddressKey(EntityType.KaspaAddressUtxo_Timestamp, [], 'scriptPublicKey')]: utxo.utxoEntry.scriptPublicKey.scriptPublicKey,
						[entityFieldAddressKey(EntityType.KaspaAddressUtxo_Timestamp, [], 'blockDaaScore')]: BigInt(utxo.utxoEntry.blockDaaScore),
						[entityFieldAddressKey(EntityType.KaspaAddressUtxo_Timestamp, [], 'isCoinbase')]: utxo.utxoEntry.isCoinbase,
					},
				}))
			} } },
		})({ $$utxos: (rows) => rows }),
		defineResolver({
			entityType: EntityType.KaspaBlock,
			resolve: { NetworkBlockHash: { appliesTo: addressApplicability, resolve: async (block) => {
				assertKaspaNetwork(block.$network)
				const value = blockValue(await (await loadQueries()).getBlock({ blockHash: block.blockHash }))
				return [{ [EntityMetaKey.Selector]: { $network: block.$network, blockHash: value.header.hash }, [EntityMetaKey.Fields]: blockFields(value) }]
			} } },
		})({
			version: (block: KaspaNodeBlock) => block.header.version,
		}),
		defineResolver({
			entityType: EntityType.KaspaTransaction,
			resolve: { NetworkTransactionId: { appliesTo: addressApplicability, resolve: async (transaction) => {
				assertKaspaNetwork(transaction.$network)
				const value = transactionValue(await (await loadQueries()).getTransaction({ transactionId: transaction.transactionId }))
				return [{ [EntityMetaKey.Selector]: { $network: transaction.$network, transactionId: value.transactionId }, [EntityMetaKey.Fields]: transactionFields(value) }]
			} } },
		})({
			version: (transaction: KaspaNodeTransaction) => transaction.version,
		}),
		defineResolver({
			entityType: EntityType.KaspaAcceptedTransaction,
			resolve: { AcceptingBlockTransaction: { appliesTo: [{ $acceptingBlock: addressApplicability[0], $transaction: addressApplicability[0] }], resolve: async (accepted) => {
				assertKaspaNetwork(accepted.$acceptingBlock.$network)
				const value = blockValue(await (await loadQueries()).getBlock({ blockHash: accepted.$acceptingBlock.blockHash }))
				if (!value.transactions.some((transaction) => transaction.transactionId === accepted.$transaction.transactionId))
					throw new Error(`KaspaNode: transaction ${accepted.$transaction.transactionId} is not accepted by ${accepted.$acceptingBlock.blockHash}`)
				return [{ [EntityMetaKey.Selector]: accepted, [EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.KaspaAcceptedTransaction, [], 'acceptingBlockHash')]: accepted.$acceptingBlock.blockHash,
					[entityFieldAddressKey(EntityType.KaspaAcceptedTransaction, [], 'transactionId')]: accepted.$transaction.transactionId,
				} }]
			} } },
		})({
			acceptingBlockHash: (accepted: { acceptingBlockHash: string }) => accepted.acceptingBlockHash,
		}),
		defineResolver({
			entityType: EntityType.KaspaVirtualChain_Timestamp,
			resolve: { NetworkStartHashTimestampMsSource: { appliesTo: addressApplicability, resolve: async (chain, context) => {
				assertKaspaNetwork(chain.$network)
				const queries = await loadQueries()
				const [value, dag] = await Promise.all([
					queries.getVirtualChain({ startHash: chain.startHash, minConfirmationCount: chain.minConfirmationCount }),
					queries.getBlockDagInfo(),
				])
				assertCurrentObservation(dag.pastMedianTime, context, 'virtual-chain')
				if (chain.timestampMs !== dag.pastMedianTime)
					throw new Error('KaspaNode: historical virtual-chain observations are unsupported')
				return [{ [EntityMetaKey.Selector]: { $network: chain.$network, startHash: chain.startHash, timestampMs: dag.pastMedianTime, source }, [EntityMetaKey.Fields]: {
					...(value.minConfirmationCount != null && { [entityFieldAddressKey(EntityType.KaspaVirtualChain_Timestamp, [], 'minConfirmationCount')]: value.minConfirmationCount }),
					[entityFieldAddressKey(EntityType.KaspaVirtualChain_Timestamp, [], 'addedChainBlockHashes')]: value.addedChainBlockHashes,
					[entityFieldAddressKey(EntityType.KaspaVirtualChain_Timestamp, [], 'removedChainBlockHashes')]: value.removedChainBlockHashes,
					...(value.acceptedTransactionIds != null && { [entityFieldAddressKey(EntityType.KaspaVirtualChain_Timestamp, [], 'acceptedTransactionCount')]: value.acceptedTransactionIds.reduce((count, row) => count + row.acceptedTransactionIds.length, 0) }),
					...(value.nextCheckpointHash != null && { [entityFieldAddressKey(EntityType.KaspaVirtualChain_Timestamp, [], 'nextCheckpointHash')]: value.nextCheckpointHash }),
				} }]
			} } },
		})({
			addedChainBlockHashes: (chain: KaspaNodeVirtualChain) => chain.addedChainBlockHashes,
		}),
	],
}) satisfies RegisteredSourceResolverModule

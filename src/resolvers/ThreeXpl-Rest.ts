import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { networkBySlug } from '$/constants/Network.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type {
	ThreeXplBlockData,
	ThreeXplBlockEvent,
	ThreeXplBlockInfo,
} from '$/sources/ThreeXpl/Rest/types.ts'


type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const threeXplBlockchain = (network: NetworkId) => {
	if ('slug' in network) {
		if (network.slug === 'tron') return 'tron'
		if (network.slug === 'near')
			throw new Error('ThreeXpl_Rest: Near is not indexed by 3xpl')
	}
	if (!('caip2' in network)) throw new Error('ThreeXpl_Rest: unsupported network')
	if (network.caip2.namespace === networkBySlug.bitcoin.caip2.namespace && network.caip2.reference === networkBySlug.bitcoin.caip2.reference) return 'bitcoin'
	if (network.caip2.namespace === networkBySlug['bitcoin-cash'].caip2.namespace && network.caip2.reference === networkBySlug['bitcoin-cash'].caip2.reference) return 'bitcoin-cash'
	if (network.caip2.namespace === networkBySlug.dogecoin.caip2.namespace && network.caip2.reference === networkBySlug.dogecoin.caip2.reference) return 'dogecoin'
	if (network.caip2.namespace === networkBySlug.litecoin.caip2.namespace && network.caip2.reference === networkBySlug.litecoin.caip2.reference) return 'litecoin'
	if (network.caip2.namespace === networkBySlug.zcash.caip2.namespace && network.caip2.reference === networkBySlug.zcash.caip2.reference) return 'zcash'
	if (network.caip2.namespace === networkBySlug.monero.caip2.namespace && network.caip2.reference === networkBySlug.monero.caip2.reference) return 'monero'
	if (network.caip2.namespace === networkBySlug.polkadot.caip2.namespace && network.caip2.reference === networkBySlug.polkadot.caip2.reference) return 'polkadot'
	if (network.caip2.namespace === networkBySlug.solana.caip2.namespace && network.caip2.reference === networkBySlug.solana.caip2.reference) return 'solana'
	if (network.caip2.namespace === networkBySlug.tron.caip2.namespace && network.caip2.reference === networkBySlug.tron.caip2.reference) return 'tron'
	throw new Error(`ThreeXpl_Rest: unsupported network ${network.caip2.namespace}:${network.caip2.reference}`)
}

const eventTransactions = (events: Record<string, ThreeXplBlockEvent[]> | undefined) => (
	[
		...new Set(
			Object.values(events ?? {})
				.flat()
				.flatMap((event) => (
					event.transaction == null || event.transaction === '' ?
						[]
					:
						[
							event.transaction,
						]
				))
		),
	]
)

const moduleEventCount = (
	events: Record<string, number | null> | undefined
) => (
	events == null ?
		undefined
	:
		Object.values(events)
			.reduce((sum, count) => (
				sum + (count ?? 0)
			), 0)
)

const parseBlockTimeMs = (
	time: string | null | undefined
) => {
	if (time == null) return undefined
	const timestampMs = Date.parse(time)
	if (!Number.isFinite(timestampMs))
		throw new Error(`ThreeXpl_Rest: invalid block time ${time}`)
	return timestampMs
}

const assertBlockIdentity = ({
	wireBlock,
	height,
	hash,
}: {
	wireBlock: ThreeXplBlockInfo | undefined
	height?: bigint
	hash?: string
}) => {
	if (wireBlock?.block != null && height != null && BigInt(wireBlock.block) !== height)
		throw new Error(`ThreeXpl_Rest: block height ${wireBlock.block} does not match selector ${height}`)
	if (wireBlock?.hash != null && hash != null && wireBlock.hash !== hash)
		throw new Error(`ThreeXpl_Rest: block hash ${wireBlock.hash} does not match selector ${hash}`)
}

const moneroBlockSnapshot = ({
	$network,
	height,
	hash,
	wire,
}: {
	$network: NetworkId
	height: bigint
	hash: string
	wire: ThreeXplBlockData
}) => {
	assertBlockIdentity({
		wireBlock: wire.block,
		height,
		hash,
	})
	const timestampMs = parseBlockTimeMs(wire.block?.time)
	return {
		hash,
		...(timestampMs != null && {
			timestampMs,
		}),
		$$transactions: eventTransactions(wire.events).map((txHash) => ({
			[EntityMetaKey.Selector]: {
				$network,
				txHash,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.MoneroTransaction, [], '$block')]: {
					[EntityMetaKey.Selector]: {
						$network,
						height,
						hash,
					},
				},
			},
		})),
	}
}

const tipBlockReferences = async ({
	$network,
	blockchain,
	limit,
	entityType,
	timestampField = true,
}: {
	$network: NetworkId
	blockchain: string
	limit: number
	entityType: EntityType.MoneroBlock | EntityType.TronBlock | EntityType.UtxoBlock
	timestampField?: boolean
}) => {
	const {
		fetchBlocks,
		fetchChainStats,
		threeXplListLimit,
	} = await import('$/sources/ThreeXpl/Rest/queries.ts')
	const pageLimit = threeXplListLimit(limit)
	const [
		stats,
		blocksResponse,
	] = await Promise.all([
		fetchChainStats({
			from: blockchain,
		}),
		fetchBlocks({
			blockchain,
			limit: pageLimit,
		}),
	])
	const bestBlock = stats.data.blockchains?.[blockchain]?.best_block
	if (bestBlock == null)
		throw new Error(`ThreeXpl_Rest: missing best_block for ${blockchain}`)

	return {
		blockCount: bestBlock + 1,
		blocks: Object.entries(blocksResponse.data.blocks ?? {})
			.map(([heightKey, block]) => ({
				height: BigInt(heightKey),
				block,
			}))
			.sort((left, right) => (
				left.height === right.height ?
					0
				: left.height > right.height ?
					-1
				:
					1
			))
			.slice(0, limit)
			.map(({ height, block }) => {
				const timestampMs = parseBlockTimeMs(block.time)
				const transactionCount = moduleEventCount(block.events)
				return {
					[EntityMetaKey.Selector]: {
						$network,
						height,
						hash: block.hash,
					},
					[EntityMetaKey.Fields]: {
						...(timestampField && timestampMs != null && {
							[entityFieldAddressKey(entityType, [], 'timestampMs')]: timestampMs,
						}),
						...(transactionCount != null && entityType !== EntityType.MoneroBlock && {
							[entityFieldAddressKey(entityType, [], 'transactionCount')]: transactionCount,
						}),
					},
				}
			}),
	}
}

export default {
	source: Source.ThreeXpl_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.MoneroBlock,
			resolve: {
				NetworkHeight: {
					resolve: async ({ $network, height }) => {
						const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
						const wireBlock = await fetchBlock({
							blockchain: threeXplBlockchain($network),
							block: height.toString(),
						})
						const hash = wireBlock.data.block?.hash
						if (hash == null)
							throw new Error(`ThreeXpl_Rest: Monero block ${height} missing hash`)
						return moneroBlockSnapshot({
							$network,
							height,
							hash,
							wire: wireBlock.data,
						})
					},
				},
				NetworkHeightHash: {
					resolve: async ({ $network, hash, height }) => {
						const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
						const wireBlock = await fetchBlock({
							blockchain: threeXplBlockchain($network),
							block: height.toString(),
						})
						return moneroBlockSnapshot({
							$network,
							height,
							hash,
							wire: wireBlock.data,
						})
					},
				},
			},
		})({
			hash: (block) => block.hash,
			timestampMs: (block) => block.timestampMs,
			$$transactions: (block) => block.$$transactions,
		}),

		defineResolver({
			entityType: EntityType.MoneroNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => (
						tipBlockReferences({
							$network,
							blockchain: threeXplBlockchain($network),
							limit: Math.min(resolverContextRowLimit(context), 100),
							entityType: EntityType.MoneroBlock,
						})
					),
				},
			},
		})({
			$$blocks: {
				select: (snapshot) => snapshot.blocks,
				resolveCount: (snapshot) => snapshot.blockCount,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => (
						tipBlockReferences({
							$network: network,
							blockchain: threeXplBlockchain(network),
							limit: Math.min(resolverContextRowLimit(context), 100),
							entityType: EntityType.MoneroBlock,
						})
					),
				},
			},
		})({
			Monero: {
				$$blocks: {
					select: (snapshot) => snapshot.blocks,
					resolveCount: (snapshot) => snapshot.blockCount,
				},
			},
		}),

		defineResolver({
			entityType: EntityType.NearBlock,
			resolve: {
				NetworkHeightHash: {
					resolve: async ({ $network }) => {
						threeXplBlockchain($network)
						throw new Error('ThreeXpl_Rest: Near is not indexed by 3xpl')
					},
				},
			},
		})({
			hash: (block) => block.hash,
			timestampMs: (block) => block.timestampMs,
		}),

		defineResolver({
			entityType: EntityType.PolkadotBlock,
			resolve: {
				NetworkBlockNumberHash: {
					resolve: async ({ $network, blockNumber, hash }) => {
						const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
						const wireBlock = await fetchBlock({
							blockchain: threeXplBlockchain($network),
							block: hash,
						})
						assertBlockIdentity({
							wireBlock: wireBlock.data.block,
							height: blockNumber,
							hash,
						})
						return {
							hash,
						}
					},
				},
			},
		})({
			hash: (block) => block.hash,
		}),

		defineResolver({
			entityType: EntityType.SolanaBlock,
			resolve: {
				Slot: {
					resolve: async ({ $network, slot }) => {
						const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
						const wireBlock = await fetchBlock({
							blockchain: threeXplBlockchain($network),
							block: slot.toString(),
						})
						assertBlockIdentity({
							wireBlock: wireBlock.data.block,
							height: slot,
						})
						return {
							...(wireBlock.data.block?.hash != null && {
								blockHash: wireBlock.data.block.hash,
							}),
							...(parseBlockTimeMs(wireBlock.data.block?.time) != null && {
								timestampMs: parseBlockTimeMs(wireBlock.data.block?.time),
							}),
							transactionCount: moduleEventCount(wireBlock.data.block?.events),
							$$transactions: eventTransactions(wireBlock.data.events).map((signature) => ({
								[EntityMetaKey.Selector]: {
									$network,
									signature,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.SolanaTransaction, [], '$block')]: {
										[EntityMetaKey.Selector]: {
											$network,
											slot,
										},
									},
									[entityFieldAddressKey(EntityType.SolanaTransaction, [], 'slot')]: slot,
								},
							})),
						}
					},
				},
			},
		})({
			blockHash: (block) => {
				if (block.blockHash == null) throw new Error('ThreeXpl_Rest: Solana block missing block hash')
				return block.blockHash
			},
			timestampMs: (block) => block.timestampMs,
			transactionCount: (block) => block.transactionCount,
			$$transactions: (block) => block.$$transactions,
		}),

		defineResolver({
			entityType: EntityType.SolanaTransaction,
			resolve: {
				NetworkSignature: {
					resolve: async ({ $network, signature }) => {
						const { fetchTransaction } = await import('$/sources/ThreeXpl/Rest/queries.ts')
						const wireTransaction = await fetchTransaction({
							blockchain: threeXplBlockchain($network),
							transaction: signature,
						})
						if (wireTransaction.data.transaction?.transaction != null && wireTransaction.data.transaction.transaction !== signature)
							throw new Error(`ThreeXpl_Rest: transaction ${wireTransaction.data.transaction.transaction} does not match selector ${signature}`)
						return {
							...(wireTransaction.data.transaction?.block != null && {
								$block: {
									[EntityMetaKey.Selector]: {
										$network,
										slot: BigInt(wireTransaction.data.transaction.block),
									},
								},
							}),
						}
					},
				},
			},
		})({
			$block: (transaction) => transaction.$block,
		}),

		defineResolver({
			entityType: EntityType.TronBlock,
			resolve: {
				NetworkHeight: {
					resolve: async ({ $network, height }) => {
						const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
						const wireBlock = await fetchBlock({
							blockchain: threeXplBlockchain($network),
							block: height.toString(),
						})
						const hash = wireBlock.data.block?.hash
						if (hash == null)
							throw new Error(`ThreeXpl_Rest: Tron block ${height} missing hash`)
						assertBlockIdentity({
							wireBlock: wireBlock.data.block,
							height,
							hash,
						})
						return {
							hash,
							...(parseBlockTimeMs(wireBlock.data.block?.time) != null && {
								timestampMs: parseBlockTimeMs(wireBlock.data.block?.time),
							}),
							transactionCount: moduleEventCount(wireBlock.data.block?.events),
							$$transactions: eventTransactions(wireBlock.data.events).map((transactionId) => ({
								[EntityMetaKey.Selector]: {
									$network,
									transactionId,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.TronTransaction, [], '$block')]: {
										[EntityMetaKey.Selector]: {
											$network,
											height,
											hash,
										},
									},
									[entityFieldAddressKey(EntityType.TronTransaction, [], 'blockHeight')]: height,
								},
							})),
						}
					},
				},
				NetworkHeightHash: {
					resolve: async ({ $network, hash, height }) => {
						const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
						const wireBlock = await fetchBlock({
							blockchain: threeXplBlockchain($network),
							block: hash,
						})
						assertBlockIdentity({
							wireBlock: wireBlock.data.block,
							height,
							hash,
						})
						return {
							hash,
							...(parseBlockTimeMs(wireBlock.data.block?.time) != null && {
								timestampMs: parseBlockTimeMs(wireBlock.data.block?.time),
							}),
							transactionCount: moduleEventCount(wireBlock.data.block?.events),
							$$transactions: eventTransactions(wireBlock.data.events).map((transactionId) => ({
								[EntityMetaKey.Selector]: {
									$network,
									transactionId,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.TronTransaction, [], '$block')]: {
										[EntityMetaKey.Selector]: {
											$network,
											height,
											hash,
										},
									},
									[entityFieldAddressKey(EntityType.TronTransaction, [], 'blockHeight')]: height,
								},
							})),
						}
					},
				},
			},
		})({
			hash: (block) => block.hash,
			timestampMs: (block) => block.timestampMs,
			transactionCount: (block) => block.transactionCount,
			$$transactions: (block) => block.$$transactions,
		}),

		defineResolver({
			entityType: EntityType.TronTransaction,
			resolve: {
				NetworkTransactionId: {
					resolve: async ({ $network, transactionId }) => {
						const { fetchTransaction } = await import('$/sources/ThreeXpl/Rest/queries.ts')
						const wireTransaction = await fetchTransaction({
							blockchain: threeXplBlockchain($network),
							transaction: transactionId,
						})
						if (wireTransaction.data.transaction?.transaction != null && wireTransaction.data.transaction.transaction !== transactionId)
							throw new Error(`ThreeXpl_Rest: transaction ${wireTransaction.data.transaction.transaction} does not match selector ${transactionId}`)
						const blockHeight = (
							wireTransaction.data.transaction?.block != null ?
								BigInt(wireTransaction.data.transaction.block)
							:
								undefined
						)
						return {
							...(blockHeight != null && {
								$block: {
									[EntityMetaKey.Selector]: {
										$network,
										height: blockHeight,
									},
								},
								blockHeight,
							}),
							...(parseBlockTimeMs(wireTransaction.data.transaction?.time) != null && {
								timestampMs: parseBlockTimeMs(wireTransaction.data.transaction?.time),
							}),
						}
					},
				},
			},
		})({
			$block: (transaction) => transaction.$block,
			blockHeight: (transaction) => transaction.blockHeight,
			timestampMs: (transaction) => transaction.timestampMs,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => (
						tipBlockReferences({
							$network: network,
							blockchain: threeXplBlockchain(network),
							limit: Math.min(resolverContextRowLimit(context), 100),
							entityType: EntityType.TronBlock,
							timestampField: true,
						})
					),
				},
			},
		})({
			Tron: {
				$$blocks: {
					select: (snapshot) => snapshot.blocks,
					resolveCount: (snapshot) => snapshot.blockCount,
				},
			},
		}),

		defineResolver({
			entityType: EntityType.UtxoBlock,
			resolve: {
				NetworkHeight: {
					resolve: async ({ $network, height }) => {
						const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
						const wireBlock = await fetchBlock({
							blockchain: threeXplBlockchain($network),
							block: height.toString(),
						})
						const hash = wireBlock.data.block?.hash
						if (hash == null)
							throw new Error(`ThreeXpl_Rest: UTXO block ${height} missing hash`)
						assertBlockIdentity({
							wireBlock: wireBlock.data.block,
							height,
							hash,
						})
						return {
							hash,
							...(parseBlockTimeMs(wireBlock.data.block?.time) != null && {
								timestampMs: parseBlockTimeMs(wireBlock.data.block?.time),
							}),
							transactionCount: moduleEventCount(wireBlock.data.block?.events),
							$$transactions: eventTransactions(wireBlock.data.events).map((txId) => ({
								[EntityMetaKey.Selector]: {
									$network,
									txId,
								},
							})),
						}
					},
				},
				NetworkHeightHash: {
					resolve: async ({ $network, height, hash }) => {
						const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
						const wireBlock = await fetchBlock({
							blockchain: threeXplBlockchain($network),
							block: hash,
						})
						assertBlockIdentity({
							wireBlock: wireBlock.data.block,
							height,
							hash,
						})
						return {
							hash,
							...(parseBlockTimeMs(wireBlock.data.block?.time) != null && {
								timestampMs: parseBlockTimeMs(wireBlock.data.block?.time),
							}),
							transactionCount: moduleEventCount(wireBlock.data.block?.events),
							$$transactions: eventTransactions(wireBlock.data.events).map((txId) => ({
								[EntityMetaKey.Selector]: {
									$network,
									txId,
								},
							})),
						}
					},
				},
			},
		})({
			hash: (block) => block.hash,
			timestampMs: (block) => block.timestampMs,
			transactionCount: (block) => block.transactionCount,
			$$transactions: (block) => block.$$transactions,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => (
						tipBlockReferences({
							$network: network,
							blockchain: threeXplBlockchain(network),
							limit: Math.min(resolverContextRowLimit(context), 100),
							entityType: EntityType.UtxoBlock,
							timestampField: true,
						})
					),
				},
			},
		})({
			Utxo: {
				$$blocks: {
					select: (snapshot) => snapshot.blocks,
					resolveCount: (snapshot) => snapshot.blockCount,
				},
			},
		}),
	],
} satisfies RegisteredSourceResolverModule

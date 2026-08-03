import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { networkBySlug } from '$/constants/Network.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type { ThreeXplBlockEvent } from '$/sources/ThreeXpl/Rest/types.ts'

const loadThreeXplQueries = () => import('$/sources/ThreeXpl/Rest/queries.ts')

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const threeXplBlockchain = (network: NetworkId) => {
	if ('slug' in network) {
		if (network.slug === 'near') return 'near'
		if (network.slug === 'tron') return 'tron'
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
	throw new Error(`ThreeXpl_Rest: unsupported network ${network.caip2.namespace}:${network.caip2.reference}`)
}

const eventTransactions = (events: Record<string, ThreeXplBlockEvent[]> | undefined) => (
	[
		...new Set(
			Object.values(events ?? {})
				.flat()
				.flatMap((event) => (
					event.transaction == null ?
						[]
					:
						[
							event.transaction,
						]
				))
		),
	]
)

export default {
	source: Source.ThreeXpl_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.MoneroBlock,
			resolve: {
				NetworkHeightHash: {
					resolve: async ({ $network, hash, height }) => {
						const { fetchBlock } = await loadThreeXplQueries()
						const wireBlock = await fetchBlock({
							blockchain: threeXplBlockchain($network),
							block: height.toString(),
						})
						return {
							hash,
							...(wireBlock.data.block?.time != null && {
								timestampMs: Date.parse(wireBlock.data.block.time),
							}),
							$$transactions: eventTransactions(wireBlock.data.events).map((txHash) => ({
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
					},
				}
			},
		})({
			hash: (block) => block.hash,
			timestampMs: (block) => block.timestampMs,
			$$transactions: (block) => block.$$transactions,
		}),

		defineResolver({
			entityType: EntityType.NearBlock,
			resolve: {
				NetworkHeightHash: {
					resolve: async ({ $network, hash, height }) => {
						const { fetchBlock } = await loadThreeXplQueries()
						const wireBlock = await fetchBlock({
							blockchain: threeXplBlockchain($network),
							block: hash,
						})
						return {
							hash,
							...(wireBlock.data.block?.time != null && {
								timestampMs: Date.parse(wireBlock.data.block.time),
							}),
						}
					},
				}
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
						const { fetchBlock } = await loadThreeXplQueries()
						const wireBlock = await fetchBlock({
							blockchain: threeXplBlockchain($network),
							block: hash,
						})
						return {
							hash,
						}
					},
				}
			},
		})({
				hash: (block) => block.hash,
			}),

		defineResolver({
			entityType: EntityType.SolanaBlock,
			resolve: {
				Slot: {
					resolve: async ({ $network, slot }) => {
						const { fetchBlock } = await loadThreeXplQueries()
						const wireBlock = await fetchBlock({
							blockchain: threeXplBlockchain($network),
							block: slot.toString(),
						})
						return {
							...(wireBlock.data.block?.hash != null && {
								blockHash: wireBlock.data.block.hash,
							}),
							...(wireBlock.data.block?.time != null && {
								timestampMs: Date.parse(wireBlock.data.block.time),
							}),
							transactionCount: wireBlock.data.block?.events?.transactions,
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
						const { fetchTransaction } = await loadThreeXplQueries()
						const wireTransaction = await fetchTransaction({
							blockchain: threeXplBlockchain($network),
							transaction: signature,
						})
							return {
								...(wireTransaction.data.transaction?.block != null && {
									$block: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										slot: BigInt(wireTransaction.data.transaction.block),
									},
								},
							}),
						}
					},
				}
			},
		})({
				$block: (transaction) => transaction.$block,
			}),

		defineResolver({
			entityType: EntityType.TronBlock,
			resolve: {
				NetworkHeightHash: {
					resolve: async ({ $network, hash, height }) => {
						const { fetchBlock } = await loadThreeXplQueries()
						const wireBlock = await fetchBlock({
							blockchain: threeXplBlockchain($network),
							block: hash,
						})
						return {
							hash,
							...(wireBlock.data.block?.time != null && {
								timestampMs: Date.parse(wireBlock.data.block.time),
							}),
							transactionCount: wireBlock.data.block?.events?.transactions,
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
				}
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
						const { fetchTransaction } = await loadThreeXplQueries()
						const wireTransaction = await fetchTransaction({
							blockchain: threeXplBlockchain($network),
							transaction: transactionId,
						})
							return {
								...(wireTransaction.data.transaction?.block != null && {
									$block: {
										[EntityMetaKey.Selector]: {
											$network: $network,
											height: BigInt(wireTransaction.data.transaction.block),
										},
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.TronTransaction, [], 'blockHeight')]: BigInt(wireTransaction.data.transaction.block),
									},
								}),
							...(wireTransaction.data.transaction?.time != null && {
								timestampMs: Date.parse(wireTransaction.data.transaction.time),
							}),
						}
					},
				}
			},
		})({
				$block: (transaction) => transaction.$block,
				blockHeight: (transaction) => transaction.blockHeight,
				timestampMs: (transaction) => transaction.timestampMs,
			}),

		defineResolver({
			entityType: EntityType.UtxoBlock,
			resolve: {
				NetworkHeightHash: {
					resolve: async ({ $network, height, hash }) => {
						const { fetchBlock } = await loadThreeXplQueries()
						const wireBlock = await fetchBlock({
							blockchain: threeXplBlockchain($network),
							block: hash,
						})
						return {
							hash,
							...(wireBlock.data.block?.time != null && {
								timestampMs: Date.parse(wireBlock.data.block.time),
							}),
							transactionCount: wireBlock.data.block?.events?.transactions,
							$$transactions: eventTransactions(wireBlock.data.events).map((txId) => ({
								[EntityMetaKey.Selector]: {
									$network,
									txId,
								},
							})),
						}
					},
				}
			},
		})({
			hash: (block) => block.hash,
			timestampMs: (block) => block.timestampMs,
			transactionCount: (block) => block.transactionCount,
			$$transactions: (block) => block.$$transactions,
		}),
	],
} satisfies RegisteredSourceResolverModule

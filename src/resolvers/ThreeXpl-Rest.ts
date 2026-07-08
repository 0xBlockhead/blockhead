import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { networkBySlug } from '$/constants/Network.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { ThreeXplBlockEvent } from '$/sources/ThreeXpl/Rest/types.ts'
import { MoneroBlockSelector } from '$/schema/MoneroBlock.ts'
import { NearBlockSelector } from '$/schema/NearBlock.ts'
import { NearTransactionSelector } from '$/schema/NearTransaction.ts'
import { PolkadotBlockSelector } from '$/schema/PolkadotBlock.ts'
import { SolanaBlockSelector } from '$/schema/SolanaBlock.ts'
import { SolanaTransactionSelector } from '$/schema/SolanaTransaction.ts'
import { TronBlockSelector } from '$/schema/TronBlock.ts'
import { TronTransactionSelector } from '$/schema/TronTransaction.ts'
import { UtxoBlockSelector } from '$/schema/UtxoBlock.ts'

const threeXplBlockchain = (
	network: { caip2: {
		namespace: string
		reference: string
	} } | { slug: string }
) => {
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
		defineResolver(Source.ThreeXpl_Rest, {
			entityType: EntityType.MoneroBlock,
			resolve: {
				[MoneroBlockSelector.NetworkHeightHash]: async ({ $network, hash, height }) => {
					const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
					const wireBlock = await fetchBlock({
						blockchain: threeXplBlockchain($network),
						block: height.toString(),
					})
					return {
						hash,
						...(wireBlock.data.block?.time != null && {
							timestampMs: Date.parse(wireBlock.data.block.time),
						}),
					}
				}
			},
		})({
				hash: (block) => block.hash,
				timestampMs: (block) => block.timestampMs,
			}),

		defineResolver(Source.ThreeXpl_Rest, {
			entityType: EntityType.NearBlock,
			resolve: {
				[NearBlockSelector.NetworkHeightHash]: async ({ $network, hash, height }) => {
					const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
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
				}
			},
		})({
				hash: (block) => block.hash,
				timestampMs: (block) => block.timestampMs,
			}),

		defineResolver(Source.ThreeXpl_Rest, {
			entityType: EntityType.PolkadotBlock,
			resolve: {
				[PolkadotBlockSelector.NetworkBlockNumberHash]: async ({ $network, blockNumber, hash }) => {
					const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
					const wireBlock = await fetchBlock({
						blockchain: threeXplBlockchain($network),
						block: hash,
					})
					return {
						hash,
					}
				}
			},
		})({
				hash: (block) => block.hash,
			}),

		defineResolver(Source.ThreeXpl_Rest, {
			entityType: EntityType.SolanaBlock,
			resolve: {
				[SolanaBlockSelector.Slot]: async ({ $network, slot }: {
					$network: { caip2: {
						namespace: string
						reference: string
					} } | { slug: string }
					slot: bigint
				}) => {
						const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
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
						}
				},
			},
		})({
				blockHash: (block) => {
					if (block.blockHash == null) throw new Error('ThreeXpl_Rest: Solana block missing block hash')
					return block.blockHash
				},
				timestampMs: (block) => block.timestampMs,
				transactionCount: (block) => block.transactionCount,
			}),
		defineResolver(Source.ThreeXpl_Rest, {
			entityType: EntityType.SolanaTransaction,
			resolve: {
				[SolanaTransactionSelector.NetworkSignature]: async ({ $network, signature }) => {
					const { fetchTransaction } = await import('$/sources/ThreeXpl/Rest/queries.ts')
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
				}
			},
		})({
				$block: (transaction) => transaction.$block,
			}),

		defineResolver(Source.ThreeXpl_Rest, {
			entityType: EntityType.TronBlock,
			resolve: {
				[TronBlockSelector.NetworkHeightHash]: async ({ $network, hash, height }) => {
					const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
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
					}
				}
			},
		})({
				hash: (block) => block.hash,
				timestampMs: (block) => block.timestampMs,
				transactionCount: (block) => block.transactionCount,
			}),

		defineResolver(Source.ThreeXpl_Rest, {
			entityType: EntityType.TronTransaction,
			resolve: {
				[TronTransactionSelector.NetworkTransactionId]: async ({ $network, transactionId }) => {
					const { fetchTransaction } = await import('$/sources/ThreeXpl/Rest/queries.ts')
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
							blockHeight: BigInt(wireTransaction.data.transaction.block),
						}),
						...(wireTransaction.data.transaction?.time != null && {
							timestampMs: Date.parse(wireTransaction.data.transaction.time),
						}),
					}
				}
			},
		})({
				$block: (transaction) => transaction.$block,
				blockHeight: (transaction) => transaction.blockHeight,
				timestampMs: (transaction) => transaction.timestampMs,
			}),

		defineResolver(Source.ThreeXpl_Rest, {
			entityType: EntityType.UtxoBlock,
			resolve: {
				[UtxoBlockSelector.NetworkHeightHash]: async ({ $network, hash }) => {
					const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
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
					}
				}
			},
		})({
				hash: (block) => block.hash,
				timestampMs: (block) => block.timestampMs,
				transactionCount: (block) => block.transactionCount,
			}),

		defineResolver(Source.ThreeXpl_Rest, {
			entityType: EntityType.MoneroBlock,
			resolve: {
				[MoneroBlockSelector.NetworkHeightHash]: async ({ $network, height, hash }) => {
					const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
					return eventTransactions(
						(
						await fetchBlock({
							blockchain: threeXplBlockchain($network),
							block: height.toString(),
						})
						).data.events
						).map((txHash) => ({
							[EntityMetaKey.Selector]: {
								$network,
								txHash,
							},
							$block: {
								[EntityMetaKey.Selector]: {
									$network,
									height,
									hash,
								},
							},
						}))
				}
			},
		})({
				$$transactions: (transactions) => transactions,
			}),

		defineResolver(Source.ThreeXpl_Rest, {
			entityType: EntityType.SolanaBlock,
			resolve: {
				[SolanaBlockSelector.Slot]: async ({ $network, slot }: {
					$network: { caip2: {
						namespace: string
						reference: string
					} } | { slug: string }
					slot: bigint
				}) => {
						const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
						return eventTransactions(
							(
							await fetchBlock({
								blockchain: threeXplBlockchain($network),
								block: slot.toString(),
							})
							).data.events
							).map((signature) => ({
								[EntityMetaKey.Selector]: {
									$network,
									signature,
								},
								$block: {
									[EntityMetaKey.Selector]: {
										$network,
										slot,
									},
								},
								slot,
							}))
				},
			},
		})({
				$$transactions: (transactions) => transactions,
			}),

		defineResolver(Source.ThreeXpl_Rest, {
			entityType: EntityType.TronBlock,
			resolve: {
				[TronBlockSelector.NetworkHeightHash]: async ({ $network, height, hash }) => {
					const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
					return eventTransactions(
						(
						await fetchBlock({
							blockchain: threeXplBlockchain($network),
							block: hash,
						})
						).data.events
						).map((transactionId) => ({
							[EntityMetaKey.Selector]: {
								$network,
								transactionId,
							},
							$block: {
								[EntityMetaKey.Selector]: {
									$network,
									height,
									hash,
								},
							},
							blockHeight: height,
						}))
				}
			},
		})({
				$$transactions: (transactions) => transactions,
			}),

		defineResolver(Source.ThreeXpl_Rest, {
			entityType: EntityType.UtxoBlock,
			resolve: {
				[UtxoBlockSelector.NetworkHeightHash]: async ({ $network, height, hash }) => {
					const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
					return eventTransactions(
						(
						await fetchBlock({
							blockchain: threeXplBlockchain($network),
							block: hash,
						})
						).data.events
						).map((txId) => ({
							[EntityMetaKey.Selector]: {
								$network,
								txId,
							},
						}))
				}
			},
		})({
				$$transactions: (transactions) => transactions,
			}),
	],
}

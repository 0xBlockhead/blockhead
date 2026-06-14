import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { ThreeXplBlockEvent } from '$/sources/ThreeXpl/Rest/types.ts'
import { MoneroBlockSelector } from '$/schema/MoneroBlock.ts'
import { MoneroTransactionSelector } from '$/schema/MoneroTransaction.ts'
import { NearBlockSelector } from '$/schema/NearBlock.ts'
import { NearTransactionSelector } from '$/schema/NearTransaction.ts'
import { PolkadotBlockSelector } from '$/schema/PolkadotBlock.ts'
import { SolanaBlockSelector } from '$/schema/SolanaBlock.ts'
import { SolanaTransactionSelector } from '$/schema/SolanaTransaction.ts'
import { TronBlockSelector } from '$/schema/TronBlock.ts'
import { TronTransactionSelector } from '$/schema/TronTransaction.ts'
import { UtxoBlockSelector } from '$/schema/UtxoBlock.ts'
import { UtxoTransactionSelector } from '$/schema/UtxoTransaction.ts'

const threeXplBlockchain = (
	network: { caip2: { namespace: string; reference: string } } | { slug: string },
) => {
	if ('slug' in network) {
		if (network.slug === 'near') return 'near'
		if (network.slug === 'tron') return 'tron'
	}
	if (!('caip2' in network)) throw new Error('ThreeXpl_Rest: unsupported network')
	if (network.caip2.namespace === 'bip122' && network.caip2.reference === '000000000019d6689c085ae165831e93') return 'bitcoin'
	if (network.caip2.namespace === 'bip122' && network.caip2.reference === '000000000000000000651ef99cb9fcbe') return 'bitcoin-cash'
	if (network.caip2.namespace === 'bip122' && network.caip2.reference === '1a91e3dace36e2be3bf030a65679fe82') return 'dogecoin'
	if (network.caip2.namespace === 'bip122' && network.caip2.reference === '12a765e31ffd4059bada1e25190f6e98') return 'litecoin'
	if (network.caip2.namespace === 'bip122' && network.caip2.reference === '00040fe8ec8471911baa1db1266ea15') return 'zcash'
	if (network.caip2.namespace === 'monero' && network.caip2.reference === '418015bb9ae982a1975da7d79277c270') return 'monero'
	if (network.caip2.namespace === 'polkadot' && network.caip2.reference === '91b171bb158e2d3848fa23a9f1c25182') return 'polkadot'
	if (network.caip2.namespace === 'solana' && network.caip2.reference === '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp') return 'solana'
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
				)),
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
					block: hash,
				})
				return {
					hash: wireBlock.data.block?.hash,
					...(height > 0n && {
						$parent: {
							[EntityMetaKey.Selector]: {
								$network: $network,
								height: height - 1n,
							},
						},
					}),
					...(wireBlock.data.block?.time != null && {
						timestampMs: Date.parse(wireBlock.data.block.time),
					}),
				}
			}
			},
		})({
				fields: {
				hash: (block) => block.hash,
				$parent: (block) => block.$parent,
				timestampMs: (block) => block.timestampMs,
			},
			}),

		defineResolver(Source.ThreeXpl_Rest, {
			entityType: EntityType.MoneroTransaction,
			resolve: {
				[MoneroTransactionSelector.NetworkTxHash]: async ({ $network, txHash }) => {
				const { fetchTransaction } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const wireTransaction = await fetchTransaction({
					blockchain: threeXplBlockchain($network),
					transaction: txHash,
				})
				return {
					...(wireTransaction.data.transaction?.block != null && {
						$block: {
							[EntityMetaKey.Selector]: {
								$network: $network,
								height: BigInt(wireTransaction.data.transaction.block),
							},
						},
					}),
				}
			}
			},
		})({
				fields: {
				$block: (transaction) => transaction.$block,
			},
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
					hash: wireBlock.data.block?.hash,
					...(height > 0n && {
						$parent: {
							[EntityMetaKey.Selector]: {
								$network: $network,
								height: height - 1n,
							},
						},
					}),
					...(wireBlock.data.block?.time != null && {
						timestampMs: Date.parse(wireBlock.data.block.time),
					}),
				}
			}
			},
		})({
				fields: {
				hash: (block) => block.hash,
				$parent: (block) => block.$parent,
				timestampMs: (block) => block.timestampMs,
			},
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
					...(wireBlock.data.block?.hash != null && {
						hash: wireBlock.data.block.hash,
					}),
					...(blockNumber > 0n && {
						$parent: {
							[EntityMetaKey.Selector]: {
								$network: $network,
								blockNumber: blockNumber - 1n,
							},
						},
					}),
				}
			}
			},
		})({
				fields: {
				hash: (block) => block.hash,
				$parent: (block) => block.$parent,
			},
			}),

		defineResolver(Source.ThreeXpl_Rest, {
			entityType: EntityType.SolanaBlock,
			resolve: {
				[SolanaBlockSelector.Slot]: async ({ $network, slot }: {
					$network: { caip2: { namespace: string; reference: string } } | { slug: string }
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
			fields: {
				blockHash: (block) => block.blockHash,
				timestampMs: (block) => block.timestampMs,
				transactionCount: (block) => block.transactionCount,
			},
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
						slot: BigInt(wireTransaction.data.transaction.block),
					}),
				}
			}
			},
		})({
				fields: {
				$block: (transaction) => transaction.$block,
				slot: (transaction) => transaction.slot,
			},
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
					hash: wireBlock.data.block?.hash,
					...(height > 0n && {
						$parent: {
							[EntityMetaKey.Selector]: {
								$network: $network,
								height: height - 1n,
							},
						},
					}),
					...(wireBlock.data.block?.time != null && {
						timestampMs: Date.parse(wireBlock.data.block.time),
					}),
					transactionCount: wireBlock.data.block?.events?.transactions,
				}
			}
			},
		})({
				fields: {
				hash: (block) => block.hash,
				$parent: (block) => block.$parent,
				timestampMs: (block) => block.timestampMs,
				transactionCount: (block) => block.transactionCount,
			},
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
				fields: {
				$block: (transaction) => transaction.$block,
				blockHeight: (transaction) => transaction.blockHeight,
				timestampMs: (transaction) => transaction.timestampMs,
			},
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
					hash: wireBlock.data.block?.hash,
					...(wireBlock.data.block?.time != null && {
						timestampMs: Date.parse(wireBlock.data.block.time),
					}),
					transactionCount: wireBlock.data.block?.events?.transactions,
				}
			}
			},
		})({
				fields: {
				hash: (block) => block.hash,
				timestampMs: (block) => block.timestampMs,
				transactionCount: (block) => block.transactionCount,
			},
			}),

		defineResolver(Source.ThreeXpl_Rest, {
			entityType: EntityType.UtxoTransaction,
			resolve: {
				[UtxoTransactionSelector.NetworkTxId]: async ({ $network, txId }) => {
				const { fetchTransaction } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const wireTransaction = await fetchTransaction({
					blockchain: threeXplBlockchain($network),
					transaction: txId,
				})
				return {
					...(wireTransaction.data.transaction?.block != null && {
						$block: {
							[EntityMetaKey.Selector]: {
								$network: $network,
								height: BigInt(wireTransaction.data.transaction.block),
							},
						},
					}),
				}
			}
			},
		})({
				fields: {
				$block: (transaction) => transaction.$block,
			},
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
							block: hash,
						})
					).data.events,
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
				fields: {
				$$transactions: (transactions) => transactions,
			},
			}),

		defineResolver(Source.ThreeXpl_Rest, {
			entityType: EntityType.SolanaBlock,
			resolve: {
				[SolanaBlockSelector.Slot]: async ({ $network, slot }: {
					$network: { caip2: { namespace: string; reference: string } } | { slug: string }
					slot: bigint
				}) => {
					const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
					return eventTransactions(
						(
							await fetchBlock({
								blockchain: threeXplBlockchain($network),
								block: slot.toString(),
							})
						).data.events,
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
			fields: {
				$$transactions: (transactions) => transactions,
			},
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
					).data.events,
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
				fields: {
				$$transactions: (transactions) => transactions,
			},
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
					).data.events,
				).map((txId) => ({
					[EntityMetaKey.Selector]: {
						$network,
						txId,
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
				fields: {
				$$transactions: (transactions) => transactions,
			},
			}),
	],
}

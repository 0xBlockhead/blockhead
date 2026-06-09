import {
	defineResolver,
} from '$/resolvers/$resolvers.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { ThreeXplBlockEvent } from '$/sources/ThreeXpl/Rest/types.ts'

const threeXplBlockchain = (
	network: { caip2: { namespace: string; reference: string } } | { networkSlug: string },
) => {
	if ('networkSlug' in network) {
		if (network.networkSlug === 'near') return 'near'
		if (network.networkSlug === 'tron') return 'tron'
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
				[EntityIdProjection.Identity]: async (entityId) => {
				const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const wireBlock = await fetchBlock({
					blockchain: threeXplBlockchain(entityId.$network),
					block: entityId.hash ?? entityId.height.toString(),
				})
				return {
					hash: wireBlock.data.block?.hash,
					...(entityId.height > 0n && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: entityId.height - 1n,
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
				[EntityIdProjection.Identity]: async (entityId) => {
				const { fetchTransaction } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const wireTransaction = await fetchTransaction({
					blockchain: threeXplBlockchain(entityId.$network),
					transaction: entityId.txHash,
				})
				return {
					...(wireTransaction.data.transaction?.block != null && {
						$block: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
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
				[EntityIdProjection.Identity]: async (entityId) => {
				const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const wireBlock = await fetchBlock({
					blockchain: threeXplBlockchain(entityId.$network),
					block: entityId.hash ?? entityId.height.toString(),
				})
				return {
					hash: wireBlock.data.block?.hash,
					...(entityId.height > 0n && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: entityId.height - 1n,
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
			entityType: EntityType.NearTransaction,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { fetchTransaction } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				await fetchTransaction({
					blockchain: threeXplBlockchain(entityId.$network),
					transaction: entityId.hash,
				})
				return {}
			}
			},
		})({
				fields: {},
			}),

		defineResolver(Source.ThreeXpl_Rest, {
			entityType: EntityType.PolkadotBlock,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const wireBlock = await fetchBlock({
					blockchain: threeXplBlockchain(entityId.$network),
					block: entityId.hash ?? entityId.blockNumber.toString(),
				})
				return {
					...(wireBlock.data.block?.hash != null && {
						hash: wireBlock.data.block.hash,
					}),
					...(entityId.blockNumber > 0n && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								blockNumber: entityId.blockNumber - 1n,
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
					[EntityIdProjection.Identity]: async (entityId) => {
					if (!('slot' in entityId))
						throw new Error('ThreeXpl_Rest: SolanaBlock blockHash lookup is unsupported')

					const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const wireBlock = await fetchBlock({
					blockchain: threeXplBlockchain(entityId.$network),
					block: entityId.slot.toString(),
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
			}
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
				[EntityIdProjection.Identity]: async (entityId) => {
				const { fetchTransaction } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const wireTransaction = await fetchTransaction({
					blockchain: threeXplBlockchain(entityId.$network),
					transaction: entityId.signature,
				})
				return {
					...(wireTransaction.data.transaction?.block != null && {
						$block: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
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
				[EntityIdProjection.Identity]: async (entityId) => {
				const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const wireBlock = await fetchBlock({
					blockchain: threeXplBlockchain(entityId.$network),
					block: entityId.hash ?? entityId.height.toString(),
				})
				return {
					hash: wireBlock.data.block?.hash,
					...(entityId.height > 0n && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: entityId.height - 1n,
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
				[EntityIdProjection.Identity]: async (entityId) => {
				const { fetchTransaction } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const wireTransaction = await fetchTransaction({
					blockchain: threeXplBlockchain(entityId.$network),
					transaction: entityId.transactionId,
				})
				return {
					...(wireTransaction.data.transaction?.block != null && {
						$block: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
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
				[EntityIdProjection.Identity]: async (entityId) => {
				const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const wireBlock = await fetchBlock({
					blockchain: threeXplBlockchain(entityId.$network),
					block: entityId.hash ?? entityId.height.toString(),
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
				[EntityIdProjection.Identity]: async (entityId) => {
				const { fetchTransaction } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const wireTransaction = await fetchTransaction({
					blockchain: threeXplBlockchain(entityId.$network),
					transaction: entityId.txId,
				})
				return {
					...(wireTransaction.data.transaction?.block != null && {
						$block: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
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
				[EntityIdProjection.Identity]: async (entityId) => {
				const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				return eventTransactions(
					(
						await fetchBlock({
							blockchain: threeXplBlockchain(entityId.$network),
							block: entityId.hash ?? entityId.height.toString(),
						})
					).data.events,
				).map((txHash) => ({
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						txHash,
					},
					$block: {
						[EntityMetaKey.Id]: entityId,
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
					[EntityIdProjection.Identity]: async (entityId) => {
					if (!('slot' in entityId))
						throw new Error('ThreeXpl_Rest: SolanaBlock.$$transactions blockHash lookup is unsupported')

					const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				return eventTransactions(
					(
						await fetchBlock({
							blockchain: threeXplBlockchain(entityId.$network),
							block: entityId.slot.toString(),
						})
					).data.events,
				).map((signature) => ({
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						signature,
					},
					$block: {
						[EntityMetaKey.Id]: entityId,
					},
					slot: entityId.slot,
				}))
			}
				},
		})({
				fields: {
				$$transactions: (transactions) => transactions,
			},
			}),

		defineResolver(Source.ThreeXpl_Rest, {
			entityType: EntityType.TronBlock,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				return eventTransactions(
					(
						await fetchBlock({
							blockchain: threeXplBlockchain(entityId.$network),
							block: entityId.hash ?? entityId.height.toString(),
						})
					).data.events,
				).map((transactionId) => ({
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						transactionId,
					},
					$block: {
						[EntityMetaKey.Id]: entityId,
					},
					blockHeight: entityId.height,
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
				[EntityIdProjection.Identity]: async (entityId) => {
				const { fetchBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				return eventTransactions(
					(
						await fetchBlock({
							blockchain: threeXplBlockchain(entityId.$network),
							block: entityId.hash ?? entityId.height.toString(),
						})
					).data.events,
				).map((txId) => ({
					[EntityMetaKey.Id]: {
						$network: entityId.$network,
						txId,
					},
					$block: {
						[EntityMetaKey.Id]: entityId,
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

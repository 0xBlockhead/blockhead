import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
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

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.MoneroBlock,
			resolve: async (entityId) => {
				const { fetchThreeXplBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const row = await fetchThreeXplBlock({
					blockchain: threeXplBlockchain(entityId.$network),
					block: entityId.hash ?? entityId.height.toString(),
				})
				return {
					hash: row.data.block?.hash,
					...(entityId.height > 0n && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: entityId.height - 1n,
							},
						},
					}),
					...(row.data.block?.time != null && {
						timestampMs: Date.parse(row.data.block.time),
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.MoneroTransaction,
			resolve: async (entityId) => {
				const { fetchThreeXplTransaction } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const row = await fetchThreeXplTransaction({
					blockchain: threeXplBlockchain(entityId.$network),
					transaction: entityId.txHash,
				})
				return {
					...(row.data.transaction?.block != null && {
						$block: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: BigInt(row.data.transaction.block),
							},
						},
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NearBlock,
			resolve: async (entityId) => {
				const { fetchThreeXplBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const row = await fetchThreeXplBlock({
					blockchain: threeXplBlockchain(entityId.$network),
					block: entityId.hash ?? entityId.height.toString(),
				})
				return {
					hash: row.data.block?.hash,
					...(entityId.height > 0n && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: entityId.height - 1n,
							},
						},
					}),
					...(row.data.block?.time != null && {
						timestampMs: Date.parse(row.data.block.time),
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NearTransaction,
			resolve: async (entityId) => {
				const { fetchThreeXplTransaction } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				await fetchThreeXplTransaction({
					blockchain: threeXplBlockchain(entityId.$network),
					transaction: entityId.hash,
				})
				return {}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.PolkadotBlock,
			resolve: async (entityId) => {
				const { fetchThreeXplBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const row = await fetchThreeXplBlock({
					blockchain: threeXplBlockchain(entityId.$network),
					block: entityId.hash ?? entityId.blockNumber.toString(),
				})
				return {
					hash: row.data.block?.hash,
					...(entityId.blockNumber > 0n && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								blockNumber: entityId.blockNumber - 1n,
							},
						},
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.SolanaBlock,
			resolve: async (entityId) => {
				const { fetchThreeXplBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const row = await fetchThreeXplBlock({
					blockchain: threeXplBlockchain(entityId.$network),
					block: entityId.slot.toString(),
				})
				return {
					blockHash: row.data.block?.hash,
					...(row.data.block?.time != null && {
						timestampMs: Date.parse(row.data.block.time),
					}),
					transactionCount: row.data.block?.events?.transactions,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.SolanaTransaction,
			resolve: async (entityId) => {
				const { fetchThreeXplTransaction } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const row = await fetchThreeXplTransaction({
					blockchain: threeXplBlockchain(entityId.$network),
					transaction: entityId.signature,
				})
				return {
					...(row.data.transaction?.block != null && {
						$block: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								slot: BigInt(row.data.transaction.block),
							},
						},
						slot: BigInt(row.data.transaction.block),
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.TronBlock,
			resolve: async (entityId) => {
				const { fetchThreeXplBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const row = await fetchThreeXplBlock({
					blockchain: threeXplBlockchain(entityId.$network),
					block: entityId.hash ?? entityId.height.toString(),
				})
				return {
					hash: row.data.block?.hash,
					...(entityId.height > 0n && {
						$parent: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: entityId.height - 1n,
							},
						},
					}),
					...(row.data.block?.time != null && {
						timestampMs: Date.parse(row.data.block.time),
					}),
					transactionCount: row.data.block?.events?.transactions,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.TronTransaction,
			resolve: async (entityId) => {
				const { fetchThreeXplTransaction } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const row = await fetchThreeXplTransaction({
					blockchain: threeXplBlockchain(entityId.$network),
					transaction: entityId.transactionId,
				})
				return {
					...(row.data.transaction?.block != null && {
						$block: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: BigInt(row.data.transaction.block),
							},
						},
						blockHeight: BigInt(row.data.transaction.block),
					}),
					...(row.data.transaction?.time != null && {
						timestampMs: Date.parse(row.data.transaction.time),
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.UtxoBlock,
			resolve: async (entityId) => {
				const { fetchThreeXplBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const row = await fetchThreeXplBlock({
					blockchain: threeXplBlockchain(entityId.$network),
					block: entityId.hash ?? entityId.height.toString(),
				})
				return {
					hash: row.data.block?.hash,
					...(row.data.block?.time != null && {
						timestampMs: Date.parse(row.data.block.time),
					}),
					transactionCount: row.data.block?.events?.transactions,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.UtxoTransaction,
			resolve: async (entityId) => {
				const { fetchThreeXplTransaction } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				const row = await fetchThreeXplTransaction({
					blockchain: threeXplBlockchain(entityId.$network),
					transaction: entityId.txId,
				})
				return {
					...(row.data.transaction?.block != null && {
						$block: {
							[EntityMetaKey.Id]: {
								$network: entityId.$network,
								height: BigInt(row.data.transaction.block),
							},
						},
					}),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.MoneroBlock,
			fieldName: '$$transactions',
			resolve: async (entityId) => {
				const { fetchThreeXplBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				return eventTransactions(
					(
						await fetchThreeXplBlock({
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SolanaBlock,
			fieldName: '$$transactions',
			resolve: async (entityId) => {
				const { fetchThreeXplBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				return eventTransactions(
					(
						await fetchThreeXplBlock({
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.TronBlock,
			fieldName: '$$transactions',
			resolve: async (entityId) => {
				const { fetchThreeXplBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				return eventTransactions(
					(
						await fetchThreeXplBlock({
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.UtxoBlock,
			fieldName: '$$transactions',
			resolve: async (entityId) => {
				const { fetchThreeXplBlock } = await import('$/sources/ThreeXpl/Rest/queries.ts')
				return eventTransactions(
					(
						await fetchThreeXplBlock({
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
			},
		}),
	],
}

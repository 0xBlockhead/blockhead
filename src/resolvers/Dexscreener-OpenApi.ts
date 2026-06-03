import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EvmAddress } from '$/schema/$ZeroExHex.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.Dexscreener_OpenApi,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.LiquidityPool,
			resolve: async (entityId) => {
				const { apiChainIdByChainId } = await import('$/sources/Dexscreener/OpenApi/constants.ts')
				const { getLatestPairs } = await import('$/sources/Dexscreener/OpenApi/queries.ts')

				const chainId = Number(entityId.$network.caip2.reference)
				const apiChainId = apiChainIdByChainId[chainId]
				if (apiChainId == null) {
					throw new Error(`Dexscreener_OpenApi: unsupported chain ${String(chainId)}`)
				}
				const latestDexPair = (
					(await getLatestPairs({
						chainId: apiChainId,
						pairId: entityId.id,
					})).pairs?.[0]
				)

				if (latestDexPair == null) {
					throw new Error('Dexscreener_OpenApi: liquidity pool / pair not found for id')
				}

				const baseTokenAddress = hexLowerOfByteSize(latestDexPair.baseToken?.address ?? '', 20)
				const quoteTokenAddress = hexLowerOfByteSize(latestDexPair.quoteToken?.address ?? '', 20)
				return {
					...(baseTokenAddress != null && {
						$baseToken: {
							[EntityMetaKey.Id]: {
								$network: {
									caip2: { namespace: 'eip155' as const, reference: String(chainId) },
								},
								address: EvmAddress.assert(baseTokenAddress),
							},
						},
					}),
					...(quoteTokenAddress != null && {
						$quoteToken: {
							[EntityMetaKey.Id]: {
								$network: {
									caip2: { namespace: 'eip155' as const, reference: String(chainId) },
								},
								address: EvmAddress.assert(quoteTokenAddress),
							},
						},
					}),
					...(latestDexPair.baseToken?.symbol != null && { baseTokenSymbol: latestDexPair.baseToken.symbol }),
					...(latestDexPair.quoteToken?.symbol != null && { quoteTokenSymbol: latestDexPair.quoteToken.symbol }),
					...(latestDexPair.volume?.h24 != null && { volumeUSD: latestDexPair.volume.h24 }),
					...(latestDexPair.liquidity?.usd != null && { totalValueLockedUSD: latestDexPair.liquidity.usd }),
					...(latestDexPair.marketCap != null && { marketCapUsd: latestDexPair.marketCap }),
					...(latestDexPair.fdv != null && { fdvUsd: latestDexPair.fdv }),
					...(latestDexPair.pairCreatedAt != null && { pairCreatedAtMs: latestDexPair.pairCreatedAt }),
					...(latestDexPair.labels != null && { dexscreenerLabels: latestDexPair.labels }),
					...(latestDexPair.dexId != null && latestDexPair.dexId !== '' && { dexId: latestDexPair.dexId }),
					...(latestDexPair.url != null && latestDexPair.url !== '' && { dexscreenerPairUrl: latestDexPair.url }),
					...(latestDexPair.priceUsd != null && { baseTokenPriceUsd: latestDexPair.priceUsd }),
					...(latestDexPair.priceNative != null && { baseTokenPriceQuote: latestDexPair.priceNative }),
					...(latestDexPair.priceChange?.h24 != null && { priceChangePercent24h: latestDexPair.priceChange.h24 }),
					...(latestDexPair.txns?.h24.buys != null && { transactionBuys24h: latestDexPair.txns.h24.buys }),
					...(latestDexPair.txns?.h24.sells != null && { transactionSells24h: latestDexPair.txns.h24.sells }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.LiquidityPool_Timestamp,
			resolve: async (entityId) => {
				const { apiChainIdByChainId } = await import('$/sources/Dexscreener/OpenApi/constants.ts')
				const { getLatestPairs } = await import('$/sources/Dexscreener/OpenApi/queries.ts')

				const chainId = Number(entityId.$liquidityPool.$network.caip2.reference)
				const apiChainId = apiChainIdByChainId[chainId]
				if (apiChainId == null) {
					throw new Error(`Dexscreener_OpenApi: unsupported chain ${String(chainId)}`)
				}
				const latestDexPair = (
					(await getLatestPairs({
						chainId: apiChainId,
						pairId: entityId.$liquidityPool.id,
					})).pairs?.[0]
				)

				if (latestDexPair == null) {
					throw new Error('Dexscreener_OpenApi: liquidity pool / pair not found for timestamp id')
				}

				return {
					...(latestDexPair.priceUsd != null && { priceUsd: latestDexPair.priceUsd }),
					...(latestDexPair.priceNative != null && { priceNative: latestDexPair.priceNative }),
					...(latestDexPair.liquidity?.usd != null && { liquidityUsd: latestDexPair.liquidity.usd }),
					...(latestDexPair.volume?.h24 != null && { volumeUsd24h: latestDexPair.volume.h24 }),
					...(latestDexPair.priceChange?.h24 != null && { priceChangePercent24h: latestDexPair.priceChange.h24 }),
					...(latestDexPair.txns?.h24.buys != null && { transactionBuys24h: latestDexPair.txns.h24.buys }),
					...(latestDexPair.txns?.h24.sells != null && { transactionSells24h: latestDexPair.txns.h24.sells }),
					...(latestDexPair.marketCap != null && { marketCapUsd: latestDexPair.marketCap }),
					...(latestDexPair.fdv != null && { fdvUsd: latestDexPair.fdv }),
					transport: 'Dexscreener OpenAPI',
				}
			},
		}),

	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$liquidityPools',
			resolve: async (
				_scopedEntityId: EntityId<typeof schema, EntityType._Global>,
				context?,
			) => {
				const { numericChainIdByDexscreenerApiChainLabel } = await import(
					'$/sources/Dexscreener/OpenApi/constants.ts',
				)
				const { getPairSearch } = await import('$/sources/Dexscreener/OpenApi/queries.ts')
				const liquidityPools = (
					((await getPairSearch({ q: 'WETH USDC uniswap' })).pairs ?? [])
						.flatMap((pair) => {
							const chainId = (
								pair.chainId != null && pair.chainId !== '' ?
									numericChainIdByDexscreenerApiChainLabel[pair.chainId]
								:
									undefined
							)
							const pairId = hexLowerOfByteSize(pair.pairAddress ?? '', 20)

							return (
								chainId == null || pairId == null ?
									[]
								:
									[{
										[EntityMetaKey.Id]: {
											$network: {
												caip2: { namespace: 'eip155' as const, reference: String(chainId) },
											},
											id: pairId,
										},
									}]
							)
						})
						.filter((liquidityPool, index, liquidityPools) => (
							liquidityPools.findIndex((otherLiquidityPool) => (
								otherLiquidityPool[EntityMetaKey.Id].id === liquidityPool[EntityMetaKey.Id].id
								&& otherLiquidityPool[EntityMetaKey.Id].$network.caip2.reference
									=== liquidityPool[EntityMetaKey.Id].$network.caip2.reference
							)) === index
						))
				)

				if (liquidityPools.length === 0)
					throw new Error('Dexscreener_OpenApi: pair search "WETH USDC uniswap" returned no liquidity pools')

				return liquidityPools.slice(0, resolverLoadSubsetRowLimit(context))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.LiquidityPool,
			fieldName: '$$timestamps',
			resolve: async (entityId) => [
				{
					[EntityMetaKey.Id]: {
						$liquidityPool: entityId,
						timestampMs: Date.now(),
						feedKey: 'dexscreener',
					},
				},
			],
		}),

		defineEntityFieldResolver({
			entityType: EntityType.LiquidityPool_Timestamp,
			fieldName: '$parentLiquidityPool',
			resolve: async (entityId) => ({
				[EntityMetaKey.Id]: entityId.$liquidityPool,
			}),
		}),

	],
}

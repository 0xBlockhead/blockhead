import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'
import { LiquidityPoolSelector } from '$/schema/LiquidityPool.ts'
import { LiquidityPool_TimestampSelector } from '$/schema/LiquidityPool_Timestamp.ts'

export default {
	source: Source.Dexscreener_OpenApi,

	resolvers: [
		defineResolver(Source.Dexscreener_OpenApi, {
			entityType: EntityType.LiquidityPool,
			resolve: {
				[LiquidityPoolSelector.EvmNetworkId]: async ({ $network, id }) => {
					const { apiChainIdByChainId } = await import('$/sources/Dexscreener/OpenApi/constants.ts')
					const { getLatestPairs } = await import('$/sources/Dexscreener/OpenApi/queries.ts')

					const chainId = Number($network.caip2.reference)
					const apiChainId = apiChainIdByChainId[chainId]
					if (apiChainId == null)
						throw new Error(`Dexscreener_OpenApi: unsupported chain ${String(chainId)}`)

					const latestDexPair = (
						(await getLatestPairs({
							chainId: apiChainId,
							pairId: id,
						})).pairs?.[0]
					)

					if (latestDexPair == null)
						throw new Error('Dexscreener_OpenApi: liquidity pool / pair not found for id')

					const baseTokenAddress = hexLowerOfByteSize(latestDexPair.baseToken?.address ?? '', 20)
					const quoteTokenAddress = hexLowerOfByteSize(latestDexPair.quoteToken?.address ?? '', 20)
					return {
						...(baseTokenAddress != null && {
							$baseToken: {
								[EntityMetaKey.Selector]: {
									$network: {
										caip2: { namespace: 'eip155' as const, reference: String(chainId) },
									},
									address: EvmAddress.assert(baseTokenAddress),
								},
							},
						}),
						...(quoteTokenAddress != null && {
							$quoteToken: {
								[EntityMetaKey.Selector]: {
									$network: {
										caip2: { namespace: 'eip155' as const, reference: String(chainId) },
									},
									address: EvmAddress.assert(quoteTokenAddress),
								},
							},
						}),
						...(latestDexPair.baseToken?.symbol != null && { baseTokenSymbol: latestDexPair.baseToken.symbol }),
						...(latestDexPair.quoteToken?.symbol != null && { quoteTokenSymbol: latestDexPair.quoteToken.symbol }),
						...(latestDexPair.pairCreatedAt != null && { pairCreatedAtMs: latestDexPair.pairCreatedAt }),
						...(latestDexPair.labels != null && { dexscreenerLabels: latestDexPair.labels }),
						...(latestDexPair.dexId != null && latestDexPair.dexId !== '' && { dexId: latestDexPair.dexId }),
						...(latestDexPair.url != null && latestDexPair.url !== '' && { dexscreenerPairUrl: latestDexPair.url }),
					}
				}
			}
		})({
			fields: {
				$baseToken: (snapshot) => snapshot.$baseToken,
				$quoteToken: (snapshot) => snapshot.$quoteToken,
				baseTokenSymbol: (snapshot) => snapshot.baseTokenSymbol,
				quoteTokenSymbol: (snapshot) => snapshot.quoteTokenSymbol,
				pairCreatedAtMs: (snapshot) => snapshot.pairCreatedAtMs,
				dexscreenerLabels: (snapshot) => snapshot.dexscreenerLabels ?? [],
				dexId: (snapshot) => snapshot.dexId,
				dexscreenerPairUrl: (snapshot) => snapshot.dexscreenerPairUrl,
			},
		}),

		defineResolver(Source.Dexscreener_OpenApi, {
			entityType: EntityType.LiquidityPool_Timestamp,
			resolve: {
				[LiquidityPool_TimestampSelector.LiquidityPoolTimestampMsFeedKey]: async ({ $liquidityPool }) => {
					const { apiChainIdByChainId } = await import('$/sources/Dexscreener/OpenApi/constants.ts')
					const { getLatestPairs } = await import('$/sources/Dexscreener/OpenApi/queries.ts')

					const chainId = Number($liquidityPool.$network.caip2.reference)
					const apiChainId = apiChainIdByChainId[chainId]
					if (apiChainId == null)
						throw new Error(`Dexscreener_OpenApi: unsupported chain ${String(chainId)}`)

					const latestDexPair = (
						(await getLatestPairs({
							chainId: apiChainId,
							pairId: $liquidityPool.id,
						})).pairs?.[0]
					)

					if (latestDexPair == null)
						throw new Error('Dexscreener_OpenApi: liquidity pool / pair not found for timestamp id')

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
				}
			}
		})({
			fields: {
				priceUsd: (snapshot) => snapshot.priceUsd,
				priceNative: (snapshot) => snapshot.priceNative,
				liquidityUsd: (snapshot) => snapshot.liquidityUsd,
				volumeUsd24h: (snapshot) => snapshot.volumeUsd24h,
				priceChangePercent24h: (snapshot) => snapshot.priceChangePercent24h,
				transactionBuys24h: (snapshot) => snapshot.transactionBuys24h,
				transactionSells24h: (snapshot) => snapshot.transactionSells24h,
				marketCapUsd: (snapshot) => snapshot.marketCapUsd,
				fdvUsd: (snapshot) => snapshot.fdvUsd,
				transport: (snapshot) => snapshot.transport,
			},
		}),

		defineResolver(Source.Dexscreener_OpenApi, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_entitySelector, context) => {
					const { numericChainIdByDexscreenerApiChainLabel } = await import(
						'$/sources/Dexscreener/OpenApi/constants.ts'
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
											[EntityMetaKey.Selector]: {
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
									otherLiquidityPool[EntityMetaKey.Selector].id === liquidityPool[EntityMetaKey.Selector].id
									&& otherLiquidityPool[EntityMetaKey.Selector].$network.caip2.reference
										=== liquidityPool[EntityMetaKey.Selector].$network.caip2.reference
								)) === index
							))
					)

					if (liquidityPools.length === 0)
						throw new Error('Dexscreener_OpenApi: pair search "WETH USDC uniswap" returned no liquidity pools')

					return liquidityPools.slice(0, resolverContextRowLimit(context))
				}
			},
		})({
			fields: {
				$$liquidityPools: (snapshot) => snapshot,
			},
		}),

		defineResolver(Source.Dexscreener_OpenApi, {
			entityType: EntityType.LiquidityPool,
			resolve: {
				[LiquidityPoolSelector.EvmNetworkId]: async (entitySelector) => [
					{
						[EntityMetaKey.Selector]: {
							$liquidityPool: entitySelector,
							timestampMs: Date.now(),
							feedKey: 'dexscreener',
						},
					},
				],
			},
		})({
			fields: {
				$$timestamps: (snapshot) => snapshot,
			},
		}),

		defineResolver(Source.Dexscreener_OpenApi, {
			entityType: EntityType.LiquidityPool_Timestamp,
			resolve: {
				[LiquidityPool_TimestampSelector.LiquidityPoolTimestampMsFeedKey]: async ({ $liquidityPool }) => ({
					[EntityMetaKey.Selector]: $liquidityPool,
				}),
			},
		})({
			fields: {
				$parentLiquidityPool: (snapshot) => snapshot,
			},
		}),
	],
}

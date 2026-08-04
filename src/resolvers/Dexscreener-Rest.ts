import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default {
	source: Source.Dexscreener_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.LiquidityPool,
			resolve: {
				EvmNetworkId: {
					resolve: async ({ $network, id }) => {
						const { apiChainIdByChainId } = await import('$/sources/Dexscreener/OpenApi/constants.ts')
						const { getLatestPairs } = await import('$/sources/Dexscreener/OpenApi/queries.ts')

						const chainId = Number($network.caip2.reference)
						const apiChainId = apiChainIdByChainId[chainId]
						if (apiChainId == null)
							throw new Error(`Dexscreener_Rest: unsupported chain ${String(chainId)}`)

						const latestDexPair = (
							await getLatestPairs({
								chainId: apiChainId,
								pairId: id,
							})
						).pairs.at(0)

						if (latestDexPair == null)
							throw new Error('Dexscreener_Rest: liquidity pool / pair not found for id')

						const baseTokenAddress = hexLowerOfByteSize(latestDexPair.baseToken.address, 20)
						const quoteTokenAddress = hexLowerOfByteSize(latestDexPair.quoteToken.address, 20)
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
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$liquidityPool: {
										$network,
										id,
									},
									timestampMs: latestDexPair.resolvedAtMs,
									feedKey: 'dexscreener',
								},
							}],
						}
					},
				}
			}
		})({
				$baseToken: (snapshot) => snapshot.$baseToken,
				$quoteToken: (snapshot) => snapshot.$quoteToken,
				$$timestamps: (snapshot) => snapshot.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.LiquidityPool_Timestamp,
			resolve: {
				LiquidityPoolTimestampMsFeedKey: {
					resolve: async ({ $liquidityPool }) => {
						const { apiChainIdByChainId } = await import('$/sources/Dexscreener/OpenApi/constants.ts')
						const { getLatestPairs } = await import('$/sources/Dexscreener/OpenApi/queries.ts')

						const chainId = Number($liquidityPool.$network.caip2.reference)
						const apiChainId = apiChainIdByChainId[chainId]
						if (apiChainId == null)
							throw new Error(`Dexscreener_Rest: unsupported chain ${String(chainId)}`)

						const latestDexPair = (
							await getLatestPairs({
								chainId: apiChainId,
								pairId: $liquidityPool.id,
							})
						).pairs.at(0)

						if (latestDexPair == null)
							throw new Error('Dexscreener_Rest: liquidity pool / pair not found for timestamp id')

						return {
							baseTokenSymbol: latestDexPair.baseToken.symbol,
							quoteTokenSymbol: latestDexPair.quoteToken.symbol,
							...(latestDexPair.pairCreatedAt != null && { pairCreatedAtMs: latestDexPair.pairCreatedAt }),
							dexscreenerLabels: latestDexPair.labels,
							dexId: latestDexPair.dexId,
							...(latestDexPair.url != null && latestDexPair.url !== '' && { dexscreenerPairUrl: latestDexPair.url }),
							...(latestDexPair.priceUsd != null && { priceUsd: latestDexPair.priceUsd }),
							...(latestDexPair.priceNative != null && { priceNative: latestDexPair.priceNative }),
							...(latestDexPair.liquidity?.usd != null && { liquidityUsd: latestDexPair.liquidity.usd }),
							...(latestDexPair.volume.h24 != null && { volumeUsd24h: latestDexPair.volume.h24 }),
							...(latestDexPair.priceChange.h24 != null && { priceChangePercent24h: latestDexPair.priceChange.h24 }),
							...(latestDexPair.txns.h24?.buys != null && { transactionBuys24h: latestDexPair.txns.h24.buys }),
							...(latestDexPair.txns.h24?.sells != null && { transactionSells24h: latestDexPair.txns.h24.sells }),
							...(latestDexPair.marketCap != null && { marketCapUsd: latestDexPair.marketCap }),
							...(latestDexPair.fdv != null && { fdvUsd: latestDexPair.fdv }),
							transport: 'Dexscreener OpenAPI',
						}
					},
				}
			}
		})({
				baseTokenSymbol: (snapshot) => snapshot.baseTokenSymbol,
				quoteTokenSymbol: (snapshot) => snapshot.quoteTokenSymbol,
				pairCreatedAtMs: (snapshot) => snapshot.pairCreatedAtMs,
				dexscreenerLabels: (snapshot) => snapshot.dexscreenerLabels,
				dexId: (snapshot) => snapshot.dexId,
				dexscreenerPairUrl: (snapshot) => snapshot.dexscreenerPairUrl,
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
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { numericChainIdByDexscreenerApiChainLabel } = await import(
							'$/sources/Dexscreener/OpenApi/constants.ts'
						)
						const { getPairSearch } = await import('$/sources/Dexscreener/OpenApi/queries.ts')
						const liquidityPools = (
							(await getPairSearch({
								q: 'WETH USDC uniswap',
							})).pairs
								.flatMap((pair) => {
									const chainId = numericChainIdByDexscreenerApiChainLabel.get(pair.chainId)
									const pairId = hexLowerOfByteSize(pair.pairAddress, 20)

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
							throw new Error('Dexscreener_Rest: pair search "WETH USDC uniswap" returned no liquidity pools')

						return liquidityPools.slice(0, resolverContextRowLimit(context))
					},
				}
			},
		})({
				$$liquidityPools: (snapshot) => snapshot,
			}),

		defineResolver({
			entityType: EntityType.LiquidityPool_Timestamp,
			resolve: {
				LiquidityPoolTimestampMsFeedKey: {
					resolve: async ({ $liquidityPool }) => ({
						[EntityMetaKey.Selector]: $liquidityPool,
					}),
				},
			},
		})({
				$parentLiquidityPool: (snapshot) => snapshot,
			}),
	],
} satisfies RegisteredSourceResolverModule

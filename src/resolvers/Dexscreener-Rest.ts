import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
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
						if (baseTokenAddress == null || quoteTokenAddress == null)
							throw new Error('Dexscreener_Rest: pair token addresses are not valid EVM addresses')

						return {
							$baseToken: {
								[EntityMetaKey.Selector]: {
									$network: {
										caip2: { namespace: 'eip155' as const, reference: String(chainId) },
									},
									address: EvmAddress.assert(baseTokenAddress),
								},
							},
							$quoteToken: {
								[EntityMetaKey.Selector]: {
									$network: {
										caip2: { namespace: 'eip155' as const, reference: String(chainId) },
									},
									address: EvmAddress.assert(quoteTokenAddress),
								},
							},
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$liquidityPool: {
										$network,
										id,
									},
									timestampMs: latestDexPair.resolvedAtMs,
									feedKey: 'dexscreener',
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'baseTokenSymbol')]: latestDexPair.baseToken.symbol,
									[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'quoteTokenSymbol')]: latestDexPair.quoteToken.symbol,
									...(latestDexPair.pairCreatedAt != null && {
										[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'pairCreatedAtMs')]: latestDexPair.pairCreatedAt,
									}),
									[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'dexscreenerLabels')]: latestDexPair.labels,
									[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'dexId')]: latestDexPair.dexId,
									...(latestDexPair.url != null && latestDexPair.url !== '' && {
										[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'dexscreenerPairUrl')]: latestDexPair.url,
									}),
									...(latestDexPair.priceUsd != null && {
										[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'priceUsd')]: latestDexPair.priceUsd,
									}),
									...(latestDexPair.priceNative != null && {
										[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'priceNative')]: latestDexPair.priceNative,
									}),
									...(latestDexPair.liquidity?.usd != null && {
										[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'liquidityUsd')]: latestDexPair.liquidity.usd,
									}),
									[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'volumeUsd24h')]: latestDexPair.volume.h24,
									[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'priceChangePercent24h')]: latestDexPair.priceChange.h24,
									[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'transactionBuys24h')]: latestDexPair.txns.h24.buys,
									[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'transactionSells24h')]: latestDexPair.txns.h24.sells,
									...(latestDexPair.marketCap != null && {
										[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'marketCapUsd')]: latestDexPair.marketCap,
									}),
									...(latestDexPair.fdv != null && {
										[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'fdvUsd')]: latestDexPair.fdv,
									}),
									[entityFieldAddressKey(EntityType.LiquidityPool_Timestamp, [], 'transport')]: 'Dexscreener OpenAPI',
								},
							}],
						}
					},
				}
			}
		})({
				$baseToken: (snapshot) => snapshot.$baseToken,
				$quoteToken: (snapshot) => snapshot.$quoteToken,
				$$timestamps: {
					select: (snapshot) => snapshot.$$timestamps,
				},
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

						return {
							liquidityPools: liquidityPools.slice(0, resolverContextRowLimit(context)),
							liquidityPoolCount: liquidityPools.length,
						}
					},
				}
			},
		})({
				$$liquidityPools: {
					select: (snapshot) => snapshot.liquidityPools,
					resolveCount: (snapshot) => snapshot.liquidityPoolCount,
				},
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

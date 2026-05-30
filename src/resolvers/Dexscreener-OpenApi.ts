import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	type ResolverLoadSubset,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EvmAddress } from '$/schema/$ZeroExHex.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import type { DexscreenerPair } from '$/sources/Dexscreener/OpenApi/types.ts'
import { Source } from '$/sources/$Source.ts'

const isEvmContractAddress = (value: string | null | undefined): value is `0x${string}` => (
	hexLowerOfByteSize(value ?? '', 20) != null
)

const entityFieldsFromDexPair = ({
	chainId,
	latestDexPair,
}: {
	chainId: number
	latestDexPair: DexscreenerPair
}) => (
	{
		...(isEvmContractAddress(latestDexPair.baseToken?.address) && {
				$baseToken: {
					[EntityMetaKey.Id]: {
							$network: {
								caip2: { namespace: 'eip155' as const, reference: String(chainId) },
							},
							address: EvmAddress.assert(
								hexLowerOfByteSize(latestDexPair.baseToken.address.trim(), 20)
								?? latestDexPair.baseToken.address.trim()
							),
					},
				},
			}),
		...(isEvmContractAddress(latestDexPair.quoteToken?.address) && {
				$quoteToken: {
					[EntityMetaKey.Id]: {
							$network: {
								caip2: { namespace: 'eip155' as const, reference: String(chainId) },
							},
							address: EvmAddress.assert(
								hexLowerOfByteSize(latestDexPair.quoteToken.address.trim(), 20)
								?? latestDexPair.quoteToken.address.trim()
							),
					},
				},
			}),
		...(latestDexPair.baseToken?.symbol != null && { baseTokenSymbol: latestDexPair.baseToken.symbol }),
		...(latestDexPair.quoteToken?.symbol != null && { quoteTokenSymbol: latestDexPair.quoteToken.symbol }),
		...(latestDexPair.volume?.h24 != null && { volumeUSD: latestDexPair.volume.h24 }),
		...(latestDexPair.liquidity?.usd != null && { totalValueLockedUSD: latestDexPair.liquidity.usd }),
		...(latestDexPair.dexId != null && latestDexPair.dexId !== '' && { dexId: latestDexPair.dexId }),
		...(latestDexPair.url != null && latestDexPair.url !== '' && { dexscreenerPairUrl: latestDexPair.url }),
		...(latestDexPair.priceUsd != null && { baseTokenPriceUsd: latestDexPair.priceUsd }),
		...(latestDexPair.priceNative != null && { baseTokenPriceQuote: latestDexPair.priceNative }),
		...(latestDexPair.priceChange?.h24 != null && { priceChangePercent24h: latestDexPair.priceChange.h24 }),
		...(latestDexPair.txns?.h24?.buys != null && { transactionBuys24h: latestDexPair.txns.h24.buys }),
		...(latestDexPair.txns?.h24?.sells != null && { transactionSells24h: latestDexPair.txns.h24.sells }),
	}
)

const timestampEntityFieldsFromDexPair = ({
	latestDexPair,
}: {
	latestDexPair: DexscreenerPair
}) => (
	{
		...(latestDexPair.priceUsd != null && { priceUsd: latestDexPair.priceUsd }),
		...(latestDexPair.priceNative != null && { priceNative: latestDexPair.priceNative }),
		...(latestDexPair.liquidity?.usd != null && { liquidityUsd: latestDexPair.liquidity.usd }),
		...(latestDexPair.volume?.h24 != null && { volumeUsd24h: latestDexPair.volume.h24 }),
		...(latestDexPair.priceChange?.h24 != null && { priceChangePercent24h: latestDexPair.priceChange.h24 }),
		...(latestDexPair.txns?.h24?.buys != null && { transactionBuys24h: latestDexPair.txns.h24.buys }),
		...(latestDexPair.txns?.h24?.sells != null && { transactionSells24h: latestDexPair.txns.h24.sells }),
		...(latestDexPair.marketCap != null && { marketCapUsd: latestDexPair.marketCap }),
		...(latestDexPair.fdv != null && { fdvUsd: latestDexPair.fdv }),
		transport: 'Dexscreener OpenAPI',
	}
)

const globalPairSearchEntityRows = async ({
	context,
	q,
}: {
	context?: ResolverLoadSubset
	q: string
}) => {
	const { getDexscreenerPairSearch } = await import('$/sources/Dexscreener/OpenApi/queries.ts')
	const { numericChainIdByDexscreenerApiChainLabel } = await import(
		'$/sources/Dexscreener/OpenApi/constants.ts',
	)

		const rows: {
			[EntityMetaKey.Id]: {
				$network: { caip2: { namespace: 'eip155', reference: string } }
				id: string
			}
		}[] = []

	const { pairs } = await getDexscreenerPairSearch({ q })

	for (const pair of pairs ?? []) {
		const chainKey = pair.chainId?.trim()
		const chainIdNum = (
			chainKey != null && chainKey !== '' ?
				numericChainIdByDexscreenerApiChainLabel[chainKey]
			:
				undefined
		)
		if (chainIdNum == null || pair.pairAddress == null) continue

		const pairIdCandidate = hexLowerOfByteSize(pair.pairAddress.trim(), 20)
			?? pair.pairAddress.trim()

		if (!isEvmContractAddress(pairIdCandidate)) continue

			const already = rows.some((row) => (
				row[EntityMetaKey.Id].id === pairIdCandidate
				&& row[EntityMetaKey.Id].$network.caip2.reference === String(chainIdNum)
			))
		if (already) continue

		rows.push({
			[EntityMetaKey.Id]: {
					$network: {
						caip2: { namespace: 'eip155' as const, reference: String(chainIdNum) },
					},
					id: pairIdCandidate,
			},
		})
	}

	const lim = resolverLoadSubsetRowLimit(context)

	const sliced = rows.slice(0, lim)
	if (sliced.length === 0) {
		throw new Error(`Dexscreener_OpenApi: pair search ${JSON.stringify(q)} returned no liquidity pools`)
	}
	return sliced
}

export default {
	source: Source.Dexscreener_OpenApi,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.LiquidityPool,
			resolve: async (entityId) => {
				const { apiChainIdByChainId } = await import('$/sources/Dexscreener/OpenApi/constants.ts')
				const { getDexscreenerLatestPairs } = await import('$/sources/Dexscreener/OpenApi/queries.ts')

					const chainId = Number(entityId.$network.caip2.reference)
				const apiChainId = apiChainIdByChainId[chainId]
				if (apiChainId == null) {
					throw new Error(`Dexscreener_OpenApi: unsupported chain ${String(chainId)}`)
				}
				const latestDexPair = (
					(await getDexscreenerLatestPairs({
						chainId: apiChainId,
						pairId: entityId.id,
					})).pairs?.[0]
				)

				if (latestDexPair == null) {
					throw new Error('Dexscreener_OpenApi: liquidity pool / pair not found for id')
				}

				return entityFieldsFromDexPair({
					chainId,
					latestDexPair,
				})
			},
		}),

		defineEntityResolver({
			entityType: EntityType.LiquidityPool_Timestamp,
			resolve: async (entityId) => {
				const { apiChainIdByChainId } = await import('$/sources/Dexscreener/OpenApi/constants.ts')
				const { getDexscreenerLatestPairs } = await import('$/sources/Dexscreener/OpenApi/queries.ts')

				const chainId = Number(entityId.$liquidityPool.$network.caip2.reference)
				const apiChainId = apiChainIdByChainId[chainId]
				if (apiChainId == null) {
					throw new Error(`Dexscreener_OpenApi: unsupported chain ${String(chainId)}`)
				}
				const latestDexPair = (
					(await getDexscreenerLatestPairs({
						chainId: apiChainId,
						pairId: entityId.$liquidityPool.id,
					})).pairs?.[0]
				)

				if (latestDexPair == null) {
					throw new Error('Dexscreener_OpenApi: liquidity pool / pair not found for timestamp id')
				}

				return timestampEntityFieldsFromDexPair({ latestDexPair })
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
			) => (
				globalPairSearchEntityRows({
					context,
					q: 'WETH USDC uniswap',
				})
			),
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
			fieldName: '$$parentLiquidityPool',
			resolve: async (entityId) => ({
				[EntityMetaKey.Id]: entityId.$liquidityPool,
			}),
		}),

	],
}

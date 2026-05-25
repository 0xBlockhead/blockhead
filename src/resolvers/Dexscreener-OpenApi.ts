import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	type ResolverLoadSubset,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
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
				$token0: {
					[EntityMetaKey.Id]: {
						$network: {
							chainId,
						},
						address: (
							hexLowerOfByteSize(latestDexPair.baseToken.address.trim(), 20)
							?? latestDexPair.baseToken.address.trim()
						),
					},
				},
			}),
		...(isEvmContractAddress(latestDexPair.quoteToken?.address) && {
				$token1: {
					[EntityMetaKey.Id]: {
						$network: {
							chainId,
						},
						address: (
							hexLowerOfByteSize(latestDexPair.quoteToken.address.trim(), 20)
							?? latestDexPair.quoteToken.address.trim()
						),
					},
				},
			}),
		...(latestDexPair.baseToken?.symbol != null && { token0Symbol: latestDexPair.baseToken.symbol }),
		...(latestDexPair.quoteToken?.symbol != null && { token1Symbol: latestDexPair.quoteToken.symbol }),
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
			$network: { chainId: number }
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
			&& row[EntityMetaKey.Id].$network.chainId === chainIdNum
		))
		if (already) continue

		rows.push({
			[EntityMetaKey.Id]: {
				$network: {
					chainId: chainIdNum,
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

				const chainId = entityId.$network.chainId
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
			entityType: EntityType.Vault,
			resolve: async (entityId) => {
				const { apiChainIdByChainId } = await import('$/sources/Dexscreener/OpenApi/constants.ts')
				const { getDexscreenerLatestPairs } = await import('$/sources/Dexscreener/OpenApi/queries.ts')

				const chainId = entityId.$network.chainId
				const apiChainId = apiChainIdByChainId[chainId]
				if (apiChainId == null) {
					throw new Error(`Dexscreener_OpenApi: unsupported chain ${String(chainId)}`)
				}
				const pairId = hexLowerOfByteSize(entityId.id.trim(), 20)
				if (pairId == null || !isEvmContractAddress(pairId)) {
					throw new Error('Dexscreener_OpenApi: vault / pair not found for id')
				}
				const latestDexPair = (
					(await getDexscreenerLatestPairs({
						chainId: apiChainId,
						pairId,
					})).pairs?.[0]
				)

				if (
					latestDexPair == null
					|| !isEvmContractAddress(latestDexPair.baseToken?.address)
					|| !isEvmContractAddress(latestDexPair.quoteToken?.address)
				) {
					throw new Error('Dexscreener_OpenApi: vault / pair not found for id')
				}

				return {
					...entityFieldsFromDexPair({
						chainId,
						latestDexPair,
					}),
					...(latestDexPair.marketCap != null && { marketCapUsd: latestDexPair.marketCap }),
					...(latestDexPair.fdv != null && { fdvUsd: latestDexPair.fdv }),
					...(latestDexPair.pairCreatedAt != null && { pairCreatedAtMs: latestDexPair.pairCreatedAt }),
					...(latestDexPair.labels != null && latestDexPair.labels.length > 0 && {
						dexscreenerLabels: latestDexPair.labels,
					}),
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
			) => (
				globalPairSearchEntityRows({
					context,
					q: 'WETH/USDC',
				})
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$vaults',
			resolve: async (
				_scopedEntityId: EntityId<typeof schema, EntityType._Global>,
				context?,
			) => (
				globalPairSearchEntityRows({
					context,
					q: 'ETH/USDT',
				})
			),
		}),
	],
}

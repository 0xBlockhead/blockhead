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
	typeof value === 'string'
	&& /^0x[a-fA-F0-9]{40}$/.test(value.trim())
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

	return rows.slice(0, lim)
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
				const latestDexPair = (
					apiChainId == null ?
						undefined
					:	(await getDexscreenerLatestPairs({
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
				const latestDexPair = (
					apiChainId == null ?
						undefined
					:	(await getDexscreenerLatestPairs({
							chainId: apiChainId,
							pairId: entityId.id,
						})).pairs?.[0]
				)

				if (
					apiChainId == null
					|| latestDexPair == null
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
					fee: 3000,
					tickSpacing: 60,
					sqrtPriceX96: 0n,
					liquidity: 0n,
					tick: 0,
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

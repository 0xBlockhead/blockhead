import { defineEntityResolver } from '$/resolvers/$defineEntityResolvers.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { dexscreenerChainIdByChainId } from '$/sources/Dexscreener/OpenApi/constants.ts'
import { getDexscreenerLatestPairs } from '$/sources/Dexscreener/OpenApi/queries.ts'
import { Source } from '$/sources/$Sources.ts'

const getDexscreenerPair = async ({
	chainId,
	pairId,
}: {
	chainId: number
	pairId: string
}) => {
	const dexscreenerChainId = dexscreenerChainIdByChainId[chainId]
	if (dexscreenerChainId == null) return undefined

	return (
		(await getDexscreenerLatestPairs({
			chainId: dexscreenerChainId,
			pairId,
		})).pairs?.[0]
	)
}

export default {
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.LiquidityPool,
			source: Source.Dexscreener,
			resolve: async (entityId) => {
				const pair = await getDexscreenerPair({
					chainId: entityId.$network.chainId,
					pairId: entityId.id,
				})

				return {
					...(pair?.baseToken?.symbol != null ? { token0Symbol: pair.baseToken.symbol } : {}),
					...(pair?.quoteToken?.symbol != null ? { token1Symbol: pair.quoteToken.symbol } : {}),
					...(pair?.volume?.h24 != null ? { volumeUSD: pair.volume.h24 } : {}),
					...(pair?.liquidity?.usd != null ? { totalValueLockedUSD: pair.liquidity.usd } : {}),
				}
			},
		}),
	],
	entityFieldResolvers: [],
}

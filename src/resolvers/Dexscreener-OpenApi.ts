import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { defineEntityResolver } from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

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

				const isEvmContractAddress = (value: string | null | undefined): value is `0x${string}` => (
					typeof value === 'string'
					&& /^0x[a-fA-F0-9]{40}$/.test(value.trim())
				)

				return {
					...(isEvmContractAddress(latestDexPair?.baseToken?.address) ?
						{
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
						}
					:
						{}),
					...(isEvmContractAddress(latestDexPair?.quoteToken?.address) ?
						{
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
						}
					:
						{}),
					...(latestDexPair?.baseToken?.symbol != null ? { token0Symbol: latestDexPair.baseToken.symbol } : {}),
					...(latestDexPair?.quoteToken?.symbol != null ? { token1Symbol: latestDexPair.quoteToken.symbol } : {}),
					...(latestDexPair?.volume?.h24 != null ? { volumeUSD: latestDexPair.volume.h24 } : {}),
					...(latestDexPair?.liquidity?.usd != null ? { totalValueLockedUSD: latestDexPair.liquidity.usd } : {}),
				}
			},
		}),
	],

	entityFieldResolvers: [],
}

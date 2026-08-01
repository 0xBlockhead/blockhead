import type { components, paths } from '$/sources/Dexscreener/OpenApi/openapi.d.ts'

export type DexscreenerPair = components['schemas']['Pair']

export type DexscreenerPairsResponse = (
	paths['/latest/dex/pairs/{chainId}/{pairId}']['get']['responses'][200]['content']['application/json']
)

export type DexscreenerTokenPairsResponse = (
	paths['/token-pairs/v1/{chainId}/{tokenAddress}']['get']['responses'][200]['content']['application/json']
)

export type DexscreenerSearchResponse = (
	paths['/latest/dex/search']['get']['responses'][200]['content']['application/json']
)

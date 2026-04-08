import { dexscreenerApiBaseUrl } from '$/sources/Dexscreener/OpenApi/constants.ts'
import type { components, paths } from '$/sources/Dexscreener/OpenApi/openapi.d.ts'

export type DexscreenerPair = components['schemas']['Pair']

export type DexscreenerPairsResponse = (
	paths['/latest/dex/pairs/{chainId}/{pairId}']['get']['responses'][200]['content']['application/json']
)

export type DexscreenerTokenPairsResponse = (
	paths['/token-pairs/v1/{chainId}/{tokenAddress}']['get']['responses'][200]['content']['application/json']
)

export const getDexscreenerJson = async <_Response>(
	pathAndQuery: string,
): Promise<_Response> => {
	const response = await fetch(`${dexscreenerApiBaseUrl}${pathAndQuery}`, {
		headers: {
			Accept: 'application/json',
		},
	})

	if (!response.ok) {
		throw new Error(`Dexscreener API error: ${response.status} ${response.statusText}`)
	}

	return response.json() as Promise<_Response>
}

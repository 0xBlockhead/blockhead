/**
 * Dexscreener pair lookup endpoints.
 * @see https://docs.dexscreener.com/api/reference
 */

import type { paths } from '$/sources/Dexscreener/OpenApi/openapi.d.ts'

import {
	getDexscreenerJson,
	type DexscreenerPairsResponse,
	type DexscreenerTokenPairsResponse,
} from '$/sources/Dexscreener/OpenApi/client.ts'

export type DexscreenerSearchResponse = (
	paths['/latest/dex/search']['get']['responses'][200]['content']['application/json']
)

export const getDexscreenerLatestPairs = async ({
	chainId,
	pairId,
}: {
	chainId: string
	pairId: string
}) => (
	await getDexscreenerJson<DexscreenerPairsResponse>(
		`/latest/dex/pairs/${chainId}/${pairId}`,
	)
)

export const getDexscreenerTokenPairs = async ({
	chainId,
	tokenAddress,
}: {
	chainId: string
	tokenAddress: string
}) => (
	await getDexscreenerJson<DexscreenerTokenPairsResponse>(
		`/token-pairs/v1/${chainId}/${tokenAddress}`,
	)
)

export const getDexscreenerPairSearch = async ({
	q,
}: {
	q: string
}) => (
	await getDexscreenerJson<DexscreenerSearchResponse>(
		`/latest/dex/search?q=${encodeURIComponent(q)}`,
	)
)

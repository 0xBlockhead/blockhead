/**
 * Dexscreener pair lookup endpoints.
 * @see https://docs.dexscreener.com/api/reference
 */

import { getDexscreenerJson } from '$/sources/Dexscreener/OpenApi/client.ts'
import type {
	DexscreenerPairsResponse,
	DexscreenerSearchResponse,
	DexscreenerTokenPairsResponse,
} from '$/sources/Dexscreener/OpenApi/types.ts'

export const getLatestPairs = async ({
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

export const getTokenPairs = async ({
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

export const getPairSearch = async ({
	q,
}: {
	q: string
}) => (
	await getDexscreenerJson<DexscreenerSearchResponse>(
		`/latest/dex/search?q=${encodeURIComponent(q)}`,
	)
)

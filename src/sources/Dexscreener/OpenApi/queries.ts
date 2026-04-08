/**
 * Dexscreener pair lookup endpoints.
 * @see https://docs.dexscreener.com/api/reference
 */

import {
	getDexscreenerJson,
	type DexscreenerPairsResponse,
	type DexscreenerTokenPairsResponse,
} from '$/sources/Dexscreener/OpenApi/client.ts'

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

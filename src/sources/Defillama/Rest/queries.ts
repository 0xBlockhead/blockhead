/**
 * DeFiLlama Coins REST — public `coins.llama.fi` and Pro `pro-api.llama.fi/<key>/…`.
 * @see https://docs.llama.fi/coin-prices-api
 * @see https://docs.llama.fi/pro-api
 */

import { proApiBaseUrl } from '$/sources/Defillama/Rest/constants.ts'
import { getCurrentPrices as getCurrentPricesOpenApi } from '$/sources/Defillama/OpenApi/queries.ts'
import type { DefiLlamaCurrentPricesResponse } from '$/sources/Defillama/Rest/types.ts'

export type DefillamaSearchWidth = '4h' | '24h'

export type GetDefillamaCurrentPricesOptions = {
	searchWidth?: DefillamaSearchWidth
}

/**
 * `GET /prices/current/{coins}` on `https://coins.llama.fi` — unauthenticated.
 */
export const getCurrentPrices = async (
	coins: string[],
	options?: GetDefillamaCurrentPricesOptions,
): Promise<DefiLlamaCurrentPricesResponse> => (
	getCurrentPricesOpenApi(
		coins,
		options,
	)
)

export type GetProDefillamaCurrentPricesArgs = {
	apiKey: string
	coins: string[]
	searchWidth?: DefillamaSearchWidth
}

/**
 * `GET /coins/prices/current/{coins}` on Pro — key is first path segment after host.
 */
export const getProCurrentPrices = async ({
	apiKey,
	coins,
	searchWidth: searchWidth_,
}: GetProDefillamaCurrentPricesArgs): Promise<DefiLlamaCurrentPricesResponse> => {
	if (coins.length === 0) return { coins: {} }
	const url = new URL(
		`${proApiBaseUrl}/${encodeURIComponent(apiKey)}/coins/prices/current/${coins.join(',')}`,
	)
	if (searchWidth_ != null) url.searchParams.set('searchWidth', searchWidth_)
	const res = await fetch(url)
	if (!res.ok) throw new Error(`DefiLlama Pro API error: ${res.status}`)
	return (await res.json()) as DefiLlamaCurrentPricesResponse
}

/**
 * DeFiLlama Coins REST — public `coins.llama.fi` and Pro `pro-api.llama.fi/<key>/…`.
 * @see https://docs.llama.fi/coin-prices-api
 * @see https://docs.llama.fi/pro-api
 */

import { corsFetch, throwIfHttpNotOk } from '$/lib/http.ts'
import type { GetDefillamaCurrentPricesOptions } from '$/sources/Defillama/OpenApi/types.ts'
import { getCurrentPrices as getCurrentPricesOpenApi } from '$/sources/Defillama/OpenApi/queries.ts'
import Defillama from '$/sources/Defillama/index.ts'
import { proBaseUrl } from '$/sources/Defillama/Rest/constants.ts'
import type {
	DefiLlamaCurrentPricesResponse,
	GetProDefillamaCurrentPricesArgs,
} from '$/sources/Defillama/Rest/types.ts'

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

/**
 * `GET /coins/prices/current/{coins}` on Pro — key is first path segment after host.
 */
export const getProCurrentPrices = async ({
	apiKey,
	coins,
	searchWidth: searchWidthOption,
}: GetProDefillamaCurrentPricesArgs): Promise<DefiLlamaCurrentPricesResponse> => {
	if (coins.length === 0) return { coins: {} }
	const url = new URL(
		`${proBaseUrl}/${encodeURIComponent(apiKey)}/coins/prices/current/${coins.join(',')}`,
	)
	if (searchWidthOption != null) url.searchParams.set('searchWidth', searchWidthOption)
	const res = await corsFetch(url.href, { origins: Defillama.origins ?? [] })
	await throwIfHttpNotOk(res, url.href)
	return res.json<DefiLlamaCurrentPricesResponse>()
}

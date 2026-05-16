/**
 * DefiLlama OpenAPI-backed price queries sourced from the official schema.
 * `Rest/queries.ts` remains the compatibility surface for resolvers and any existing callers.
 * @see https://api-docs.defillama.com/
 * @see https://docs.llama.fi/coin-prices-api
 */

import { getCurrentPricesJson } from '$/sources/Defillama/OpenApi/client.ts'
import type {
	DefiLlamaCurrentPricesResponse,
	DefiLlamaPriceData,
} from '$/sources/Defillama/Rest/types.ts'

export type DefillamaSearchWidth = '4h' | '24h'

export type GetDefillamaCurrentPricesOptions = {
	searchWidth?: DefillamaSearchWidth
}

const normalizeCurrentPriceData = (
	value: {
		decimals?: number
		price?: number
		symbol?: string
		timestamp?: number
		confidence?: number
	} | undefined,
): DefiLlamaPriceData | undefined => (
	value?.decimals != null
	&& value.price != null
	&& value.symbol != null
	&& value.timestamp != null ?
		{
			decimals: value.decimals,
			price: value.price,
			symbol: value.symbol,
			timestamp: value.timestamp,
			...(value.confidence != null && { confidence: value.confidence }),
		}
	:	undefined
)

/**
 * `GET /prices/current/{coins}` — current prices for `{chain}:{address}` or `coingecko:{id}` ids.
 * @see https://docs.llama.fi/coin-prices-api
 */
export const getCurrentPrices = async (
	coins: string[],
	options?: GetDefillamaCurrentPricesOptions,
): Promise<DefiLlamaCurrentPricesResponse> => {
	if (coins.length === 0) return { coins: {} }

	const response = await getCurrentPricesJson({
		coins,
		searchWidth: options?.searchWidth,
	})

	return {
		coins: Object.fromEntries(
			Object.entries(response.coins ?? {})
				.flatMap(([coin, value]) => {
					const normalized = normalizeCurrentPriceData(value)
					return normalized == null ? [] : [[coin, normalized] as const]
				}),
		),
	}
}

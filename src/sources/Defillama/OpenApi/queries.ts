/**
 * DefiLlama OpenAPI-backed price queries sourced from the official schema.
 * `Rest/queries.ts` remains the compatibility surface for resolvers and any existing callers.
 * @see https://api-docs.defillama.com/
 * @see https://docs.llama.fi/coin-prices-api
 */

import { getChartJson, getCurrentPricesJson } from '$/sources/Defillama/OpenApi/client.ts'
import type {
	DefillamaChartPricePoint,
	DefillamaOpenApiCurrentPrice,
	GetDefillamaCurrentPricesOptions,
} from '$/sources/Defillama/OpenApi/types.ts'
import type {
	DefiLlamaCurrentPricesResponse,
	DefiLlamaPriceData,
} from '$/sources/Defillama/Rest/types.ts'

/** Match `coins` map key to the id we requested (`coingecko:ethereum`, etc.). */
export const defillamaCoinEntryFromResponse = <_Bucket>(
	coins: Record<string, _Bucket> | undefined,
	requestedCoinId: string,
): _Bucket | undefined => {
	const map = coins ?? {}
	if (map[requestedCoinId] != null) return map[requestedCoinId]
	return (
		Object.entries(map)
			.find(([key]) => (
				key === requestedCoinId
				|| decodeURIComponent(key) === requestedCoinId
			))
			?.[1]
	)
}

const normalizeCurrentPriceData = (
	value: DefillamaOpenApiCurrentPrice | undefined,
): DefiLlamaPriceData | undefined => (
	value?.price != null
	&& value.timestamp != null ?
		{
			decimals: value.decimals ?? 8,
			price: value.price,
			symbol: value.symbol ?? '',
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
			coins.flatMap((requestedCoinId) => {
				const wire = defillamaCoinEntryFromResponse(response.coins, requestedCoinId)
				const normalized = normalizeCurrentPriceData(wire)
				return normalized == null ? [] : [[requestedCoinId, normalized] as const]
			}),
		),
	}
}

/**
 * Maps DefiLlama chart closes to CoinGecko `/coins/{id}/ohlc` tuples
 * `[timestampMs, open, high, low, close]` so `MarketPriceRangeView` can parse one shape.
 * Opens link prior close; high/low are min/max of that step (line-to-synthetic-OHLC).
 */
export const defillamaChartPricesToCoingeckoOhlcRows = (
	prices: DefillamaChartPricePoint[],
): number[][] => (
	prices.flatMap((point, i) => (
		point.price == null || point.timestamp == null ?
			[]
		:	(() => {
				const tRaw = point.timestamp
				const tMs = tRaw < 1e12 ? tRaw * 1000 : tRaw
				const close = point.price
				const prev = i === 0 ? undefined : prices[i - 1]
				const open = (
					i === 0 || prev?.price == null ?
						close
					:
						prev.price
				)
				const high = Math.max(open, close)
				const low = Math.min(open, close)
				return [[tMs, open, high, low, close]]
			})()
	))
)

/**
 * Daily chart points for `days` buckets (`period=1D`, `span=days`).
 */
export const getDefillamaChartOhlcRowsCoingeckoShape = async ({
	llamaCoinId,
	days,
	searchWidth,
}: {
	llamaCoinId: string
	days: number
	searchWidth?: string
}): Promise<number[][]> => {
	const response = await getChartJson({
		coins: [llamaCoinId],
		period: '1D',
		span: days,
		searchWidth,
	})
	const prices = (
		defillamaCoinEntryFromResponse(response.coins, llamaCoinId)?.prices ?? []
	)
	return defillamaChartPricesToCoingeckoOhlcRows(prices)
}

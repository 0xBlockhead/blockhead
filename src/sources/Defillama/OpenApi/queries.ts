/**
 * DefiLlama OpenAPI-backed price queries sourced from the official schema.
 * `Rest/queries.ts` remains the compatibility surface for resolvers and any existing callers.
 * @see https://api-docs.defillama.com/
 * @see https://docs.llama.fi/coin-prices-api
 */

import { iconsOrigin } from '$/sources/Defillama/Rest/constants.ts'
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
export const getCoinEntryFromResponse = <_Bucket>(
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
	:
		undefined
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
				const wire = getCoinEntryFromResponse(response.coins, requestedCoinId)
				const normalized = normalizeCurrentPriceData(wire)
				return normalized == null ? [] : [[requestedCoinId, normalized] as const]
			}),
		),
	}
}

/**
 * Maps DefiLlama chart closes to CoinGecko `/coins/{id}/ohlc` tuples
 * `[timestampMs, open, high, low, close]` — Coingecko-shaped OHLC rows for candle entities.
 * Opens link prior close; high/low are min/max of that step (line-to-synthetic-OHLC).
 */
/**
 * Daily chart points for `days` buckets (`period=1D`, `span=days`).
 */
export const getChartOhlcRows = async ({
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
		getCoinEntryFromResponse(response.coins, llamaCoinId)?.prices ?? []
	)
	return (
		prices.flatMap((point, i) => (
			point.price == null || point.timestamp == null ?
				[]
			:
				(() => {
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
}

/** `https://icons.llama.fi/{slug}.png` — chain icon CDN. Slug is the DeFiLlama chain name lowercased. */
export const getChainIconUrl = (slug: string): string => (
	`${iconsOrigin}/${encodeURIComponent(slug)}.png`
)

/**
 * DeFiLlama chain slug keyed by EVM chain id.
 * Slugs match the lowercase `name` field from `/v2/chains`, which also routes `icons.llama.fi`.
 */
export const getChainSlugByChainId: Partial<Record<number, string>> = {
	1: 'ethereum',
	10: 'optimism',
	56: 'bsc',
	100: 'xdai',
	137: 'polygon',
	250: 'fantom',
	8453: 'base',
	42161: 'arbitrum',
	43114: 'avax',
	59144: 'linea',
	534352: 'scroll',
	1101: 'polygon_zkevm',
	324: 'era',
	5000: 'mantle',
	81457: 'blast',
	34443: 'mode',
	1868: 'soneium',
	480: 'worldchain',
	7777777: 'zora',
	57073: 'ink',
	1135: 'lisk',
	60808: 'bob',
}

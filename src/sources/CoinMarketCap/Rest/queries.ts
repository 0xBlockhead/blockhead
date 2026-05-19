/**
 * CoinMarketCap latest quotes and metadata endpoints.
 * @see https://coinmarketcap.com/api/documentation/
 */

import { coinMarketCapFetch } from '$/sources/CoinMarketCap/Rest/client.ts'
import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import type {
	CoinMarketCapInfoLatestResponse,
	CoinMarketCapOhlcvHistoricalResponse,
	CoinMarketCapOhlcvQuote,
	CoinMarketCapQuotesLatestResponse,
} from '$/sources/CoinMarketCap/Rest/types.ts'

/**
 * CoinGecko `/coins/{id}/ohlc`-style rows `[timestampMs, open, high, low, close]`.
 */
export const coinMarketCapOhlcvQuotesToCoingeckoOhlcRows = (
	quotes: CoinMarketCapOhlcvQuote[],
): number[][] => (
	quotes.flatMap((row) => {
		const usd = row.quote?.USD
		const timeOpen = row.time_open
		if (
			usd?.open == null
			|| usd.high == null
			|| usd.low == null
			|| usd.close == null
			|| timeOpen == null
		) {
			return []
		}
		const timestampMs = Date.parse(timeOpen)
		if (!Number.isFinite(timestampMs)) return []
		return [[timestampMs, usd.open, usd.high, usd.low, usd.close]]
	})
)

/**
 * `GET /v3/cryptocurrency/quotes/latest`
 */
export const getCoinMarketCapQuotesLatest = async ({
	publicEnv,
	id,
}: {
	publicEnv: SourcePublicEnvFor<Source.CoinMarketCap_Rest>
	id: number
}) => (
	await coinMarketCapFetch<CoinMarketCapQuotesLatestResponse>(
		publicEnv,
		`/v3/cryptocurrency/quotes/latest?id=${id}&convert=USD`,
	)
)

/**
 * `GET /v2/cryptocurrency/info`
 */
export const getCoinMarketCapInfo = async ({
	publicEnv,
	id,
}: {
	publicEnv: SourcePublicEnvFor<Source.CoinMarketCap_Rest>
	id: number
}) => (
	await coinMarketCapFetch<CoinMarketCapInfoLatestResponse>(
		publicEnv,
		`/v2/cryptocurrency/info?id=${id}&aux=platform`,
	)
)

/**
 * `GET /v2/cryptocurrency/ohlcv/historical` — daily OHLCV candles.
 * @see https://coinmarketcap.com/api/documentation/v1/#operation/getV2CryptocurrencyOhlcvHistorical
 */
export const getCoinMarketCapOhlcvHistoricalCoingeckoShape = async ({
	publicEnv,
	id,
	days,
}: {
	publicEnv: SourcePublicEnvFor<Source.CoinMarketCap_Rest>
	id: number
	days: number
}): Promise<number[][]> => {
	const response = await coinMarketCapFetch<CoinMarketCapOhlcvHistoricalResponse>(
		publicEnv,
		`/v2/cryptocurrency/ohlcv/historical?id=${id}&time_period=daily&count=${days}&convert=USD`,
	)
	const coin = (
		response.data == null ?
			undefined
		:	Object.values(response.data)[0]
	)
	return coinMarketCapOhlcvQuotesToCoingeckoOhlcRows(coin?.quotes ?? [])
}

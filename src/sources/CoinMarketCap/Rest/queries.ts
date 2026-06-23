/**
	* CoinMarketCap latest quotes and metadata endpoints.
	* @see https://coinmarketcap.com/api/documentation/
	*/

import { coinMarketCapFetch } from '$/sources/CoinMarketCap/Rest/client.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import type {
	CoinMarketCapInfoLatestResponse,
	CoinMarketCapOhlcvHistoricalResponse,
	CoinMarketCapQuotesLatestResponse,
} from '$/sources/CoinMarketCap/Rest/types.ts'

type OhlcCandle = readonly [
	timestampMs: number,
	open: number,
	high: number,
	low: number,
	close: number,
	quoteVolume?: number,
]

/**
	* `GET /v3/cryptocurrency/quotes/latest`
	*/
export const getQuotesLatest = async ({
	publicEnv,
	id,
}: {
	publicEnv: SourcePublicEnv
	id: number
}) => (
	await coinMarketCapFetch<CoinMarketCapQuotesLatestResponse>(
		publicEnv,
		`/v3/cryptocurrency/quotes/latest?id=${id}&convert=USD`
	)
)

/**
	* `GET /v2/cryptocurrency/info`
	*/
export const getInfo = async ({
	publicEnv,
	id,
}: {
	publicEnv: SourcePublicEnv
	id: number
}) => (
	await coinMarketCapFetch<CoinMarketCapInfoLatestResponse>(
		publicEnv,
		`/v2/cryptocurrency/info?id=${id}&aux=platform`
	)
)

/**
	* `GET /v2/cryptocurrency/ohlcv/historical` — daily OHLCV candles.
	* @see https://coinmarketcap.com/api/documentation/v1/#operation/getV2CryptocurrencyOhlcvHistorical
	*/
export const getOhlcvHistoricalRows = async ({
	publicEnv,
	id,
	lookbackDayCount,
}: {
	publicEnv: SourcePublicEnv
	id: number
	lookbackDayCount: number
}): Promise<OhlcCandle[]> => {
	const response = await coinMarketCapFetch<CoinMarketCapOhlcvHistoricalResponse>(
		publicEnv,
		`/v2/cryptocurrency/ohlcv/historical?id=${id}&time_period=daily&count=${lookbackDayCount}&convert=USD`
	)
	const coin = (
		response.data == null ?
			undefined
		:
			Object.values(response.data)[0]
	)
	return (
		(coin?.quotes ?? []).flatMap((row) => {
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
			return [[
				timestampMs,
				usd.open,
				usd.high,
				usd.low,
				usd.close,
				usd.volume,
			]]
		})
	)
}

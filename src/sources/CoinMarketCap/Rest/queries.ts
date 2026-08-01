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

/**
	* `GET /v3/cryptocurrency/quotes/latest`
	*/
export const getQuotesLatest = ({
	publicEnv,
	id,
}: {
	publicEnv: SourcePublicEnv
	id: number
}) => (
	coinMarketCapFetch<CoinMarketCapQuotesLatestResponse>(
		publicEnv,
		`/v3/cryptocurrency/quotes/latest?id=${id}&convert=USD`
	)
)

/**
	* `GET /v2/cryptocurrency/info`
	*/
export const getInfo = ({
	publicEnv,
	id,
}: {
	publicEnv: SourcePublicEnv
	id: number
}) => (
	coinMarketCapFetch<CoinMarketCapInfoLatestResponse>(
		publicEnv,
		`/v2/cryptocurrency/info?id=${id}&aux=platform`
	)
)

/**
	* `GET /v2/cryptocurrency/ohlcv/historical` — daily OHLCV candles.
	* @see https://coinmarketcap.com/api/documentation/v1/#operation/getV2CryptocurrencyOhlcvHistorical
	*/
export const getOhlcvHistorical = ({
	publicEnv,
	id,
	count,
}: {
	publicEnv: SourcePublicEnv
	id: number
	count: number
}) => (
	coinMarketCapFetch<CoinMarketCapOhlcvHistoricalResponse>(
		publicEnv,
		`/v2/cryptocurrency/ohlcv/historical?id=${id}&time_period=daily&count=${count}&convert=USD`
	)
)

/**
 * Coinpaprika coins and ticker endpoints.
 * @see https://docs.coinpaprika.com/api-reference/coins/get-coin-by-id
 * @see https://docs.coinpaprika.com/api-reference/tickers/get-ticker-for-a-specific-coin
 */
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { getCoinpaprikaJson } from '$/sources/Coinpaprika/OpenApi/client.ts'
import type {
	CoinpaprikaCoin,
	CoinpaprikaCoinMarkets,
	CoinpaprikaCoinPath,
	CoinpaprikaCurrencies,
	CoinpaprikaExchangeMarkets,
	CoinpaprikaExchangeMarketsPath,
	CoinpaprikaOhlcvHistoricalQuery,
	CoinpaprikaOhlcvHistoricalRows,
	CoinpaprikaOhlcvTodayRows,
	CoinpaprikaTicker,
	CoinpaprikaTickers,
} from '$/sources/Coinpaprika/OpenApi/types.ts'

export const getCoinById = ({
	publicEnv,
	coinpaprikaId,
}: {
	publicEnv: SourcePublicEnv
	coinpaprikaId: CoinpaprikaCoinPath['coin_id']
}) => (
	getCoinpaprikaJson<CoinpaprikaCoin>(
		publicEnv,
		`/coins/${encodeURIComponent(coinpaprikaId)}`
	)
)

export const getCoins = ({
	publicEnv,
}: {
	publicEnv: SourcePublicEnv
}) => (
	getCoinpaprikaJson<CoinpaprikaCurrencies>(
		publicEnv,
		'/coins'
	)
)

/**
 * `GET /coins/{coin_id}/markets`
 * @see https://docs.coinpaprika.com/api-reference/coins/get-markets-for-a-coin
 */
export const getCoinMarkets = ({
	publicEnv,
	coinpaprikaId,
}: {
	publicEnv: SourcePublicEnv
	coinpaprikaId: CoinpaprikaCoinPath['coin_id']
}) => (
	getCoinpaprikaJson<CoinpaprikaCoinMarkets>(
		publicEnv,
		`/coins/${encodeURIComponent(coinpaprikaId)}/markets?quotes=USD`
	)
)


/**
 * `GET /exchanges/{exchange_id}/markets`
 * @see https://docs.coinpaprika.com/api-reference/exchanges/get-markets-by-exchange-id
 */
export const getExchangeMarkets = ({
	publicEnv,
	exchangeId,
}: {
	publicEnv: SourcePublicEnv
	exchangeId: CoinpaprikaExchangeMarketsPath['exchange_id']
}) => (
	getCoinpaprikaJson<CoinpaprikaExchangeMarkets>(
		publicEnv,
		`/exchanges/${encodeURIComponent(exchangeId)}/markets?quotes=USD`
	)
)


export const getTickerById = ({
	publicEnv,
	coinpaprikaId,
}: {
	publicEnv: SourcePublicEnv
	coinpaprikaId: CoinpaprikaCoinPath['coin_id']
}) => (
	getCoinpaprikaJson<CoinpaprikaTicker>(
		publicEnv,
		`/tickers/${encodeURIComponent(coinpaprikaId)}`
	)
)

export const getTickers = ({
	publicEnv,
}: {
	publicEnv: SourcePublicEnv
}) => (
	getCoinpaprikaJson<CoinpaprikaTickers>(
		publicEnv,
		'/tickers?quotes=USD'
	)
)

/**
 * `GET /coins/{coin_id}/ohlcv/today`
 * @see https://docs.coinpaprika.com/api-reference/coins/get-today-ohlc
 */
export const getOhlcvToday = ({
	publicEnv,
	coinpaprikaId,
}: {
	publicEnv: SourcePublicEnv
	coinpaprikaId: CoinpaprikaCoinPath['coin_id']
}) => (
	getCoinpaprikaJson<CoinpaprikaOhlcvTodayRows>(
		publicEnv,
		`/coins/${encodeURIComponent(coinpaprikaId)}/ohlcv/today`
	)
)

/**
 * `GET /coins/{coin_id}/ohlcv/historical` — `interval=24h`; free plan: last 24 hours.
 * @see https://docs.coinpaprika.com/api-reference/coins/get-historical-ohlc
 */
export const getOhlcvHistorical = ({
	publicEnv,
	coinpaprikaId,
	start,
	end,
	limit,
}: {
	publicEnv: SourcePublicEnv
	coinpaprikaId: CoinpaprikaCoinPath['coin_id']
	start: CoinpaprikaOhlcvHistoricalQuery['start']
	end?: CoinpaprikaOhlcvHistoricalQuery['end']
	limit?: CoinpaprikaOhlcvHistoricalQuery['limit']
}) => (
	getCoinpaprikaJson<CoinpaprikaOhlcvHistoricalRows>(
		publicEnv,
		`/coins/${encodeURIComponent(coinpaprikaId)}/ohlcv/historical?${new URLSearchParams({
			start,
			...(end != null && { end }),
			...(limit != null && { limit: String(limit) }),
			interval: '24h',
			quote: 'usd',
		})}`
	)
)

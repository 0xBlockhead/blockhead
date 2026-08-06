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
	CoinpaprikaExchangeMarkets,
	CoinpaprikaExchangeMarketsPath,
	CoinpaprikaOhlcvHistoricalQuery,
	CoinpaprikaOhlcvHistoricalRows,
	CoinpaprikaOhlcvTodayRows,
	CoinpaprikaTicker,
	CoinpaprikaTickers,
} from '$/sources/Coinpaprika/OpenApi/types.ts'
import {
	coinpaprikaCoinEnvelope,
	coinpaprikaMarketsEnvelope,
	coinpaprikaOhlcvRowsEnvelope,
	coinpaprikaTickerEnvelope,
	coinpaprikaTickersEnvelope,
} from '$/sources/Coinpaprika/OpenApi/types.ts'

const assertEnvelope = <_Value>(
	envelope: {
		assert: (value: unknown) => unknown
	},
	value: unknown,
	label: string
) => {
	try {
		envelope.assert(value)
	} catch {
		throw new Error(`Coinpaprika_Rest: invalid ${label} response envelope`)
	}
	return value as _Value
}

export const getCoinById = async ({
	publicEnv,
	coinpaprikaId,
}: {
	publicEnv: SourcePublicEnv
	coinpaprikaId: CoinpaprikaCoinPath['coin_id']
}) => (
	assertEnvelope<CoinpaprikaCoin>(
		coinpaprikaCoinEnvelope,
		await getCoinpaprikaJson<CoinpaprikaCoin>(
			publicEnv,
			`/coins/${encodeURIComponent(coinpaprikaId)}`
		),
		'coin'
	)
)

/**
 * `GET /coins/{coin_id}/markets`
 * @see https://docs.coinpaprika.com/api-reference/coins/get-markets-for-a-coin
 */
export const getCoinMarkets = async ({
	publicEnv,
	coinpaprikaId,
}: {
	publicEnv: SourcePublicEnv
	coinpaprikaId: CoinpaprikaCoinPath['coin_id']
}) => (
	assertEnvelope<CoinpaprikaCoinMarkets>(
		coinpaprikaMarketsEnvelope,
		await getCoinpaprikaJson<CoinpaprikaCoinMarkets>(
			publicEnv,
			`/coins/${encodeURIComponent(coinpaprikaId)}/markets?quotes=USD`
		),
		'coin markets'
	)
)


/**
 * `GET /exchanges/{exchange_id}/markets`
 * @see https://docs.coinpaprika.com/api-reference/exchanges/get-markets-by-exchange-id
 */
export const getExchangeMarkets = async ({
	publicEnv,
	exchangeId,
}: {
	publicEnv: SourcePublicEnv
	exchangeId: CoinpaprikaExchangeMarketsPath['exchange_id']
}) => (
	assertEnvelope<CoinpaprikaExchangeMarkets>(
		coinpaprikaMarketsEnvelope,
		await getCoinpaprikaJson<CoinpaprikaExchangeMarkets>(
			publicEnv,
			`/exchanges/${encodeURIComponent(exchangeId)}/markets?quotes=USD`
		),
		'exchange markets'
	)
)


export const getTickerById = async ({
	publicEnv,
	coinpaprikaId,
}: {
	publicEnv: SourcePublicEnv
	coinpaprikaId: CoinpaprikaCoinPath['coin_id']
}) => (
	assertEnvelope<CoinpaprikaTicker>(
		coinpaprikaTickerEnvelope,
		await getCoinpaprikaJson<CoinpaprikaTicker>(
			publicEnv,
			`/tickers/${encodeURIComponent(coinpaprikaId)}`
		),
		'ticker'
	)
)

export const getTickers = async ({
	publicEnv,
}: {
	publicEnv: SourcePublicEnv
}) => (
	assertEnvelope<CoinpaprikaTickers>(
		coinpaprikaTickersEnvelope,
		await getCoinpaprikaJson<CoinpaprikaTickers>(
			publicEnv,
			'/tickers?quotes=USD'
		),
		'tickers'
	)
)

/**
 * `GET /coins/{coin_id}/ohlcv/today`
 * @see https://docs.coinpaprika.com/api-reference/coins/get-today-ohlc
 */
export const getOhlcvToday = async ({
	publicEnv,
	coinpaprikaId,
}: {
	publicEnv: SourcePublicEnv
	coinpaprikaId: CoinpaprikaCoinPath['coin_id']
}) => (
	assertEnvelope<CoinpaprikaOhlcvTodayRows>(
		coinpaprikaOhlcvRowsEnvelope,
		await getCoinpaprikaJson<CoinpaprikaOhlcvTodayRows>(
			publicEnv,
			`/coins/${encodeURIComponent(coinpaprikaId)}/ohlcv/today`
		),
		'ohlcv today'
	)
)

/**
 * `GET /coins/{coin_id}/ohlcv/historical` — `interval=24h`; free plan: last 24 hours.
 * @see https://docs.coinpaprika.com/api-reference/coins/get-historical-ohlc
 */
export const getOhlcvHistorical = async ({
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
	assertEnvelope<CoinpaprikaOhlcvHistoricalRows>(
		coinpaprikaOhlcvRowsEnvelope,
		await getCoinpaprikaJson<CoinpaprikaOhlcvHistoricalRows>(
			publicEnv,
			`/coins/${encodeURIComponent(coinpaprikaId)}/ohlcv/historical?${new URLSearchParams({
				start,
				...(end != null && { end }),
				...(limit != null && { limit: String(limit) }),
				interval: '24h',
				quote: 'usd',
			})}`
		),
		'ohlcv historical'
	)
)

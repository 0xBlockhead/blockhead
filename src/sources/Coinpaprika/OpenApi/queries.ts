/**
 * Coinpaprika coins and ticker endpoints.
 * @see https://docs.coinpaprika.com/api-reference/coins/get-coin-by-id.md
 * @see https://docs.coinpaprika.com/api-reference/tickers/get-ticker-for-a-specific-coin.md
 */

import { coingeckoOhlcDayWindowLengths } from '$/constants/Market.ts'
import { optionalPublicEnvString } from '$/lib/sources.ts'
import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { getCoinpaprikaJson } from '$/sources/Coinpaprika/OpenApi/client.ts'
import type {
	CoinpaprikaCoin,
	CoinpaprikaOhlcvRow,
	CoinpaprikaTicker,
} from '$/sources/Coinpaprika/OpenApi/types.ts'

/**
 * OHLC range windows registered for Coinpaprika: multi-day historical needs pro API key
 * (`Authorization` on api-pro); free plan only supports today / 24h historical per OpenAPI plan table.
 */
export const coinpaprikaOhlcDayWindowValues = (
	publicEnv: SourcePublicEnvFor<Source.Coinpaprika_OpenApi>,
) => (
	optionalPublicEnvString(publicEnv, 'PUBLIC_COINPAPRIKA_API_KEY') != null ?
		[...coingeckoOhlcDayWindowLengths]
	:
		[1]
)

export const getCoinpaprikaCoinById = async ({
	publicEnv,
	coinpaprikaId,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coinpaprika_OpenApi>
	coinpaprikaId: string
}) => (
	await getCoinpaprikaJson<CoinpaprikaCoin>(
		publicEnv,
		`/coins/${coinpaprikaId}`,
	)
)

export const getCoinpaprikaTickerById = async ({
	publicEnv,
	coinpaprikaId,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coinpaprika_OpenApi>
	coinpaprikaId: string
}) => (
	await getCoinpaprikaJson<CoinpaprikaTicker>(
		publicEnv,
		`/tickers/${coinpaprikaId}`,
	)
)

/**
 * CoinGecko `/coins/{id}/ohlc`-style rows `[timestampMs, open, high, low, close]`.
 */
export const coinpaprikaOhlcvRowsToCoingeckoOhlcRows = (
	rows: CoinpaprikaOhlcvRow[],
): number[][] => (
	rows.flatMap((row) => (
		row.time_open == null
		|| row.open == null
		|| row.high == null
		|| row.low == null
		|| row.close == null ?
			[]
		:	[[Date.parse(row.time_open), row.open, row.high, row.low, row.close]]
	))
)

/**
 * `GET /coins/{coin_id}/ohlcv/today`
 * @see https://docs.coinpaprika.com/api-reference/coins/get-today-ohlc.md
 */
export const getCoinpaprikaOhlcvTodayCoingeckoShape = async ({
	publicEnv,
	coinpaprikaId,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coinpaprika_OpenApi>
	coinpaprikaId: string
}): Promise<number[][]> => {
	const rows = await getCoinpaprikaJson<CoinpaprikaOhlcvRow[]>(
		publicEnv,
		`/coins/${coinpaprikaId}/ohlcv/today`,
	)
	return coinpaprikaOhlcvRowsToCoingeckoOhlcRows(rows ?? [])
}

/**
 * `GET /coins/{coin_id}/ohlcv/historical` — `interval=24h`; free plan: last 24 hours.
 * @see https://docs.coinpaprika.com/api-reference/coins/get-historical-ohlc.md
 */
export const getCoinpaprikaOhlcvHistoricalCoingeckoShape = async ({
	publicEnv,
	coinpaprikaId,
	days,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coinpaprika_OpenApi>
	coinpaprikaId: string
	days: number
}): Promise<number[][]> => {
	const end = new Date()
	const start = new Date(end)
	start.setUTCDate(start.getUTCDate() - days)
	const startDate = start.toISOString().slice(0, 10)
	const endDate = end.toISOString().slice(0, 10)
	const rows = await getCoinpaprikaJson<CoinpaprikaOhlcvRow[]>(
		publicEnv,
		`/coins/${coinpaprikaId}/ohlcv/historical?start=${startDate}&end=${endDate}&limit=${days}&interval=24h&quote=usd`,
	)
	return coinpaprikaOhlcvRowsToCoingeckoOhlcRows(rows ?? [])
}

/**
 * CoinGecko Demo API (OpenAPI: `coingecko-demo.json`).
 * @see https://docs.coingecko.com/reference/coins-id-ohlc
 * @see https://docs.coingecko.com/reference/coins-id
 */

import { throwHttpError } from '$/lib/http.ts'
import { coingeckoOhlcDayWindowLengths } from '$/constants/Market.ts'
import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { coingeckoOpenApiFetch } from '$/sources/Coingecko/OpenApi/client.ts'
import type {
	CoingeckoOpenApiCoinById,
	CoingeckoOpenApiCoinsOhlc,
} from '$/sources/Coingecko/OpenApi/types.ts'

const coingeckoOpenApiOhlcDaysByWindow = {
	1: '1',
	7: '7',
	14: '14',
	30: '30',
	90: '90',
	180: '180',
	365: '365',
} as const satisfies Record<
	(typeof coingeckoOhlcDayWindowLengths)[number] | 180 | 365,
	'1' | '7' | '14' | '30' | '90' | '180' | '365'
>

const coingeckoOpenApiCoinMarketSpotQuery = (
	'localization=false'
	+ '&tickers=false'
	+ '&market_data=true'
	+ '&community_data=false'
	+ '&developer_data=false'
	+ '&sparkline=false'
)

export const getCoingeckoOpenApiCoinById = async ({
	publicEnv,
	coingeckoId,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coingecko_OpenApi>
	coingeckoId: string
}): Promise<CoingeckoOpenApiCoinById | undefined> => {
	if (coingeckoId.trim() === '') return undefined

	const response = await coingeckoOpenApiFetch(
		publicEnv,
		`/coins/${encodeURIComponent(coingeckoId)}?${coingeckoOpenApiCoinMarketSpotQuery}`,
	)

	if (response.status === 404) return undefined
	if (!response.ok) await throwHttpError(`CoinGecko OpenApi /coins/${coingeckoId}`, response)

	return response.json<CoingeckoOpenApiCoinById>()
}

export const getCoingeckoOpenApiCoinMarketSpot = async ({
	publicEnv,
	coingeckoId,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coingecko_OpenApi>
	coingeckoId: string
}): Promise<{
	coin: CoingeckoOpenApiCoinById
	usd: number
	lastUpdatedAtSec: number
} | undefined> => {
	const coin = await getCoingeckoOpenApiCoinById({
		publicEnv,
		coingeckoId,
	})
	if (coin == null) return undefined

	const usd = coin.market_data?.current_price?.usd
	if (typeof usd !== 'number' || !Number.isFinite(usd)) return undefined

	const lastUpdatedAtSec = Date.parse(String(coin.market_data?.last_updated ?? '')) / 1000
	if (!Number.isFinite(lastUpdatedAtSec)) return undefined

	return {
		coin,
		usd,
		lastUpdatedAtSec,
	}
}

export const getCoingeckoOpenApiCoinOhlc = async ({
	publicEnv,
	coingeckoId,
	vsCurrency,
	days,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coingecko_OpenApi>
	coingeckoId: string
	vsCurrency: string
	days: number
}): Promise<CoingeckoOpenApiCoinsOhlc> => {
	if (coingeckoId.trim() === '') return []

	const daysParam = coingeckoOpenApiOhlcDaysByWindow[
		days as keyof typeof coingeckoOpenApiOhlcDaysByWindow
	]
	if (daysParam == null) return []

	const searchParams = new URLSearchParams()
	searchParams.set('vs_currency', vsCurrency)
	searchParams.set('days', daysParam)

	const response = await coingeckoOpenApiFetch(
		publicEnv,
		`/coins/${encodeURIComponent(coingeckoId)}/ohlc?${searchParams.toString()}`,
	)

	if (response.status === 404) return []
	if (!response.ok) await throwHttpError(`CoinGecko OpenApi /coins/${coingeckoId}/ohlc`, response)

	return response.json<CoingeckoOpenApiCoinsOhlc>()
}

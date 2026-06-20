/**
	* CoinGecko Demo API (OpenAPI: `coingecko-demo.json`).
	* @see https://docs.coingecko.com/reference/coins-id-ohlc
	* @see https://docs.coingecko.com/reference/coins-id
	*/

import { stringify } from 'devalue'

import { throwHttpError } from '$/lib/http.ts'
import type { CoinId } from '$/constants/Coin.ts'
import { MarketAssetKind, marketOhlcDayLookbackValues } from '$/constants/Market.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type { MarketVenueId } from '$/constants/MarketVenue.ts'
import { Source } from '$/sources/Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import {
	catalogCoinIdByCoingeckoId,
	marketEntitySelectorFromCoingeckoDerivativesExchangeTicker,
	marketEntitySelectorFromCoingeckoSpotTicker,
} from '$/sources/Coingecko/marketKind.ts'
import { coingeckoOpenApiFetch } from '$/sources/Coingecko/OpenApi/client.ts'
import {
	coingeckoDerivativesExchangeIdByMarketVenueId,
} from '$/sources/Coingecko/Rest/constants.ts'
import type {
	CoingeckoDerivativesExchangeById,
	CoingeckoDerivativesTickersListItem,
	CoingeckoOpenApiCoinById,
	CoingeckoOpenApiCoinsOhlc,
	CoingeckoOpenApiCoinTicker,
} from '$/sources/Coingecko/OpenApi/types.ts'

type OhlcCandle = readonly [
	timestampMs: number,
	open: number,
	high: number,
	low: number,
	close: number,
]

const coingeckoOpenApiOhlcDaysByWindow = {
	1: '1',
	7: '7',
	14: '14',
	30: '30',
	90: '90',
	180: '180',
	365: '365',
} as const satisfies Record<
	(typeof marketOhlcDayLookbackValues)[number] | 180 | 365,
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

export const getCoinById = async ({
	publicEnv,
	coingeckoId,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coingecko_OpenApi>
	coingeckoId: string
}): Promise<CoingeckoOpenApiCoinById | undefined> => {
	if (coingeckoId === '') return undefined

	const response = await coingeckoOpenApiFetch(
		publicEnv,
		`/coins/${encodeURIComponent(coingeckoId)}?${coingeckoOpenApiCoinMarketSpotQuery}`
	)

	if (response.status === 404) return undefined
	if (!response.ok) await throwHttpError(`CoinGecko OpenApi /coins/${coingeckoId}`, response)

	return response.json<CoingeckoOpenApiCoinById>()
}

export const getCoinMarketSpot = async ({
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
	const coin = await getCoinById({
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

export const getCoinOhlc = async ({
	publicEnv,
	coingeckoId,
	vsCurrency,
	lookbackDayCount,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coingecko_OpenApi>
	coingeckoId: string
	vsCurrency: string
	lookbackDayCount: number
}): Promise<OhlcCandle[]> => {
	if (coingeckoId === '') return []

	const daysParam = Object.entries(coingeckoOpenApiOhlcDaysByWindow)
		.find(([windowDays]) => Number(windowDays) === lookbackDayCount)?.[1]
	if (daysParam == null) return []

	const searchParams = new URLSearchParams()
	searchParams.set('vs_currency', vsCurrency)
	searchParams.set('days', daysParam)

	const response = await coingeckoOpenApiFetch(
		publicEnv,
		`/coins/${encodeURIComponent(coingeckoId)}/ohlc?${searchParams.toString()}`
	)

	if (response.status === 404) return []
	if (!response.ok) await throwHttpError(`CoinGecko OpenApi /coins/${coingeckoId}/ohlc`, response)

	return (
		(await response.json<CoingeckoOpenApiCoinsOhlc>())
			.map(([timestampMs, open, high, low, close]): OhlcCandle => (
				[
					timestampMs,
					open,
					high,
					low,
					close,
				]
			))
	)
}


/** `GET /coins/{id}/tickers` — venue spot books. @see https://docs.coingecko.com/reference/coins-id-tickers */
export const getCoinTickers = async ({
	publicEnv,
	coingeckoId,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coingecko_OpenApi>
	coingeckoId: string
}): Promise<CoingeckoOpenApiCoinTicker[]> => {
	if (coingeckoId === '')
		return []

	const searchParams = new URLSearchParams()
	searchParams.set('order', 'volume_desc')

	const response = await coingeckoOpenApiFetch(
		publicEnv,
		`/coins/${encodeURIComponent(coingeckoId)}/tickers?${searchParams.toString()}`
	)

	if (response.status === 404)
		return []
	if (!response.ok)
		await throwHttpError(`CoinGecko OpenApi /coins/${coingeckoId}/tickers`, response)

	const body = await response.json<{ tickers?: CoingeckoOpenApiCoinTicker[] }>()
	return body.tickers ?? []
}


/** Spot venue markets for one catalog coin from exchange tickers. */
export const collectSpotMarketEntitySelectorsForCoin = async ({
	publicEnv,
	catalogCoinId,
	coingeckoId,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coingecko_OpenApi>
	catalogCoinId: CoinId
	coingeckoId: string
}): Promise<EntitySelector<typeof schema, EntityType.Market>[]> => {
	const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
	const catalogCoinIdByCoingeckoIdMap = catalogCoinIdByCoingeckoId(idByCoinId)
	const tickers = await getCoinTickers({
		publicEnv,
		coingeckoId,
	})
	const seen = new Set<string>()
	return (
		tickers.flatMap((ticker) => {
			const marketId = marketEntitySelectorFromCoingeckoSpotTicker(
				ticker,
				catalogCoinId,
				catalogCoinIdByCoingeckoIdMap
			)
			if (marketId == null)
				return []
			const key = stringify(marketId)
			if (seen.has(key))
				return []
			seen.add(key)
			return [marketId]
		})
	)
}


/** All derivative tickers (perpetual + dated futures). @see https://docs.coingecko.com/reference/derivatives-tickers */
export const getDerivativesTickers = async ({
	publicEnv,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coingecko_OpenApi>
}): Promise<CoingeckoDerivativesTickersListItem[]> => {
	const response = await coingeckoOpenApiFetch(publicEnv, '/derivatives')

	if (!response.ok) await throwHttpError('CoinGecko OpenApi /derivatives', response)

	return response.json<CoingeckoDerivativesTickersListItem[]>()
}


/** One derivatives exchange with optional embedded tickers. @see https://docs.coingecko.com/reference/derivatives-exchanges-id */
export const getDerivativesExchangeById = async ({
	publicEnv,
	exchangeId,
	includeTickers = 'unexpired',
}: {
	publicEnv: SourcePublicEnvFor<Source.Coingecko_OpenApi>
	exchangeId: string
	includeTickers?: 'all' | 'unexpired'
}): Promise<CoingeckoDerivativesExchangeById | undefined> => {
	if (exchangeId === '') return undefined

	const searchParams = new URLSearchParams()
	searchParams.set('include_tickers', includeTickers)

	const response = await coingeckoOpenApiFetch(
		publicEnv,
		`/derivatives/exchanges/${encodeURIComponent(exchangeId)}?${searchParams.toString()}`
	)

	if (response.status === 404) return undefined
	if (!response.ok)
		await throwHttpError(`CoinGecko OpenApi /derivatives/exchanges/${exchangeId}`, response)

	return response.json<CoingeckoDerivativesExchangeById>()
}


/** @see https://docs.coingecko.com/reference/derivatives-exchanges-id */
export const collectDerivativeMarketEntitySelectors = async ({
	publicEnv,
	catalogCoinId,
	marketVenueId,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coingecko_OpenApi>
	catalogCoinId?: CoinId
	marketVenueId?: MarketVenueId
}): Promise<EntitySelector<typeof schema, EntityType.Market>[]> => {
	const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
	const catalogCoinIdByCoingeckoIdMap = catalogCoinIdByCoingeckoId(idByCoinId)
	const seen = new Set<string>()

	return (
		(
			await Promise.all(
				(
					Object.entries(coingeckoDerivativesExchangeIdByMarketVenueId) as [
						MarketVenueId,
						string,
					][]
				)
					.filter(([venueId]) => (
						marketVenueId == null
						|| venueId === marketVenueId
					))
					.map(
					async ([venueId, exchangeId]) => {
							const exchange = await getDerivativesExchangeById({
								publicEnv,
								exchangeId,
							})
							return (
								(exchange?.tickers ?? []).flatMap((ticker) => {
									const marketId = marketEntitySelectorFromCoingeckoDerivativesExchangeTicker(
										ticker,
										venueId,
										catalogCoinIdByCoingeckoIdMap
									)
									if (marketId == null)
										return []
									if (
									catalogCoinId != null
									&& (
										marketId.$base.kind !== MarketAssetKind.Coin
										|| marketId.$base.$coin.coinId !== catalogCoinId
									)
								) {
									return []
								}
									const key = stringify(marketId)
									if (seen.has(key))
										return []
									seen.add(key)
									return [marketId]
								})
							)
					}
				)
			)
		).flat()
	)
}

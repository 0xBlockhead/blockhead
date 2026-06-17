/**
	* Coinpaprika coins and ticker endpoints.
	* @see https://docs.coinpaprika.com/api-reference/coins/get-coin-by-id.md
	* @see https://docs.coinpaprika.com/api-reference/tickers/get-ticker-for-a-specific-coin.md
	*/

import { stringify } from 'devalue'

import type { CoinId } from '$/constants/Coin.ts'
import { Iso4217 } from '$/constants/Currency.ts'
import { MarketAssetKind, MarketKind, marketOhlcDayLookbackValues } from '$/constants/Market.ts'
import type { MarketVenueId } from '$/constants/MarketVenue.ts'
import { optionalPublicEnvString } from '$/sources/$sources.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import {
	coinpaprikaMarketVenueIdByHostnameFragment,
	coinpaprikaUsdQuoteWireIds,
	coinIdByWireId,
} from '$/sources/Coinpaprika/OpenApi/constants.ts'
import { getCoinpaprikaJson } from '$/sources/Coinpaprika/OpenApi/client.ts'
import type {
	CoinpaprikaCoin,
	CoinpaprikaMarket,
	CoinpaprikaOhlcv,
	CoinpaprikaTicker,
} from '$/sources/Coinpaprika/OpenApi/types.ts'

type OhlcCandle = readonly [
	timestampMs: number,
	open: number,
	high: number,
	low: number,
	close: number,
	quoteVolume?: number,
]


export const getMarketKindFromMarketCategory = (
	category: string | undefined
): MarketKind => (
	category === 'Futures' ?
		MarketKind.Futures
	:
		category === 'Perpetuals' || category === 'Perpetual' ?
			MarketKind.Perpetual
		:
			MarketKind.Spot
)


export const getMarketVenueIdFromMarketUrl = (
	marketUrl: string | undefined
): MarketVenueId | null => {
	if (marketUrl == null || marketUrl === '')
		return null
	try {
		const host = new URL(marketUrl).hostname.toLowerCase()
		for (const [fragment, marketVenueId] of coinpaprikaMarketVenueIdByHostnameFragment) {
			if (host.includes(fragment))
				return marketVenueId
		}
	} catch {
		return null
	}
	return null
}


export const getMarketEntitySelectorFromMarket = (
	market: CoinpaprikaMarket,
	scope?: {
		baseCoinId?: CoinId
		marketVenueId?: MarketVenueId
	}
): EntitySelector<typeof schema, EntityType.Market> | null => {
	const baseWireId = market.base_currency_id
	const quoteWireId = market.quote_currency_id
	if (baseWireId == null || quoteWireId == null)
		return null
	const baseCoinId = coinIdByWireId[baseWireId]
	if (
		baseCoinId == null
		|| (
			scope?.baseCoinId != null
			&& baseCoinId !== scope.baseCoinId
		)
	) {
		return null
	}
	const marketVenueId = (
		scope?.marketVenueId
		?? getMarketVenueIdFromMarketUrl(market.market_url)
	)
	if (marketVenueId == null)
		return null
	const quoteCoinId = coinIdByWireId[quoteWireId]
	const marketKind = getMarketKindFromMarketCategory(market.category)
	if (
		(
			coinpaprikaUsdQuoteWireIds as readonly string[]
		).includes(quoteWireId)
	) {
		return {
			$base: {
				kind: MarketAssetKind.Coin,
				$coin: { coinId: baseCoinId },
			},
			$quote: {
				kind: MarketAssetKind.Currency,
				$currency: { iso4217: Iso4217.USD },
			},
			$marketVenue: { marketVenueId },
			marketKind,
		}
	}
	if (quoteCoinId != null)
		return {
			$base: {
				kind: MarketAssetKind.Coin,
				$coin: { coinId: baseCoinId },
			},
			$quote: {
				kind: MarketAssetKind.Coin,
				$coin: { coinId: quoteCoinId },
			},
			$marketVenue: { marketVenueId },
			marketKind,
		}
	return null
}


export const collectMarketEntitySelectorsForCoin = async ({
	publicEnv,
	catalogCoinId,
	coinpaprikaId,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coinpaprika_OpenApi>
	catalogCoinId: CoinId
	coinpaprikaId: string
}): Promise<EntitySelector<typeof schema, EntityType.Market>[]> => {
	const markets = await getCoinMarkets({
		publicEnv,
		coinpaprikaId,
	})
	const seen = new Set<string>()
	return (
		markets.flatMap((market) => {
			const marketId = getMarketEntitySelectorFromMarket(market, {
				baseCoinId: catalogCoinId,
			})
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


export const collectMarketEntitySelectorsForExchange = async ({
	publicEnv,
	marketVenueId,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coinpaprika_OpenApi>
	marketVenueId: MarketVenueId
}): Promise<EntitySelector<typeof schema, EntityType.Market>[]> => {
	const { coinpaprikaExchangeIdByMarketVenueId } = await import(
		'$/sources/Coinpaprika/OpenApi/constants.ts'
	)
	const exchangeId = coinpaprikaExchangeIdByMarketVenueId[marketVenueId]
	if (exchangeId == null)
		return []
	const markets = await getExchangeMarkets({
		publicEnv,
		exchangeId,
	})
	const seen = new Set<string>()
	return (
		markets.flatMap((market) => {
			const marketId = getMarketEntitySelectorFromMarket(market, {
				marketVenueId,
			})
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

/**
	* OHLC range windows registered for Coinpaprika: multi-day historical needs pro API key
	* (`Authorization` on api-pro); free plan only supports today / 24h historical per OpenAPI plan table.
	*/
export const getOhlcDayWindowValues = (
	publicEnv: SourcePublicEnvFor<Source.Coinpaprika_OpenApi>
) => (
	optionalPublicEnvString(publicEnv, 'PUBLIC_COINPAPRIKA_API_KEY') != null ?
		[...marketOhlcDayLookbackValues]
	:
		[1]
)

export const getCoinById = async ({
	publicEnv,
	coinpaprikaId,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coinpaprika_OpenApi>
	coinpaprikaId: string
}) => (
	await getCoinpaprikaJson<CoinpaprikaCoin>(
		publicEnv,
		`/coins/${coinpaprikaId}`
	)
)

/**
	* `GET /coins/{coin_id}/markets`
	* @see https://docs.coinpaprika.com/api-reference/coins/get-markets-for-a-coin.md
	*/
export const getCoinMarkets = async ({
	publicEnv,
	coinpaprikaId,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coinpaprika_OpenApi>
	coinpaprikaId: string
}) => (
	await getCoinpaprikaJson<CoinpaprikaMarket[]>(
		publicEnv,
		`/coins/${coinpaprikaId}/markets?quotes=USD`
	)

)


/**
	* `GET /exchanges/{exchange_id}/markets`
	* @see https://docs.coinpaprika.com/api-reference/exchanges/get-markets-by-exchange-id.md
	*/
export const getExchangeMarkets = async ({
	publicEnv,
	exchangeId,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coinpaprika_OpenApi>
	exchangeId: string
}) => (
	await getCoinpaprikaJson<CoinpaprikaMarket[]>(
		publicEnv,
		`/exchanges/${exchangeId}/markets?quotes=USD`
	)

)


export const getTickerById = async ({
	publicEnv,
	coinpaprikaId,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coinpaprika_OpenApi>
	coinpaprikaId: string
}) => (
	await getCoinpaprikaJson<CoinpaprikaTicker>(
		publicEnv,
		`/tickers/${coinpaprikaId}`
	)
)

/**
	* `GET /coins/{coin_id}/ohlcv/today`
	* @see https://docs.coinpaprika.com/api-reference/coins/get-today-ohlc.md
	*/
export const getOhlcvTodayRows = async ({
	publicEnv,
	coinpaprikaId,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coinpaprika_OpenApi>
	coinpaprikaId: string
}): Promise<OhlcCandle[]> => {
	const rows = await getCoinpaprikaJson<CoinpaprikaOhlcv[]>(
		publicEnv,
		`/coins/${coinpaprikaId}/ohlcv/today`
	)
	return rows.flatMap((row) => (
		row.time_open == null
		|| row.open == null
		|| row.high == null
		|| row.low == null
		|| row.close == null ?
			[]
		:
			[[
				Date.parse(row.time_open),
				row.open,
				row.high,
				row.low,
				row.close,
				row.volume ?? undefined,
			]]
	))
}

/**
	* `GET /coins/{coin_id}/ohlcv/historical` — `interval=24h`; free plan: last 24 hours.
	* @see https://docs.coinpaprika.com/api-reference/coins/get-historical-ohlc.md
	*/
export const getOhlcvHistoricalRows = async ({
	publicEnv,
	coinpaprikaId,
	lookbackDayCount,
}: {
	publicEnv: SourcePublicEnvFor<Source.Coinpaprika_OpenApi>
	coinpaprikaId: string
	lookbackDayCount: number
}): Promise<OhlcCandle[]> => {
	const end = new Date()
	const start = new Date(end)
	start.setUTCDate(start.getUTCDate() - lookbackDayCount)
	const startDate = start.toISOString().slice(0, 10)
	const endDate = end.toISOString().slice(0, 10)
	const rows = await getCoinpaprikaJson<CoinpaprikaOhlcv[]>(
		publicEnv,
		`/coins/${coinpaprikaId}/ohlcv/historical?start=${startDate}&end=${endDate}&limit=${lookbackDayCount}&interval=24h&quote=usd`
	)
	return rows.flatMap((row) => (
		row.time_open == null
		|| row.open == null
		|| row.high == null
		|| row.low == null
		|| row.close == null ?
			[]
		:
			[[
				Date.parse(row.time_open),
				row.open,
				row.high,
				row.low,
				row.close,
				row.volume ?? undefined,
			]]
	))
}

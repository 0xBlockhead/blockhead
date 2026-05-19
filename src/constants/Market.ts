// Types

import { stringify } from 'devalue'

import type { MarketVenueId } from '$/constants/MarketVenue.ts'


export type MarketAssetLegLabelInput =
	| {
		kind: MarketAssetKind.Coin
		$coin: { coinId: string }
	}
	| {
		kind: MarketAssetKind.CoinInstance
		$coinInstance: object
	}
	| {
		kind: MarketAssetKind.Currency
		$currency: { iso4217: string }
	}


export type MarketIdLabelInput = {
	$base: MarketAssetLegLabelInput
	$quote: MarketAssetLegLabelInput
	$marketVenue: { marketVenueId: MarketVenueId }
}


/**
 * `Market` graph model (source-agnostic ids; resolvers map into provider APIs):
 *
 * - **MarketAsset** — discriminated value in `Market.$base` / `.$quote` (catalog `Coin`, on-chain
 *   `CoinInstance`, or fiat `Currency` via `$currency` → `Currency`). Embedded in `Market.id`
 *   and in `MarketPrice` / OHLC parents via `.$market`.
 * - **Market** — `{$base, $quote, $marketVenue}`; venue is a real trading book (`Binance`, `Coinbase`, …).
 * - **MarketPrice** — stream identity: `{$market, feedKey?, $network?}`; observation: `price` and
 *   time fields in entity payload (as-of is not part of the id, so the same id can update over time).
 * - **Market_TimeInterval_Timestamp** — one OHLC candle per row (`{$market, timeInterval, timestampNs}`).
 */

/**
 * How a market asset id discriminates value: catalog coin, `CoinInstance` id, or fiat via `$currency`.
 */
export enum MarketAssetKind {
	Coin = 'Coin',
	CoinInstance = 'CoinInstance',
	Currency = 'Currency',
}

/**
 * Unit for a rolling or bucketed time window. Extensible for 4h-style CEX series.
 */
export enum MarketTimeIntervalUnit {
	Day = 'day',
	Hour = 'hour',
	Minute = 'minute',
	Second = 'second',
}

/**
 * Rolling (or provider-defined) window: `value` steps of `unit` (e.g. 7 × `day` for daily OHLC).
 */
export type MarketTimeInterval = {
	unit: MarketTimeIntervalUnit
	value: number
}

// Constants

import { Source } from '$/sources/$Source.ts'

/**
 * `days` values accepted by CoinGecko `GET /coins/{id}/ohlc` for USD candles (numeric days).
 * @see https://docs.coingecko.com/reference/coins-id-ohlc
 */
export const coingeckoOhlcDayWindowLengths = [1, 7, 14, 30, 90] as const

/** Resolvers that populate catalog `Coin` identity (symbol, name, rank, logo). */
export const catalogCoinIdentitySources = [
	Source.Constants_Internal,
	Source.Coingecko_Rest,
	Source.CoinMarketCap_Rest,
	Source.Coinpaprika_OpenApi,
] as const

/** Resolvers for `MarketPrice` / `$$marketPrice` (spot USD streams). */
export const marketSpotPriceSources = [
	Source.Constants_Internal,
	Source.Coingecko_Rest,
	Source.Coingecko_OpenApi,
	Source.CoinMarketCap_Rest,
	Source.Coinpaprika_OpenApi,
	Source.Defillama_OpenApi,
] as const

/** Resolvers for `Market_TimeInterval_Timestamp` / `$$marketTimeIntervalTimestamps`. */
export const marketOhlcCandleSources = [
	Source.Coingecko_Rest,
	Source.Coingecko_OpenApi,
	Source.Defillama_OpenApi,
	Source.Coinpaprika_OpenApi,
	Source.CoinMarketCap_Rest,
] as const

/** Parent `$` sources when loading `$$markets` field lists. */
export const marketCatalogFieldSources = [
	Source.Constants_Internal,
	Source.Coingecko_Rest,
	Source.Coingecko_OpenApi,
	Source.CoinMarketCap_Rest,
	Source.Coinpaprika_OpenApi,
	Source.Defillama_OpenApi,
	Source.TradingView_Rest,
] as const


// Lookups

export const formatMarketTimeIntervalLabel = (timeInterval: MarketTimeInterval) => (
	timeInterval.unit === MarketTimeIntervalUnit.Day ?
		`${String(timeInterval.value)}d`
	: timeInterval.unit === MarketTimeIntervalUnit.Hour ?
		`${String(timeInterval.value)}h`
	: timeInterval.unit === MarketTimeIntervalUnit.Minute ?
		`${String(timeInterval.value)}m`
	: timeInterval.unit === MarketTimeIntervalUnit.Second ?
		`${String(timeInterval.value)}s`
	:
		`${String(timeInterval.value)}`
)


export const formatMarketAssetSymbol = (
	leg: MarketAssetLegLabelInput,
) => (
	leg.kind === MarketAssetKind.Coin ?
		leg.$coin.coinId
	: leg.kind === MarketAssetKind.CoinInstance ?
		`instance-${stringify(leg.$coinInstance).slice(0, 12)}`
	:
		leg.$currency.iso4217
)


/** Human-readable market id: `Venue:BASE-QUOTE` (e.g. `Binance:ETH-USD`). */
export const formatMarketIdLabel = (
	marketId: MarketIdLabelInput,
) => (
	`${marketId.$marketVenue.marketVenueId}:${formatMarketAssetSymbol(marketId.$base)}-${formatMarketAssetSymbol(marketId.$quote)}`
)

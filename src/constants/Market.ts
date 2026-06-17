// Types

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


/** Spot CEX/DEX book vs perpetual vs dated futures. */
export enum MarketKind {
	Spot = 'Spot',
	Perpetual = 'Perpetual',
	Futures = 'Futures',
}

export type MarketIdLabelInput = {
	$base: MarketAssetLegLabelInput
	$quote: MarketAssetLegLabelInput
	$marketVenue: { marketVenueId: MarketVenueId }
	marketKind: MarketKind
}


/**
	* `Market` graph model (source-agnostic ids; resolvers map into provider APIs):
	*
	* - **MarketAsset** — discriminated value in `Market.$base` / `.$quote` (catalog `Coin`, on-chain
	*   `CoinInstance`, or fiat `Currency` via `$currency` → `Currency`). Embedded in `Market.id`
	*   and in `MarketPrice` / OHLC parents via `.$market`.
	* - **Market** — `{$base, $quote, $marketVenue}`; venue is a real trading book (`Binance`, `Coinbase`, …).
	* - **MarketPrice** — stream identity: `{$market, feedKey?, $network?}`; spot/index prints live on
	*   **`Market_Timestamp`** rows referenced from `$$quotes` (`{$market, timestampMs, feedKey?}`).
	* - **Market_TimeInterval_Timestamp** — one OHLC candle per row (`{$market, timeInterval, timestampMs}`).
	*/

/**
	* How a market asset id discriminates value: catalog coin, `CoinInstance` id, or fiat via `$currency`.
	*/
export enum MarketAssetKind {
	Coin = 'Coin',
	CoinInstance = 'CoinInstance',
	Currency = 'Currency',
}

/** Unit for a candle bucket interval. Extensible for 4h-style CEX series. */
export enum MarketTimeIntervalUnit {
	Day = 'day',
	Hour = 'hour',
	Minute = 'minute',
	Second = 'second',
}

/** Candle bucket interval: `value` steps of `unit` (e.g. 1 x `day` for daily OHLC). */
export type MarketTimeInterval = {
	unit: MarketTimeIntervalUnit
	value: number
}

export const marketOhlcDailyTimeInterval = {
	unit: MarketTimeIntervalUnit.Day,
	value: 1,
} as const satisfies MarketTimeInterval

/**
	* Provider lookback values used to fetch daily OHLC ranges. These are not candle identities.
	* @see https://docs.coingecko.com/reference/coins-id-ohlc
	*/
export const marketOhlcDayLookbackValues = [
	1,
	7,
	14,
	30,
	90,
] as const

export const marketOhlcDefaultLookbackDayCount = 90 satisfies typeof marketOhlcDayLookbackValues[number]

const marketKinds = [
	{
		marketKind: MarketKind.Spot,
		label: 'Spot',
	},
	{
		marketKind: MarketKind.Perpetual,
		label: 'Perpetual',
	},
	{
		marketKind: MarketKind.Futures,
		label: 'Futures',
	},
] as const satisfies readonly {
	marketKind: MarketKind
	label: string
}[]


// Lookups

export const marketKindByMarketKind = Object.fromEntries(
	marketKinds.map((row) => [
		row.marketKind,
		row,
	])
)

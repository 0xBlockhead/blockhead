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

/**
	* `days` values accepted by CoinGecko `GET /coins/{id}/ohlc` for USD candles (numeric days).
	* @see https://docs.coingecko.com/reference/coins-id-ohlc
	*/
export const coingeckoOhlcDayWindowLengths = [
	1,
	7,
	14,
	30,
	90,
] as const

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

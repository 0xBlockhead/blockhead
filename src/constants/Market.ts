// Types


/** Spot CEX/DEX book vs perpetual vs dated futures. */
export enum MarketKind {
	Spot = 'Spot',
	Perpetual = 'Perpetual',
	Futures = 'Futures',
}

export type MarketAssetRouteLabel = (
	| 'coin'
	| 'coin-instance'
	| 'currency'
)

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

const marketAssetRouteLabels = [
	{
		kind: MarketAssetKind.Coin,
		label: 'coin',
	},
	{
		kind: MarketAssetKind.CoinInstance,
		label: 'coin-instance',
	},
	{
		kind: MarketAssetKind.Currency,
		label: 'currency',
	},
] as const satisfies readonly {
	kind: MarketAssetKind
	label: MarketAssetRouteLabel
}[]

// Lookups

export const marketKindByMarketKind = Object.fromEntries(
	marketKinds.map((row) => [
		row.marketKind,
		row,
	])
)

export const marketAssetRouteLabelByKind = Object.fromEntries(
	marketAssetRouteLabels.map((row) => [
		row.kind,
		row.label,
	])
)

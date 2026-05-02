// Types

/**
 * `Market` graph model (source-agnostic ids; resolvers map into provider APIs):
 *
 * - **MarketAsset** — discriminated value in `Market.$base` / `.$quote` (catalog `Coin`, on-chain
 *   `CoinInstance`, or `Currency` ISO 4217). Not a standalone `EntityType`; it is embedded in
 *   `Market.id` and in `MarketPrice` / range parents via `.$market`.
 * - **Market** — `{$base, $quote, venue}`; venue separates synthetic indices vs per-provider books.
 * - **MarketPrice** — stream identity: `{$market, feedKey?, $network?}`; observation: `price` and
 *   time fields in entity payload (as-of is not part of the id, so the same id can update over time).
 * - **MarketPriceRange** — `{$market, timeInterval, rangeType}`; `rangeType` picks the payload
 *   family; store provider blobs in `rangePayload` and interpret per `rangeType`.
 */


// Constants

/**
 * How a market asset id discriminates value: catalog coin, `CoinInstance` id, or fiat ISO 4217.
 */
export enum MarketAssetKind {
	Coin = 'Coin',
	CoinInstance = 'CoinInstance',
	Currency = 'Currency',
}

/**
 * Book or index for a `Market` id. `SpotIndex` is a shared key so many resolvers list the same row;
 * per-provider values keep parallel venues addressable.
 */
export enum MarketVenue {
	/** Shared spot/USD market id so Constants and multiple price sources address one row. */
	SpotIndex = 'SpotIndex',
	Coingecko_Rest = 'Coingecko_Rest',
	CoinMarketCap_Rest = 'CoinMarketCap_Rest',
	Coinpaprika_OpenApi = 'Coinpaprika_OpenApi',
	Defillama_Rest = 'Defillama_Rest',
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
 * Discriminates `MarketPriceRange` payload family; new members imply new `rangePayload` shapes.
 */
export enum MarketPriceRangeType {
	OHLCCandles = 'OHLCCandles',
}


// Lookups

/**
 * `days` values accepted by CoinGecko `GET /coins/{id}/ohlc` for USD candles (numeric days).
 * @see https://docs.coingecko.com/reference/coins-id-ohlc
 */
export const coingeckoOhlcDayWindowLengths = [1, 7, 14, 30, 90] as const


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

// Types
import type { CoinId } from '$/constants/Coin.ts'
import { coins } from '$/constants/Coin.ts'
import { Iso4217, iso4217WithCatalogUsdCrossAsBase } from '$/constants/Currency.ts'
import { MarketKind } from '$/constants/Market.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'


export type CatalogCoinCurrencyMarket = {
	readonly baseCoinId: CoinId
	readonly quoteIso4217: Iso4217
	readonly marketVenueId: MarketVenueId
	readonly marketKind: MarketKind
}

export type CatalogCoinCoinMarket = {
	readonly baseCoinId: CoinId
	readonly quoteCoinId: CoinId
	readonly marketVenueId: MarketVenueId
	readonly marketKind: MarketKind
}

export type CatalogCurrencyCurrencyMarket = {
	readonly baseIso4217: Iso4217
	readonly quoteIso4217: Iso4217
	readonly marketVenueId: MarketVenueId
	readonly marketKind: MarketKind
}


/** Venue for catalog fiat-major / USD crosses (e.g. EUR/USD). */
export const catalogFiatUsdCrossMarketVenueId = MarketVenueId.Coinbase


// Constants
export const catalogCoinSpotUsdMarkets = coins.map((coin) => (
	{
		baseCoinId: coin.id,
		quoteIso4217: Iso4217.USD,
		marketVenueId: MarketVenueId.Binance,
		marketKind: MarketKind.Spot,
	}
)) satisfies readonly CatalogCoinCurrencyMarket[]

export const catalogSpotMarketsWithCoinAsQuote = coins.flatMap((quoteCoin) => (
	coins.flatMap((coin) => (
		coin.id === quoteCoin.id ?
			[]
		:
			[{
				quoteCoinId: quoteCoin.id,
				baseCoinId: coin.id,
				marketVenueId: MarketVenueId.Binance,
				marketKind: MarketKind.Spot,
			}]
	))
)) satisfies readonly CatalogCoinCoinMarket[]

export const catalogSpotMarketsWithCurrencyAsQuote = catalogCoinSpotUsdMarkets

export const catalogSpotMarketsWithCurrencyAsBase = iso4217WithCatalogUsdCrossAsBase.map((iso4217) => ({
	baseIso4217: iso4217,
	quoteIso4217: Iso4217.USD,
	marketVenueId: catalogFiatUsdCrossMarketVenueId,
	marketKind: MarketKind.Spot,
})) satisfies readonly CatalogCurrencyCurrencyMarket[]


// Lookups

export const catalogCoinSpotUsdMarketByCoinId = Object.fromEntries(
	catalogCoinSpotUsdMarkets.map((catalogRow) => [
		catalogRow.baseCoinId,
		catalogRow,
	])
)

export const catalogMarketsWithCoinAsQuoteByQuoteCoinId = Object.fromEntries(
	[
		...new Set(catalogSpotMarketsWithCoinAsQuote.map((catalogRow) => catalogRow.quoteCoinId)),
	].map((quoteCoinId) => [
		quoteCoinId,
		catalogSpotMarketsWithCoinAsQuote
				.filter((catalogRow) => catalogRow.quoteCoinId === quoteCoinId),
	])
)

export const catalogMarketsWithCurrencyAsBaseByIso4217 = Object.fromEntries(
	catalogSpotMarketsWithCurrencyAsBase.map((catalogRow) => [
		catalogRow.baseIso4217,
		[catalogRow],
	])
)

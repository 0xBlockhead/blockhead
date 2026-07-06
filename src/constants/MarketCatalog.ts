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


// Constants
export const seededCoinSpotUsdMarkets = coins.map((coin) => (
	{
		baseCoinId: coin.id,
		quoteIso4217: Iso4217.USD,
		marketVenueId: MarketVenueId.Binance,
		marketKind: MarketKind.Spot,
	}
)) satisfies readonly CatalogCoinCurrencyMarket[]

export const seededSpotMarketsWithCoinAsQuote = coins.flatMap((quoteCoin) => (
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

export const seededSpotMarketsWithCurrencyAsBase = iso4217WithCatalogUsdCrossAsBase.map((iso4217) => ({
	baseIso4217: iso4217,
	quoteIso4217: Iso4217.USD,
	marketVenueId: MarketVenueId.Coinbase,
	marketKind: MarketKind.Spot,
})) satisfies readonly CatalogCurrencyCurrencyMarket[]


// Lookups

export const seededCoinSpotUsdMarketByCoinId = Object.fromEntries(
	seededCoinSpotUsdMarkets.map((catalogRow) => [
		catalogRow.baseCoinId,
		catalogRow,
	])
)

export const seededMarketsWithCoinAsQuoteByQuoteCoinId = Object.fromEntries(
	[
		...new Set(seededSpotMarketsWithCoinAsQuote.map((catalogRow) => catalogRow.quoteCoinId)),
	].map((quoteCoinId) => [
		quoteCoinId,
		seededSpotMarketsWithCoinAsQuote
				.filter((catalogRow) => catalogRow.quoteCoinId === quoteCoinId),
	])
)

export const seededMarketsWithCurrencyAsBaseByIso4217 = Object.fromEntries(
	seededSpotMarketsWithCurrencyAsBase.map((catalogRow) => [
		catalogRow.baseIso4217,
		[catalogRow],
	])
)

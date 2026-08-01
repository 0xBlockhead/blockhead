import type { CoinId } from '$/constants/Coin.ts'
import { MarketAssetKind } from '$/constants/Market.ts'
import {
	seededCoinSpotUsdMarkets,
	type CatalogCoinCoinMarket,
	type CatalogCoinCurrencyMarket,
	type CatalogCurrencyCurrencyMarket,
} from '$/constants/MarketCatalog.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'

export const marketSelectorFromCatalogCoinCurrencyMarket = (
	catalogMarket: CatalogCoinCurrencyMarket
) => ({
	$base: {
		kind: MarketAssetKind.Coin,
		assetKey: catalogMarket.baseCoinId,
	},
	$quote: {
		kind: MarketAssetKind.Currency,
		assetKey: catalogMarket.quoteIso4217,
	},
	$marketVenue: {
		marketVenueId: catalogMarket.marketVenueId,
	},
	marketKind: catalogMarket.marketKind,
}) satisfies EntitySelector<
	typeof schema,
	EntityType.Market
>

export const marketSelectorFromCatalogCoinCoinMarket = (
	catalogMarket: CatalogCoinCoinMarket
) => ({
	$base: {
		kind: MarketAssetKind.Coin,
		assetKey: catalogMarket.baseCoinId,
	},
	$quote: {
		kind: MarketAssetKind.Coin,
		assetKey: catalogMarket.quoteCoinId,
	},
	$marketVenue: {
		marketVenueId: catalogMarket.marketVenueId,
	},
	marketKind: catalogMarket.marketKind,
}) satisfies EntitySelector<
	typeof schema,
	EntityType.Market
>

export const marketSelectorFromCatalogCurrencyCurrencyMarket = (
	catalogMarket: CatalogCurrencyCurrencyMarket
) => ({
	$base: {
		kind: MarketAssetKind.Currency,
		assetKey: catalogMarket.baseIso4217,
	},
	$quote: {
		kind: MarketAssetKind.Currency,
		assetKey: catalogMarket.quoteIso4217,
	},
	$marketVenue: {
		marketVenueId: catalogMarket.marketVenueId,
	},
	marketKind: catalogMarket.marketKind,
}) satisfies EntitySelector<
	typeof schema,
	EntityType.Market
>

export const catalogCoinCurrencyMarketMatchesMarket = (
	catalogMarket: CatalogCoinCurrencyMarket,
	market: EntitySelector<typeof schema, EntityType.Market>
) => (
	market.marketKind === catalogMarket.marketKind
	&& market.$marketVenue.marketVenueId === catalogMarket.marketVenueId
	&& market.$base.kind === MarketAssetKind.Coin
	&& market.$base.assetKey === catalogMarket.baseCoinId
	&& market.$quote.kind === MarketAssetKind.Currency
	&& market.$quote.assetKey === catalogMarket.quoteIso4217
)

export const isSeededCoinCurrencyMarket = (
	market: EntitySelector<typeof schema, EntityType.Market>
): market is EntitySelector<typeof schema, EntityType.Market> & {
	readonly $base: {
		readonly kind: MarketAssetKind.Coin
		readonly assetKey: CoinId
	}
} => (
	seededCoinSpotUsdMarkets.some((catalogMarket) => (
		catalogCoinCurrencyMarketMatchesMarket(
			catalogMarket,
			market
		)
	))
)

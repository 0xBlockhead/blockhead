import { Iso4217 } from '$/constants/Currency.ts'
import {
	MarketAssetKind,
	MarketKind,
	type MarketIdLabelInput,
} from '$/constants/Market.ts'
import {
	seededCoinSpotUsdMarkets,
	seededCoinSpotUsdMarketByCoinId,
	type CatalogCoinCurrencyMarket,
	type CatalogCurrencyCurrencyMarket,
	seededSpotMarketsWithCurrencyAsBase,
} from '$/constants/MarketCatalog.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'
import { CoinSelector } from '$/schema/Coin.ts'
import { CurrencySelector } from '$/schema/Currency.ts'

const marketSelectorFromCatalogCoinCurrencyMarket = (catalogMarket: CatalogCoinCurrencyMarket) => ({
	$base: {
		kind: MarketAssetKind.Coin,
		$coin: { coinId: catalogMarket.baseCoinId },
	},
	$quote: {
		kind: MarketAssetKind.Currency,
		$currency: { iso4217: catalogMarket.quoteIso4217 },
	},
	$marketVenue: {
		marketVenueId: catalogMarket.marketVenueId,
	},
	marketKind: catalogMarket.marketKind,
}) satisfies MarketIdLabelInput

const marketSelectorFromCatalogCurrencyCurrencyMarket = (catalogMarket: CatalogCurrencyCurrencyMarket) => ({
	$base: {
		kind: MarketAssetKind.Currency,
		$currency: { iso4217: catalogMarket.baseIso4217 },
	},
	$quote: {
		kind: MarketAssetKind.Currency,
		$currency: { iso4217: catalogMarket.quoteIso4217 },
	},
	$marketVenue: {
		marketVenueId: catalogMarket.marketVenueId,
	},
	marketKind: catalogMarket.marketKind,
}) satisfies MarketIdLabelInput

export default {
	source: Source.TradingView_Rest,

	resolvers: [
		defineResolver(Source.TradingView_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async () => {
					const { tradingViewMarketByCoinId } = await import('$/sources/TradingView/Rest/constants.ts')
					return Object.entries(tradingViewMarketByCoinId)
						.flatMap(([coinId, market]) => (
						market == null ?
							[]
						:
							[{
								[EntityMetaKey.Selector]: {
									$base: {
										kind: MarketAssetKind.Coin,
										$coin: { coinId },
									},
									$quote: {
										kind: MarketAssetKind.Currency,
										$currency: { iso4217: Iso4217.USD },
									},
									$marketVenue: {
										marketVenueId: market.marketVenueId,
									},
									marketKind: MarketKind.Spot,
								} as const,
							}]
						))
				}
			},
		})({
				$$markets: (snapshot) => snapshot,
			}),

		defineResolver(Source.TradingView_Rest, {
			entityType: EntityType.Coin,
			resolve: {
				[CoinSelector.CoinId]: async ({ coinId }) => {
					const { tradingViewMarketByCoinId } = await import('$/sources/TradingView/Rest/constants.ts')
					const market = tradingViewMarketByCoinId[coinId]
					if (market == null)
						throw new Error(`TradingView_Rest: no market for coin ${coinId}`)
					return [
						{
							[EntityMetaKey.Selector]: {
								$base: {
									kind: MarketAssetKind.Coin,
									$coin: { coinId: coinId },
								},
								$quote: {
									kind: MarketAssetKind.Currency,
									$currency: { iso4217: Iso4217.USD },
								},
								$marketVenue: {
									marketVenueId: market.marketVenueId,
								},
								marketKind: MarketKind.Spot,
							} as const,
						},
					]
				}
			},
		})({
				$$marketsWithCoinAsBase: (snapshot) => snapshot,
			}),

		defineResolver(Source.TradingView_Rest, {
			entityType: EntityType.Currency,
			resolve: {
				[CurrencySelector.Iso4217]: async ({ iso4217 }) => {
					const { tradingViewMarketByCoinId } = await import('$/sources/TradingView/Rest/constants.ts')
					const markets = (
						iso4217 === Iso4217.USD ?
							seededCoinSpotUsdMarkets.filter((catalogMarket) => (
								tradingViewMarketByCoinId[catalogMarket.baseCoinId] != null
							))
						:
							[]
					).map((catalogMarket) => ({
						[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCurrencyMarket(catalogMarket),
					}))
					if (markets.length === 0)
						throw new Error(`TradingView_Rest: no catalog markets with ${iso4217} as quote`)
					return markets
				}
			},
		})({
				$$marketsWithCurrencyAsQuote: (snapshot) => snapshot,
			}),

		defineResolver(Source.TradingView_Rest, {
			entityType: EntityType.Currency,
			resolve: {
				[CurrencySelector.Iso4217]: async ({ iso4217 }) => {
					const markets = seededSpotMarketsWithCurrencyAsBase
						.filter((catalogMarket) => catalogMarket.baseIso4217 === iso4217)
						.map((catalogMarket) => ({
							[EntityMetaKey.Selector]: marketSelectorFromCatalogCurrencyCurrencyMarket(catalogMarket),
						}))
					if (markets.length === 0)
						throw new Error(`TradingView_Rest: no catalog markets with ${iso4217} as base`)
					return markets
				}
			},
		})({
				$$marketsWithCurrencyAsBase: (snapshot) => snapshot,
			}),

	],
}

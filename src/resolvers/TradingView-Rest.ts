import { Iso4217 } from '$/constants/Currency.ts'
import {
	MarketAssetKind,
	MarketKind,
} from '$/constants/Market.ts'
import {
	catalogCoinUsdMarketIdByCoinId,
	catalogMarketsWithCurrencyAsQuoteUsd,
	catalogSpotMarketsWithCurrencyAsBase,
} from '$/constants/MarketCatalog.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { stringify } from 'devalue'
import { _GlobalSelector } from '$/schema/_Global.ts'
import { Market_TimestampSelector } from '$/schema/Market_Timestamp.ts'
import { CoinSelector } from '$/schema/Coin.ts'
import { CurrencySelector } from '$/schema/Currency.ts'
import { MarketPriceSelector } from '$/schema/MarketPrice.ts'

export default {
	source: Source.TradingView_Rest,

	resolvers: [
		defineResolver(Source.TradingView_Rest, {
			entityType: EntityType.Market_Timestamp,
			resolve: {
				[Market_TimestampSelector.MarketTimestampMsFeedKey]: async ({ $market }) => {
				if ($market.marketKind !== MarketKind.Spot) {
					throw new Error('TradingView_Rest: Market_Timestamp is spot-only')
				}
				if ($market.$base.kind !== MarketAssetKind.Coin) {
					throw new Error('TradingView_Rest: market base must be catalog coin')
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[$market.$base.$coin.coinId]) !== stringify($market)) {
					throw new Error('TradingView_Rest: Market_Timestamp is catalog coin USD market only')
				}
				const { tradingViewMarketByCoinId } = await import('$/sources/TradingView/Rest/constants.ts')
				const { getCryptoQuotes } = await import('$/sources/TradingView/Rest/queries.ts')
				const market = tradingViewMarketByCoinId[$market.$base.$coin.coinId]
				if (market == null) throw new Error('TradingView_Rest: coin market not mapped')
				const quote = (await getCryptoQuotes([market.ticker])).find((cryptoQuote) => cryptoQuote.ticker === market.ticker)
				if (quote == null) throw new Error('TradingView_Rest: quote not returned')

				return {
					price: BigInt(Math.round(quote.price * 1e8)),
					transport: 'tradingview-crypto-quotes-usd-1e8',
					providerAssetId: market.ticker,
				}
			}
			}
		})({
				fields: {
			price: (snapshot) => snapshot.price,
			transport: (snapshot) => snapshot.transport,
			providerAssetId: (snapshot) => snapshot.providerAssetId,
		},
			}),

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
			}
		})({
				fields: {
			$$markets: (snapshot) => snapshot,
		},
			}),

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
									$market: {
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
								},
							}]
					))
			}
			}
		})({
				fields: {
			$$marketPrices: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.TradingView_Rest, {
			entityType: EntityType.Coin,
			resolve: {
				[CoinSelector.CoinId]: async ({ coinId }) => {
				const { tradingViewMarketByCoinId } = await import('$/sources/TradingView/Rest/constants.ts')
				const market = tradingViewMarketByCoinId[coinId]
				if (market == null) {
					throw new Error(`TradingView_Rest: no market for coin ${coinId}`)
				}
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
			}
		})({
				fields: {
			$$marketsWithCoinAsBase: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.TradingView_Rest, {
			entityType: EntityType.Coin,
			resolve: {
				[CoinSelector.CoinId]: async ({ coinId }) => {
				throw new Error(`TradingView_Rest: $$marketsWithCoinAsQuote unsupported for coin ${coinId}`)
			}
			}
		})({
				fields: {
			$$marketsWithCoinAsQuote: () => [],
		},
			}),

		defineResolver(Source.TradingView_Rest, {
			entityType: EntityType.Currency,
			resolve: {
				[CurrencySelector.Iso4217]: async ({ iso4217 }) => {
				const { tradingViewMarketByCoinId } = await import('$/sources/TradingView/Rest/constants.ts')
				const markets = (
					iso4217 === Iso4217.USD ?
						catalogMarketsWithCurrencyAsQuoteUsd.filter((marketId) => (
							tradingViewMarketByCoinId[marketId.$base.$coin.coinId] != null
						))
					:
						[]
				).map((marketId) => ({
					[EntityMetaKey.Selector]: marketId,
				}))
				if (markets.length === 0) {
					throw new Error(`TradingView_Rest: no catalog markets with ${iso4217} as quote`)
				}
				return markets
			}
			}
		})({
				fields: {
			$$marketsWithCurrencyAsQuote: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.TradingView_Rest, {
			entityType: EntityType.Currency,
			resolve: {
				[CurrencySelector.Iso4217]: async ({ iso4217 }) => {
				const markets = catalogSpotMarketsWithCurrencyAsBase
					.filter((catalogMarket) => catalogMarket.iso4217 === iso4217)
					.map((catalogMarket) => ({
						[EntityMetaKey.Selector]: catalogMarket.marketId,
					}))
				if (markets.length === 0) {
					throw new Error(`TradingView_Rest: no catalog markets with ${iso4217} as base`)
				}
				return markets
			}
			}
		})({
				fields: {
			$$marketsWithCurrencyAsBase: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.TradingView_Rest, {
			entityType: EntityType.MarketPrice,
			resolve: {
				[MarketPriceSelector.Market]: async ({ $market }) => {
				if ($market.marketKind !== MarketKind.Spot) {
					throw new Error('TradingView_Rest: MarketPrice $$quotes is spot-only')
				}
				if ($market.$base.kind !== MarketAssetKind.Coin) {
					throw new Error('TradingView_Rest: market base must be catalog coin')
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[$market.$base.$coin.coinId]) !== stringify($market)) {
					throw new Error('TradingView_Rest: MarketPrice $$quotes is catalog coin USD market only')
				}
				const { tradingViewMarketByCoinId } = await import('$/sources/TradingView/Rest/constants.ts')
				const { getCryptoQuotes } = await import('$/sources/TradingView/Rest/queries.ts')
				const market = tradingViewMarketByCoinId[$market.$base.$coin.coinId]
				if (market == null) throw new Error('TradingView_Rest: coin market not mapped')
				const quote = (await getCryptoQuotes([market.ticker])).find((cryptoQuote) => cryptoQuote.ticker === market.ticker)
				if (quote == null) throw new Error('TradingView_Rest: quote not returned')

				return [
					{
						[EntityMetaKey.Selector]: {
							$market: $market,
							timestampMs: Date.now(),
							feedKey: market.ticker,
						},
					},
				]
			}
			}
		})({
				fields: {
			$$quotes: (snapshot) => snapshot,
		},
			}),
	],
}

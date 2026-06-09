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
} from '$/resolvers/$resolvers.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { stringify } from 'devalue'

export default {
	source: Source.TradingView_Rest,

	resolvers: [
		defineResolver(Source.TradingView_Rest, {
			entityType: EntityType.Market_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('TradingView_Rest: Market_Timestamp is spot-only')
				}
				if (entityId.$market.$base.kind !== MarketAssetKind.Coin) {
					throw new Error('TradingView_Rest: market base must be catalog coin')
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$market.$base.$coin.coinId]) !== stringify(entityId.$market)) {
					throw new Error('TradingView_Rest: Market_Timestamp is catalog coin USD market only')
				}
				const { tradingViewMarketByCoinId } = await import('$/sources/TradingView/Rest/constants.ts')
				const { getCryptoQuotes } = await import('$/sources/TradingView/Rest/queries.ts')
				const market = tradingViewMarketByCoinId[entityId.$market.$base.$coin.coinId]
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
				[EntityIdProjection.Identity]: async () => {
				const { tradingViewMarketByCoinId } = await import('$/sources/TradingView/Rest/constants.ts')
				return Object.entries(tradingViewMarketByCoinId)
					.flatMap(([coinId, market]) => (
						market == null ?
							[]
						:
							[{
								[EntityMetaKey.Id]: {
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
				[EntityIdProjection.Identity]: async () => {
				const { tradingViewMarketByCoinId } = await import('$/sources/TradingView/Rest/constants.ts')
				return Object.entries(tradingViewMarketByCoinId)
					.flatMap(([coinId, market]) => (
						market == null ?
							[]
						:
							[{
								[EntityMetaKey.Id]: {
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
				[EntityIdProjection.Identity]: async (entityId) => {
				const { tradingViewMarketByCoinId } = await import('$/sources/TradingView/Rest/constants.ts')
				const market = tradingViewMarketByCoinId[entityId.coinId]
				if (market == null) {
					throw new Error(`TradingView_Rest: no market for coin ${entityId.coinId}`)
				}
				return [
					{
						[EntityMetaKey.Id]: {
							$base: {
								kind: MarketAssetKind.Coin,
								$coin: { coinId: entityId.coinId },
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
				[EntityIdProjection.Identity]: async (entityId) => {
				throw new Error(`TradingView_Rest: $$marketsWithCoinAsQuote unsupported for coin ${entityId.coinId}`)
			}
			}
		})({
				fields: {
			$$marketsWithCoinAsQuote: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.TradingView_Rest, {
			entityType: EntityType.Currency,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { tradingViewMarketByCoinId } = await import('$/sources/TradingView/Rest/constants.ts')
				const markets = (
					entityId.iso4217 === Iso4217.USD ?
						catalogMarketsWithCurrencyAsQuoteUsd.filter((marketId) => (
							tradingViewMarketByCoinId[marketId.$base.$coin.coinId] != null
						))
					:
						[]
				).map((marketId) => ({
					[EntityMetaKey.Id]: marketId,
				}))
				if (markets.length === 0) {
					throw new Error(`TradingView_Rest: no catalog markets with ${entityId.iso4217} as quote`)
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
				[EntityIdProjection.Identity]: async (entityId) => {
				const markets = catalogSpotMarketsWithCurrencyAsBase
					.filter((catalogMarket) => catalogMarket.iso4217 === entityId.iso4217)
					.map((catalogMarket) => ({
						[EntityMetaKey.Id]: catalogMarket.marketId,
					}))
				if (markets.length === 0) {
					throw new Error(`TradingView_Rest: no catalog markets with ${entityId.iso4217} as base`)
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
				[EntityIdProjection.Identity]: async (entityId) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('TradingView_Rest: MarketPrice $$quotes is spot-only')
				}
				if (entityId.$market.$base.kind !== MarketAssetKind.Coin) {
					throw new Error('TradingView_Rest: market base must be catalog coin')
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$market.$base.$coin.coinId]) !== stringify(entityId.$market)) {
					throw new Error('TradingView_Rest: MarketPrice $$quotes is catalog coin USD market only')
				}
				const { tradingViewMarketByCoinId } = await import('$/sources/TradingView/Rest/constants.ts')
				const { getCryptoQuotes } = await import('$/sources/TradingView/Rest/queries.ts')
				const market = tradingViewMarketByCoinId[entityId.$market.$base.$coin.coinId]
				if (market == null) throw new Error('TradingView_Rest: coin market not mapped')
				const quote = (await getCryptoQuotes([market.ticker])).find((cryptoQuote) => cryptoQuote.ticker === market.ticker)
				if (quote == null) throw new Error('TradingView_Rest: quote not returned')

				return [
					{
						[EntityMetaKey.Id]: {
							$market: entityId.$market,
							timestampMs: Date.now(),
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

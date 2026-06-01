import {
	MarketAssetKind,
	MarketKind,
} from '$/constants/Market.ts'
import {
	catalogCoinUsdMarketIdByCoinId,
	catalogSpotMarketsWithCurrencyAsBase,
	catalogMarketsWithCurrencyAsQuoteUsd,
} from '$/constants/MarketCatalog.ts'
import { Iso4217 } from '$/constants/Currency.ts'
import { stringify } from 'devalue'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.TradingView_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Market_Timestamp,
			resolve: async (entityId) => {
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
				const coinId = entityId.$market.$base.$coin.coinId
				const market = tradingViewMarketByCoinId[coinId]
				if (market == null) throw new Error('TradingView_Rest: coin market not mapped')
				const quote = (await getCryptoQuotes([market.ticker])).find((cryptoQuote) => cryptoQuote.ticker === market.ticker)
				if (quote == null) throw new Error('TradingView_Rest: quote not returned')

				return {
					[EntityMetaKey.Id]: entityId,
					price: BigInt(Math.round(quote.price * 1e8)),
					transport: 'tradingview-crypto-quotes-usd-1e8',
					providerAssetId: market.ticker,
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$markets',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { tradingViewMarketByCoinId } = await import('$/sources/TradingView/Rest/constants.ts')
					return (
						Object.entries(tradingViewMarketByCoinId)
							.flatMap(([coinId, market]) => market == null ? [] : [{
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
							}])
					)
				},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$marketPrices',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { tradingViewMarketByCoinId } = await import('$/sources/TradingView/Rest/constants.ts')
					return (
						Object.entries(tradingViewMarketByCoinId)
							.flatMap(([coinId, market]) => market == null ? [] : [{
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
							}])
					)
				},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsBase',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>) => {
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsQuote',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>) => {
				throw new Error(`TradingView_Rest: $$marketsWithCoinAsQuote unsupported for coin ${entityId.coinId}`)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Currency,
			fieldName: '$$marketsWithCurrencyAsQuote',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Currency,
			fieldName: '$$marketsWithCurrencyAsBase',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
				const markets = catalogSpotMarketsWithCurrencyAsBase
						.filter((catalogMarket) => catalogMarket.iso4217 === entityId.iso4217)
						.map((catalogMarket) => ({
							[EntityMetaKey.Id]: catalogMarket.marketId,
						}))
				if (markets.length === 0) {
					throw new Error(`TradingView_Rest: no catalog markets with ${entityId.iso4217} as base`)
				}
				return markets
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.MarketPrice,
			fieldName: '$$quotes',
			resolve: async (entityId) => {
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
				const coinId = entityId.$market.$base.$coin.coinId
				const market = tradingViewMarketByCoinId[coinId]
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
			},
		}),

	],
}

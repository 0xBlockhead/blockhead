import { MarketAssetKind } from '$/constants/Market.ts'
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
			entityType: EntityType.Market,
			resolve: async () => ({}),
		}),

		defineEntityResolver({
			entityType: EntityType.Market_Timestamp,
			resolve: async (entityId) => {
				const { tradingViewMarketByCoinId } = await import('$/sources/TradingView/Rest/constants.ts')
				const { getTradingViewCryptoQuotes } = await import('$/sources/TradingView/Rest/queries.ts')
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
						entityId.$market.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null) throw new Error('TradingView_Rest: market base is not a catalog coin')
				const market = tradingViewMarketByCoinId[coinId]
				if (market == null) throw new Error('TradingView_Rest: coin market not mapped')
				const quote = (await getTradingViewCryptoQuotes([market.ticker])).find((row) => row.ticker === market.ticker)
				if (quote == null) throw new Error('TradingView_Rest: quote not returned')

				return {
					[EntityMetaKey.Id]: entityId,
					price: BigInt(Math.round(quote.price * 1e8)),
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
						.map(([coinId, market]) => ({
							[EntityMetaKey.Id]: {
								$base: {
									kind: MarketAssetKind.Coin,
									$coin: { coinId },
								},
								$quote: {
									kind: MarketAssetKind.Currency,
									iso4217: 'USD',
								},
								$marketVenue: {
									marketVenueId: market.marketVenueId,
								},
							} as const,
						}))
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
						.map(([coinId, market]) => ({
							[EntityMetaKey.Id]: {
								$market: {
									$base: {
										kind: MarketAssetKind.Coin,
										$coin: { coinId },
									},
									$quote: {
										kind: MarketAssetKind.Currency,
										iso4217: 'USD',
									},
									$marketVenue: {
										marketVenueId: market.marketVenueId,
									},
								} as const,
							},
						}))
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
								iso4217: 'USD',
							},
							$marketVenue: {
								marketVenueId: market.marketVenueId,
							},
						} as const,
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsQuote',
			resolve: async () => ([]),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketPrice',
			resolve: async (entityId) => {
				const { tradingViewMarketByCoinId } = await import('$/sources/TradingView/Rest/constants.ts')
				const market = tradingViewMarketByCoinId[entityId.coinId]
				if (market == null) {
					throw new Error(`TradingView_Rest: no market for coin ${entityId.coinId}`)
				}
				return {
					[EntityMetaKey.Id]: {
						$market: {
							$base: {
								kind: MarketAssetKind.Coin,
								$coin: { coinId: entityId.coinId },
							},
							$quote: {
								kind: MarketAssetKind.Currency,
								iso4217: 'USD',
							},
							$marketVenue: {
								marketVenueId: market.marketVenueId,
							},
						} as const,
					},
				}
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.MarketPrice,
			fieldName: '$$quotes',
			resolve: async (entityId) => {
				const { tradingViewMarketByCoinId } = await import('$/sources/TradingView/Rest/constants.ts')
				const { getTradingViewCryptoQuotes } = await import('$/sources/TradingView/Rest/queries.ts')
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
						entityId.$market.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null) throw new Error('TradingView_Rest: market base is not a catalog coin')
				const market = tradingViewMarketByCoinId[coinId]
				if (market == null) throw new Error('TradingView_Rest: coin market not mapped')
				const quote = (await getTradingViewCryptoQuotes([market.ticker])).find((row) => row.ticker === market.ticker)
				if (quote == null) throw new Error('TradingView_Rest: quote not returned')

				return [
					{
						[EntityMetaKey.Id]: {
							$market: entityId.$market,
							timestampNs: BigInt(Date.now()) * 1_000_000n,
						},
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Market,
			fieldName: '$$quotes',
			resolve: async (entityId) => {
				const { tradingViewMarketByCoinId } = await import('$/sources/TradingView/Rest/constants.ts')
				const { getTradingViewCryptoQuotes } = await import('$/sources/TradingView/Rest/queries.ts')
				const coinId = (
					entityId.$base.kind === MarketAssetKind.Coin ?
						entityId.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null) throw new Error('TradingView_Rest: market base is not a catalog coin')
				const market = tradingViewMarketByCoinId[coinId]
				if (market == null) throw new Error('TradingView_Rest: coin market not mapped')
				const quote = (await getTradingViewCryptoQuotes([market.ticker])).find((row) => row.ticker === market.ticker)
				if (quote == null) throw new Error('TradingView_Rest: quote not returned')

				return [
					{
						[EntityMetaKey.Id]: {
							$market: entityId,
							timestampNs: BigInt(Date.now()) * 1_000_000n,
						},
					},
				]
			},
		}),
	],
}

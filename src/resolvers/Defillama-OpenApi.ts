import { CoinId } from '$/constants/Coin.ts'
import {
	MarketAssetKind,
	MarketKind,
	MarketTimeIntervalUnit,
	coingeckoOhlcDayWindowLengths,
} from '$/constants/Market.ts'
import { Iso4217 } from '$/constants/Currency.ts'
import {
	catalogCoinUsdMarketIdByCoinId,
	catalogSpotMarketsWithCoinAsQuote,
	catalogSpotMarketsWithCurrencyAsBase,
	catalogMarketsWithCurrencyAsQuoteUsd,
} from '$/constants/MarketCatalog.ts'
import {
	assertCoingeckoDayOhlcTimeInterval,
	candlesFromOhlc,
	candleFromOhlc,
} from '$/lib/marketOhlcCandles.ts'
import { stringify } from 'devalue'
import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MediaType } from '$/schema/Media.ts'
import { Source } from '$/sources/Source.ts'

/** Coin prices use `$/sources/Defillama/OpenApi` + checked-in `openapi.d.ts` (`GET /prices/current/{coins}`). */
export default {
	source: Source.Defillama_OpenApi,

	resolvers: [
		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.Market_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('Defillama_OpenApi: Market_Timestamp is spot-only')
				}
				if (entityId.$market.$base.kind !== MarketAssetKind.Coin) {
					throw new Error('Market source: market base must be catalog coin')
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$market.$base.$coin.coinId]) !== stringify(entityId.$market)) {
					throw new Error('Defillama_OpenApi: Market_Timestamp is catalog coin USD market only')
				}
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				const { getCurrentPrices } = await import('$/sources/Defillama/OpenApi/queries.ts')
				const coinId = entityId.$market.$base.$coin.coinId
				const llamaId = (
					entityId.feedKey
					?? defillamaCurrentPriceIdByCoinId[coinId]
				)
				if (llamaId == null) throw new Error('Defillama_OpenApi: no price id')
				const priceRow = (await getCurrentPrices([llamaId])).coins[llamaId]
				const timestampMs = priceRow.timestamp * 1000
				if (entityId.timestampMs !== timestampMs) {
					throw new Error('Defillama_OpenApi: Market_Timestamp id does not match price clock')
				}
				return {
					price: BigInt(Math.round(priceRow.price * 1e8)),
					transport: 'defillama-usd-1e8',
					providerAssetId: llamaId,
				}
			}
			},
		})({
				fields: {
				price: (timestamp) => timestamp.price,
				transport: (timestamp) => timestamp.transport,
				providerAssetId: (timestamp) => timestamp.providerAssetId,
			},
			}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, _context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('Defillama_OpenApi: OHLC is spot-only')
				}
				if (entityId.$market.$base.kind !== MarketAssetKind.Coin) {
					throw new Error('Market source: market base must be catalog coin')
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$market.$base.$coin.coinId]) !== stringify(entityId.$market)) {
					throw new Error('Defillama_OpenApi: OHLC is catalog coin USD market only')
				}
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				const { getChartOhlcRows } = await import('$/sources/Defillama/OpenApi/queries.ts')
				assertCoingeckoDayOhlcTimeInterval(entityId.timeInterval, 'Defillama_OpenApi')
				const coinId = entityId.$market.$base.$coin.coinId
				const llamaId = defillamaCurrentPriceIdByCoinId[coinId]
				if (llamaId == null) throw new Error('Defillama_OpenApi: OHLC coin not mapped')
				const ohlcCandles = await getChartOhlcRows({
					llamaCoinId: llamaId,
					days: entityId.timeInterval.value,
				})
				const ohlcCandle = ohlcCandles.find(([timestampMs]) => (
					Math.floor(timestampMs) === entityId.timestampMs
				))
				if (ohlcCandle == null) throw new Error('Defillama_OpenApi: OHLC candle not found for timestamp')
				return (
					candleFromOhlc(
						entityId.$market,
						entityId.timeInterval,
					ohlcCandle,
					)
				)
			}
			},
		})({
				fields: {
				open: (timestamp) => timestamp.open,
				high: (timestamp) => timestamp.high,
				low: (timestamp) => timestamp.low,
				close: (timestamp) => timestamp.close,
				volume: (timestamp) => timestamp.volume,
				quoteVolume: (timestamp) => timestamp.quoteVolume,
				tradeCount: (timestamp) => timestamp.tradeCount,
				vwap: (timestamp) => timestamp.vwap,
			},
			}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				return (
					Object.values(CoinId)
						.flatMap((coinId) => (
							defillamaCurrentPriceIdByCoinId[coinId] != null ?
								[
									{
										[EntityMetaKey.Id]: catalogCoinUsdMarketIdByCoinId[coinId],
									},
								]
							:
								[]
						))
				)
			}
			},
		})({
				fields: {
				$$markets: (markets) => markets,
			},
			}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async () => {
				throw new Error('Defillama_OpenApi: $$marketTimeIntervalTimestamps is not implemented')
			}
			},
		})({
				fields: {
				$$marketTimeIntervalTimestamps: (timestamps) => timestamps,
			},
			}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				return (
					Object.values(CoinId)
						.flatMap((coinId) => (
							defillamaCurrentPriceIdByCoinId[coinId] != null ?
								[
									{
										[EntityMetaKey.Id]: {
											$market: catalogCoinUsdMarketIdByCoinId[coinId],
										},
									},
								]
							:
								[]
						))
				)
			}
			},
		})({
				fields: {
				$$marketPrices: (marketPrices) => marketPrices,
			},
			}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.Coin,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.Coin>) => {
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				return (
					defillamaCurrentPriceIdByCoinId[entityId.coinId] != null ?
						[
							{
								[EntityMetaKey.Id]: catalogCoinUsdMarketIdByCoinId[entityId.coinId],
							},
						]
					:
						[]
				)
			}
			},
		})({
				fields: {
				$$marketsWithCoinAsBase: (markets) => markets,
			},
			}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.Coin,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.Coin>) => {
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				if (defillamaCurrentPriceIdByCoinId[entityId.coinId] == null) {
					return []
				}
				return (
					catalogSpotMarketsWithCoinAsQuote
						.filter((catalogMarket) => catalogMarket.quoteCoinId === entityId.coinId)
						.map((catalogMarket) => catalogMarket.marketId)
						.filter((marketId) => (
							defillamaCurrentPriceIdByCoinId[marketId.$base.$coin.coinId] != null
						))
						.map((marketId) => (
							{
								[EntityMetaKey.Id]: marketId,
							}
						))
				)
			}
			},
		})({
				fields: {
				$$marketsWithCoinAsQuote: (markets) => markets,
			},
			}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.Currency,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				return (
					(
						entityId.iso4217 === Iso4217.USD ?
							catalogMarketsWithCurrencyAsQuoteUsd.filter((marketId) => (
								defillamaCurrentPriceIdByCoinId[marketId.$base.$coin.coinId] != null
							))
						:
							[]
					).map((marketId) => ({
						[EntityMetaKey.Id]: marketId,
					}))
				)
			}
			},
		})({
				fields: {
				$$marketsWithCurrencyAsQuote: (markets) => markets,
			},
			}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.Currency,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
				const markets = catalogSpotMarketsWithCurrencyAsBase
						.filter((catalogMarket) => catalogMarket.iso4217 === entityId.iso4217)
						.map((catalogMarket) => ({
							[EntityMetaKey.Id]: catalogMarket.marketId,
						}))
				if (markets.length === 0) {
					throw new Error(`Defillama_OpenApi: no catalog markets with ${entityId.iso4217} as base`)
				}
				return markets
			}
			},
		})({
				fields: {
				$$marketsWithCurrencyAsBase: (markets) => markets,
			},
			}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.Market,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.Market>, context) => {
				if (entityId.marketKind !== MarketKind.Spot) {
					return []
				}
				if (entityId.$base.kind !== MarketAssetKind.Coin) {
					return []
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$base.$coin.coinId]) !== stringify(entityId)) {
					return []
				}
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				const { getChartOhlcRows } = await import('$/sources/Defillama/OpenApi/queries.ts')
				const coinId = entityId.$base.$coin.coinId
				if (defillamaCurrentPriceIdByCoinId[coinId] == null) {
					throw new Error('Defillama_OpenApi: OHLC coin not mapped')
				}
				const llamaId = defillamaCurrentPriceIdByCoinId[coinId]
				const lim = resolverContextRowLimit(context)
				const candles = []
				for (const value of coingeckoOhlcDayWindowLengths) {
					const timeInterval = (
						{
							unit: MarketTimeIntervalUnit.Day,
							value,
						}
					)
					const ohlcCandles = await getChartOhlcRows({
						llamaCoinId: llamaId,
						days: value,
					})
					candles.push(
						...candlesFromOhlc(
							entityId,
							timeInterval,
							ohlcCandles,
						),
					)
				}
				return (
					candles.slice(0, lim)
				)
			}
			},
		})({
				fields: {
				$$marketTimeIntervalTimestamps: (timestamps) => timestamps,
			},
			}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.MarketPrice,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					return []
				}
				if (entityId.$market.$base.kind !== MarketAssetKind.Coin) {
					return []
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$market.$base.$coin.coinId]) !== stringify(entityId.$market)) {
					return []
				}
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				const { getCurrentPrices } = await import('$/sources/Defillama/OpenApi/queries.ts')
				const coinId = entityId.$market.$base.$coin.coinId
				const llamaId = (
					entityId.feedKey
					?? (
						entityId.$network != null ?
							(
								coinId === CoinId.ETH && Number(entityId.$network.caip2.reference) === 1 ?
									defillamaCurrentPriceIdByCoinId[CoinId.ETH]
								:
									undefined
							)
						:
							defillamaCurrentPriceIdByCoinId[coinId]
					)
				)
				if (llamaId == null) throw new Error('Defillama_OpenApi: no price id')
				const priceRow = (await getCurrentPrices([llamaId])).coins[llamaId]
				return [
					{
						[EntityMetaKey.Id]: {
							$market: entityId.$market,
							timestampMs: priceRow.timestamp * 1000,
							...(llamaId !== '' && { feedKey: llamaId }),
						},
					},
				]
			}
			},
		})({
				fields: {
				$$quotes: (quotes) => quotes,
			},
			}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.MarketPrice,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.MarketPrice>) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
				}
			)
			},
		})({
				fields: {
				$parentMarket: (market) => market,
			},
			}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.Market_TimeInterval_Timestamp>) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
				}
			)
			},
		})({
				fields: {
				$parentMarket: (market) => market,
			},
			}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getChainSlugByChainId, getChainIconUrl } = await import('$/sources/Defillama/OpenApi/queries.ts')
				const slug = getChainSlugByChainId[Number(entityId.caip2.reference)]
				if (slug == null) throw new Error(`Defillama_OpenApi: no chain icon slug for chain ${entityId.caip2.reference}`)
				const iconMedia = mediaFromUrl(getChainIconUrl(slug), MediaType.Image)
				if (iconMedia == null) throw new Error(`Defillama_OpenApi: invalid icon URL for chain ${entityId.caip2.reference}`)
				return iconMedia
			}
			},
		})({
				fields: {
				$icon: (icon) => icon,
			},
			}),
	],
}

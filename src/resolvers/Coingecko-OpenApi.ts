import type { CoinId } from '$/constants/Coin.ts'
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
	type SourceResolverContext,
} from '$/resolvers/$resolvers.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const coingeckoOpenApiDerivativeTickerForMarket = async (
	entityId: EntityId<typeof schema, EntityType.Market>,
	context: SourceResolverContext<Source.Coingecko_OpenApi>,
) => {
	const { coingeckoDerivativesExchangeIdByMarketVenueId } = await import(
		'$/sources/Coingecko/Rest/constants.ts'
	)
	const { derivativeTickerMatchesMarket } = await import('$/sources/Coingecko/marketKind.ts')
	const exchangeId = (
		coingeckoDerivativesExchangeIdByMarketVenueId[
			entityId.$marketVenue.marketVenueId
		]
	)
	if (exchangeId == null) {
		throw new Error(
			`Coingecko_OpenApi: derivatives exchange not mapped for venue ${entityId.$marketVenue.marketVenueId}`,
		)
	}
	const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
	const { catalogCoinIdByCoingeckoId } = await import('$/sources/Coingecko/marketKind.ts')
	const catalogCoinIdByCoingeckoIdMap = catalogCoinIdByCoingeckoId(idByCoinId)
	const { getDerivativesExchangeById } = await import(
		'$/sources/Coingecko/OpenApi/queries.ts'
	)
	const exchange = await getDerivativesExchangeById({
		publicEnv: context.publicEnv,
		exchangeId,
	})
	const ticker = exchange?.tickers?.find((exchangeTicker) => (
		derivativeTickerMatchesMarket(
			entityId,
			exchangeTicker,
			catalogCoinIdByCoingeckoIdMap,
		)
	))
	if (ticker == null) {
		throw new Error(
			`Coingecko_OpenApi: no derivative ticker for ${entityId.$marketVenue.marketVenueId} market`,
		)
	}
	return ticker
}

/** Spot + OHLC via checked-in `coingecko-demo.json` (`GET /coins/{id}`, `/coins/{id}/ohlc`). */
export default {
	source: Source.Coingecko_OpenApi,

	resolvers: [
		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Market_Derivative_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				if (entityId.$market.marketKind === MarketKind.Spot) {
					throw new Error('Coingecko_OpenApi: Market_Derivative_Timestamp is derivative-only')
				}
				const ticker = await coingeckoOpenApiDerivativeTickerForMarket(entityId.$market, context)
				return {
					...(ticker.funding_rate != null && { fundingRate: ticker.funding_rate }),
					...(ticker.open_interest_usd != null && {
						openInterestUsd: BigInt(Math.round(ticker.open_interest_usd)),
					}),
					...(ticker.index_basis_percentage != null && {
						indexBasisPercent: ticker.index_basis_percentage,
					}),
					...(ticker.expired_at != null && ticker.expired_at !== '' && {
						expiredAtMs: Date.parse(ticker.expired_at),
					}),
					...(ticker.last_traded != null && {
						lastTradedAtMs: ticker.last_traded * 1000,
					}),
					providerAssetId: ticker.symbol ?? null,
					transport: 'Coingecko OpenAPI',
				}
			}
			},
		})({
				fields: {
				fundingRate: (timestamp) => timestamp.fundingRate,
				openInterestUsd: (timestamp) => timestamp.openInterestUsd,
				indexBasisPercent: (timestamp) => timestamp.indexBasisPercent,
				expiredAtMs: (timestamp) => timestamp.expiredAtMs,
				lastTradedAtMs: (timestamp) => timestamp.lastTradedAtMs,
				providerAssetId: (timestamp) => timestamp.providerAssetId,
				transport: (timestamp) => timestamp.transport,
			},
			}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Market_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('Coingecko_OpenApi: Market_Timestamp is spot-only')
				}
				if (entityId.$market.$base.kind !== MarketAssetKind.Coin) {
					throw new Error('Market source: market base must be catalog coin')
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$market.$base.$coin.coinId]) !== stringify(entityId.$market)) {
					throw new Error('Coingecko_OpenApi: Market_Timestamp is catalog coin USD market only')
				}
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoinMarketSpot } = await import('$/sources/Coingecko/OpenApi/queries.ts')
				const coinId = entityId.$market.$base.$coin.coinId
				const coingeckoId = idByCoinId[coinId]
				if (coingeckoId == null) throw new Error('Coingecko_OpenApi: coin price not mapped')

				const spot = await getCoinMarketSpot({
					publicEnv: context.publicEnv,
					coingeckoId,
				})
				if (spot == null) throw new Error('Coingecko_OpenApi: coin market spot not returned')
				const timestampMs = spot.lastUpdatedAtSec * 1000
				if (entityId.timestampMs !== timestampMs) {
					throw new Error('Coingecko_OpenApi: Market_Timestamp id does not match spot clock')
				}

				return {
					price: BigInt(Math.round(spot.usd * 1e8)),
					transport: 'coingecko-openapi-coins-id-market-data-usd-1e8',
					providerAssetId: coingeckoId,
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

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('Coingecko_OpenApi: OHLC is spot-only')
				}
				if (entityId.$market.$base.kind !== MarketAssetKind.Coin) {
					throw new Error('Market source: market base must be catalog coin')
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$market.$base.$coin.coinId]) !== stringify(entityId.$market)) {
					throw new Error('Coingecko_OpenApi: OHLC is catalog coin USD market only')
				}
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoinOhlc } = await import('$/sources/Coingecko/OpenApi/queries.ts')
				assertCoingeckoDayOhlcTimeInterval(entityId.timeInterval, 'Coingecko_OpenApi')
				const coinId = entityId.$market.$base.$coin.coinId
				const coingeckoId = idByCoinId[coinId]
				if (coingeckoId == null) throw new Error('Coingecko_OpenApi: OHLC coin not mapped')

				const ohlcCandles = await getCoinOhlc({
					publicEnv: context.publicEnv,
					coingeckoId,
					vsCurrency: 'usd',
					days: entityId.timeInterval.value,
				})
				const ohlcCandle = ohlcCandles.find(([timestampMs]) => (
					Math.floor(timestampMs) === entityId.timestampMs
				))
				if (ohlcCandle == null) throw new Error('Coingecko_OpenApi: OHLC candle not found for timestamp')
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
		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async () => {
				throw new Error('Coingecko_OpenApi: $$marketTimeIntervalTimestamps is not implemented')
			}
			},
		})({
				fields: {
				$$marketTimeIntervalTimestamps: (globalScope) => globalScope,
			},
			}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Market,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				if (entityId.marketKind === MarketKind.Spot) return []
				const ticker = await coingeckoOpenApiDerivativeTickerForMarket(entityId, context)
				return [
					{
						[EntityMetaKey.Id]: {
							$market: entityId,
							timestampMs: (
								ticker.last_traded != null ?
									ticker.last_traded * 1000
								:
									Date.now()
							),
							feedKey: `coingecko:${ticker.symbol ?? entityId.$marketVenue.marketVenueId}`,
						},
					},
				]
			}
			},
		})({
				fields: {
				$$derivativeTimestamps: (market) => market,
			},
			}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Market_Derivative_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => ({
				[EntityMetaKey.Id]: entityId.$market,
			})
			},
		})({
				fields: {
				$parentMarket: (timestamp) => timestamp,
			},
			}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async (_globalScopeEntityId, context) => {
				const { collectDerivativeMarketEntityIds } = await import(
					'$/sources/Coingecko/OpenApi/queries.ts'
				)
				const lim = resolverContextRowLimit(context)
				const marketIds = await collectDerivativeMarketEntityIds({
					publicEnv: context.publicEnv,
				})
				return (
					marketIds
						.slice(0, lim)
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
				$$markets: (globalScope) => globalScope,
			},
			}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.MarketVenue,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { collectDerivativeMarketEntityIds } = await import(
					'$/sources/Coingecko/OpenApi/queries.ts'
				)
				const lim = resolverContextRowLimit(context)
				const marketIds = await collectDerivativeMarketEntityIds({
					publicEnv: context.publicEnv,
					marketVenueId: entityId.marketVenueId,
				})
				return (
					marketIds
						.slice(0, lim)
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
				$$markets: (marketVenue) => marketVenue,
			},
			}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Coin,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const spotMarketId = catalogCoinUsdMarketIdByCoinId[entityId.coinId]
				const coingeckoId = idByCoinId[entityId.coinId]
				if (coingeckoId == null) {
					return [
						{
							[EntityMetaKey.Id]: spotMarketId,
						},
					]
				}
				const {
					collectDerivativeMarketEntityIds,
					collectSpotMarketEntityIdsForCoin,
				} = await import('$/sources/Coingecko/OpenApi/queries.ts')
				const lim = resolverContextRowLimit(context)
				const spotVenueMarketIds = await collectSpotMarketEntityIdsForCoin({
					publicEnv: context.publicEnv,
					catalogCoinId: entityId.coinId,
					coingeckoId,
				})
				const derivativeMarketIds = await collectDerivativeMarketEntityIds({
					publicEnv: context.publicEnv,
					catalogCoinId: entityId.coinId,
				})
				return (
					[
						spotMarketId,
						...spotVenueMarketIds,
						...derivativeMarketIds,
					]
						.map((marketId) => ({
							[EntityMetaKey.Id]: marketId,
						}))
						.slice(0, lim)
				)
			}
			},
		})({
				fields: {
				$$marketsWithCoinAsBase: (coin) => coin,
			},
			}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Coin,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.Coin>, context) => {
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				if (idByCoinId[entityId.coinId] == null) {
					return []
				}
				const lim = resolverContextRowLimit(context)
				return (
					catalogSpotMarketsWithCoinAsQuote
						.filter((catalogMarket) => catalogMarket.quoteCoinId === entityId.coinId)
						.map((catalogMarket) => catalogMarket.marketId)
						.filter((marketId) => (
							idByCoinId[marketId.$base.$coin.coinId] != null
						))
						.slice(0, lim)
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
				$$marketsWithCoinAsQuote: (coin) => coin,
			},
			}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				return (
					Object.entries(idByCoinId)
						.filter(([coinId]) => coinId in coinById)
						.map(([coinId]) => (
							{
								[EntityMetaKey.Id]: {
									$market: catalogCoinUsdMarketIdByCoinId[coinId],
								},
							}
						))
				)
			}
			},
		})({
				fields: {
				$$marketPrices: (globalScope) => globalScope,
			},
			}),

		defineResolver(Source.Coingecko_OpenApi, {
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
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoinOhlc } = await import('$/sources/Coingecko/OpenApi/queries.ts')
				const coinId = entityId.$base.$coin.coinId
				if (idByCoinId[coinId] == null) throw new Error('Coingecko_OpenApi: OHLC coin not mapped')
				const coingeckoId = idByCoinId[coinId]
				const lim = resolverContextRowLimit(context)
				const candles = []
				for (const value of coingeckoOhlcDayWindowLengths) {
					const timeInterval = (
						{
							unit: MarketTimeIntervalUnit.Day,
							value,
						}
					)
					const ohlcCandles = await getCoinOhlc({
						publicEnv: context.publicEnv,
						coingeckoId,
						vsCurrency: 'usd',
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
				$$marketTimeIntervalTimestamps: (market) => market,
			},
			}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Currency,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				return (
					(
						entityId.iso4217 === Iso4217.USD ?
							catalogMarketsWithCurrencyAsQuoteUsd.filter((marketId) => (
								idByCoinId[marketId.$base.$coin.coinId] != null
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
				$$marketsWithCurrencyAsQuote: (currency) => currency,
			},
			}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Currency,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
				const markets = catalogSpotMarketsWithCurrencyAsBase
						.filter((catalogMarket) => catalogMarket.iso4217 === entityId.iso4217)
						.map((catalogMarket) => ({
							[EntityMetaKey.Id]: catalogMarket.marketId,
						}))
				if (markets.length === 0) {
					throw new Error(`Coingecko_OpenApi: no catalog markets with ${entityId.iso4217} as base`)
				}
				return markets
			}
			},
		})({
				fields: {
				$$marketsWithCurrencyAsBase: (currency) => currency,
			},
			}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.MarketPrice,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					return []
				}
				if (entityId.$market.$base.kind !== MarketAssetKind.Coin) {
					return []
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$market.$base.$coin.coinId]) !== stringify(entityId.$market)) {
					return []
				}
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoinMarketSpot } = await import('$/sources/Coingecko/OpenApi/queries.ts')
				const coinId = entityId.$market.$base.$coin.coinId
				const coingeckoId = idByCoinId[coinId]
				if (coingeckoId == null) throw new Error('Coingecko_OpenApi: coin price not mapped')
				const spot = await getCoinMarketSpot({
					publicEnv: context.publicEnv,
					coingeckoId,
				})
				if (spot == null) throw new Error('Coingecko_OpenApi: coin market spot not returned')
				return [
					{
						[EntityMetaKey.Id]: {
							$market: entityId.$market,
							timestampMs: spot.lastUpdatedAtSec * 1000,
						},
					},
				]
			}
			},
		})({
				fields: {
				$$quotes: (marketPrice) => marketPrice,
			},
			}),

		defineResolver(Source.Coingecko_OpenApi, {
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
				$parentMarket: (marketPrice) => marketPrice,
			},
			}),

		defineResolver(Source.Coingecko_OpenApi, {
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
				$parentMarket: (timestamp) => timestamp,
			},
			}),
	],
}

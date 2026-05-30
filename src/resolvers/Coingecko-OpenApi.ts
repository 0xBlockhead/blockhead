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
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
	type ResolverLoadSubset,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const coingeckoOpenApiDerivativeTickerForMarket = async (
	entityId: EntityId<typeof schema, EntityType.Market>,
	context: ResolverLoadSubset | undefined,
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
	const { getCoingeckoOpenApiDerivativesExchangeById } = await import(
		'$/sources/Coingecko/OpenApi/queries.ts'
	)
	const publicEnv = sourcePublicEnv(context, Source.Coingecko_OpenApi)
	const exchange = await getCoingeckoOpenApiDerivativesExchangeById({
		publicEnv,
		exchangeId,
	})
	const ticker = exchange?.tickers?.find((row) => (
		derivativeTickerMatchesMarket(
			entityId,
			row,
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

const derivativeTimestampFieldsFromTicker = (
	ticker: Awaited<ReturnType<typeof coingeckoOpenApiDerivativeTickerForMarket>>,
) => ({
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
})

/** Spot + OHLC via checked-in `coingecko-demo.json` (`GET /coins/{id}`, `/coins/{id}/ohlc`). */
export default {
	source: Source.Coingecko_OpenApi,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Market,
			resolve: async (entityId, context) => {
				if (entityId.marketKind === MarketKind.Spot) {
					return {}
				}
				const ticker = await coingeckoOpenApiDerivativeTickerForMarket(entityId, context)
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
						derivativeLastTradedAtMs: ticker.last_traded * 1000,
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Market_Derivative_Timestamp,
			resolve: async (entityId, context) => {
				if (entityId.$market.marketKind === MarketKind.Spot) {
					throw new Error('Coingecko_OpenApi: Market_Derivative_Timestamp is derivative-only')
				}
				return derivativeTimestampFieldsFromTicker(
					await coingeckoOpenApiDerivativeTickerForMarket(entityId.$market, context),
				)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Market_Timestamp,
			resolve: async (entityId, context) => {
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
				const { getCoingeckoOpenApiCoinMarketSpot } = await import('$/sources/Coingecko/OpenApi/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_OpenApi)
				const coinId = entityId.$market.$base.$coin.coinId
				const coingeckoId = idByCoinId[coinId]
				if (coingeckoId == null) throw new Error('Coingecko_OpenApi: coin price not mapped')

				const spot = await getCoingeckoOpenApiCoinMarketSpot({
					publicEnv,
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
					...(coingeckoId !== undefined && { providerAssetId: coingeckoId }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: async (entityId, context) => {
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
				const { getCoingeckoOpenApiCoinOhlc } = await import('$/sources/Coingecko/OpenApi/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_OpenApi)
				assertCoingeckoDayOhlcTimeInterval(entityId.timeInterval, 'Coingecko_OpenApi')
				const coinId = entityId.$market.$base.$coin.coinId
				const coingeckoId = idByCoinId[coinId]
				if (coingeckoId == null) throw new Error('Coingecko_OpenApi: OHLC coin not mapped')

				const rows = await getCoingeckoOpenApiCoinOhlc({
					publicEnv,
					coingeckoId,
					vsCurrency: 'usd',
					days: entityId.timeInterval.value,
				})
				const row = rows.find(([timestampMs]) => (
					Math.floor(timestampMs) === entityId.timestampMs
				))
				if (row == null) throw new Error('Coingecko_OpenApi: OHLC candle not found for timestamp')
				return (
					candleFromOhlc(
						entityId.$market,
						entityId.timeInterval,
						row,
					)
				)
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$marketTimeIntervalTimestamps',
			resolve: async () => {
				throw new Error('Coingecko_OpenApi: $$marketTimeIntervalTimestamps is not implemented')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Market,
			fieldName: '$$derivativeTimestamps',
			resolve: async (entityId, context) => {
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Market_Derivative_Timestamp,
			fieldName: '$$parentMarket',
			resolve: async (entityId) => ({
				[EntityMetaKey.Id]: entityId.$market,
			}),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$markets',
			resolve: async (_globalScopeEntityId, context) => {
				const { collectCoingeckoOpenApiDerivativeMarketEntityIds } = await import(
					'$/sources/Coingecko/OpenApi/queries.ts'
				)
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_OpenApi)
				const lim = resolverLoadSubsetRowLimit(context)
				const marketIds = await collectCoingeckoOpenApiDerivativeMarketEntityIds({
					publicEnv,
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.MarketVenue,
			fieldName: '$$markets',
			resolve: async (entityId, context) => {
				const { collectCoingeckoOpenApiDerivativeMarketEntityIds } = await import(
					'$/sources/Coingecko/OpenApi/queries.ts'
				)
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_OpenApi)
				const lim = resolverLoadSubsetRowLimit(context)
				const marketIds = await collectCoingeckoOpenApiDerivativeMarketEntityIds({
					publicEnv,
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsBase',
			resolve: async (entityId, context) => {
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
					collectCoingeckoOpenApiDerivativeMarketEntityIds,
					collectCoingeckoOpenApiSpotMarketEntityIdsForCoin,
				} = await import('$/sources/Coingecko/OpenApi/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_OpenApi)
				const lim = resolverLoadSubsetRowLimit(context)
				const spotVenueMarketIds = await collectCoingeckoOpenApiSpotMarketEntityIdsForCoin({
					publicEnv,
					catalogCoinId: entityId.coinId,
					coingeckoId,
				})
				const derivativeMarketIds = await collectCoingeckoOpenApiDerivativeMarketEntityIds({
					publicEnv,
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsQuote',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>, context) => {
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				if (idByCoinId[entityId.coinId] == null) {
					return []
				}
				const lim = resolverLoadSubsetRowLimit(context)
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$marketPrices',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Market,
			fieldName: '$$marketTimeIntervalTimestamps',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market>, context) => {
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
				const { getCoingeckoOpenApiCoinOhlc } = await import('$/sources/Coingecko/OpenApi/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_OpenApi)
				const coinId = entityId.$base.$coin.coinId
				if (idByCoinId[coinId] == null) throw new Error('Coingecko_OpenApi: OHLC coin not mapped')
				const coingeckoId = idByCoinId[coinId]
				if (coingeckoId == null) throw new Error('Coingecko_OpenApi: OHLC coin not mapped')
				const lim = resolverLoadSubsetRowLimit(context)
				const candles = []
				for (const value of coingeckoOhlcDayWindowLengths) {
					const timeInterval = (
						{
							unit: MarketTimeIntervalUnit.Day,
							value,
						}
					)
					const rows = await getCoingeckoOpenApiCoinOhlc({
						publicEnv,
						coingeckoId,
						vsCurrency: 'usd',
						days: value,
					})
					candles.push(
						...candlesFromOhlc(
							entityId,
							timeInterval,
							rows,
						),
					)
				}
				return (
					candles.slice(0, lim)
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Currency,
			fieldName: '$$marketsWithCurrencyAsQuote',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
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
					throw new Error(`Coingecko_OpenApi: no catalog markets with ${entityId.iso4217} as base`)
				}
				return markets
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.MarketPrice,
			fieldName: '$$quotes',
			resolve: async (entityId, context) => {
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
				const { getCoingeckoOpenApiCoinMarketSpot } = await import('$/sources/Coingecko/OpenApi/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_OpenApi)
				const coinId = entityId.$market.$base.$coin.coinId
				const coingeckoId = idByCoinId[coinId]
				if (coingeckoId == null) throw new Error('Coingecko_OpenApi: coin price not mapped')
				const spot = await getCoingeckoOpenApiCoinMarketSpot({ publicEnv, coingeckoId })
				if (spot == null) throw new Error('Coingecko_OpenApi: coin market spot not returned')
				return [
					{
						[EntityMetaKey.Id]: {
							$market: entityId.$market,
							timestampMs: spot.lastUpdatedAtSec * 1000,
						},
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.MarketPrice,
			fieldName: '$$parentMarket',
			resolve: async (entityId: EntityId<typeof schema, EntityType.MarketPrice>) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
				}
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Market_TimeInterval_Timestamp,
			fieldName: '$$parentMarket',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market_TimeInterval_Timestamp>) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
				}
			),
		}),
	],
}

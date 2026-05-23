import type { CoinId } from '$/constants/Coin.ts'
import {
	MarketAssetKind,
	MarketKind,
	MarketTimeIntervalUnit,
	coingeckoOhlcDayWindowLengths,
} from '$/constants/Market.ts'
import {
	catalogMarketsWithCurrencyAsBase,
	catalogMarketsWithCurrencyAsQuote,
	usdCurrencyMarketAssetLeg,
} from '$/constants/Currency.ts'
import {
	assertCoingeckoDayOhlcTimeInterval,
	candleEntitiesFromOhlcWireRows,
	candleEntityFromOhlcWireRow,
} from '$/lib/marketOhlcCandles.ts'
import { catalogCoinUsdMarketId } from '$/constants/MarketCatalog.ts'
import { marketTimestampFieldsFromObservation } from '$/resolvers/_marketSpotTimestamp.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

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
			entityType: EntityType.Market_Timestamp,
			resolve: async (entityId, context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('Coingecko_OpenApi: Market_Timestamp is spot-only')
				}
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoingeckoOpenApiCoinMarketSpot } = await import('$/sources/Coingecko/OpenApi/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_OpenApi)
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
						entityId.$market.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null) throw new Error('Coingecko_OpenApi: market base is not a catalog coin')
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

				return marketTimestampFieldsFromObservation({
					timestampMs,
					price: BigInt(Math.round(spot.usd * 1e8)),
					transport: 'coingecko-openapi-coins-id-market-data-usd-1e8',
					providerAssetId: coingeckoId,
				})
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: async (entityId, context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('Coingecko_OpenApi: OHLC is spot-only')
				}
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoingeckoOpenApiCoinOhlc } = await import('$/sources/Coingecko/OpenApi/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_OpenApi)
				assertCoingeckoDayOhlcTimeInterval(entityId.timeInterval, 'Coingecko_OpenApi')
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
						entityId.$market.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null) throw new Error('Coingecko_OpenApi: OHLC market base is not a catalog coin')
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
					candleEntityFromOhlcWireRow(
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
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsBase',
			resolve: async (entityId, context) => {
				const { stringify } = await import('devalue')
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				if (coinById[entityId.coinId as keyof typeof coinById] == null) {
					throw new Error(
						`Coingecko_OpenApi: $$marketsWithCoinAsBase unsupported for coin ${entityId.coinId}`,
					)
				}
				const spotMarketId = catalogCoinUsdMarketId(entityId.coinId)
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
				const [spotVenueMarketIds, derivativeMarketIds] = await Promise.all([
					collectCoingeckoOpenApiSpotMarketEntityIdsForCoin({
						publicEnv,
						catalogCoinId: entityId.coinId,
						coingeckoId,
					}),
					collectCoingeckoOpenApiDerivativeMarketEntityIds({
						publicEnv,
						catalogCoinId: entityId.coinId,
					}),
				])
				const seen = new Set<string>()
				return (
					[
						spotMarketId,
						...spotVenueMarketIds,
						...derivativeMarketIds,
					]
						.flatMap((marketId) => {
							const key = stringify(marketId)
							if (seen.has(key)) {
								return []
							}
							seen.add(key)
							return [
								{
									[EntityMetaKey.Id]: marketId,
								},
							]
						})
						.slice(0, lim)
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsQuote',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>, context) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { catalogMarketsWithCoinAsQuote } = await import('$/constants/MarketCatalog.ts')
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				if (coinById[entityId.coinId as keyof typeof coinById] == null) {
					throw new Error(
						`Coingecko_OpenApi: $$marketsWithCoinAsQuote unsupported for coin ${entityId.coinId}`,
					)
				}
				if (idByCoinId[entityId.coinId] == null) {
					return []
				}
				const lim = resolverLoadSubsetRowLimit(context)
				return (
					catalogMarketsWithCoinAsQuote(
						entityId.coinId,
						(baseCoinId) => idByCoinId[baseCoinId] != null,
					)
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
						.filter(([coinId]) => coinById[coinId as keyof typeof coinById] != null)
						.map(([coinId]) => (
							{
								[EntityMetaKey.Id]: {
									$market: catalogCoinUsdMarketId(coinId),
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
					throw new Error('Coingecko_OpenApi: OHLC is spot-only')
				}
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoingeckoOpenApiCoinOhlc } = await import('$/sources/Coingecko/OpenApi/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_OpenApi)
				const coinId = (
					entityId.$base.kind === MarketAssetKind.Coin ?
						entityId.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null) throw new Error('Coingecko_OpenApi: OHLC market base is not a catalog coin')
				if (idByCoinId[coinId] == null) throw new Error('Coingecko_OpenApi: OHLC coin not mapped')
				const coingeckoId = idByCoinId[coinId]
				if (coingeckoId == null) throw new Error('Coingecko_OpenApi: OHLC coin not mapped')
				const lim = resolverLoadSubsetRowLimit(context)
				const candles = (
					(
						await Promise.all(
							[...coingeckoOhlcDayWindowLengths].map(async (value) => {
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
								return (
									candleEntitiesFromOhlcWireRows(
										entityId,
										timeInterval,
										rows,
									)
								)
							}),
						)
					).flat()
				)
				return (
					candles
						.toSorted((left, right) => (
							left[EntityMetaKey.Id].timestampMs < right[EntityMetaKey.Id].timestampMs ?
								1
							: left[EntityMetaKey.Id].timestampMs > right[EntityMetaKey.Id].timestampMs ?
								-1
							:
								0
						))
						.slice(0, lim)
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Currency,
			fieldName: '$$marketsWithCurrencyAsQuote',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				return (
					catalogMarketsWithCurrencyAsQuote(
						entityId.iso4217,
						(coinId) => (
							coinById[coinId as keyof typeof coinById] != null
							&& idByCoinId[coinId] != null
						),
					).map((marketId) => (
						{
							[EntityMetaKey.Id]: marketId,
						}
					))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Currency,
			fieldName: '$$marketsWithCurrencyAsBase',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
				const markets = catalogMarketsWithCurrencyAsBase(entityId.iso4217).map((marketId) => (
					{
						[EntityMetaKey.Id]: marketId,
					}
				))
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
					throw new Error('Coingecko_OpenApi: MarketPrice $$quotes is spot-only')
				}
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoingeckoOpenApiCoinMarketSpot } = await import('$/sources/Coingecko/OpenApi/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_OpenApi)
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
						entityId.$market.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null) throw new Error('Coingecko_OpenApi: market base is not a catalog coin')
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

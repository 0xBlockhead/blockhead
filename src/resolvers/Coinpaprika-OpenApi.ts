import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import type { CoinId } from '$/constants/Coin.ts'
import {
	MarketAssetKind,
	MarketKind,
	MarketTimeIntervalUnit,
} from '$/constants/Market.ts'
import { Iso4217 } from '$/constants/Currency.ts'
import {
	catalogCoinUsdMarketIdByCoinId,
	catalogSpotMarketsWithCoinAsQuote,
	catalogSpotMarketsWithCurrencyAsBase,
	catalogMarketsWithCurrencyAsQuoteUsd,
} from '$/constants/MarketCatalog.ts'
import {
	candlesFromOhlc,
	candleFromOhlc,
} from '$/lib/marketOhlcCandles.ts'
import { stringify } from 'devalue'
import { mediaFromUrl } from '$/lib/media.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { MediaType } from '$/schema/Media.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.Coinpaprika_OpenApi,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Coin,
			resolve: async (entityId, context) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const {
					idByCoinId,
					decimalsByCoinId,
				} = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				const { getCoinById } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coinpaprika_OpenApi)
				const coinpaprikaId = idByCoinId[entityId.coinId]
				if (coinpaprikaId == null) throw new Error('Coinpaprika_OpenApi: coin not mapped')

				const coin = await getCoinById({
					publicEnv,
					coinpaprikaId,
				})

				const decimals = decimalsByCoinId[entityId.coinId]
				const logoMedia = mediaFromUrl(coin.logo, MediaType.Image)
				const coinName = coin.name?.trim() ?? ''
				const coinSymbol = coin.symbol?.trim() ?? ''

				return {
					...(coinName !== '' && { name: coinName }),
					...(coinSymbol !== '' && { symbol: coinSymbol.toUpperCase() }),
					...(coinSymbol === '' && {
						symbol: coinById[entityId.coinId].symbol,
					}),
					...(decimals != null && { decimals }),
					...(logoMedia != null && { $logo: logoMedia }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Market_Timestamp,
			resolve: async (entityId, context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('Coinpaprika_OpenApi: Market_Timestamp is spot-only')
				}
				if (entityId.$market.$base.kind !== MarketAssetKind.Coin) {
					throw new Error('Market source: market base must be catalog coin')
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$market.$base.$coin.coinId]) !== stringify(entityId.$market)) {
					throw new Error('Coinpaprika_OpenApi: Market_Timestamp is catalog coin USD market only')
				}
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				const { getTickerById } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coinpaprika_OpenApi)
				const coinId: CoinId = entityId.$market.$base.$coin.coinId
				const coinpaprikaId = idByCoinId[coinId]
				if (coinpaprikaId == null) throw new Error('Coinpaprika_OpenApi: coin price not mapped')

				const ticker = await getTickerById({
					publicEnv,
					coinpaprikaId,
				})
				const price = ticker.quotes?.USD?.price
				const updatedAtMs = (
					ticker.last_updated == null || ticker.last_updated === '' ?
						NaN
					:
						Date.parse(ticker.last_updated)
				)

				if (price == null || !Number.isFinite(price) || !Number.isFinite(updatedAtMs)) {
					throw new Error('Coinpaprika_OpenApi: ticker invalid')
				}
				const timestampMs = updatedAtMs
				if (entityId.timestampMs !== timestampMs) {
					throw new Error('Coinpaprika_OpenApi: Market_Timestamp id does not match ticker clock')
				}

				return {
					price: BigInt(Math.round((price ?? 0) * 1e8)),
					transport: 'coinpaprika-usd-1e8',
					...(coinpaprikaId !== undefined && { providerAssetId: coinpaprikaId }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: async (entityId, context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('Coinpaprika_OpenApi: OHLC is spot-only')
				}
				if (entityId.$market.$base.kind !== MarketAssetKind.Coin) {
					throw new Error('Market source: market base must be catalog coin')
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$market.$base.$coin.coinId]) !== stringify(entityId.$market)) {
					throw new Error('Coinpaprika_OpenApi: OHLC is catalog coin USD market only')
				}
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				const {
					getOhlcDayWindowValues,
					getOhlcvHistoricalRows,
					getOhlcvTodayRows,
				} = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coinpaprika_OpenApi)
				if (entityId.timeInterval.unit !== MarketTimeIntervalUnit.Day) {
					throw new Error('Coinpaprika_OpenApi: OHLC timeInterval must be day-based')
				}
				const ohlcDayWindows = getOhlcDayWindowValues(publicEnv)
				if (!ohlcDayWindows.includes(entityId.timeInterval.value)) {
					throw new Error('Coinpaprika_OpenApi: OHLC day window not supported for current API plan')
				}
				const coinId = entityId.$market.$base.$coin.coinId
				const coinpaprikaId = idByCoinId[coinId]
				if (coinpaprikaId == null) throw new Error('Coinpaprika_OpenApi: OHLC coin not mapped')

				const ohlcCandles = (
					entityId.timeInterval.value === 1 ?
						await getOhlcvTodayRows({
							publicEnv,
							coinpaprikaId,
						})
					:
						await getOhlcvHistoricalRows({
							publicEnv,
							coinpaprikaId,
							days: entityId.timeInterval.value,
						})
				)
				const ohlcCandle = ohlcCandles.find(([timestampMs]) => (
					Math.floor(timestampMs) === entityId.timestampMs
				))
				if (ohlcCandle == null) throw new Error('Coinpaprika_OpenApi: OHLC candle not found for timestamp')
				return (
					candleFromOhlc(
						entityId.$market,
						entityId.timeInterval,
					ohlcCandle,
					)
				)
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$coins',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { coinpaprikaCatalogCoinIds } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				return (
					coinpaprikaCatalogCoinIds
						.filter((coinId) => coinId in coinById)
						.map((coinId) => (
							{
								[EntityMetaKey.Id]: {
									coinId,
								},
							}
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$markets',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				return (
					Object.entries(idByCoinId)
						.filter(([coinId]) => coinId in coinById)
						.map(([coinId]) => (
							{
								[EntityMetaKey.Id]: catalogCoinUsdMarketIdByCoinId[coinId],
							}
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$marketTimeIntervalTimestamps',
			resolve: async () => {
				throw new Error('Coinpaprika_OpenApi: $$marketTimeIntervalTimestamps is not implemented')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$marketPrices',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
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
			entityType: EntityType.MarketVenue,
			fieldName: '$$markets',
			resolve: async (entityId, context) => {
				const { collectMarketEntityIdsForExchange } = await import(
					'$/sources/Coinpaprika/OpenApi/queries.ts'
				)
				const publicEnv = sourcePublicEnv(context, Source.Coinpaprika_OpenApi)
				const lim = resolverLoadSubsetRowLimit(context)
				const marketIds = await collectMarketEntityIdsForExchange({
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
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>, context) => {
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				const { collectMarketEntityIdsForCoin } = await import(
					'$/sources/Coinpaprika/OpenApi/queries.ts'
				)
				const coinpaprikaId = idByCoinId[entityId.coinId]
				if (coinpaprikaId == null) {
					throw new Error(`Coinpaprika_OpenApi: $$marketsWithCoinAsBase unsupported for coin ${entityId.coinId}`)
				}
				const publicEnv = sourcePublicEnv(context, Source.Coinpaprika_OpenApi)
				const lim = resolverLoadSubsetRowLimit(context)
				const venueMarketIds = await collectMarketEntityIdsForCoin({
					publicEnv,
					catalogCoinId: entityId.coinId,
					coinpaprikaId,
				})
				return (
					[
						catalogCoinUsdMarketIdByCoinId[entityId.coinId],
						...venueMarketIds,
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
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
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
			entityType: EntityType.Currency,
			fieldName: '$$marketsWithCurrencyAsQuote',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
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
					throw new Error(`Coinpaprika_OpenApi: no catalog markets with ${entityId.iso4217} as base`)
				}
				return markets
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
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				const {
					getOhlcDayWindowValues,
					getOhlcvHistoricalRows,
					getOhlcvTodayRows,
				} = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
				const coinId = entityId.$base.$coin.coinId
				if (idByCoinId[coinId] == null) throw new Error('Coinpaprika_OpenApi: OHLC coin not mapped')
				const publicEnv = sourcePublicEnv(context, Source.Coinpaprika_OpenApi)
				const ohlcDayWindows = getOhlcDayWindowValues(publicEnv)
				const coinpaprikaId = idByCoinId[coinId]
				if (coinpaprikaId == null) throw new Error('Coinpaprika_OpenApi: OHLC coin not mapped')
				const lim = resolverLoadSubsetRowLimit(context)
				const candles = []
				for (const value of ohlcDayWindows) {
					const timeInterval = (
						{
							unit: MarketTimeIntervalUnit.Day,
							value,
						}
					)
					const ohlcCandles = (
						value === 1 ?
							await getOhlcvTodayRows({
								publicEnv,
								coinpaprikaId,
							})
						:
							await getOhlcvHistoricalRows({
								publicEnv,
								coinpaprikaId,
								days: value,
							})
					)
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
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				const { getTickerById } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coinpaprika_OpenApi)
				const coinId = entityId.$market.$base.$coin.coinId
				const coinpaprikaId = idByCoinId[coinId]
				if (coinpaprikaId == null) throw new Error('Coinpaprika_OpenApi: coin price not mapped')
				const ticker = await getTickerById({ publicEnv, coinpaprikaId })
				const updatedAtMs = (
					ticker.last_updated == null || ticker.last_updated === '' ?
						NaN
					:
						Date.parse(ticker.last_updated)
				)
				if (!Number.isFinite(updatedAtMs)) {
					throw new Error('Coinpaprika_OpenApi: ticker invalid')
				}
				return [
					{
						[EntityMetaKey.Id]: {
							$market: entityId.$market,
							timestampMs: updatedAtMs,
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

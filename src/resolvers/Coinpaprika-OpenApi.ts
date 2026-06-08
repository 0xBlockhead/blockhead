import {
	defineResolver,
	resolverContextRowLimit,
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
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { MediaType } from '$/schema/Media.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.Coinpaprika_OpenApi,

	resolvers: [
		defineResolver({
			entityType: EntityType.Coin,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const {
					idByCoinId,
					decimalsByCoinId,
				} = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				const { getCoinById } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
				const coinpaprikaId = idByCoinId[entityId.coinId]
				if (coinpaprikaId == null) throw new Error('Coinpaprika_OpenApi: coin not mapped')

				const coin = await getCoinById({
					publicEnv: context.publicEnv,
					coinpaprikaId,
				})

				const decimals = decimalsByCoinId[entityId.coinId]
				const logoMedia = mediaFromUrl(coin.logo, MediaType.Image)
				const coinName = coin.name ?? ''
				const coinSymbol = coin.symbol ?? ''

				return {
					...(coinName !== '' && { name: coinName }),
					...(coinSymbol !== '' && { symbol: coinSymbol.toUpperCase() }),
					...(coinSymbol === '' && {
						symbol: coinById[entityId.coinId].symbol,
					}),
					...(decimals != null && { decimals }),
					...(logoMedia != null && { $logo: logoMedia }),
				}
			}
			},
			fields: {
				name: (coin) => coin.name,
				symbol: (coin) => coin.symbol,
				decimals: (coin) => coin.decimals,
				$logo: (coin) => coin.$logo,
			},
		}),

		defineResolver({
			entityType: EntityType.Market_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
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
				const coinId: CoinId = entityId.$market.$base.$coin.coinId
				const coinpaprikaId = idByCoinId[coinId]
				if (coinpaprikaId == null) throw new Error('Coinpaprika_OpenApi: coin price not mapped')

				const ticker = await getTickerById({
					publicEnv: context.publicEnv,
					coinpaprikaId,
				})
				const price = ticker.quotes?.USD.price
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
					price: BigInt(Math.round((price ) * 1e8)),
					transport: 'coinpaprika-usd-1e8',
					providerAssetId: coinpaprikaId,
				}
			}
			},
			fields: {
				price: (timestamp) => timestamp.price,
				transport: (timestamp) => timestamp.transport,
				providerAssetId: (timestamp) => timestamp.providerAssetId,
			},
		}),

		defineResolver({
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
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
				if (entityId.timeInterval.unit !== MarketTimeIntervalUnit.Day) {
					throw new Error('Coinpaprika_OpenApi: OHLC timeInterval must be day-based')
				}
				const ohlcDayWindows = getOhlcDayWindowValues(context.publicEnv)
				if (!ohlcDayWindows.includes(entityId.timeInterval.value)) {
					throw new Error('Coinpaprika_OpenApi: OHLC day window not supported for current API plan')
				}
				const coinId = entityId.$market.$base.$coin.coinId
				const coinpaprikaId = idByCoinId[coinId]
				if (coinpaprikaId == null) throw new Error('Coinpaprika_OpenApi: OHLC coin not mapped')

				const ohlcCandles = (
					entityId.timeInterval.value === 1 ?
						await getOhlcvTodayRows({
							publicEnv: context.publicEnv,
							coinpaprikaId,
						})
					:
						await getOhlcvHistoricalRows({
							publicEnv: context.publicEnv,
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
			}
			},
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
		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
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
			}
			},
			fields: {
				$$coins: (globalScope) => globalScope,
			},
		}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
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
			}
			},
			fields: {
				$$markets: (globalScope) => globalScope,
			},
		}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async () => {
				throw new Error('Coinpaprika_OpenApi: $$marketTimeIntervalTimestamps is not implemented')
			}
			},
			fields: {
				$$marketTimeIntervalTimestamps: (globalScope) => globalScope,
			},
		}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
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
			}
			},
			fields: {
				$$marketPrices: (globalScope) => globalScope,
			},
		}),

		defineResolver({
			entityType: EntityType.MarketVenue,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { collectMarketEntityIdsForExchange } = await import(
					'$/sources/Coinpaprika/OpenApi/queries.ts'
				)
				const lim = resolverContextRowLimit(context)
				const marketIds = await collectMarketEntityIdsForExchange({
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
			fields: {
				$$markets: (marketVenue) => marketVenue,
			},
		}),

		defineResolver({
			entityType: EntityType.Coin,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.Coin>, context) => {
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				const { collectMarketEntityIdsForCoin } = await import(
					'$/sources/Coinpaprika/OpenApi/queries.ts'
				)
				const coinpaprikaId = idByCoinId[entityId.coinId]
				if (coinpaprikaId == null) {
					throw new Error(`Coinpaprika_OpenApi: $$marketsWithCoinAsBase unsupported for coin ${entityId.coinId}`)
				}
				const lim = resolverContextRowLimit(context)
				const venueMarketIds = await collectMarketEntityIdsForCoin({
					publicEnv: context.publicEnv,
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
			}
			},
			fields: {
				$$marketsWithCoinAsBase: (coin) => coin,
			},
		}),

		defineResolver({
			entityType: EntityType.Coin,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.Coin>, context) => {
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
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
			fields: {
				$$marketsWithCoinAsQuote: (coin) => coin,
			},
		}),

		defineResolver({
			entityType: EntityType.Currency,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
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
			}
			},
			fields: {
				$$marketsWithCurrencyAsQuote: (currency) => currency,
			},
		}),

		defineResolver({
			entityType: EntityType.Currency,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
				const markets = catalogSpotMarketsWithCurrencyAsBase
						.filter((catalogMarket) => catalogMarket.iso4217 === entityId.iso4217)
						.map((catalogMarket) => ({
							[EntityMetaKey.Id]: catalogMarket.marketId,
						}))
				if (markets.length === 0) {
					throw new Error(`Coinpaprika_OpenApi: no catalog markets with ${entityId.iso4217} as base`)
				}
				return markets
			}
			},
			fields: {
				$$marketsWithCurrencyAsBase: (currency) => currency,
			},
		}),

		defineResolver({
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
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				const {
					getOhlcDayWindowValues,
					getOhlcvHistoricalRows,
					getOhlcvTodayRows,
				} = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
				const coinId = entityId.$base.$coin.coinId
				if (idByCoinId[coinId] == null) throw new Error('Coinpaprika_OpenApi: OHLC coin not mapped')
				const ohlcDayWindows = getOhlcDayWindowValues(context.publicEnv)
				const coinpaprikaId = idByCoinId[coinId]
				const lim = resolverContextRowLimit(context)
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
								publicEnv: context.publicEnv,
								coinpaprikaId,
							})
						:
							await getOhlcvHistoricalRows({
								publicEnv: context.publicEnv,
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
			}
			},
			fields: {
				$$marketTimeIntervalTimestamps: (market) => market,
			},
		}),

		defineResolver({
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
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				const { getTickerById } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
				const coinId = entityId.$market.$base.$coin.coinId
				const coinpaprikaId = idByCoinId[coinId]
				if (coinpaprikaId == null) throw new Error('Coinpaprika_OpenApi: coin price not mapped')
				const ticker = await getTickerById({
					publicEnv: context.publicEnv,
					coinpaprikaId,
				})
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
			}
			},
			fields: {
				$$quotes: (marketPrice) => marketPrice,
			},
		}),

		defineResolver({
			entityType: EntityType.MarketPrice,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.MarketPrice>) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
				}
			)
			},
			fields: {
				$parentMarket: (marketPrice) => marketPrice,
			},
		}),

		defineResolver({
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.Market_TimeInterval_Timestamp>) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
				}
			)
			},
			fields: {
				$parentMarket: (timestamp) => timestamp,
			},
		}),
	],
}

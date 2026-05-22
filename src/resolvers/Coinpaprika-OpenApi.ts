import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import type { CoinId } from '$/constants/Coin.ts'
import {
	MarketAssetKind,
	MarketTimeIntervalUnit,
} from '$/constants/Market.ts'
import {
	catalogMarketsWithCurrencyAsBase,
	catalogMarketsWithCurrencyAsQuote,
	usdCurrencyMarketAssetLeg,
} from '$/constants/Currency.ts'
import {
	candleEntitiesFromOhlcWireRows,
	candleEntityFromOhlcWireRow,
} from '$/lib/marketOhlcCandles.ts'
import { catalogCoinUsdMarketId } from '$/constants/MarketCatalog.ts'
import { marketTimestampFieldsFromObservation } from '$/resolvers/_marketSpotTimestamp.ts'
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
				const { getCoinpaprikaCoinById } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coinpaprika_OpenApi)
				const coinpaprikaId = idByCoinId[entityId.coinId]
				if (coinpaprikaId == null) throw new Error('Coinpaprika_OpenApi: coin not mapped')

				const coin = await getCoinpaprikaCoinById({
					publicEnv,
					coinpaprikaId,
				})

				const decimals = decimalsByCoinId[entityId.coinId]
				const logoMedia = mediaFromUrl(coin.logo, MediaType.Image)

				return {
					...(coin.name.trim() !== '' && { name: coin.name.trim() }),
					...(coin.symbol.trim() !== '' && { symbol: coin.symbol.trim().toUpperCase() }),
					...(coin.symbol.trim() === '' && coinById[entityId.coinId] != null && {
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
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				const { getCoinpaprikaTickerById } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coinpaprika_OpenApi)
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
						entityId.$market.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null) throw new Error('Coinpaprika_OpenApi: market base is not a catalog coin')
				const coinpaprikaId = idByCoinId[coinId]
				if (coinpaprikaId == null) throw new Error('Coinpaprika_OpenApi: coin price not mapped')

				const ticker = await getCoinpaprikaTickerById({
					publicEnv,
					coinpaprikaId,
				})
				const price = ticker.quotes?.USD?.price
				const updatedAtMs = (
					ticker.last_updated == null || ticker.last_updated === '' ?
						NaN
					:	Date.parse(ticker.last_updated)
				)

				if (price == null || !Number.isFinite(price) || !Number.isFinite(updatedAtMs)) {
					throw new Error('Coinpaprika_OpenApi: ticker invalid')
				}
				const timestampMs = updatedAtMs
				if (entityId.timestampMs !== timestampMs) {
					throw new Error('Coinpaprika_OpenApi: Market_Timestamp id does not match ticker clock')
				}

				return marketTimestampFieldsFromObservation({
					timestampMs,
					price: BigInt(Math.round(price * 1e8)),
					transport: 'coinpaprika-usd-1e8',
					providerAssetId: coinpaprikaId,
				})
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: async (entityId, context) => {
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				const {
					coinpaprikaOhlcDayWindowValues,
					getCoinpaprikaOhlcvHistoricalCoingeckoShape,
					getCoinpaprikaOhlcvTodayCoingeckoShape,
				} = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coinpaprika_OpenApi)
				if (entityId.timeInterval.unit !== MarketTimeIntervalUnit.Day) {
					throw new Error('Coinpaprika_OpenApi: OHLC timeInterval must be day-based')
				}
				const ohlcDayWindows = coinpaprikaOhlcDayWindowValues(publicEnv)
				if (!ohlcDayWindows.includes(entityId.timeInterval.value)) {
					throw new Error('Coinpaprika_OpenApi: OHLC day window not supported for current API plan')
				}
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
						entityId.$market.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null) throw new Error('Coinpaprika_OpenApi: OHLC market base is not a catalog coin')
				const coinpaprikaId = idByCoinId[coinId]
				if (coinpaprikaId == null) throw new Error('Coinpaprika_OpenApi: OHLC coin not mapped')

				const rows = (
					entityId.timeInterval.value === 1 ?
						await getCoinpaprikaOhlcvTodayCoingeckoShape({
							publicEnv,
							coinpaprikaId,
						})
					:	await getCoinpaprikaOhlcvHistoricalCoingeckoShape({
							publicEnv,
							coinpaprikaId,
							days: entityId.timeInterval.value,
						})
				)
				const row = rows.find(([timestampMs]) => (
					Math.floor(timestampMs) === entityId.timestampMs
				))
				if (row == null) throw new Error('Coinpaprika_OpenApi: OHLC candle not found for timestamp')
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
			fieldName: '$$coins',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				return (
					Object.entries(idByCoinId)
						.filter(([coinId]) => coinById[coinId as keyof typeof coinById] != null)
						.map(([coinId]) => (
							{
								[EntityMetaKey.Id]: {
									coinId: coinId as CoinId,
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
						.filter(([coinId]) => coinById[coinId as keyof typeof coinById] != null)
						.map(([coinId]) => (
							{
								[EntityMetaKey.Id]: catalogCoinUsdMarketId(coinId),
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
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsBase',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>, context) => {
				const { stringify } = await import('devalue')
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				const { collectCoinpaprikaMarketEntityIdsForCoin } = await import(
					'$/sources/Coinpaprika/OpenApi/queries.ts'
				)
				const coinpaprikaId = idByCoinId[entityId.coinId]
				if (coinpaprikaId == null) {
					throw new Error(`Coinpaprika_OpenApi: $$marketsWithCoinAsBase unsupported for coin ${entityId.coinId}`)
				}
				const publicEnv = sourcePublicEnv(context, Source.Coinpaprika_OpenApi)
				const lim = resolverLoadSubsetRowLimit(context)
				const venueMarketIds = await collectCoinpaprikaMarketEntityIdsForCoin({
					publicEnv,
					catalogCoinId: entityId.coinId,
					coinpaprikaId,
				})
				const seen = new Set<string>()
				return (
					[
						catalogCoinUsdMarketId(entityId.coinId),
						...venueMarketIds,
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
			resolve: async () => {
				throw new Error('Coinpaprika_OpenApi: $$marketsWithCoinAsQuote is not implemented')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Currency,
			fieldName: '$$marketsWithCurrencyAsQuote',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
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
					throw new Error(`Coinpaprika_OpenApi: no catalog markets with ${entityId.iso4217} as base`)
				}
				return markets
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Market,
			fieldName: '$$marketTimeIntervalTimestamps',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market>, context) => {
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				const {
					coinpaprikaOhlcDayWindowValues,
					getCoinpaprikaOhlcvHistoricalCoingeckoShape,
					getCoinpaprikaOhlcvTodayCoingeckoShape,
				} = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
				const coinId = (
					entityId.$base.kind === MarketAssetKind.Coin ?
						entityId.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null) throw new Error('Coinpaprika_OpenApi: OHLC market base is not a catalog coin')
				if (idByCoinId[coinId] == null) throw new Error('Coinpaprika_OpenApi: OHLC coin not mapped')
				const publicEnv = sourcePublicEnv(context, Source.Coinpaprika_OpenApi)
				const ohlcDayWindows = coinpaprikaOhlcDayWindowValues(publicEnv)
				const coinpaprikaId = idByCoinId[coinId]
				if (coinpaprikaId == null) throw new Error('Coinpaprika_OpenApi: OHLC coin not mapped')
				const lim = resolverLoadSubsetRowLimit(context)
				const candles = (
					(
						await Promise.all(
							ohlcDayWindows.map(async (value) => {
								const timeInterval = (
									{
										unit: MarketTimeIntervalUnit.Day,
										value,
									}
								)
								const rows = (
									value === 1 ?
										await getCoinpaprikaOhlcvTodayCoingeckoShape({
											publicEnv,
											coinpaprikaId,
										})
									:	await getCoinpaprikaOhlcvHistoricalCoingeckoShape({
											publicEnv,
											coinpaprikaId,
											days: value,
										})
								)
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
			entityType: EntityType.MarketPrice,
			fieldName: '$$quotes',
			resolve: async (entityId, context) => {
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				const { getCoinpaprikaTickerById } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coinpaprika_OpenApi)
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
						entityId.$market.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null) throw new Error('Coinpaprika_OpenApi: market base is not a catalog coin')
				const coinpaprikaId = idByCoinId[coinId]
				if (coinpaprikaId == null) throw new Error('Coinpaprika_OpenApi: coin price not mapped')
				const ticker = await getCoinpaprikaTickerById({ publicEnv, coinpaprikaId })
				const updatedAtMs = (
					ticker.last_updated == null || ticker.last_updated === '' ?
						NaN
					:	Date.parse(ticker.last_updated)
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

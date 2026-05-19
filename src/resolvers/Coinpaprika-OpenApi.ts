import {
	defineEntityFieldResolver,
	defineEntityResolver,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import type { CoinId } from '$/constants/Coin.ts'
import {
	MarketAssetKind,
	MarketPriceRangeType,
	MarketTimeIntervalUnit,
} from '$/constants/Market.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
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
			entityType: EntityType.MarketPrice,
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
				const updatedAtSec = updatedAtMs / 1000

				return {
					[EntityMetaKey.Id]: entityId,
					price: BigInt(Math.round(price * 1e8)),
					timestampNs: BigInt(updatedAtSec) * 1_000_000_000n,
					updatedAt: updatedAtSec * 1000,
					transport: 'coinpaprika-usd-1e8',
					providerAssetId: coinpaprikaId,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.MarketPriceRange,
			resolve: async (entityId, context) => {
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				const {
					coinpaprikaOhlcDayWindowValues,
					getCoinpaprikaOhlcvHistoricalCoingeckoShape,
					getCoinpaprikaOhlcvTodayCoingeckoShape,
				} = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coinpaprika_OpenApi)
				if (entityId.rangeType !== MarketPriceRangeType.OHLCCandles) {
					throw new Error('Coinpaprika_OpenApi: unsupported range type')
				}
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
				if (rows.length === 0) throw new Error('Coinpaprika_OpenApi: empty OHLC series')
				return {
					pointCount: rows.length,
					rangePayload: JSON.stringify(rows),
				}
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
								[EntityMetaKey.Id]: {
									$base: {
										kind: MarketAssetKind.Coin,
										$coin: { coinId: coinId as CoinId },
									},
									$quote: {
										kind: MarketAssetKind.Currency,
										iso4217: 'USD',
									},
									$marketVenue: {
										marketVenueId: MarketVenueId.SpotIndex,
									},
								} as const,
							}
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$marketPriceRanges',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>, context) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				const { coinpaprikaOhlcDayWindowValues } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coinpaprika_OpenApi)
				const ohlcDayWindows = coinpaprikaOhlcDayWindowValues(publicEnv)
				return (
					Object.entries(idByCoinId)
						.filter(([coinId]) => coinById[coinId as keyof typeof coinById] != null)
						.flatMap(
							([coinId]) => ohlcDayWindows.map((value) => (
								{
									[EntityMetaKey.Id]: {
										$market: {
											$base: {
												kind: MarketAssetKind.Coin,
												$coin: { coinId: coinId as CoinId },
											},
											$quote: {
												kind: MarketAssetKind.Currency,
												iso4217: 'USD',
											},
											$marketVenue: {
												marketVenueId: MarketVenueId.SpotIndex,
											},
										} as const,
										timeInterval: {
											unit: MarketTimeIntervalUnit.Day,
											value,
										},
										rangeType: MarketPriceRangeType.OHLCCandles,
									},
								}
							)),
						)
				)
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
									$market: {
										$base: {
											kind: MarketAssetKind.Coin,
											$coin: { coinId: coinId as CoinId },
										},
										$quote: {
											kind: MarketAssetKind.Currency,
											iso4217: 'USD',
										},
										$marketVenue: {
											marketVenueId: MarketVenueId.SpotIndex,
										},
									} as const,
								},
							}
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsBase',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>) => {
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				if (idByCoinId[entityId.coinId] == null) {
					throw new Error(`Coinpaprika_OpenApi: $$marketsWithCoinAsBase unsupported for coin ${entityId.coinId}`)
				}
				return (
					[
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
									marketVenueId: MarketVenueId.SpotIndex,
								},
							} as const,
						},
					]
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsQuote',
			resolve: async () => [],
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketPriceRanges',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>, context) => {
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				const { coinpaprikaOhlcDayWindowValues } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
				if (idByCoinId[entityId.coinId] == null) return []
				const ohlcDayWindows = coinpaprikaOhlcDayWindowValues(sourcePublicEnv(context, Source.Coinpaprika_OpenApi))
				return (
					ohlcDayWindows.map((value) => (
						{
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
										marketVenueId: MarketVenueId.SpotIndex,
									},
								} as const,
								timeInterval: {
									unit: MarketTimeIntervalUnit.Day,
									value,
								},
								rangeType: MarketPriceRangeType.OHLCCandles,
							},
						}
					))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketPrice',
			resolve: async (entityId) => {
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				if (idByCoinId[entityId.coinId] == null) return undefined
				return (
					{
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
									marketVenueId: MarketVenueId.SpotIndex,
								},
							} as const,
						},
					}
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Market,
			fieldName: '$$marketPriceRanges',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market>, context) => {
				const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
				const { coinpaprikaOhlcDayWindowValues } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
				const coinId = (
					entityId.$base.kind === MarketAssetKind.Coin ?
						entityId.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null || idByCoinId[coinId] == null) return []
				const ohlcDayWindows = coinpaprikaOhlcDayWindowValues(sourcePublicEnv(context, Source.Coinpaprika_OpenApi))
				return (
					ohlcDayWindows.map((value) => (
						{
							[EntityMetaKey.Id]: {
								$market: entityId,
								timeInterval: {
									unit: MarketTimeIntervalUnit.Day,
									value,
								},
								rangeType: MarketPriceRangeType.OHLCCandles,
							},
						}
					))
				)
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
			entityType: EntityType.MarketPriceRange,
			fieldName: '$$parentMarket',
			resolve: async (entityId: EntityId<typeof schema, EntityType.MarketPriceRange>) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
				}
			),
		}),
	],
}

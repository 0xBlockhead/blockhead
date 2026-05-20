import { CoinId } from '$/constants/Coin.ts'
import {
	MarketAssetKind,
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
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

/** Coin prices use `$/sources/Defillama/OpenApi` + checked-in `openapi.d.ts` (`GET /prices/current/{coins}`). */
export default {
	source: Source.Defillama_OpenApi,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Market_Timestamp,
			resolve: async (entityId) => {
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				const { getCurrentPrices } = await import('$/sources/Defillama/OpenApi/queries.ts')
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
						entityId.$market.$base.$coin.coinId
					:	undefined
				)
				const llamaId = (
					entityId.feedKey?.trim() ?
						entityId.feedKey.trim()
					: coinId != null ?
						defillamaCurrentPriceIdByCoinId[coinId]
					:
						undefined
				)
				if (llamaId == null) throw new Error('Defillama_OpenApi: no price id')
				const priceRow = (await getCurrentPrices([llamaId])).coins[llamaId]
				if (priceRow == null) throw new Error('Defillama_OpenApi: price row missing')
				const timestampMs = priceRow.timestamp * 1000
				if (entityId.timestampMs !== timestampMs) {
					throw new Error('Defillama_OpenApi: Market_Timestamp id does not match price clock')
				}
				return marketTimestampFieldsFromObservation({
					timestampMs,
					price: BigInt(Math.round(priceRow.price * 1e8)),
					transport: 'defillama-usd-1e8',
					providerAssetId: llamaId,
				})
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: async (entityId, _context) => {
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				const { getDefillamaChartOhlcRowsCoingeckoShape } = await import('$/sources/Defillama/OpenApi/queries.ts')
				assertCoingeckoDayOhlcTimeInterval(entityId.timeInterval, 'Defillama_OpenApi')
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
						entityId.$market.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null) throw new Error('Defillama_OpenApi: OHLC market base is not a catalog coin')
				const llamaId = defillamaCurrentPriceIdByCoinId[coinId]
				if (llamaId == null) throw new Error('Defillama_OpenApi: OHLC coin not mapped')
				const rows = await getDefillamaChartOhlcRowsCoingeckoShape({
					llamaCoinId: llamaId,
					days: entityId.timeInterval.value,
				})
				const row = rows.find(([timestampMs]) => (
					Math.floor(timestampMs) === entityId.timestampMs
				))
				if (row == null) throw new Error('Defillama_OpenApi: OHLC candle not found for timestamp')
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
			fieldName: '$$markets',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				return (
					Object.values(CoinId)
						.flatMap((coinId) => (
							defillamaCurrentPriceIdByCoinId[coinId] != null ?
								[
									{
										[EntityMetaKey.Id]: catalogCoinUsdMarketId(coinId),
									},
								]
							:
								[]
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$marketTimeIntervalTimestamps',
			resolve: async () => [],
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$marketPrices',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				return (
					Object.values(CoinId)
						.flatMap((coinId) => (
							defillamaCurrentPriceIdByCoinId[coinId] != null ?
								[
									{
										[EntityMetaKey.Id]: {
											$market: catalogCoinUsdMarketId(coinId),
										},
									},
								]
							:
								[]
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsBase',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>) => {
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				return (
					defillamaCurrentPriceIdByCoinId[entityId.coinId] != null ?
						[
							{
								[EntityMetaKey.Id]: catalogCoinUsdMarketId(entityId.coinId),
							},
						]
					:
						[]
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsQuote',
			resolve: async () => [],
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Currency,
			fieldName: '$$marketsWithCurrencyAsQuote',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				return (
					catalogMarketsWithCurrencyAsQuote(
						entityId.iso4217,
						(coinId) => (
							coinById[coinId as keyof typeof coinById] != null
							&& defillamaCurrentPriceIdByCoinId[coinId] != null
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
			resolve: async (entityId: EntityId<typeof schema, EntityType.Currency>) => (
				catalogMarketsWithCurrencyAsBase(entityId.iso4217).map((marketId) => (
					{
						[EntityMetaKey.Id]: marketId,
					}
				))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Market,
			fieldName: '$$marketTimeIntervalTimestamps',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market>, context) => {
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				const { getDefillamaChartOhlcRowsCoingeckoShape } = await import('$/sources/Defillama/OpenApi/queries.ts')
				const coinId = (
					entityId.$base.kind === MarketAssetKind.Coin ?
						entityId.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null || defillamaCurrentPriceIdByCoinId[coinId] == null) return []
				const llamaId = defillamaCurrentPriceIdByCoinId[coinId]
				if (llamaId == null) throw new Error('Defillama_OpenApi: OHLC coin not mapped')
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
								const rows = await getDefillamaChartOhlcRowsCoingeckoShape({
									llamaCoinId: llamaId,
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
			entityType: EntityType.MarketPrice,
			fieldName: '$$quotes',
			resolve: async (entityId) => {
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				const { getCurrentPrices } = await import('$/sources/Defillama/OpenApi/queries.ts')
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
						entityId.$market.$base.$coin.coinId
					:	undefined
				)
				const llamaId = (
					entityId.feedKey?.trim() ?
						entityId.feedKey.trim()
					: entityId.$network != null ?
						(
							coinId === CoinId.ETH && entityId.$network.chainId === 1 ?
								defillamaCurrentPriceIdByCoinId[CoinId.ETH]
							:
								undefined
						)
					: coinId != null ?
						defillamaCurrentPriceIdByCoinId[coinId]
					:
						undefined
				)
				if (llamaId == null) return []
				const priceRow = (await getCurrentPrices([llamaId])).coins[llamaId]
				if (priceRow == null) return []
				return [
					{
						[EntityMetaKey.Id]: {
							$market: entityId.$market,
							timestampMs: priceRow.timestamp * 1000,
							...(llamaId != null && llamaId !== '' && { feedKey: llamaId }),
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

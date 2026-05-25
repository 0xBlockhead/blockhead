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
	catalogMarketsWithCoinAsQuoteByQuoteCoinId,
	catalogMarketsWithCurrencyAsBaseByIso4217,
	catalogMarketsWithCurrencyAsQuoteUsd,
} from '$/constants/MarketCatalog.ts'
import {
	assertCoingeckoDayOhlcTimeInterval,
	candleEntitiesFromOhlcWireRows,
	candleEntityFromOhlcWireRow,
} from '$/lib/marketOhlcCandles.ts'
import { stringify } from 'devalue'
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
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('Defillama_OpenApi: Market_Timestamp is spot-only')
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$market.$base.$coin.coinId]) !== stringify(entityId.$market)) {
					throw new Error('Defillama_OpenApi: Market_Timestamp is catalog coin USD market only')
				}
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				const { getCurrentPrices } = await import('$/sources/Defillama/OpenApi/queries.ts')
				const coinId = entityId.$market.$base.$coin.coinId
				const llamaId = (
					entityId.feedKey?.trim()
					?? defillamaCurrentPriceIdByCoinId[coinId]
				)
				if (llamaId == null) throw new Error('Defillama_OpenApi: no price id')
				const priceRow = (await getCurrentPrices([llamaId])).coins[llamaId]
				if (priceRow == null) throw new Error('Defillama_OpenApi: price row missing')
				const timestampMs = priceRow.timestamp * 1000
				if (entityId.timestampMs !== timestampMs) {
					throw new Error('Defillama_OpenApi: Market_Timestamp id does not match price clock')
				}
				return {
					price: BigInt(Math.round(priceRow.price * 1e8)),
					...('defillama-usd-1e8' && { transport: 'defillama-usd-1e8' }),
					...(llamaId !== undefined && { providerAssetId: llamaId }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: async (entityId, _context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('Defillama_OpenApi: OHLC is spot-only')
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$market.$base.$coin.coinId]) !== stringify(entityId.$market)) {
					throw new Error('Defillama_OpenApi: OHLC is catalog coin USD market only')
				}
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				const { getDefillamaChartOhlcRowsCoingeckoShape } = await import('$/sources/Defillama/OpenApi/queries.ts')
				assertCoingeckoDayOhlcTimeInterval(entityId.timeInterval, 'Defillama_OpenApi')
				const coinId = entityId.$market.$base.$coin.coinId
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
										[EntityMetaKey.Id]: catalogCoinUsdMarketIdByCoinId[coinId],
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
			resolve: async () => {
				throw new Error('Defillama_OpenApi: $$marketTimeIntervalTimestamps is not implemented')
			},
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
											$market: catalogCoinUsdMarketIdByCoinId[coinId],
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
								[EntityMetaKey.Id]: catalogCoinUsdMarketIdByCoinId[entityId.coinId],
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
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>) => {
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				if (defillamaCurrentPriceIdByCoinId[entityId.coinId] == null) {
					return []
				}
				return (
					catalogMarketsWithCoinAsQuoteByQuoteCoinId[entityId.coinId] ?? []
						.filter((marketId) => (
							defillamaCurrentPriceIdByCoinId[marketId.$base.$coin.coinId] != null
						))
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Currency,
			fieldName: '$$marketsWithCurrencyAsBase',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
				const markets = (catalogMarketsWithCurrencyAsBaseByIso4217[entityId.iso4217] ?? []).map((marketId) => ({
						[EntityMetaKey.Id]: marketId,
					}))
				if (markets.length === 0) {
					throw new Error(`Defillama_OpenApi: no catalog markets with ${entityId.iso4217} as base`)
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
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$base.$coin.coinId]) !== stringify(entityId)) {
					return []
				}
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				const { getDefillamaChartOhlcRowsCoingeckoShape } = await import('$/sources/Defillama/OpenApi/queries.ts')
				const coinId = entityId.$base.$coin.coinId
				if (defillamaCurrentPriceIdByCoinId[coinId] == null) {
					throw new Error('Defillama_OpenApi: OHLC coin not mapped')
				}
				const llamaId = defillamaCurrentPriceIdByCoinId[coinId]
				if (llamaId == null) throw new Error('Defillama_OpenApi: OHLC coin not mapped')
				const lim = resolverLoadSubsetRowLimit(context)
				const candles = []
				for (const value of coingeckoOhlcDayWindowLengths) {
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
					candles.push(
						...candleEntitiesFromOhlcWireRows(
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
			entityType: EntityType.MarketPrice,
			fieldName: '$$quotes',
			resolve: async (entityId) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					return []
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$market.$base.$coin.coinId]) !== stringify(entityId.$market)) {
					return []
				}
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				const { getCurrentPrices } = await import('$/sources/Defillama/OpenApi/queries.ts')
				const coinId = entityId.$market.$base.$coin.coinId
				const llamaId = (
					entityId.feedKey?.trim()
					?? (
						entityId.$network != null ?
							(
								coinId === CoinId.ETH && entityId.$network.chainId === 1 ?
									defillamaCurrentPriceIdByCoinId[CoinId.ETH]
								:
									undefined
							)
						: defillamaCurrentPriceIdByCoinId[coinId]
					)
				)
				if (llamaId == null) throw new Error('Defillama_OpenApi: no price id')
				const priceRow = (await getCurrentPrices([llamaId])).coins[llamaId]
				if (priceRow == null) throw new Error('Defillama_OpenApi: price row missing')
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

import { CoinId } from '$/constants/Coin.ts'
import {
	MarketAssetKind,
	MarketPriceRangeType,
	MarketTimeIntervalUnit,
	coingeckoOhlcDayWindowLengths,
} from '$/constants/Market.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
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
			entityType: EntityType.MarketPrice,
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
				if (llamaId == null) throw new Error('Defillama_OpenApi: no price id')
				const priceRow = (await getCurrentPrices([llamaId])).coins[llamaId]
				if (priceRow == null) throw new Error('Defillama_OpenApi: price row missing')
				const timestampSeconds = priceRow.timestamp
				return {
					[EntityMetaKey.Id]: entityId,
					price: BigInt(Math.round(priceRow.price * 1e8)),
					timestampNs: BigInt(timestampSeconds) * 1_000_000_000n,
					updatedAt: timestampSeconds * 1000,
					transport: 'defillama-usd-1e8',
					providerAssetId: llamaId,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.MarketPriceRange,
			resolve: async (entityId, _context) => {
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				const { getDefillamaChartOhlcRowsCoingeckoShape } = await import('$/sources/Defillama/OpenApi/queries.ts')
				if (entityId.rangeType !== MarketPriceRangeType.OHLCCandles) {
					throw new Error('Defillama_OpenApi: unsupported range type')
				}
				if (entityId.timeInterval.unit !== MarketTimeIntervalUnit.Day) {
					throw new Error('Defillama_OpenApi: OHLC timeInterval must be day-based')
				}
				if (!(coingeckoOhlcDayWindowLengths as readonly number[]).includes(entityId.timeInterval.value)) {
					throw new Error('Defillama_OpenApi: OHLC day window not supported')
				}
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
				if (rows.length === 0) throw new Error('Defillama_OpenApi: empty OHLC chart')
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
			fieldName: '$$markets',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				return (
					Object.values(CoinId)
						.flatMap((coinId) => (
							defillamaCurrentPriceIdByCoinId[coinId] != null ?
								[
									{
										[EntityMetaKey.Id]: {
											$base: {
												kind: MarketAssetKind.Coin,
												$coin: { coinId },
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
							:
								[]
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$marketPriceRanges',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				return (
					Object.values(CoinId)
						.flatMap((coinId) => (
							defillamaCurrentPriceIdByCoinId[coinId] != null ?
								[...coingeckoOhlcDayWindowLengths].map((value) => (
									{
										[EntityMetaKey.Id]: {
											$market: {
												$base: {
													kind: MarketAssetKind.Coin,
													$coin: { coinId },
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
							:
								[]
						))
				)
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
											$market: {
												$base: {
													kind: MarketAssetKind.Coin,
													$coin: { coinId },
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
			entityType: EntityType.Coin,
			fieldName: '$$marketPriceRanges',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>) => {
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				if (defillamaCurrentPriceIdByCoinId[entityId.coinId] == null) return []
				return (
					[...coingeckoOhlcDayWindowLengths].map((value) => (
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
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				return (
					defillamaCurrentPriceIdByCoinId[entityId.coinId] != null ?
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
					:
						undefined
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Market,
			fieldName: '$$marketPriceRanges',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market>) => {
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				const coinId = (
					entityId.$base.kind === MarketAssetKind.Coin ?
						entityId.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null || defillamaCurrentPriceIdByCoinId[coinId] == null) return []
				return (
					[...coingeckoOhlcDayWindowLengths].map((value) => (
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

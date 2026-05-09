import { CoinId } from '$/constants/Coin.ts'
import { MarketAssetKind } from '$/constants/Market.ts'
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
import { defillamaCurrentPriceIdByCoinId } from '$/sources/Defillama/Rest/constants.ts'
import { getCurrentPrices } from '$/sources/Defillama/Rest/queries.ts'

export default {
	source: Source.Defillama_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.MarketPrice,
			resolve: async (entityId) => {
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
				if (llamaId == null) throw new Error('Defillama_Rest: no price id')
				const priceRow = (await getCurrentPrices([llamaId])).coins[llamaId]
				if (priceRow == null) throw new Error('Defillama_Rest: price row missing')
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
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$markets',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => (
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
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$marketPrices',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => (
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
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsBase',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>) => (
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
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsQuote',
			resolve: async () => (
				[]
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketPrice',
			resolve: async (entityId) => (
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
			),
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
	],
}

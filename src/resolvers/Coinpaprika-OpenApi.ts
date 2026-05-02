import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import type { CoinId } from '$/constants/Coin.ts'
import { MarketAssetKind, MarketVenue } from '$/constants/Market.ts'
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
				const { sourcePublicEnv } = await import('$/resolvers/$resolvers.ts')
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
				const logoMedia = (
					coin.logo == null || coin.logo.trim() === '' ?
						undefined
					:	{
							[EntityMetaKey.Id]: { url: coin.logo },
							type: MediaType.Image,
						}
				)

				return {
					...(coin.name.trim() !== '' ? { name: coin.name.trim() } : {}),
					...(coin.symbol.trim() !== '' ?
						{ symbol: coin.symbol.trim().toUpperCase() }
					: coinById[entityId.coinId] != null ?
						{ symbol: coinById[entityId.coinId].symbol }
					:	{}),
					...(decimals != null ?
						{ decimals }
					:	{}),
					...(logoMedia != null ?
						{ $logo: logoMedia }
					:	{}),
				}
			},
		}),
		defineEntityResolver({
			entityType: EntityType.MarketPrice,
			resolve: async (entityId, context) => {
				const { sourcePublicEnv } = await import('$/resolvers/$resolvers.ts')
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
				const price = Number(ticker.price_usd)
				const updatedAtSec = Number(ticker.last_updated)

				if (!Number.isFinite(price) || !Number.isFinite(updatedAtSec)) throw new Error('Coinpaprika_OpenApi: ticker invalid')

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
									venue: MarketVenue.SpotIndex,
								} as const,
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
										venue: MarketVenue.SpotIndex,
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
					return []
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
								venue: MarketVenue.SpotIndex,
							} as const,
						},
					]
				)
			},
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
								venue: MarketVenue.SpotIndex,
							} as const,
						},
					}
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
	],
}

import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import type { CoinId } from '$/constants/Coin.ts'
import { MarketAssetKind } from '$/constants/Market.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import { caip19Erc20 } from '$/lib/caip19.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { MediaType } from '$/schema/Media.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.CoinMarketCap_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Coin,
			resolve: async (entityId, context) => {
				const { sourcePublicEnv } = await import('$/resolvers/$resolvers.ts')
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				const { getCoinMarketCapInfo } = await import('$/sources/CoinMarketCap/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.CoinMarketCap_Rest)
				const coinMarketCapId = idByCoinId[entityId.coinId]
				if (coinMarketCapId == null) throw new Error('CoinMarketCap_Rest: coin not mapped')

				const infoResponse = await getCoinMarketCapInfo({
					publicEnv,
					id: coinMarketCapId,
				})
				const info = (
					infoResponse.data == null ?
						undefined
					:	Object.values(infoResponse.data)[0]
				)
				if (info == null) throw new Error('CoinMarketCap_Rest: coin info not returned')

				const logoUrl = info.logo
				const logoMedia = mediaFromUrl(logoUrl, MediaType.Image)

				return {
					...(info.name.trim() !== '' && { name: info.name.trim() }),
					...(info.symbol.trim() !== '' && { symbol: info.symbol.trim().toUpperCase() }),
					...(info.symbol.trim() === '' && coinById[entityId.coinId] != null && {
						symbol: coinById[entityId.coinId].symbol,
					}),
					...(logoMedia != null && { $logo: logoMedia }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.MarketPrice,
			resolve: async (entityId, context) => {
				const { sourcePublicEnv } = await import('$/resolvers/$resolvers.ts')
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				const publicEnv = sourcePublicEnv(context, Source.CoinMarketCap_Rest)
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
						entityId.$market.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null) throw new Error('CoinMarketCap_Rest: market base is not a catalog coin')
				const coinMarketCapId = idByCoinId[coinId]
				if (coinMarketCapId == null) throw new Error('CoinMarketCap_Rest: coin price not mapped')

				const { getCoinMarketCapInfo, getCoinMarketCapQuotesLatest } = await import(
					'$/sources/CoinMarketCap/Rest/queries.ts',
				)
				const [quoteResponse, infoResponse] = await Promise.all([
					getCoinMarketCapQuotesLatest({
						publicEnv,
						id: coinMarketCapId,
					}),
					getCoinMarketCapInfo({
						publicEnv,
						id: coinMarketCapId,
					}),
				])
				const quote = (
					quoteResponse.data == null ?
						undefined
					:	Object.values(quoteResponse.data)[0]
				)
				const price = quote?.quote?.USD?.price
				const lastUpdated = quote?.quote?.USD?.last_updated
				const updatedAt = Date.parse(lastUpdated ?? '')
				if (!Number.isFinite(price) || !Number.isFinite(updatedAt)) {
					throw new Error('CoinMarketCap_Rest: quote invalid')
				}
				const p = (
					infoResponse.data == null
						? undefined
					:	Object.values(infoResponse.data)[0]
				)?.platform
				const caip19 = (
					(p?.slug === 'ethereum' || p?.name === 'Ethereum')
					&& p?.token_address != null
					&& /^0x[a-fA-F0-9]{40}$/i.test(p.token_address.trim()) ?
						caip19Erc20(1, p.token_address.trim().toLowerCase() as `0x${string}`)
					:
						undefined
				)

				return {
					[EntityMetaKey.Id]: entityId,
					price: BigInt(Math.round(price * 1e8)),
					timestampNs: BigInt(updatedAt) * 1_000_000n,
					updatedAt,
					transport: 'coinmarketcap-v2-quotes-and-info-usd-1e8',
					providerAssetId: String(coinMarketCapId),
					...(caip19 != null && { caip19 }),
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
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
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
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
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
			fieldName: '$$marketPrices',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
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
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				if (idByCoinId[entityId.coinId] == null) {
					throw new Error(`CoinMarketCap_Rest: $$marketsWithCoinAsBase unsupported for coin ${entityId.coinId}`)
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
			resolve: async () => {
				throw new Error('CoinMarketCap_Rest: $$marketsWithCoinAsQuote is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketPrice',
			resolve: async (entityId) => {
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
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

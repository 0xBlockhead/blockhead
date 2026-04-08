import { coinById } from '$/constants/Coin.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$defineEntityResolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { MediaType } from '$/schema/Media.ts'
import {
	coinMarketCapIdByCoinId,
} from '$/sources/CoinMarketCap/Rest/constants.ts'
import {
	getCoinMarketCapInfo,
	getCoinMarketCapQuotesLatest,
} from '$/sources/CoinMarketCap/Rest/queries.ts'
import { Source } from '$/sources/$Sources.ts'

const mediaEntityFromUrl = (url: string | undefined) => (
	url == null || url.trim() === '' ?
		undefined
	:	{
			[EntityMetaKey.Id]: { url },
			type: MediaType.Image,
		}
)

const firstRecord = <_Value>(value: Record<string, _Value> | undefined) => (
	value == null ?
		undefined
	:	Object.values(value)[0]
)

export default {
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Coin,
			source: Source.CoinMarketCap,
			resolve: async (entityId) => {
				const coinMarketCapId = coinMarketCapIdByCoinId[entityId.coinId]
				if (coinMarketCapId == null) return {}

				const info = firstRecord(
					(await getCoinMarketCapInfo({
						id: coinMarketCapId,
					})).data,
				)
				if (info == null) return {}

				return {
					...(typeof info.name === 'string' && info.name.trim() !== '' ? { name: info.name } : {}),
					...(typeof info.symbol === 'string' && info.symbol.trim() !== '' ?
						{ symbol: info.symbol.toUpperCase() }
					: coinById[entityId.coinId] != null ?
						{ symbol: coinById[entityId.coinId].symbol }
					:	{}),
					...(mediaEntityFromUrl(info.logo) != null ?
						{ $logo: mediaEntityFromUrl(info.logo) }
					:	{}),
				}
			},
		}),
		defineEntityResolver({
			entityType: EntityType.CoinPrice,
			source: Source.CoinMarketCap,
			resolve: async (entityId) => {
				const coinMarketCapId = coinMarketCapIdByCoinId[entityId.$coin.coinId]
				if (coinMarketCapId == null) return {}

				const quote = firstRecord(
					(await getCoinMarketCapQuotesLatest({
						id: coinMarketCapId,
					})).data,
				)
				const usdQuote = quote?.quote?.USD
				const price = usdQuote?.price
				const lastUpdated = usdQuote?.last_updated
				const updatedAt = (
					typeof lastUpdated === 'string' ?
						Date.parse(lastUpdated)
					:	Number.NaN
				)

				if (typeof price !== 'number' || !Number.isFinite(price) || !Number.isFinite(updatedAt)) {
					return {}
				}

				return {
					[EntityMetaKey.Id]: entityId,
					price: BigInt(Math.round(price * 1e8)),
					timestampNs: BigInt(updatedAt) * 1_000_000n,
					updatedAt,
					transport: 'coinmarketcap-usd-1e8',
					encodedAssetId: String(coinMarketCapId),
				}
			},
		}),
	],
	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$coins',
			source: Source.CoinMarketCap,
			resolve: async (_entityId) => (
				Object.entries(coinMarketCapIdByCoinId)
					.filter(([coinId]) => coinById[coinId as keyof typeof coinById] != null)
					.map(([coinId]) => (
						{
							[EntityMetaKey.Id]: {
								coinId,
							},
						}
					))
			),
		}),
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$coinPrices',
			source: Source.CoinMarketCap,
			resolve: async (_entityId) => (
				Object.entries(coinMarketCapIdByCoinId)
					.filter(([coinId]) => coinById[coinId as keyof typeof coinById] != null)
					.map(([coinId]) => (
						{
							[EntityMetaKey.Id]: {
								$coin: {
									coinId,
								},
							},
						}
					))
			),
		}),
	],
}

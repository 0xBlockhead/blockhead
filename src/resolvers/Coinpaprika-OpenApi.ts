import { coinById } from '$/constants/Coin.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$defineEntityResolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { MediaType } from '$/schema/Media.ts'
import {
	coinpaprikaDecimalsByCoinId,
	coinpaprikaIdByCoinId,
} from '$/sources/Coinpaprika/OpenApi/constants.ts'
import {
	getCoinpaprikaCoinById,
	getCoinpaprikaTickerById,
} from '$/sources/Coinpaprika/OpenApi/queries.ts'
import { Source } from '$/sources/$Sources.ts'

const mediaEntityFromUrl = (url: string | undefined) => (
	url == null || url.trim() === '' ?
		undefined
	:	{
			[EntityMetaKey.Id]: { url },
			type: MediaType.Image,
		}
)

export default {
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Coin,
			source: Source.Coinpaprika,
			resolve: async (entityId) => {
				const coinpaprikaId = coinpaprikaIdByCoinId[entityId.coinId]
				if (coinpaprikaId == null) return {}

				const coin = await getCoinpaprikaCoinById({
					coinpaprikaId,
				})

				return {
					...(typeof coin.name === 'string' && coin.name.trim() !== '' ? { name: coin.name } : {}),
					...(typeof coin.symbol === 'string' && coin.symbol.trim() !== '' ?
						{ symbol: coin.symbol.toUpperCase() }
					: coinById[entityId.coinId] != null ?
						{ symbol: coinById[entityId.coinId].symbol }
					:	{}),
					...(coinpaprikaDecimalsByCoinId[entityId.coinId] != null ?
						{ decimals: coinpaprikaDecimalsByCoinId[entityId.coinId] }
					:	{}),
					...(mediaEntityFromUrl(coin.logo) != null ?
						{ $logo: mediaEntityFromUrl(coin.logo) }
					:	{}),
				}
			},
		}),
		defineEntityResolver({
			entityType: EntityType.CoinPrice,
			source: Source.Coinpaprika,
			resolve: async (entityId) => {
				const coinpaprikaId = coinpaprikaIdByCoinId[entityId.$coin.coinId]
				if (coinpaprikaId == null) return {}

				const ticker = await getCoinpaprikaTickerById({
					coinpaprikaId,
				})
				const price = Number(ticker.price_usd)
				const updatedAtSec = Number(ticker.last_updated)

				if (!Number.isFinite(price) || !Number.isFinite(updatedAtSec)) return {}

				return {
					[EntityMetaKey.Id]: entityId,
					price: BigInt(Math.round(price * 1e8)),
					timestampNs: BigInt(updatedAtSec) * 1_000_000_000n,
					updatedAt: updatedAtSec * 1000,
					transport: 'coinpaprika-usd-1e8',
					encodedAssetId: coinpaprikaId,
				}
			},
		}),
	],
	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$coins',
			source: Source.Coinpaprika,
			resolve: async (_entityId) => (
				Object.entries(coinpaprikaIdByCoinId)
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
			source: Source.Coinpaprika,
			resolve: async (_entityId) => (
				Object.entries(coinpaprikaIdByCoinId)
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

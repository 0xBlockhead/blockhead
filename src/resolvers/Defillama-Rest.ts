import { CoinId } from '$/constants/Coin.ts'
import {
	MarketAssetKind,
	MarketKind,
} from '$/constants/Market.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

/**
 * Transport-only lane for DeFiLlama **Pro** REST (`getProCurrentPrices` in `$/sources/Defillama/Rest/queries.ts`).
 * Public coin prices use **`Source.Defillama_OpenApi`** + **`Defillama-OpenApi.ts`** (checked-in OpenAPI schema).
 */
export default {
	source: Source.Defillama_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Market_Timestamp,
			resolve: async (entityId, context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('Defillama_Rest: Market_Timestamp is spot-only')
				}
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				const { getProCurrentPrices } = await import('$/sources/Defillama/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Defillama_Rest)
				const apiKey = publicEnv.PUBLIC_DEFILLAMA_PRO_API_KEY
				if (apiKey == null || apiKey.trim() === '') {
					throw new Error('Defillama_Rest: PUBLIC_DEFILLAMA_PRO_API_KEY is missing')
				}
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
						entityId.$market.$base.$coin.coinId
					:
						undefined
				)
				const llamaId = (
					entityId.feedKey?.trim()
					?? (
						coinId != null ?
							defillamaCurrentPriceIdByCoinId[coinId]
						:
							undefined
					)
				)
				if (llamaId == null) throw new Error('Defillama_Rest: no price id')
				const priceRow = (
					await getProCurrentPrices({
						apiKey,
						coins: [llamaId],
					})
				).coins[llamaId]
				const timestampMs = priceRow.timestamp * 1000
				if (entityId.timestampMs !== timestampMs) {
					throw new Error('Defillama_Rest: Market_Timestamp id does not match price clock')
				}
					return {
						price: BigInt(Math.round(priceRow.price * 1e8)),
						transport: 'defillama-pro-current-usd-1e8',
						providerAssetId: llamaId,
					}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.MarketPrice,
			fieldName: '$$quotes',
			resolve: async (entityId, context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('Defillama_Rest: MarketPrice $$quotes is spot-only')
				}
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
				const { getProCurrentPrices } = await import('$/sources/Defillama/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Defillama_Rest)
				const apiKey = publicEnv.PUBLIC_DEFILLAMA_PRO_API_KEY
				if (apiKey == null || apiKey.trim() === '') {
					throw new Error('Defillama_Rest: PUBLIC_DEFILLAMA_PRO_API_KEY is missing')
				}
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
							entityId.$market.$base.$coin.coinId
						:
							undefined
					)
					if (entityId.$market.$base.kind !== MarketAssetKind.Coin) {
						return []
					}
					const llamaId = (
						entityId.feedKey?.trim()
						?? (
							entityId.$network != null ?
								(
									coinId === CoinId.ETH && entityId.$network.caip2.reference === '1' ?
										defillamaCurrentPriceIdByCoinId[CoinId.ETH]
								:
									undefined
							)
						: coinId != null ?
							defillamaCurrentPriceIdByCoinId[coinId]
						:
							undefined
					)
				)
				if (llamaId == null) throw new Error('Defillama_Rest: no price id')
				const priceRow = (
					await getProCurrentPrices({
						apiKey,
						coins: [llamaId],
					})
				).coins[llamaId]
				return [
					{
						[EntityMetaKey.Id]: {
							$market: entityId.$market,
							timestampMs: priceRow.timestamp * 1000,
							...(llamaId !== '' && { feedKey: llamaId }),
						},
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.MarketPrice,
			fieldName: '$parentMarket',
			resolve: async (entityId) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
				}
			),
		}),
	],
}

import { CoinId } from '$/constants/Coin.ts'
import { MarketAssetKind, MarketKind } from '$/constants/Market.ts'
import {
	defineResolver,
} from '$/resolvers/$resolvers.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

/**
 * Transport-only lane for DeFiLlama **Pro** REST (`getProCurrentPrices` in `$/sources/Defillama/Rest/queries.ts`).
 * Public coin prices use **`Source.Defillama_OpenApi`** + **`Defillama-OpenApi.ts`** (checked-in OpenAPI schema).
 */
export default {
	source: Source.Defillama_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.Market_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('Defillama_Rest: Market_Timestamp is spot-only')
				}
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
					const { getProCurrentPrices } = await import('$/sources/Defillama/Rest/queries.ts')
					const apiKey = context.publicEnv.PUBLIC_DEFILLAMA_PRO_API_KEY
					if (entityId.$market.$base.kind !== MarketAssetKind.Coin)
						throw new Error('Defillama_Rest: Market_Timestamp base asset is not a coin')

					const llamaId = (
						entityId.feedKey?.trim()
						?? defillamaCurrentPriceIdByCoinId[entityId.$market.$base.$coin.coinId]
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
				}
			},
				fields: {
					price: (snapshot) => snapshot.price,
					transport: (snapshot) => snapshot.transport,
					providerAssetId: (snapshot) => snapshot.providerAssetId,
				},
			}),

		defineResolver({
			entityType: EntityType.MarketPrice,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('Defillama_Rest: MarketPrice $$quotes is spot-only')
				}
					const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
					const { getProCurrentPrices } = await import('$/sources/Defillama/Rest/queries.ts')
					const apiKey = context.publicEnv.PUBLIC_DEFILLAMA_PRO_API_KEY
					if (entityId.$market.$base.kind !== MarketAssetKind.Coin)
						throw new Error('Defillama_Rest: MarketPrice base asset is not a coin')

					const coinId = entityId.$market.$base.$coin.coinId
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
					:
						defillamaCurrentPriceIdByCoinId[coinId]
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
			}
			},
			fields: {
			$$quotes: (snapshot) => snapshot,
		}
		}),

		defineResolver({
			entityType: EntityType.MarketPrice,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => ({
				[EntityMetaKey.Id]: entityId.$market,
			})
			},
			fields: {
			$parentMarket: (snapshot) => snapshot,
		}
		}),
	],
}

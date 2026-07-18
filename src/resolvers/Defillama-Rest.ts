import { MarketAssetKind, MarketKind } from '$/constants/Market.ts'
import { coins } from '$/constants/Coin.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Market_TimestampSelector } from '$/schema/Market_Timestamp.ts'
import { MarketPriceSelector } from '$/schema/MarketPrice.ts'
import { Source } from '$/sources/Source.ts'

/**
 * Transport-only lane for DeFiLlama **Pro** REST (`getProCurrentPrices` in `$/sources/Defillama/Rest/queries.ts`).
 * Public coin prices use **`Source.Defillama_OpenApi`** + **`Defillama-OpenApi.ts`** (checked-in OpenAPI schema).
 */
export default {
	source: Source.Defillama_Rest,

	resolvers: [
		defineResolver(Source.Defillama_Rest, {
			entityType: EntityType.Market_Timestamp,
			resolve: {
				[Market_TimestampSelector.MarketTimestampMsFeedKey]: {
					resolve: async ({ $market, feedKey, timestampMs: timestampMsSelector }, context) => {
						if ($market.marketKind !== MarketKind.Spot)
							throw new Error('Defillama_Rest: Market_Timestamp is spot-only')

						const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
						const { getProCurrentPrices } = await import('$/sources/Defillama/Rest/queries.ts')
						if ($market.$base.kind !== MarketAssetKind.Coin)
							throw new Error('Defillama_Rest: Market_Timestamp base asset is not a coin')
						const coin = coins.find((row) => row.id === $market.$base.assetKey)
						if (coin == null)
							throw new Error('Defillama_Rest: Market_Timestamp base coin is not in the catalog')

						const llamaId = defillamaCurrentPriceIdByCoinId[coin.id]
						if (llamaId == null || llamaId !== feedKey)
							throw new Error('Defillama_Rest: Market_Timestamp feedKey does not match catalog coin')
						const priceRow = (
							await getProCurrentPrices({
								publicEnv: context.publicEnv,
								coins: [llamaId],
							})
						).coins[llamaId]
						const timestampMs = priceRow.timestamp * 1000
						if (timestampMs !== timestampMsSelector)
							throw new Error('Defillama_Rest: Market_Timestamp id does not match price clock')

						return {
							price: BigInt(Math.round(priceRow.price * 1e8)),
							transport: 'defillama-pro-current-usd-1e8',
							providerAssetId: llamaId,
						}
					},
				},
			},
		})({
				price: (snapshot) => snapshot.price,
				transport: (snapshot) => snapshot.transport,
				providerAssetId: (snapshot) => snapshot.providerAssetId,
			}),

		defineResolver(Source.Defillama_Rest, {
			entityType: EntityType.MarketPrice,
			resolve: {
				[MarketPriceSelector.Market]: {
					resolve: async ({ $market }, context) => {
						if ($market.marketKind !== MarketKind.Spot)
							throw new Error('Defillama_Rest: MarketPrice $$quotes is spot-only')

						const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
						const { getProCurrentPrices } = await import('$/sources/Defillama/Rest/queries.ts')
						if ($market.$base.kind !== MarketAssetKind.Coin)
							throw new Error('Defillama_Rest: MarketPrice base asset is not a coin')
						const coin = coins.find((row) => row.id === $market.$base.assetKey)
						if (coin == null)
							return []

						const llamaId = defillamaCurrentPriceIdByCoinId[coin.id]
						if (llamaId == null)
							return []

						const priceRow = (
							await getProCurrentPrices({
								publicEnv: context.publicEnv,
								coins: [llamaId],
							})
						).coins[llamaId]
						return [
							{
								[EntityMetaKey.Selector]: {
									$market,
									timestampMs: priceRow.timestamp * 1000,
									feedKey: llamaId,
								},
							},
						]
					},
				},
			},
		})({
				$$quotes: (snapshot) => snapshot.map((quote) => ({
					[EntityMetaKey.Selector]: quote[EntityMetaKey.Selector],
				})),
			}),

		defineResolver(Source.Defillama_Rest, {
			entityType: EntityType.MarketPrice,
			resolve: {
				[MarketPriceSelector.Market]: {
					resolve: async ({ $market }) => ({
						[EntityMetaKey.Selector]: $market,
					}),
				},
			},
		})({
				$parentMarket: (snapshot) => snapshot,
			}),
	],
}

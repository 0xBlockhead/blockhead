import { CoinId } from '$/constants/Coin.ts'
import { MarketAssetKind, MarketKind } from '$/constants/Market.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { Market_TimestampSelector } from '$/schema/Market_Timestamp.ts'
import { MarketPriceSelector } from '$/schema/MarketPrice.ts'

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
				[Market_TimestampSelector.MarketTimestampMsFeedKey]: async ({ $market, feedKey, timestampMs: timestampMsSelector }, context) => {
				if ($market.marketKind !== MarketKind.Spot) {
					throw new Error('Defillama_Rest: Market_Timestamp is spot-only')
				}
				const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
					const { getProCurrentPrices } = await import('$/sources/Defillama/Rest/queries.ts')
					const apiKey = context.publicEnv.PUBLIC_DEFILLAMA_PRO_API_KEY
					if ($market.$base.kind !== MarketAssetKind.Coin)
						throw new Error('Defillama_Rest: Market_Timestamp base asset is not a coin')

					const llamaId = feedKey.trim()
				const priceRow = (
					await getProCurrentPrices({
						apiKey,
						coins: [llamaId],
					})
				).coins[llamaId]
				const timestampMs = priceRow.timestamp * 1000
				if (timestampMs !== timestampMsSelector) {
					throw new Error('Defillama_Rest: Market_Timestamp id does not match price clock')
				}
				return {
					price: BigInt(Math.round(priceRow.price * 1e8)),
					transport: 'defillama-pro-current-usd-1e8',
					providerAssetId: llamaId,
				}
				}
			},
			})({
				fields: {
					price: (snapshot) => snapshot.price,
					transport: (snapshot) => snapshot.transport,
					providerAssetId: (snapshot) => snapshot.providerAssetId,
				},
			}),

		defineResolver(Source.Defillama_Rest, {
			entityType: EntityType.MarketPrice,
			resolve: {
				[MarketPriceSelector.Market]: async ({ $market }, context) => {
				if ($market.marketKind !== MarketKind.Spot) {
					throw new Error('Defillama_Rest: MarketPrice $$quotes is spot-only')
				}
					const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
					const { getProCurrentPrices } = await import('$/sources/Defillama/Rest/queries.ts')
					const apiKey = context.publicEnv.PUBLIC_DEFILLAMA_PRO_API_KEY
					if ($market.$base.kind !== MarketAssetKind.Coin)
						throw new Error('Defillama_Rest: MarketPrice base asset is not a coin')

					const coinId = $market.$base.$coin.coinId
				const llamaId = defillamaCurrentPriceIdByCoinId[coinId]
				if (llamaId == null)
					return []

				const priceRow = (
					await getProCurrentPrices({
						apiKey,
						coins: [llamaId],
					})
				).coins[llamaId]
				return [
					{
						[EntityMetaKey.Selector]: {
							$market: $market,
							timestampMs: priceRow.timestamp * 1000,
							...(llamaId !== '' && { feedKey: llamaId }),
						},
					},
				]
			}
			}
		})({
				fields: {
			$$quotes: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.Defillama_Rest, {
			entityType: EntityType.MarketPrice,
			resolve: {
				[MarketPriceSelector.Market]: async ({ $market }) => ({
				[EntityMetaKey.Selector]: $market,
			})
			}
		})({
				fields: {
			$parentMarket: (snapshot) => snapshot,
		},
			}),
	],
}

import {
	MarketAssetKind,
	MarketKind,
} from '$/constants/Market.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import { isSeededCoinCurrencyMarket } from '$/resolvers/market.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MediaType } from '$/schema/MediaType.ts'
import {
	optionalPublicEnvString,
	type SourcePublicEnv,
} from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'

const currentPriceForRequestedId = <_Price>(
	coins: Record<string, _Price> | undefined,
	requestedId: string
) => (
	coins?.[requestedId]
	?? Object.entries(coins ?? {})
		.find(([responseId]) => decodeURIComponent(responseId) === requestedId)
		?.[1]
)

const getConfiguredCurrentPrices = async (
	coins: string[],
	publicEnv: SourcePublicEnv
) => {
	const {
		getCurrentPrices,
		getProCurrentPrices,
	} = await import('$/sources/Defillama/Rest/queries.ts')

	return optionalPublicEnvString(publicEnv, 'PUBLIC_DEFILLAMA_PRO_API_KEY') == null ?
		getCurrentPrices({ coins })
	:
		getProCurrentPrices({
			coins,
			publicEnv,
		})
}

export default {
	source: Source.Defillama_Rest,

	resolvers: [
		defineResolver(Source.Defillama_Rest, {
			entityType: EntityType.Market_Timestamp,
			resolve: {
				MarketTimestampMsFeedKey: {
					resolve: async ({ $market, feedKey, timestampMs: timestampMsSelector }, context) => {
						if ($market.marketKind !== MarketKind.Spot)
							throw new Error('Defillama_Rest: Market_Timestamp is spot-only')
						if ($market.$base.kind !== MarketAssetKind.Coin)
							throw new Error('Defillama_Rest: Market_Timestamp base asset is not a coin')
						if (!isSeededCoinCurrencyMarket($market))
							throw new Error('Defillama_Rest: Market_Timestamp is catalog coin USD market only')

						const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
						const requestedId = defillamaCurrentPriceIdByCoinId[$market.$base.assetKey]
						if (requestedId == null || requestedId !== feedKey)
							throw new Error('Defillama_Rest: Market_Timestamp feedKey does not match catalog coin')

						const price = currentPriceForRequestedId(
							(
								await getConfiguredCurrentPrices(
									[requestedId],
									context.publicEnv
								)
							).coins,
							requestedId
						)
						if (price == null)
							throw new Error('Defillama_Rest: current price not returned')
						if (price.timestamp * 1_000 !== timestampMsSelector)
							throw new Error('Defillama_Rest: Market_Timestamp id does not match price clock')

						return {
							price: BigInt(Math.round(price.price * 1e8)),
							transport: 'defillama-current-usd-1e8',
							providerAssetId: requestedId,
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
				Market: {
					resolve: async ({ $market }, context) => {
						if (
							$market.marketKind !== MarketKind.Spot
							|| $market.$base.kind !== MarketAssetKind.Coin
							|| !isSeededCoinCurrencyMarket($market)
						)
							return []

						const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
						const requestedId = defillamaCurrentPriceIdByCoinId[$market.$base.assetKey]
						if (requestedId == null)
							return []

						const price = currentPriceForRequestedId(
							(
								await getConfiguredCurrentPrices(
									[requestedId],
									context.publicEnv
								)
							).coins,
							requestedId
						)
						if (price == null)
							return []

						return [{
							[EntityMetaKey.Selector]: {
								$market,
								timestampMs: price.timestamp * 1_000,
								feedKey: requestedId,
							},
						}]
					},
				},
			},
		})({
			$$quotes: (quotes) => quotes,
		}),

		defineResolver(Source.Defillama_Rest, {
			entityType: EntityType.MarketPrice,
			resolve: {
				Market: {
					resolve: async ({ $market }) => ({
						[EntityMetaKey.Selector]: $market,
					}),
				},
			},
		})({
			$parentMarket: (market) => market,
		}),

		defineResolver(Source.Defillama_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						const {
							chainIconSlugByChainId,
							getChainIconUrl,
						} = await import('$/sources/Defillama/Rest/queries.ts')
						const slug = chainIconSlugByChainId[Number(caip2.reference)]
						if (slug == null)
							throw new Error(`Defillama_Rest: no chain icon slug for chain ${caip2.reference}`)

						const icon = mediaFromUrl(
							getChainIconUrl(slug),
							MediaType.Image
						)
						if (icon == null)
							throw new Error(`Defillama_Rest: invalid icon URL for chain ${caip2.reference}`)

						return icon
					},
				},
			},
		})({
			$icon: (icon) => icon,
		}),
	],
}

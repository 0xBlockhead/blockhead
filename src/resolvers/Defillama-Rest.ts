import {
	MarketAssetKind,
	MarketKind,
} from '$/constants/Market.ts'
import { seededCoinSpotUsdMarketByCoinId } from '$/constants/MarketCatalog.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	isSeededCoinCurrencyMarket,
	marketSelectorFromCatalogCoinCurrencyMarket,
} from '$/resolvers/market.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
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

const getConfiguredHistoricalPrices = async (
	coins: string[],
	timestamp: number,
	publicEnv: SourcePublicEnv
) => {
	const {
		getHistoricalPrices,
		getProHistoricalPrices,
	} = await import('$/sources/Defillama/Rest/queries.ts')

	return optionalPublicEnvString(publicEnv, 'PUBLIC_DEFILLAMA_PRO_API_KEY') == null ?
		getHistoricalPrices({
			coins,
			timestamp,
		})
	:
		getProHistoricalPrices({
			coins,
			timestamp,
			publicEnv,
		})
}

const priceSnapshotFromWire = (
	requestedId: string,
	price: {
		price: number
		timestamp: number
	}
) => ({
	price: BigInt(Math.round(price.price * 1e8)),
	transport: 'defillama-current-usd-1e8',
	providerAssetId: requestedId,
})

export default {
	source: Source.Defillama_Rest,

	resolvers: [
		defineResolver({
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

						const currentPrice = currentPriceForRequestedId(
							(
								await getConfiguredCurrentPrices(
									[requestedId],
									context.publicEnv
								)
							).coins,
							requestedId
						)
						if (currentPrice != null && currentPrice.timestamp * 1_000 === timestampMsSelector)
							return priceSnapshotFromWire(requestedId, currentPrice)

						const historicalPrice = currentPriceForRequestedId(
							(
								await getConfiguredHistoricalPrices(
									[requestedId],
									Math.floor(timestampMsSelector / 1_000),
									context.publicEnv
								)
							).coins,
							requestedId
						)
						if (historicalPrice == null)
							throw new Error('Defillama_Rest: historical price not returned')
						if (historicalPrice.timestamp * 1_000 !== timestampMsSelector)
							throw new Error('Defillama_Rest: Market_Timestamp id does not match price clock')

						return {
							...priceSnapshotFromWire(requestedId, historicalPrice),
							transport: 'defillama-historical-usd-1e8',
						}
					},
				},
			},
		})({
			price: (snapshot) => snapshot.price,
			transport: (snapshot) => snapshot.transport,
			providerAssetId: (snapshot) => snapshot.providerAssetId,
		}),

		defineResolver({
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

		defineResolver({
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

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						const {
							defillamaChainIconSlugByChainId,
						} = await import('$/sources/Defillama/Rest/constants.ts')
						const { getChainIconUrl } = await import('$/sources/Defillama/Rest/queries.ts')
						const slug = defillamaChainIconSlugByChainId[Number(caip2.reference)]
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

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async () => {
						const { CoinId, coinById } = await import('$/constants/Coin.ts')
						const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
						return (
							Object.values(CoinId)
								.filter((coinId) => (
									defillamaCurrentPriceIdByCoinId[coinId] != null
									&& coinId in coinById
								))
								.map((coinId) => ({
									[EntityMetaKey.Selector]: {
										coinId,
									},
								}))
						)
					},
				},
			},
		})({
			$$coins: {
				select: (coins) => coins,
				resolveCount: (coins) => coins.length,
			},
		}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_globalScope, context) => {
						const { CoinId, coinById } = await import('$/constants/Coin.ts')
						const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
						const lim = resolverContextRowLimit(context)
						const catalogEntries = (
							Object.values(CoinId)
								.flatMap((coinId) => {
									const requestedId = defillamaCurrentPriceIdByCoinId[coinId]
									if (requestedId == null || !(coinId in coinById))
										return []

									return [{
										coinId,
										requestedId,
									}]
								})
						)
						const prices = (
							await getConfiguredCurrentPrices(
								catalogEntries.map(({ requestedId }) => requestedId),
								context.publicEnv
							)
						).coins
						const marketPrices = catalogEntries.flatMap(({
							coinId,
							requestedId,
						}) => {
							const price = currentPriceForRequestedId(prices, requestedId)
							if (price == null)
								return []

							return [{
								[EntityMetaKey.Selector]: {
									$market: marketSelectorFromCatalogCoinCurrencyMarket(seededCoinSpotUsdMarketByCoinId[coinId]),
									timestampMs: price.timestamp * 1_000,
									feedKey: requestedId,
								},
							}]
						})
						return {
							marketPrices: marketPrices.slice(0, lim),
							marketPriceCount: marketPrices.length,
						}
					},
				},
			},
		})({
			$$marketPrices: {
				select: (snapshot) => snapshot.marketPrices,
				resolveCount: (snapshot) => snapshot.marketPriceCount,
			},
		}),
	],
} satisfies RegisteredSourceResolverModule

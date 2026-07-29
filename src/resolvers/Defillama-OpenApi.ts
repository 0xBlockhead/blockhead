import { CoinId } from '$/constants/Coin.ts'
import {
	MarketAssetKind,
	MarketKind,
} from '$/constants/Market.ts'
import { seededCoinSpotUsdMarkets, type CatalogCoinCurrencyMarket } from '$/constants/MarketCatalog.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { Source } from '$/sources/Source.ts'

/** Coin prices use `$/sources/Defillama/OpenApi` + checked-in `openapi.d.ts` (`GET /prices/current/{coins}`). */
const marketSelectorFromCatalogCoinCurrencyMarket = (catalogMarket: CatalogCoinCurrencyMarket) => ({
	$base: {
		kind: MarketAssetKind.Coin,
		assetKey: catalogMarket.baseCoinId,
	},
	$quote: {
		kind: MarketAssetKind.Currency,
		assetKey: catalogMarket.quoteIso4217,
	},
	$marketVenue: {
		marketVenueId: catalogMarket.marketVenueId,
	},
	marketKind: catalogMarket.marketKind,
}) satisfies EntitySelector<
	typeof schema,
	EntityType.Market
>

const catalogCoinCurrencyMarketMatchesMarket = (
	market: EntitySelector<typeof schema, EntityType.Market>
): market is EntitySelector<typeof schema, EntityType.Market> & {
	readonly $base: {
		readonly kind: MarketAssetKind.Coin
		readonly assetKey: CoinId
	}
} => (
	market.$base.kind === MarketAssetKind.Coin
	&& market.$quote.kind === MarketAssetKind.Currency
	&& seededCoinSpotUsdMarkets.some((catalogMarket) => (
		market.marketKind === catalogMarket.marketKind
		&& market.$marketVenue.marketVenueId === catalogMarket.marketVenueId
		&& market.$base.assetKey === catalogMarket.baseCoinId
		&& market.$quote.assetKey === catalogMarket.quoteIso4217
	))
)

export default {
	source: Source.Defillama_OpenApi,

	resolvers: [
		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.Market_Timestamp,
			resolve: {
				MarketTimestampMsFeedKey: {
					resolve: async ({ $market, feedKey, timestampMs: timestampMsSelector }) => {
						if ($market.marketKind !== MarketKind.Spot)
							throw new Error('Defillama_OpenApi: Market_Timestamp is spot-only')
						if ($market.$base.kind !== MarketAssetKind.Coin)
							throw new Error('Market source: market base must be catalog coin')
						if (!catalogCoinCurrencyMarketMatchesMarket($market))
							throw new Error('Defillama_OpenApi: Market_Timestamp is catalog coin USD market only')
						const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
						const { getCurrentPrices } = await import('$/sources/Defillama/OpenApi/queries.ts')
						const coinId = $market.$base.assetKey
						const llamaId = defillamaCurrentPriceIdByCoinId[coinId]
						if (llamaId == null || llamaId !== feedKey)
							throw new Error('Defillama_OpenApi: Market_Timestamp feedKey does not match catalog coin')
						const priceRow = (
							await getCurrentPrices(
								[llamaId]
							)
						).coins[llamaId]
						const timestampMs = priceRow.timestamp * 1000
						if (timestampMs !== timestampMsSelector)
							throw new Error('Defillama_OpenApi: Market_Timestamp id does not match price clock')
						return {
							price: BigInt(Math.round(priceRow.price * 1e8)),
							transport: 'defillama-usd-1e8',
							providerAssetId: llamaId,
						}
					},
				}
			},
		})({
				price: (timestamp) => timestamp.price,
				transport: (timestamp) => timestamp.transport,
				providerAssetId: (timestamp) => timestamp.providerAssetId,
			}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.MarketPrice,
			resolve: {
				Market: {
					resolve: async ({ $market }) => {
						if ($market.marketKind !== MarketKind.Spot)
							return []
						if ($market.$base.kind !== MarketAssetKind.Coin)
							return []
						if (!catalogCoinCurrencyMarketMatchesMarket($market))
							return []
						const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
						const { getCurrentPrices } = await import('$/sources/Defillama/OpenApi/queries.ts')
						const coinId = $market.$base.assetKey
						const llamaId = defillamaCurrentPriceIdByCoinId[coinId]
						if (llamaId == null)
							return []

						const priceRow = (
							await getCurrentPrices(
								[llamaId]
							)
						).coins[llamaId]
						return [
							{
								[EntityMetaKey.Selector]: {
									$market: $market,
									timestampMs: priceRow.timestamp * 1000,
									feedKey: llamaId,
								},
							},
						]
					},
				}
			},
		})({
				$$quotes: (quotes) => quotes.map((quote) => ({
					[EntityMetaKey.Selector]: quote[EntityMetaKey.Selector],
				})),
			}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.MarketPrice,
			resolve: {
				Market: {
					resolve: async ({ $market }: EntitySelector<typeof schema, EntityType.MarketPrice>) => (
						{
							[EntityMetaKey.Selector]: $market,
						}
					),
				}
			},
		})({
				$parentMarket: (market) => market,
			}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					resolve: async ({ caip2 }) => {
						const { getChainSlugByChainId, getChainIconUrl } = await import('$/sources/Defillama/OpenApi/queries.ts')
						const slug = getChainSlugByChainId[Number(caip2.reference)]
						if (slug == null) throw new Error(`Defillama_OpenApi: no chain icon slug for chain ${caip2.reference}`)
						const iconMedia = mediaFromUrl(
							getChainIconUrl(
								slug
							),
							MediaType.Image
						)
						if (iconMedia == null) throw new Error(`Defillama_OpenApi: invalid icon URL for chain ${caip2.reference}`)
						return iconMedia
					},
				}
			},
		})({
				$icon: (iconMedia) => iconMedia,
			}),
	],
}

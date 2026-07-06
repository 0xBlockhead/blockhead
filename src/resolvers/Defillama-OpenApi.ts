import { CoinId } from '$/constants/Coin.ts'
import {
	MarketAssetKind,
	MarketKind,
	type MarketIdLabelInput,
} from '$/constants/Market.ts'
import { Iso4217 } from '$/constants/Currency.ts'
import {
	seededCoinSpotUsdMarkets,
	seededCoinSpotUsdMarketByCoinId,
	seededSpotMarketsWithCoinAsQuote,
	seededSpotMarketsWithCurrencyAsBase,
	type CatalogCoinCoinMarket,
	type CatalogCoinCurrencyMarket,
	type CatalogCurrencyCurrencyMarket,
} from '$/constants/MarketCatalog.ts'
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
import { MediaType } from '$/schema/Media.ts'
import { Source } from '$/sources/Source.ts'
import { EvmNetworkSelector } from '$/schema/EvmNetwork.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'
import { Market_TimestampSelector } from '$/schema/Market_Timestamp.ts'
import { CoinSelector } from '$/schema/Coin.ts'
import { CurrencySelector } from '$/schema/Currency.ts'
import { MarketSelector } from '$/schema/Market.ts'
import { MarketPriceSelector } from '$/schema/MarketPrice.ts'

/** Coin prices use `$/sources/Defillama/OpenApi` + checked-in `openapi.d.ts` (`GET /prices/current/{coins}`). */
const marketSelectorFromCatalogCoinCurrencyMarket = (catalogMarket: CatalogCoinCurrencyMarket) => ({
	$base: {
		kind: MarketAssetKind.Coin,
		$coin: { coinId: catalogMarket.baseCoinId },
	},
	$quote: {
		kind: MarketAssetKind.Currency,
		$currency: { iso4217: catalogMarket.quoteIso4217 },
	},
	$marketVenue: {
		marketVenueId: catalogMarket.marketVenueId,
	},
	marketKind: catalogMarket.marketKind,
}) satisfies MarketIdLabelInput

const catalogCoinCurrencyMarketMatchesMarket = (
	catalogMarket: CatalogCoinCurrencyMarket,
	market: EntitySelector<typeof schema, EntityType.Market>
) => (
	market.marketKind === catalogMarket.marketKind
	&& market.$marketVenue.marketVenueId === catalogMarket.marketVenueId
	&& market.$base.kind === MarketAssetKind.Coin
	&& market.$base.$coin.coinId === catalogMarket.baseCoinId
	&& market.$quote.kind === MarketAssetKind.Currency
	&& market.$quote.$currency.iso4217 === catalogMarket.quoteIso4217
)

const marketSelectorFromCatalogCoinCoinMarket = (catalogMarket: CatalogCoinCoinMarket) => ({
	$base: {
		kind: MarketAssetKind.Coin,
		$coin: { coinId: catalogMarket.baseCoinId },
	},
	$quote: {
		kind: MarketAssetKind.Coin,
		$coin: { coinId: catalogMarket.quoteCoinId },
	},
	$marketVenue: {
		marketVenueId: catalogMarket.marketVenueId,
	},
	marketKind: catalogMarket.marketKind,
}) satisfies MarketIdLabelInput

const marketSelectorFromCatalogCurrencyCurrencyMarket = (catalogMarket: CatalogCurrencyCurrencyMarket) => ({
	$base: {
		kind: MarketAssetKind.Currency,
		$currency: { iso4217: catalogMarket.baseIso4217 },
	},
	$quote: {
		kind: MarketAssetKind.Currency,
		$currency: { iso4217: catalogMarket.quoteIso4217 },
	},
	$marketVenue: {
		marketVenueId: catalogMarket.marketVenueId,
	},
	marketKind: catalogMarket.marketKind,
}) satisfies MarketIdLabelInput

export default {
	source: Source.Defillama_OpenApi,

	resolvers: [
		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.Market_Timestamp,
			resolve: {
				[Market_TimestampSelector.MarketTimestampMsFeedKey]: async ({ $market, feedKey, timestampMs: timestampMsSelector }) => {
					if ($market.marketKind !== MarketKind.Spot)
						throw new Error('Defillama_OpenApi: Market_Timestamp is spot-only')
					if ($market.$base.kind !== MarketAssetKind.Coin)
						throw new Error('Market source: market base must be catalog coin')
					if (!catalogCoinCurrencyMarketMatchesMarket(seededCoinSpotUsdMarketByCoinId[$market.$base.$coin.coinId], $market))
						throw new Error('Defillama_OpenApi: Market_Timestamp is catalog coin USD market only')
					const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
					const { getCurrentPrices } = await import('$/sources/Defillama/OpenApi/queries.ts')
					const coinId = $market.$base.$coin.coinId
					const llamaId = defillamaCurrentPriceIdByCoinId[coinId]
					if (llamaId == null || llamaId !== feedKey)
						throw new Error('Defillama_OpenApi: Market_Timestamp feedKey does not match catalog coin')
					const priceRow = (await getCurrentPrices([llamaId])).coins[llamaId]
					const timestampMs = priceRow.timestamp * 1000
					if (timestampMs !== timestampMsSelector)
						throw new Error('Defillama_OpenApi: Market_Timestamp id does not match price clock')
					return {
						price: BigInt(Math.round(priceRow.price * 1e8)),
						transport: 'defillama-usd-1e8',
						providerAssetId: llamaId,
					}
				}
			},
		})({
			fields: {
				price: (timestamp) => timestamp.price,
				transport: (timestamp) => timestamp.transport,
				providerAssetId: (timestamp) => timestamp.providerAssetId,
			},
		}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
					const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
					return (
						Object.values(CoinId)
							.flatMap((coinId) => (
							defillamaCurrentPriceIdByCoinId[coinId] != null ?
								[
									{
										[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCurrencyMarket(seededCoinSpotUsdMarketByCoinId[coinId]),
									},
								]
							:
								[]
							))
					)
				}
			},
		})({
			fields: {
				$$markets: (markets) => markets,
			},
		}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.Coin,
				resolve: {
					[CoinSelector.CoinId]: async ({ coinId }: EntitySelector<typeof schema, EntityType.Coin>) => {
						return (
							[
								{
									[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCurrencyMarket(seededCoinSpotUsdMarketByCoinId[coinId]),
								},
							]
						)
					}
				},
		})({
			fields: {
				$$marketsWithCoinAsBase: (markets) => markets,
			},
		}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.Coin,
				resolve: {
					[CoinSelector.CoinId]: async ({ coinId }: EntitySelector<typeof schema, EntityType.Coin>) => {
						const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
						return (
							seededSpotMarketsWithCoinAsQuote
							.filter((catalogMarket) => catalogMarket.quoteCoinId === coinId)
							.map(marketSelectorFromCatalogCoinCoinMarket)
							.filter((marketId) => (
							defillamaCurrentPriceIdByCoinId[marketId.$base.$coin.coinId] != null
							))
							.map((marketId) => (
							{
								[EntityMetaKey.Selector]: marketId,
							}
							))
					)
				}
			},
		})({
			fields: {
				$$marketsWithCoinAsQuote: (markets) => markets,
			},
		}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.Currency,
			resolve: {
				[CurrencySelector.Iso4217]: async ({ iso4217 }: EntitySelector<typeof schema, EntityType.Currency>) => {
					const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
					return (
						(
						iso4217 === Iso4217.USD ?
							seededCoinSpotUsdMarkets.filter((catalogMarket) => (
								defillamaCurrentPriceIdByCoinId[catalogMarket.baseCoinId] != null
							))
						:
							[]
						).map((catalogMarket) => ({
							[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCurrencyMarket(catalogMarket),
						}))
					)
				}
			},
		})({
			fields: {
				$$marketsWithCurrencyAsQuote: (markets) => markets,
			},
		}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.Currency,
			resolve: {
				[CurrencySelector.Iso4217]: async ({ iso4217 }: EntitySelector<typeof schema, EntityType.Currency>) => {
					const markets = seededSpotMarketsWithCurrencyAsBase
						.filter((catalogMarket) => catalogMarket.baseIso4217 === iso4217)
						.map((catalogMarket) => ({
							[EntityMetaKey.Selector]: marketSelectorFromCatalogCurrencyCurrencyMarket(catalogMarket),
						}))
					if (markets.length === 0)
						throw new Error(`Defillama_OpenApi: no catalog markets with ${iso4217} as base`)
					return markets
				}
			},
		})({
			fields: {
				$$marketsWithCurrencyAsBase: (markets) => markets,
			},
		}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.MarketPrice,
			resolve: {
				[MarketPriceSelector.Market]: async ({ $market }) => {
					if ($market.marketKind !== MarketKind.Spot)
						return []
					if ($market.$base.kind !== MarketAssetKind.Coin)
						return []
					if (!catalogCoinCurrencyMarketMatchesMarket(seededCoinSpotUsdMarketByCoinId[$market.$base.$coin.coinId], $market))
						return []
					const { defillamaCurrentPriceIdByCoinId } = await import('$/sources/Defillama/Rest/constants.ts')
					const { getCurrentPrices } = await import('$/sources/Defillama/OpenApi/queries.ts')
					const coinId = $market.$base.$coin.coinId
					const llamaId = defillamaCurrentPriceIdByCoinId[coinId]
					if (llamaId == null)
						return []

					const priceRow = (await getCurrentPrices([llamaId])).coins[llamaId]
					return [
						{
							[EntityMetaKey.Selector]: {
								$market: $market,
								timestampMs: priceRow.timestamp * 1000,
								feedKey: llamaId,
							},
						},
					]
				}
			},
		})({
			fields: {
				$$quotes: (quotes) => quotes.map((quote) => ({
					[EntityMetaKey.Selector]: quote[EntityMetaKey.Selector],
				})),
			},
		}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.MarketPrice,
			resolve: {
				[MarketPriceSelector.Market]: async ({ $market }: EntitySelector<typeof schema, EntityType.MarketPrice>) => (
					{
						[EntityMetaKey.Selector]: $market,
					}
				)
			},
		})({
			fields: {
				$parentMarket: (market) => market,
			},
		}),

		defineResolver(Source.Defillama_OpenApi, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
					const { getChainSlugByChainId, getChainIconUrl } = await import('$/sources/Defillama/OpenApi/queries.ts')
					const slug = getChainSlugByChainId[Number(caip2.reference)]
					if (slug == null) throw new Error(`Defillama_OpenApi: no chain icon slug for chain ${caip2.reference}`)
					const iconMedia = mediaFromUrl(getChainIconUrl(slug), MediaType.Image)
					if (iconMedia == null) throw new Error(`Defillama_OpenApi: invalid icon URL for chain ${caip2.reference}`)
					return iconMedia
				}
			},
		})({
			fields: {
				$icon: (iconMedia) => iconMedia,
			},
		}),
	],
}

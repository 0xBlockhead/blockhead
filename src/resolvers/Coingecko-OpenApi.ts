import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import type { CoinId } from '$/constants/Coin.ts'
import {
	MarketAssetKind,
	MarketKind,
	marketOhlcDefaultLookbackDayCount,
	marketOhlcDailyTimeInterval,
	marketOhlcDayLookbackValues,
	type MarketIdLabelInput,
} from '$/constants/Market.ts'
import { Iso4217 } from '$/constants/Currency.ts'
import {
	catalogCoinSpotUsdMarkets,
	catalogCoinSpotUsdMarketByCoinId,
	catalogSpotMarketsWithCoinAsQuote,
	catalogSpotMarketsWithCurrencyAsBase,
	type CatalogCoinCoinMarket,
	type CatalogCoinCurrencyMarket,
	type CatalogCurrencyCurrencyMarket,
} from '$/constants/MarketCatalog.ts'
import { stringify } from 'devalue'
import {
	defineResolver,
	type SourceResolverContext,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'
import { Market_Derivative_TimestampSelector } from '$/schema/Market_Derivative_Timestamp.ts'
import { Market_TimestampSelector } from '$/schema/Market_Timestamp.ts'
import { Market_TimeInterval_TimestampSelector } from '$/schema/Market_TimeInterval_Timestamp.ts'
import { MarketSelector } from '$/schema/Market.ts'
import { MarketVenueSelector } from '$/schema/MarketVenue.ts'
import { CoinSelector } from '$/schema/Coin.ts'
import { CurrencySelector } from '$/schema/Currency.ts'
import { MarketPriceSelector } from '$/schema/MarketPrice.ts'

const coingeckoOpenApiDerivativeTickerForMarket = async (
	market: EntitySelector<typeof schema, EntityType.Market>,
	context: SourceResolverContext<Source.Coingecko_OpenApi>
) => {
	const { coingeckoDerivativesExchangeIdByMarketVenueId } = await import(
		'$/sources/Coingecko/Rest/constants.ts'
	)
	const { derivativeTickerMatchesMarket } = await import('$/sources/Coingecko/marketKind.ts')
	const exchangeId = (
		coingeckoDerivativesExchangeIdByMarketVenueId[
			market.$marketVenue.marketVenueId
		]
	)
	if (exchangeId == null)
		throw new Error(
			`Coingecko_OpenApi: derivatives exchange not mapped for venue ${market.$marketVenue.marketVenueId}`
		)
	const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
	const { catalogCoinIdByCoingeckoId } = await import('$/sources/Coingecko/marketKind.ts')
	const catalogCoinIdByCoingeckoIdMap = catalogCoinIdByCoingeckoId(idByCoinId)
	const { getDerivativesExchangeById } = await import(
		'$/sources/Coingecko/OpenApi/queries.ts'
	)
	const exchange = await getDerivativesExchangeById({
		publicEnv: context.publicEnv,
		exchangeId,
	})
	const ticker = exchange?.tickers?.find((exchangeTicker) => (
		derivativeTickerMatchesMarket(
			market,
			exchangeTicker,
			catalogCoinIdByCoingeckoIdMap
		)
	))
	if (ticker == null)
		throw new Error(
			`Coingecko_OpenApi: no derivative ticker for ${market.$marketVenue.marketVenueId} market`
		)
	return ticker
}

/** Spot + OHLC via checked-in `coingecko-demo.json` (`GET /coins/{id}`, `/coins/{id}/ohlc`). */
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
	source: Source.Coingecko_OpenApi,

	resolvers: [
		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Market_Derivative_Timestamp,
			resolve: {
				[Market_Derivative_TimestampSelector.MarketTimestampMsFeedKey]: async ({ $market }, context) => {
					if ($market.marketKind === MarketKind.Spot)
						throw new Error('Coingecko_OpenApi: Market_Derivative_Timestamp is derivative-only')
					const ticker = await coingeckoOpenApiDerivativeTickerForMarket($market, context)
					return {
						...(ticker.funding_rate != null && { fundingRate: ticker.funding_rate }),
						...(ticker.open_interest_usd != null && {
							openInterestUsd: BigInt(Math.round(ticker.open_interest_usd)),
						}),
						...(ticker.index_basis_percentage != null && {
							indexBasisPercent: ticker.index_basis_percentage,
						}),
						...(ticker.expired_at != null && ticker.expired_at !== '' && {
							expiredAtMs: Date.parse(ticker.expired_at),
						}),
						...(ticker.last_traded != null && {
							lastTradedAtMs: ticker.last_traded * 1000,
						}),
						providerAssetId: ticker.symbol ?? null,
						transport: 'Coingecko OpenAPI',
					}
				}
			},
		})({
			fields: {
				fundingRate: (timestamp) => timestamp.fundingRate,
				openInterestUsd: (timestamp) => timestamp.openInterestUsd,
				indexBasisPercent: (timestamp) => timestamp.indexBasisPercent,
				expiredAtMs: (timestamp) => timestamp.expiredAtMs,
				lastTradedAtMs: (timestamp) => timestamp.lastTradedAtMs,
				providerAssetId: (timestamp) => timestamp.providerAssetId,
				transport: (timestamp) => timestamp.transport,
			},
		}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Market_Timestamp,
			resolve: {
				[Market_TimestampSelector.MarketTimestampMsFeedKey]: async ({ $market, feedKey, timestampMs: timestampMsSelector }, context) => {
					if ($market.marketKind !== MarketKind.Spot)
						throw new Error('Coingecko_OpenApi: Market_Timestamp is spot-only')
					if ($market.$base.kind !== MarketAssetKind.Coin)
						throw new Error('Market source: market base must be catalog coin')
					if (stringify(marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[$market.$base.$coin.coinId])) !== stringify($market))
						throw new Error('Coingecko_OpenApi: Market_Timestamp is catalog coin USD market only')
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					const { getCoinMarketSpot } = await import('$/sources/Coingecko/OpenApi/queries.ts')
					const coinId = $market.$base.$coin.coinId
					const coingeckoId = idByCoinId[coinId]
					if (coingeckoId == null) throw new Error('Coingecko_OpenApi: coin price not mapped')
					if (feedKey !== coingeckoId)
						throw new Error('Coingecko_OpenApi: Market_Timestamp feedKey does not match Coingecko id')

					const spot = await getCoinMarketSpot({
						publicEnv: context.publicEnv,
						coingeckoId,
					})
					if (spot == null) throw new Error('Coingecko_OpenApi: coin market spot not returned')
					const timestampMs = spot.lastUpdatedAtSec * 1000
					if (timestampMs !== timestampMsSelector)
						throw new Error('Coingecko_OpenApi: Market_Timestamp id does not match spot clock')

					return {
						price: BigInt(Math.round(spot.usd * 1e8)),
						transport: 'coingecko-openapi-coins-id-market-data-usd-1e8',
						providerAssetId: coingeckoId,
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

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: {
				[Market_TimeInterval_TimestampSelector.MarketTimeIntervalTimestampMs]: async ({ $market, timeInterval, timestampMs: timestampMsSelector }, context) => {
					if ($market.marketKind !== MarketKind.Spot)
						throw new Error('Coingecko_OpenApi: OHLC is spot-only')
					if ($market.$base.kind !== MarketAssetKind.Coin)
						throw new Error('Market source: market base must be catalog coin')
					if (stringify(marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[$market.$base.$coin.coinId])) !== stringify($market))
						throw new Error('Coingecko_OpenApi: OHLC is catalog coin USD market only')
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					const { getCoinOhlc } = await import('$/sources/Coingecko/OpenApi/queries.ts')
					if (timeInterval.unit !== marketOhlcDailyTimeInterval.unit || timeInterval.value !== marketOhlcDailyTimeInterval.value)
						throw new Error('Coingecko_OpenApi: OHLC timeInterval must be daily')
					const coinId = $market.$base.$coin.coinId
					const coingeckoId = idByCoinId[coinId]
					if (coingeckoId == null) throw new Error('Coingecko_OpenApi: OHLC coin not mapped')

					const ohlcCandles = await getCoinOhlc({
						publicEnv: context.publicEnv,
						coingeckoId,
						vsCurrency: 'usd',
						lookbackDayCount: marketOhlcDefaultLookbackDayCount,
					})
					const ohlcCandle = ohlcCandles.find(([timestampMs]) => (
						Math.floor(timestampMs) === timestampMsSelector
					))
					if (ohlcCandle == null) throw new Error('Coingecko_OpenApi: OHLC candle not found for timestamp')
					const [timestampMs, open, high, low, close] = ohlcCandle
					return {
						[EntityMetaKey.Selector]: {
							$market,
							timeInterval: marketOhlcDailyTimeInterval,
							timestampMs: Math.floor(timestampMs),
						} satisfies EntitySelector<typeof schema, EntityType.Market_TimeInterval_Timestamp>,
						open: BigInt(Math.round(open * 1e8)),
						high: BigInt(Math.round(high * 1e8)),
						low: BigInt(Math.round(low * 1e8)),
						close: BigInt(Math.round(close * 1e8)),
					}
				}
			},
		})({
			fields: {
				open: (timestamp) => timestamp.open,
				high: (timestamp) => timestamp.high,
				low: (timestamp) => timestamp.low,
				close: (timestamp) => timestamp.close,
			},
		}),
		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Market,
			resolve: {
				[MarketSelector.BaseQuoteMarketVenueKind]: async (entitySelector, context) => {
					if (entitySelector.marketKind === MarketKind.Spot) return []
					const ticker = await coingeckoOpenApiDerivativeTickerForMarket(entitySelector, context)
					return [
						{
							[EntityMetaKey.Selector]: {
								$market: entitySelector,
								timestampMs: (
									ticker.last_traded != null ?
										ticker.last_traded * 1000
									:
										Date.now()
								),
								feedKey: `coingecko:${ticker.symbol ?? entitySelector.$marketVenue.marketVenueId}`,
							},
						},
					]
				}
			},
		})({
			fields: {
				$$derivativeTimestamps: (market) => market,
			},
		}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Market_Derivative_Timestamp,
			resolve: {
				[Market_Derivative_TimestampSelector.MarketTimestampMsFeedKey]: async ({ $market }) => ({
					[EntityMetaKey.Selector]: $market,
				})
			},
		})({
			fields: {
				$parentMarket: (timestamp) => timestamp,
			},
		}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector, context) => {
					const { collectDerivativeMarketEntitySelectors } = await import(
						'$/sources/Coingecko/OpenApi/queries.ts'
					)
					const lim = resolverContextRowLimit(context)
					const marketIds = await collectDerivativeMarketEntitySelectors({
						publicEnv: context.publicEnv,
					})
					return (
						marketIds
							.slice(0, lim)
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
				$$markets: (globalScope) => globalScope,
			},
		}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.MarketVenue,
			resolve: {
				[MarketVenueSelector.MarketVenueId]: async ({ marketVenueId }, context) => {
					const { collectDerivativeMarketEntitySelectors } = await import(
						'$/sources/Coingecko/OpenApi/queries.ts'
					)
					const lim = resolverContextRowLimit(context)
					const marketIds = await collectDerivativeMarketEntitySelectors({
						publicEnv: context.publicEnv,
						marketVenueId: marketVenueId,
					})
					return (
						marketIds
							.slice(0, lim)
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
				$$markets: (marketVenue) => marketVenue,
			},
		}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Coin,
			resolve: {
				[CoinSelector.CoinId]: async ({ coinId }, context) => {
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					const spotMarketId = marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[coinId])
					const coingeckoId = idByCoinId[coinId]
					if (coingeckoId == null)
						return [
							{
								[EntityMetaKey.Selector]: spotMarketId,
							},
						]
					const {
						collectDerivativeMarketEntitySelectors,
						collectSpotMarketEntitySelectorsForCoin,
					} = await import('$/sources/Coingecko/OpenApi/queries.ts')
					const lim = resolverContextRowLimit(context)
					const spotVenueMarketIds = await collectSpotMarketEntitySelectorsForCoin({
						publicEnv: context.publicEnv,
						catalogCoinId: coinId,
						coingeckoId,
					})
					const derivativeMarketIds = await collectDerivativeMarketEntitySelectors({
						publicEnv: context.publicEnv,
						catalogCoinId: coinId,
					})
					return (
						[
							spotMarketId,
							...spotVenueMarketIds,
							...derivativeMarketIds,
						]
							.map((marketId) => ({
								[EntityMetaKey.Selector]: marketId,
							}))
							.slice(0, lim)
					)
				}
			},
		})({
			fields: {
				$$marketsWithCoinAsBase: (coin) => coin,
			},
		}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Coin,
			resolve: {
				[CoinSelector.CoinId]: async ({ coinId }: EntitySelector<typeof schema, EntityType.Coin>, context) => {
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					if (idByCoinId[coinId] == null)
						return []
					const lim = resolverContextRowLimit(context)
					return (
						catalogSpotMarketsWithCoinAsQuote
							.filter((catalogMarket) => catalogMarket.quoteCoinId === coinId)
							.map(marketSelectorFromCatalogCoinCoinMarket)
							.filter((marketId) => (
							idByCoinId[marketId.$base.$coin.coinId] != null
							))
							.slice(0, lim)
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
				$$marketsWithCoinAsQuote: (coin) => coin,
			},
		}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
					const { coinById } = await import('$/constants/Coin.ts')
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					return (
						Object.entries(idByCoinId)
							.filter(([coinId]) => coinId in coinById)
							.map(([coinId]) => (
							{
								[EntityMetaKey.Selector]: {
									$market: marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[coinId]),
								},
							}
							))
					)
				}
			},
		})({
			fields: {
				$$marketPrices: (globalScope) => globalScope,
			},
		}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Market,
			resolve: {
				[MarketSelector.BaseQuoteMarketVenueKind]: async (entitySelector: EntitySelector<typeof schema, EntityType.Market>, context) => {
					if (entitySelector.marketKind !== MarketKind.Spot)
						return []
					if (entitySelector.$base.kind !== MarketAssetKind.Coin)
						return []
					if (stringify(marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[entitySelector.$base.$coin.coinId])) !== stringify(entitySelector))
						return []
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					const { getCoinOhlc } = await import('$/sources/Coingecko/OpenApi/queries.ts')
					const coinId = entitySelector.$base.$coin.coinId
					if (idByCoinId[coinId] == null) throw new Error('Coingecko_OpenApi: OHLC coin not mapped')
					const coingeckoId = idByCoinId[coinId]
					const lim = resolverContextRowLimit(context)
					return (
						(await Promise.all([marketOhlcDayLookbackValues.find((value) => value >= lim) ?? marketOhlcDefaultLookbackDayCount].map(async (value) => {
						const ohlcCandles = await getCoinOhlc({
							publicEnv: context.publicEnv,
							coingeckoId,
							vsCurrency: 'usd',
							lookbackDayCount: value,
						})
						return ohlcCandles.map(([timestampMs, open, high, low, close]) => ({
							[EntityMetaKey.Selector]: {
								$market: entitySelector,
								timeInterval: marketOhlcDailyTimeInterval,
								timestampMs: Math.floor(timestampMs),
							} satisfies EntitySelector<typeof schema, EntityType.Market_TimeInterval_Timestamp>,
							open: BigInt(Math.round(open * 1e8)),
							high: BigInt(Math.round(high * 1e8)),
							low: BigInt(Math.round(low * 1e8)),
							close: BigInt(Math.round(close * 1e8)),
						}))
						}))).flat().slice(0, lim)
					)
				}
			},
		})({
			fields: {
				$$marketTimeIntervalTimestamps: (market) => market,
			},
		}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Currency,
			resolve: {
				[CurrencySelector.Iso4217]: async ({ iso4217 }: EntitySelector<typeof schema, EntityType.Currency>) => {
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					return (
						(
						iso4217 === Iso4217.USD ?
							catalogCoinSpotUsdMarkets.filter((catalogMarket) => (
								idByCoinId[catalogMarket.baseCoinId] != null
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
				$$marketsWithCurrencyAsQuote: (currency) => currency,
			},
		}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Currency,
			resolve: {
				[CurrencySelector.Iso4217]: async ({ iso4217 }: EntitySelector<typeof schema, EntityType.Currency>) => {
					const markets = catalogSpotMarketsWithCurrencyAsBase
						.filter((catalogMarket) => catalogMarket.baseIso4217 === iso4217)
						.map((catalogMarket) => ({
							[EntityMetaKey.Selector]: marketSelectorFromCatalogCurrencyCurrencyMarket(catalogMarket),
						}))
					if (markets.length === 0)
						throw new Error(`Coingecko_OpenApi: no catalog markets with ${iso4217} as base`)
					return markets
				}
			},
		})({
			fields: {
				$$marketsWithCurrencyAsBase: (currency) => currency,
			},
		}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.MarketPrice,
			resolve: {
				[MarketPriceSelector.Market]: async ({ $market }, context) => {
					if ($market.marketKind !== MarketKind.Spot)
						return []
					if ($market.$base.kind !== MarketAssetKind.Coin)
						return []
					if (stringify(marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[$market.$base.$coin.coinId])) !== stringify($market))
						return []
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					const { getCoinMarketSpot } = await import('$/sources/Coingecko/OpenApi/queries.ts')
					const coinId = $market.$base.$coin.coinId
					const coingeckoId = idByCoinId[coinId]
					if (coingeckoId == null) throw new Error('Coingecko_OpenApi: coin price not mapped')
					const spot = await getCoinMarketSpot({
						publicEnv: context.publicEnv,
						coingeckoId,
					})
					if (spot == null) throw new Error('Coingecko_OpenApi: coin market spot not returned')
					return [
						{
							[EntityMetaKey.Selector]: {
								$market: $market,
								timestampMs: spot.lastUpdatedAtSec * 1000,
								feedKey: coingeckoId,
							},
						},
					]
				}
			},
		})({
			fields: {
				$$quotes: (marketPrice) => marketPrice,
			},
		}),

		defineResolver(Source.Coingecko_OpenApi, {
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
				$parentMarket: (marketPrice) => marketPrice,
			},
		}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: {
				[Market_TimeInterval_TimestampSelector.MarketTimeIntervalTimestampMs]: async ({ $market }: EntitySelector<typeof schema, EntityType.Market_TimeInterval_Timestamp>) => (
					{
						[EntityMetaKey.Selector]: $market,
					}
				)
			},
		})({
			fields: {
				$parentMarket: (timestamp) => timestamp,
			},
		}),
	],
}

import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import type { CoinId } from '$/constants/Coin.ts'
import {
	MarketAssetKind,
	MarketKind,
	marketOhlcDefaultLookbackDayCount,
	marketOhlcDailyTimeInterval,
	marketOhlcDayLookbackValues,
} from '$/constants/Market.ts'
import {
	seededCoinSpotUsdMarkets,
	seededCoinSpotUsdMarketByCoinId,
	type CatalogCoinCurrencyMarket,
} from '$/constants/MarketCatalog.ts'
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
import { CoinSelector } from '$/schema/Coin.ts'
import { MarketPriceSelector } from '$/schema/MarketPrice.ts'

const coingeckoOpenApiDerivativeTickerForMarket = async (
	market: EntitySelector<typeof schema, EntityType.Market>,
	context: SourceResolverContext<Source.Coingecko_OpenApi>
) => {
	const { coingeckoDerivativesExchangeIdByMarketVenueId } = await import(
		'$/sources/Coingecko/Rest/constants.ts'
	)
	const { derivativeTickerMatchesMarket } = await import('$/resolvers/Coingecko/marketKind.ts')
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
	const { catalogCoinIdByCoingeckoId } = await import('$/resolvers/Coingecko/marketKind.ts')
	const catalogCoinIdByCoingeckoIdMap = catalogCoinIdByCoingeckoId(idByCoinId)
	const { getDerivativesExchangeById } = await import(
		'$/resolvers/Coingecko/OpenApi/queries.ts'
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
							providerAssetId: ticker.symbol,
						transport: 'Coingecko OpenAPI',
					}
				}
			},
		})({
				fundingRate: (timestamp) => timestamp.fundingRate,
				openInterestUsd: (timestamp) => timestamp.openInterestUsd,
				indexBasisPercent: (timestamp) => timestamp.indexBasisPercent,
				expiredAtMs: (timestamp) => timestamp.expiredAtMs,
				lastTradedAtMs: (timestamp) => timestamp.lastTradedAtMs,
				providerAssetId: (timestamp) => timestamp.providerAssetId,
				transport: (timestamp) => timestamp.transport,
				$parentMarket: (_timestamp, { $market }) => (
					{
						[EntityMetaKey.Selector]: $market,
					}
				),
			}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Market_Timestamp,
			resolve: {
				[Market_TimestampSelector.MarketTimestampMsFeedKey]: async ({ $market, feedKey, timestampMs: timestampMsSelector }, context) => {
					if ($market.marketKind !== MarketKind.Spot)
						throw new Error('Coingecko_OpenApi: Market_Timestamp is spot-only')
					if ($market.$base.kind !== MarketAssetKind.Coin)
						throw new Error('Market source: market base must be catalog coin')
					if (!catalogCoinCurrencyMarketMatchesMarket($market))
						throw new Error('Coingecko_OpenApi: Market_Timestamp is catalog coin USD market only')
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					const { getCoinMarketSpot } = await import('$/resolvers/Coingecko/OpenApi/queries.ts')
					const coinId = $market.$base.assetKey
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
				price: (timestamp) => timestamp.price,
				transport: (timestamp) => timestamp.transport,
				providerAssetId: (timestamp) => timestamp.providerAssetId,
			}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: {
				[Market_TimeInterval_TimestampSelector.MarketTimeIntervalTimestampMs]: async ({ $market, timeInterval, timestampMs: timestampMsSelector }, context) => {
					if ($market.marketKind !== MarketKind.Spot)
						throw new Error('Coingecko_OpenApi: OHLC is spot-only')
					if ($market.$base.kind !== MarketAssetKind.Coin)
						throw new Error('Market source: market base must be catalog coin')
					if (!catalogCoinCurrencyMarketMatchesMarket($market))
						throw new Error('Coingecko_OpenApi: OHLC is catalog coin USD market only')
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					const { getCoinOhlc } = await import('$/resolvers/Coingecko/OpenApi/queries.ts')
					if (timeInterval.unit !== marketOhlcDailyTimeInterval.unit || timeInterval.value !== marketOhlcDailyTimeInterval.value)
						throw new Error('Coingecko_OpenApi: OHLC timeInterval must be daily')
					const coinId = $market.$base.assetKey
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
				open: (timestamp) => timestamp.open,
				high: (timestamp) => timestamp.high,
				low: (timestamp) => timestamp.low,
				close: (timestamp) => timestamp.close,
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
				$$derivativeTimestamps: (market) => market,
			}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Market_Derivative_Timestamp,
			resolve: {
				[Market_Derivative_TimestampSelector.MarketTimestampMsFeedKey]: async ({ $market }) => ({
					[EntityMetaKey.Selector]: $market,
				})
			},
		})({
				$parentMarket: (_timestamp, { $market }) => (
					{
						[EntityMetaKey.Selector]: $market,
					}
				),
			}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector, context) => {
					const { collectDerivativeMarketEntitySelectors } = await import(
						'$/resolvers/Coingecko/OpenApi/queries.ts'
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
				$$markets: (globalScope) => globalScope,
			}),


		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Coin,
			resolve: {
				[CoinSelector.CoinId]: async ({ coinId }, context) => {
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					const coingeckoId = idByCoinId[coinId]
					if (coingeckoId == null)
						return []
					const {
						collectDerivativeMarketEntitySelectors,
						collectSpotMarketEntitySelectorsForCoin,
					} = await import('$/resolvers/Coingecko/OpenApi/queries.ts')
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
				$$marketsWithCoinAsBase: (coin) => coin,
			}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => {
					const { CoinId, coinById } = await import('$/constants/Coin.ts')
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					const { getCoinMarketSpot } = await import('$/resolvers/Coingecko/OpenApi/queries.ts')
					const lim = resolverContextRowLimit(context)
					return (
						(await Promise.all(
							Object.values(CoinId)
								.filter((coinId) => idByCoinId[coinId] != null && coinId in coinById)
								.slice(0, lim)
								.map(async (coinId) => {
									const coingeckoId = idByCoinId[coinId]
									if (coingeckoId == null)
										return []
									const spot = await getCoinMarketSpot({
										publicEnv: context.publicEnv,
										coingeckoId,
									})
									if (spot == null)
										return []
									return [
										{
											[EntityMetaKey.Selector]: {
												$market: marketSelectorFromCatalogCoinCurrencyMarket(seededCoinSpotUsdMarketByCoinId[coinId]),
												timestampMs: spot.lastUpdatedAtSec * 1000,
												feedKey: coingeckoId,
											},
										},
									]
								})
						)).flat()
					)
				}
			},
		})({
				$$marketPrices: (globalScope) => globalScope,
			}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Market,
			resolve: {
				[MarketSelector.BaseQuoteMarketVenueKind]: async (entitySelector: EntitySelector<typeof schema, EntityType.Market>, context) => {
					if (entitySelector.marketKind !== MarketKind.Spot)
						return []
					if (entitySelector.$base.kind !== MarketAssetKind.Coin)
						return []
					if (!catalogCoinCurrencyMarketMatchesMarket(entitySelector))
						return []
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					const { getCoinOhlc } = await import('$/resolvers/Coingecko/OpenApi/queries.ts')
					const coinId = entitySelector.$base.assetKey
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
				$$marketTimeIntervalTimestamps: (market) => market,
			}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.MarketPrice,
			resolve: {
				[MarketPriceSelector.Market]: async ({ $market }, context) => {
					if ($market.marketKind !== MarketKind.Spot)
						return []
					if ($market.$base.kind !== MarketAssetKind.Coin)
						return []
					if (!catalogCoinCurrencyMarketMatchesMarket($market))
						return []
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					const { getCoinMarketSpot } = await import('$/resolvers/Coingecko/OpenApi/queries.ts')
					const coinId = $market.$base.assetKey
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
				$$quotes: (marketPrice) => marketPrice,
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
				$parentMarket: (marketPrice) => marketPrice,
			}),

		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: {
				[Market_TimeInterval_TimestampSelector.MarketTimeIntervalTimestampMs]: async ({ $market }) => (
					{
						[EntityMetaKey.Selector]: $market,
					}
				)
			},
		})({
				$parentMarket: (timestamp) => timestamp,
			}),
	],
}

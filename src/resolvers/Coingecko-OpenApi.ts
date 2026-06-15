import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import type { CoinId } from '$/constants/Coin.ts'
import {
	MarketAssetKind,
	MarketKind,
	MarketTimeIntervalUnit,
	coingeckoOhlcDayWindowLengths,
} from '$/constants/Market.ts'
import { Iso4217 } from '$/constants/Currency.ts'
import {
	catalogCoinUsdMarketIdByCoinId,
	catalogSpotMarketsWithCoinAsQuote,
	catalogSpotMarketsWithCurrencyAsBase,
	catalogMarketsWithCurrencyAsQuoteUsd,
} from '$/constants/MarketCatalog.ts'
import {
	assertCoingeckoDayOhlcTimeInterval,
	candlesFromOhlc,
	candleFromOhlc,
} from '$/lib/marketOhlcCandles.ts'
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
	context: SourceResolverContext<Source.Coingecko_OpenApi>,
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
	if (exchangeId == null) {
		throw new Error(
			`Coingecko_OpenApi: derivatives exchange not mapped for venue ${market.$marketVenue.marketVenueId}`,
		)
	}
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
			catalogCoinIdByCoingeckoIdMap,
		)
	))
	if (ticker == null) {
		throw new Error(
			`Coingecko_OpenApi: no derivative ticker for ${market.$marketVenue.marketVenueId} market`,
		)
	}
	return ticker
}

/** Spot + OHLC via checked-in `coingecko-demo.json` (`GET /coins/{id}`, `/coins/{id}/ohlc`). */
export default {
	source: Source.Coingecko_OpenApi,

	resolvers: [
		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType.Market_Derivative_Timestamp,
			resolve: {
				[Market_Derivative_TimestampSelector.MarketTimestampMsFeedKey]: async ({ $market }, context) => {
				if ($market.marketKind === MarketKind.Spot) {
					throw new Error('Coingecko_OpenApi: Market_Derivative_Timestamp is derivative-only')
				}
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
				[Market_TimestampSelector.MarketTimestampMsFeedKey]: async ({ $market, timestampMs: timestampMsSelector }, context) => {
				if ($market.marketKind !== MarketKind.Spot) {
					throw new Error('Coingecko_OpenApi: Market_Timestamp is spot-only')
				}
				if ($market.$base.kind !== MarketAssetKind.Coin) {
					throw new Error('Market source: market base must be catalog coin')
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[$market.$base.$coin.coinId]) !== stringify($market)) {
					throw new Error('Coingecko_OpenApi: Market_Timestamp is catalog coin USD market only')
				}
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
				const timestampMs = spot.lastUpdatedAtSec * 1000
				if (timestampMs !== timestampMsSelector) {
					throw new Error('Coingecko_OpenApi: Market_Timestamp id does not match spot clock')
				}

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
				[Market_TimeInterval_TimestampSelector.MarketTimeIntervalTimestampMsFeedKey]: async ({ $market, timeInterval, timestampMs: timestampMsSelector, feedKey }, context) => {
				if ($market.marketKind !== MarketKind.Spot) {
					throw new Error('Coingecko_OpenApi: OHLC is spot-only')
				}
				if ($market.$base.kind !== MarketAssetKind.Coin) {
					throw new Error('Market source: market base must be catalog coin')
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[$market.$base.$coin.coinId]) !== stringify($market)) {
					throw new Error('Coingecko_OpenApi: OHLC is catalog coin USD market only')
				}
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoinOhlc } = await import('$/sources/Coingecko/OpenApi/queries.ts')
				assertCoingeckoDayOhlcTimeInterval(timeInterval, 'Coingecko_OpenApi')
				const coinId = $market.$base.$coin.coinId
				const coingeckoId = idByCoinId[coinId]
				if (coingeckoId == null) throw new Error('Coingecko_OpenApi: OHLC coin not mapped')

				const ohlcCandles = await getCoinOhlc({
					publicEnv: context.publicEnv,
					coingeckoId,
					vsCurrency: 'usd',
					days: timeInterval.value,
				})
				const ohlcCandle = ohlcCandles.find(([timestampMs]) => (
					Math.floor(timestampMs) === timestampMsSelector
				))
				if (ohlcCandle == null) throw new Error('Coingecko_OpenApi: OHLC candle not found for timestamp')
				return (
					candleFromOhlc(
						$market,
						timeInterval,
						feedKey,
						ohlcCandle,
					)
				)
			}
			},
		})({
				fields: {
				open: (timestamp) => timestamp.open,
				high: (timestamp) => timestamp.high,
				low: (timestamp) => timestamp.low,
				close: (timestamp) => timestamp.close,
				quoteVolume: (timestamp) => timestamp.quoteVolume,
			},
			}),
		defineResolver(Source.Coingecko_OpenApi, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async () => {
				throw new Error('Coingecko_OpenApi: $$marketTimeIntervalTimestamps is not implemented')
			}
			},
		})({
				fields: {
				$$marketTimeIntervalTimestamps: (globalScope) => globalScope,
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
				const spotMarketId = catalogCoinUsdMarketIdByCoinId[coinId]
				const coingeckoId = idByCoinId[coinId]
				if (coingeckoId == null) {
					return [
						{
							[EntityMetaKey.Selector]: spotMarketId,
						},
					]
				}
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
				if (idByCoinId[coinId] == null) {
					return []
				}
				const lim = resolverContextRowLimit(context)
				return (
					catalogSpotMarketsWithCoinAsQuote
						.filter((catalogMarket) => catalogMarket.quoteCoinId === coinId)
						.map((catalogMarket) => catalogMarket.marketId)
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
									$market: catalogCoinUsdMarketIdByCoinId[coinId],
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
				if (entitySelector.marketKind !== MarketKind.Spot) {
					return []
				}
				if (entitySelector.$base.kind !== MarketAssetKind.Coin) {
					return []
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entitySelector.$base.$coin.coinId]) !== stringify(entitySelector)) {
					return []
				}
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoinOhlc } = await import('$/sources/Coingecko/OpenApi/queries.ts')
				const coinId = entitySelector.$base.$coin.coinId
				if (idByCoinId[coinId] == null) throw new Error('Coingecko_OpenApi: OHLC coin not mapped')
				const coingeckoId = idByCoinId[coinId]
				const lim = resolverContextRowLimit(context)
				const candles = []
				for (const value of coingeckoOhlcDayWindowLengths) {
					const timeInterval = (
						{
							unit: MarketTimeIntervalUnit.Day,
							value,
						}
					)
					const ohlcCandles = await getCoinOhlc({
						publicEnv: context.publicEnv,
						coingeckoId,
						vsCurrency: 'usd',
						days: value,
					})
					candles.push(
						...candlesFromOhlc(
							entitySelector,
							timeInterval,
							coingeckoId,
							ohlcCandles,
						),
					)
				}
				return (
					candles.slice(0, lim)
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
							catalogMarketsWithCurrencyAsQuoteUsd.filter((marketId) => (
								idByCoinId[marketId.$base.$coin.coinId] != null
							))
						:
							[]
					).map((marketId) => ({
						[EntityMetaKey.Selector]: marketId,
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
						.filter((catalogMarket) => catalogMarket.iso4217 === iso4217)
						.map((catalogMarket) => ({
							[EntityMetaKey.Selector]: catalogMarket.marketId,
						}))
				if (markets.length === 0) {
					throw new Error(`Coingecko_OpenApi: no catalog markets with ${iso4217} as base`)
				}
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
				if ($market.marketKind !== MarketKind.Spot) {
					return []
				}
				if ($market.$base.kind !== MarketAssetKind.Coin) {
					return []
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[$market.$base.$coin.coinId]) !== stringify($market)) {
					return []
				}
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
				[Market_TimeInterval_TimestampSelector.MarketTimeIntervalTimestampMsFeedKey]: async ({ $market }: EntitySelector<typeof schema, EntityType.Market_TimeInterval_Timestamp>) => (
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

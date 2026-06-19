import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import type { CoinId } from '$/constants/Coin.ts'
import {
	MarketAssetKind,
	MarketKind,
	marketOhlcDailyTimeInterval,
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
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { MediaType } from '$/schema/Media.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'
import { CoinSelector } from '$/schema/Coin.ts'
import { Market_TimestampSelector } from '$/schema/Market_Timestamp.ts'
import { Market_TimeInterval_TimestampSelector } from '$/schema/Market_TimeInterval_Timestamp.ts'
import { MarketVenueSelector } from '$/schema/MarketVenue.ts'
import { CurrencySelector } from '$/schema/Currency.ts'
import { MarketSelector } from '$/schema/Market.ts'
import { MarketPriceSelector } from '$/schema/MarketPrice.ts'

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
	source: Source.Coinpaprika_OpenApi,

	resolvers: [
		defineResolver(Source.Coinpaprika_OpenApi, {
			entityType: EntityType.Coin,
			resolve: {
				[CoinSelector.CoinId]: async ({ coinId }, context) => {
					const { coinById } = await import('$/constants/Coin.ts')
					const {
						idByCoinId,
						decimalsByCoinId,
					} = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
					const { getCoinById } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
					const coinpaprikaId = idByCoinId[coinId]
					if (coinpaprikaId == null) throw new Error('Coinpaprika_OpenApi: coin not mapped')

					const coin = await getCoinById({
						publicEnv: context.publicEnv,
						coinpaprikaId,
					})

					const decimals = decimalsByCoinId[coinId]
					const logoMedia = mediaFromUrl(coin.logo, MediaType.Image)
					const coinName = coin.name ?? ''
					const coinSymbol = coin.symbol ?? ''

					return {
						name: (
							coinName === '' ?
								coinById[coinId].symbol
							:
								coinName
						),
						symbol: (
							coinSymbol === '' ?
								coinById[coinId].symbol
							:
								coinSymbol.toUpperCase()
						),
						...(logoMedia != null && { $logo: logoMedia }),
					}
				}
			},
		})({
			fields: {
				name: (coin) => coin.name,
				symbol: (coin) => coin.symbol,
				$logo: (coin) => coin.$logo,
			},
		}),

		defineResolver(Source.Coinpaprika_OpenApi, {
			entityType: EntityType.Market_Timestamp,
			resolve: {
				[Market_TimestampSelector.MarketTimestampMsFeedKey]: async ({ $market, feedKey, timestampMs: timestampMsSelector }, context) => {
					if ($market.marketKind !== MarketKind.Spot)
						throw new Error('Coinpaprika_OpenApi: Market_Timestamp is spot-only')
					if ($market.$base.kind !== MarketAssetKind.Coin)
						throw new Error('Market source: market base must be catalog coin')
					if (stringify(marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[$market.$base.$coin.coinId])) !== stringify($market))
						throw new Error('Coinpaprika_OpenApi: Market_Timestamp is catalog coin USD market only')
					const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
					const { getTickerById } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
					const coinId: CoinId = $market.$base.$coin.coinId
					const coinpaprikaId = idByCoinId[coinId]
					if (coinpaprikaId == null) throw new Error('Coinpaprika_OpenApi: coin price not mapped')
					if (feedKey !== coinpaprikaId)
						throw new Error('Coinpaprika_OpenApi: Market_Timestamp feedKey does not match Coinpaprika id')

					const ticker = await getTickerById({
						publicEnv: context.publicEnv,
						coinpaprikaId,
					})
					const price = ticker.quotes?.USD.price
					const updatedAtMs = (
						ticker.last_updated == null || ticker.last_updated === '' ?
							NaN
						:
							Date.parse(ticker.last_updated)
					)

					if (price == null || !Number.isFinite(price) || !Number.isFinite(updatedAtMs))
						throw new Error('Coinpaprika_OpenApi: ticker invalid')
					const timestampMs = updatedAtMs
					if (timestampMs !== timestampMsSelector)
						throw new Error('Coinpaprika_OpenApi: Market_Timestamp id does not match ticker clock')

					return {
						price: BigInt(Math.round((price ) * 1e8)),
						transport: 'coinpaprika-usd-1e8',
						providerAssetId: coinpaprikaId,
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

		defineResolver(Source.Coinpaprika_OpenApi, {
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: {
				[Market_TimeInterval_TimestampSelector.MarketTimeIntervalTimestampMs]: async ({ $market, timeInterval, timestampMs: timestampMsSelector }, context) => {
					if ($market.marketKind !== MarketKind.Spot)
						throw new Error('Coinpaprika_OpenApi: OHLC is spot-only')
					if ($market.$base.kind !== MarketAssetKind.Coin)
						throw new Error('Market source: market base must be catalog coin')
					if (stringify(marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[$market.$base.$coin.coinId])) !== stringify($market))
						throw new Error('Coinpaprika_OpenApi: OHLC is catalog coin USD market only')
					const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
					const {
						getOhlcDayWindowValues,
						getOhlcvHistoricalRows,
						getOhlcvTodayRows,
					} = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
					if (timeInterval.unit !== marketOhlcDailyTimeInterval.unit || timeInterval.value !== marketOhlcDailyTimeInterval.value)
						throw new Error('Coinpaprika_OpenApi: OHLC timeInterval must be daily')
					const ohlcDayWindows = getOhlcDayWindowValues(context.publicEnv)
					const coinId = $market.$base.$coin.coinId
					const coinpaprikaId = idByCoinId[coinId]
					if (coinpaprikaId == null) throw new Error('Coinpaprika_OpenApi: OHLC coin not mapped')

					const ohlcCandles = (
						(ohlcDayWindows.at(-1) ?? marketOhlcDailyTimeInterval.value) === 1 ?
							await getOhlcvTodayRows({
								publicEnv: context.publicEnv,
								coinpaprikaId,
							})
						:
							await getOhlcvHistoricalRows({
								publicEnv: context.publicEnv,
								coinpaprikaId,
								lookbackDayCount: ohlcDayWindows.at(-1) ?? marketOhlcDailyTimeInterval.value,
							})
					)
					const ohlcCandle = ohlcCandles.find(([timestampMs]) => (
						Math.floor(timestampMs) === timestampMsSelector
					))
					if (ohlcCandle == null) throw new Error('Coinpaprika_OpenApi: OHLC candle not found for timestamp')
					const [timestampMs, open, high, low, close, quoteVolume] = ohlcCandle
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
						...(quoteVolume != null && {
							quoteVolume: BigInt(Math.round(quoteVolume * 1e8)),
						}),
					}
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
		defineResolver(Source.Coinpaprika_OpenApi, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
					const { coinById } = await import('$/constants/Coin.ts')
					const { coinpaprikaCatalogCoinIds } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
					return (
						coinpaprikaCatalogCoinIds
							.filter((coinId) => coinId in coinById)
							.map((coinId) => (
							{
								[EntityMetaKey.Selector]: {
									coinId,
								},
							}
							))
					)
				}
			},
		})({
			fields: {
				$$coins: (globalScope) => globalScope,
			},
		}),

		defineResolver(Source.Coinpaprika_OpenApi, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
					const { coinById } = await import('$/constants/Coin.ts')
					const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
					return (
						Object.entries(idByCoinId)
							.filter(([coinId]) => coinId in coinById)
							.map(([coinId]) => (
							{
								[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[coinId]),
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

		defineResolver(Source.Coinpaprika_OpenApi, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
					const { coinById } = await import('$/constants/Coin.ts')
					const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
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

		defineResolver(Source.Coinpaprika_OpenApi, {
			entityType: EntityType.MarketVenue,
			resolve: {
				[MarketVenueSelector.MarketVenueId]: async ({ marketVenueId }, context) => {
					const { collectMarketEntitySelectorsForExchange } = await import(
						'$/sources/Coinpaprika/OpenApi/queries.ts'
					)
					const lim = resolverContextRowLimit(context)
					const marketIds = await collectMarketEntitySelectorsForExchange({
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

		defineResolver(Source.Coinpaprika_OpenApi, {
			entityType: EntityType.Coin,
			resolve: {
				[CoinSelector.CoinId]: async ({ coinId }: EntitySelector<typeof schema, EntityType.Coin>, context) => {
					const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
					const { collectMarketEntitySelectorsForCoin } = await import(
						'$/sources/Coinpaprika/OpenApi/queries.ts'
					)
					const coinpaprikaId = idByCoinId[coinId]
					if (coinpaprikaId == null)
						return []
					const lim = resolverContextRowLimit(context)
					const venueMarketIds = await collectMarketEntitySelectorsForCoin({
						publicEnv: context.publicEnv,
						catalogCoinId: coinId,
						coinpaprikaId,
					})
					return (
						[
							marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[coinId]),
							...venueMarketIds,
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

		defineResolver(Source.Coinpaprika_OpenApi, {
			entityType: EntityType.Coin,
			resolve: {
				[CoinSelector.CoinId]: async ({ coinId }: EntitySelector<typeof schema, EntityType.Coin>, context) => {
					const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
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

		defineResolver(Source.Coinpaprika_OpenApi, {
			entityType: EntityType.Currency,
			resolve: {
				[CurrencySelector.Iso4217]: async ({ iso4217 }: EntitySelector<typeof schema, EntityType.Currency>) => {
					const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
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

		defineResolver(Source.Coinpaprika_OpenApi, {
			entityType: EntityType.Currency,
			resolve: {
				[CurrencySelector.Iso4217]: async ({ iso4217 }: EntitySelector<typeof schema, EntityType.Currency>) => {
					const markets = catalogSpotMarketsWithCurrencyAsBase
						.filter((catalogMarket) => catalogMarket.baseIso4217 === iso4217)
						.map((catalogMarket) => ({
							[EntityMetaKey.Selector]: marketSelectorFromCatalogCurrencyCurrencyMarket(catalogMarket),
						}))
					if (markets.length === 0)
						throw new Error(`Coinpaprika_OpenApi: no catalog markets with ${iso4217} as base`)
					return markets
				}
			},
		})({
			fields: {
				$$marketsWithCurrencyAsBase: (currency) => currency,
			},
		}),

		defineResolver(Source.Coinpaprika_OpenApi, {
			entityType: EntityType.Market,
			resolve: {
				[MarketSelector.BaseQuoteMarketVenueKind]: async (entitySelector: EntitySelector<typeof schema, EntityType.Market>, context) => {
					if (entitySelector.marketKind !== MarketKind.Spot)
						return []
					if (entitySelector.$base.kind !== MarketAssetKind.Coin)
						return []
					if (stringify(marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[entitySelector.$base.$coin.coinId])) !== stringify(entitySelector))
						return []
					const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
					const {
						getOhlcDayWindowValues,
						getOhlcvHistoricalRows,
						getOhlcvTodayRows,
					} = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
					const coinId = entitySelector.$base.$coin.coinId
					if (idByCoinId[coinId] == null) throw new Error('Coinpaprika_OpenApi: OHLC coin not mapped')
					const ohlcDayWindows = getOhlcDayWindowValues(context.publicEnv)
					const coinpaprikaId = idByCoinId[coinId]
					const lim = resolverContextRowLimit(context)
					return (
						(await Promise.all([ohlcDayWindows.at(-1) ?? marketOhlcDailyTimeInterval.value].map(async (value) => {
							const ohlcCandles = (
								value === 1 ?
									await getOhlcvTodayRows({
										publicEnv: context.publicEnv,
										coinpaprikaId,
									})
								:
									await getOhlcvHistoricalRows({
										publicEnv: context.publicEnv,
										coinpaprikaId,
										lookbackDayCount: value,
									})
							)
							return ohlcCandles.map(([timestampMs, open, high, low, close, quoteVolume]) => ({
								[EntityMetaKey.Selector]: {
									$market: entitySelector,
									timeInterval: marketOhlcDailyTimeInterval,
									timestampMs: Math.floor(timestampMs),
								} satisfies EntitySelector<typeof schema, EntityType.Market_TimeInterval_Timestamp>,
								open: BigInt(Math.round(open * 1e8)),
								high: BigInt(Math.round(high * 1e8)),
								low: BigInt(Math.round(low * 1e8)),
								close: BigInt(Math.round(close * 1e8)),
								...(quoteVolume != null && {
									quoteVolume: BigInt(Math.round(quoteVolume * 1e8)),
								}),
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

		defineResolver(Source.Coinpaprika_OpenApi, {
			entityType: EntityType.MarketPrice,
			resolve: {
				[MarketPriceSelector.Market]: async ({ $market }, context) => {
					if ($market.marketKind !== MarketKind.Spot)
						return []
					if ($market.$base.kind !== MarketAssetKind.Coin)
						return []
					if (stringify(marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[$market.$base.$coin.coinId])) !== stringify($market))
						return []
					const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
					const { getTickerById } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
					const coinId = $market.$base.$coin.coinId
					const coinpaprikaId = idByCoinId[coinId]
					if (coinpaprikaId == null) throw new Error('Coinpaprika_OpenApi: coin price not mapped')
					const ticker = await getTickerById({
						publicEnv: context.publicEnv,
						coinpaprikaId,
					})
					const updatedAtMs = (
						ticker.last_updated == null || ticker.last_updated === '' ?
							NaN
						:
							Date.parse(ticker.last_updated)
					)
					if (!Number.isFinite(updatedAtMs))
						throw new Error('Coinpaprika_OpenApi: ticker invalid')
					return [
						{
							[EntityMetaKey.Selector]: {
								$market: $market,
								timestampMs: updatedAtMs,
								feedKey: coinpaprikaId,
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

		defineResolver(Source.Coinpaprika_OpenApi, {
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

		defineResolver(Source.Coinpaprika_OpenApi, {
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

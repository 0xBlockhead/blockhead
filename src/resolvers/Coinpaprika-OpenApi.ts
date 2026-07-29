import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import type { CoinId } from '$/constants/Coin.ts'
import {
	MarketAssetKind,
	MarketKind,
	marketOhlcDailyTimeInterval,
} from '$/constants/Market.ts'
import {
	seededCoinSpotUsdMarkets,
	seededCoinSpotUsdMarketByCoinId,
	type CatalogCoinCurrencyMarket,
} from '$/constants/MarketCatalog.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

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
	source: Source.Coinpaprika_OpenApi,

	resolvers: [
		defineResolver(Source.Coinpaprika_OpenApi, {
			entityType: EntityType.Coin,
			resolve: {
				CoinId: {
					resolve: async ({ coinId }, context) => {
						const { coinById } = await import('$/constants/Coin.ts')
						const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
						const { getCoinById } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
						const coinpaprikaId = idByCoinId[coinId]
						if (coinpaprikaId == null) throw new Error('Coinpaprika_OpenApi: coin not mapped')

						const coin = await getCoinById({
							publicEnv: context.publicEnv,
							coinpaprikaId,
						})

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
					},
				}
			},
		})({
				name: (coin) => coin.name,
				symbol: (coin) => coin.symbol,
				$logo: (coin) => coin.$logo,
			}),

		defineResolver(Source.Coinpaprika_OpenApi, {
			entityType: EntityType.Market_Timestamp,
			resolve: {
				MarketTimestampMsFeedKey: {
					resolve: async ({ $market, feedKey, timestampMs: timestampMsSelector }, context) => {
						if ($market.marketKind !== MarketKind.Spot)
							throw new Error('Coinpaprika_OpenApi: Market_Timestamp is spot-only')
						if ($market.$base.kind !== MarketAssetKind.Coin)
							throw new Error('Market source: market base must be catalog coin')
						if (!catalogCoinCurrencyMarketMatchesMarket($market))
							throw new Error('Coinpaprika_OpenApi: Market_Timestamp is catalog coin USD market only')
						const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
						const { getTickerById } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
						const coinId: CoinId = $market.$base.assetKey
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
					},
				}
			},
		})({
				price: (timestamp) => timestamp.price,
				transport: (timestamp) => timestamp.transport,
				providerAssetId: (timestamp) => timestamp.providerAssetId,
			}),

		defineResolver(Source.Coinpaprika_OpenApi, {
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: {
				MarketTimeIntervalTimestampMs: {
					resolve: async ({ $market, timeInterval, timestampMs: timestampMsSelector }, context) => {
						if ($market.marketKind !== MarketKind.Spot)
							throw new Error('Coinpaprika_OpenApi: OHLC is spot-only')
						if ($market.$base.kind !== MarketAssetKind.Coin)
							throw new Error('Market source: market base must be catalog coin')
						if (!catalogCoinCurrencyMarketMatchesMarket($market))
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
						const coinId = $market.$base.assetKey
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
					},
				}
			},
		})({
				open: (timestamp) => timestamp.open,
				high: (timestamp) => timestamp.high,
				low: (timestamp) => timestamp.low,
				close: (timestamp) => timestamp.close,
				quoteVolume: (timestamp) => timestamp.quoteVolume,
			}),
		defineResolver(Source.Coinpaprika_OpenApi, {
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => {
						const { coinById } = await import('$/constants/Coin.ts')
						const { coinIdByWireId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
						const { getCoins } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
						return (
							(await getCoins({
								publicEnv: context.publicEnv,
							}))
								.flatMap((coin) => {
									const coinId = coin.id == null ? undefined : coinIdByWireId[coin.id]
									if (
										coinId == null
										|| !(coinId in coinById)
										|| coin.name == null
										|| coin.name === ''
										|| coin.symbol == null
										|| coin.symbol === ''
									)
										return []

									return [{
										[EntityMetaKey.Selector]: {
											coinId,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.Coin, [], 'name')]: coin.name,
											[entityFieldAddressKey(EntityType.Coin, [], 'symbol')]: coin.symbol.toUpperCase(),
										},
									}]
								})
						)
					},
				}
			},
		})({
				$$coins: (globalScope) => globalScope,
			}),

		defineResolver(Source.Coinpaprika_OpenApi, {
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => {
						const { CoinId, coinById } = await import('$/constants/Coin.ts')
						const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
						const { getTickerById } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
						const lim = resolverContextRowLimit(context)
						return (
							(await Promise.all(
								Object.values(CoinId)
									.filter((coinId) => idByCoinId[coinId] != null && coinId in coinById)
									.slice(0, lim)
									.map(async (coinId) => {
										const coinpaprikaId = idByCoinId[coinId]
										if (coinpaprikaId == null)
											return []
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
											return []
										return [
											{
												[EntityMetaKey.Selector]: {
													$market: marketSelectorFromCatalogCoinCurrencyMarket(seededCoinSpotUsdMarketByCoinId[coinId]),
													timestampMs: updatedAtMs,
													feedKey: coinpaprikaId,
												},
											},
										]
									})
							)).flat()
						)
					},
				}
			},
		})({
				$$marketPrices: (globalScope) => globalScope,
			}),


		defineResolver(Source.Coinpaprika_OpenApi, {
			entityType: EntityType.Coin,
				resolve: {
					CoinId: {
						resolve: async ({ coinId }: EntitySelector<typeof schema, EntityType.Coin>, context) => {
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
								...venueMarketIds,
							]
								.map((marketId) => ({
									[EntityMetaKey.Selector]: marketId,
								}))
								.slice(0, lim)
						)
					},
					}
			},
		})({
				$$marketsWithCoinAsBase: (coin) => coin,
			}),

		defineResolver(Source.Coinpaprika_OpenApi, {
			entityType: EntityType.Market,
			resolve: {
				BaseQuoteMarketVenueKind: {
					resolve: async (entitySelector: EntitySelector<typeof schema, EntityType.Market>, context) => {
						if (entitySelector.marketKind !== MarketKind.Spot)
							return []
						if (entitySelector.$base.kind !== MarketAssetKind.Coin)
							return []
						if (!catalogCoinCurrencyMarketMatchesMarket(entitySelector))
							return []
						const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
						const {
							getOhlcDayWindowValues,
							getOhlcvHistoricalRows,
							getOhlcvTodayRows,
						} = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
						const coinId = entitySelector.$base.assetKey
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
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.Market_TimeInterval_Timestamp, [], 'open')]: BigInt(Math.round(open * 1e8)),
										[entityFieldAddressKey(EntityType.Market_TimeInterval_Timestamp, [], 'high')]: BigInt(Math.round(high * 1e8)),
										[entityFieldAddressKey(EntityType.Market_TimeInterval_Timestamp, [], 'low')]: BigInt(Math.round(low * 1e8)),
										[entityFieldAddressKey(EntityType.Market_TimeInterval_Timestamp, [], 'close')]: BigInt(Math.round(close * 1e8)),
										...(quoteVolume != null && {
											[entityFieldAddressKey(EntityType.Market_TimeInterval_Timestamp, [], 'quoteVolume')]: BigInt(Math.round(quoteVolume * 1e8)),
										}),
									},
								}))
							}))).flat().slice(0, lim)
						)
					},
				}
			},
		})({
				$$marketTimeIntervalTimestamps: (market) => market,
			}),

		defineResolver(Source.Coinpaprika_OpenApi, {
			entityType: EntityType.MarketPrice,
			resolve: {
				Market: {
					resolve: async ({ $market }, context) => {
						if ($market.marketKind !== MarketKind.Spot)
							return []
						if ($market.$base.kind !== MarketAssetKind.Coin)
							return []
						if (!catalogCoinCurrencyMarketMatchesMarket($market))
							return []
						const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
						const { getTickerById } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
						const coinId = $market.$base.assetKey
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
					},
				}
			},
		})({
				$$quotes: (marketPrice) => marketPrice,
			}),

		defineResolver(Source.Coinpaprika_OpenApi, {
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
				$parentMarket: (marketPrice) => marketPrice,
			}),

		defineResolver(Source.Coinpaprika_OpenApi, {
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: {
				MarketTimeIntervalTimestampMs: {
					resolve: async ({ $market }) => (
						{
							[EntityMetaKey.Selector]: $market,
						}
					),
				}
			},
		})({
				$parentMarket: (timestamp) => timestamp,
			}),
	],
}

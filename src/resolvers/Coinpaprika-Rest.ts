import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import type { CoinId } from '$/constants/Coin.ts'
import { Iso4217 } from '$/constants/Currency.ts'
import type { MarketVenueId } from '$/constants/MarketVenue.ts'
import {
	MarketAssetKind,
	MarketKind,
	marketOhlcDefaultLookbackDayCount,
	marketOhlcDailyTimeInterval,
} from '$/constants/Market.ts'
import {
	seededCoinSpotUsdMarketByCoinId,
} from '$/constants/MarketCatalog.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	isSeededCoinCurrencyMarket,
	marketSelectorFromCatalogCoinCurrencyMarket,
} from '$/resolvers/market.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { optionalPublicEnvString, type SourcePublicEnv } from '$/sources/$sources.ts'
import {
	coinpaprikaMarketVenueIdByHostnameFragment,
	coinpaprikaUsdQuoteWireIds,
	coinIdByWireId,
} from '$/sources/Coinpaprika/OpenApi/constants.ts'
import type {
	CoinpaprikaMarket,
	CoinpaprikaTicker,
} from '$/sources/Coinpaprika/OpenApi/types.ts'
import { Source } from '$/sources/Source.ts'

const coinpaprikaTickerTimestampMs = (ticker: CoinpaprikaTicker) => (
	ticker.last_updated == null || ticker.last_updated === '' ?
		NaN
	:
		Date.parse(ticker.last_updated)
)

const coinpaprikaTickerForRequestedId = (
	ticker: CoinpaprikaTicker,
	coinpaprikaId: string
) => {
	if (ticker.id !== coinpaprikaId)
		throw new Error('Coinpaprika_Rest: ticker response does not match requested coin')

	return ticker
}

const coinpaprikaOhlcLookbackDayCount = (publicEnv: SourcePublicEnv) => (
	optionalPublicEnvString(publicEnv, 'PUBLIC_COINPAPRIKA_API_KEY') == null ?
		marketOhlcDailyTimeInterval.value
	:
		marketOhlcDefaultLookbackDayCount
)

const coinpaprikaOhlcCandles = async (
	publicEnv: SourcePublicEnv,
	coinpaprikaId: string,
	lookbackDayCount: number
) => {
	const {
		getOhlcvHistorical,
		getOhlcvToday,
	} = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
	const end = new Date()
	const start = new Date(end)
	start.setUTCDate(start.getUTCDate() - lookbackDayCount)
	const rows = (
		lookbackDayCount === marketOhlcDailyTimeInterval.value ?
			await getOhlcvToday({
				publicEnv,
				coinpaprikaId,
			})
		:
			await getOhlcvHistorical({
				publicEnv,
				coinpaprikaId,
				start: start.toISOString().slice(0, 10),
				end: end.toISOString().slice(0, 10),
				limit: lookbackDayCount,
			})
	)
	return rows.flatMap((row) => (
		row.time_open == null
		|| row.open == null
		|| row.high == null
		|| row.low == null
		|| row.close == null ?
			[]
		:
			[[
				Date.parse(row.time_open),
				row.open,
				row.high,
				row.low,
				row.close,
				row.volume ?? undefined,
			] as const]
	))
}

const coinpaprikaMarketSelector = (
	market: CoinpaprikaMarket,
	scope?: {
		catalogCoinId?: CoinId
		marketVenueId?: MarketVenueId
	}
): EntitySelector<typeof schema, EntityType.Market> | null => {
	const baseWireId = market.base_currency_id
	const quoteWireId = market.quote_currency_id
	if (baseWireId == null || quoteWireId == null)
		return null

	const baseCoinId = coinIdByWireId.get(baseWireId)
	if (
		baseCoinId == null
		|| (
			scope?.catalogCoinId != null
			&& baseCoinId !== scope.catalogCoinId
		)
	)
		return null

	const marketVenueId = (
		scope?.marketVenueId
		?? (() => {
			try {
				const hostname = new URL(market.market_url ?? '').hostname.toLowerCase()
				return coinpaprikaMarketVenueIdByHostnameFragment.find(([fragment]) => (
					hostname.includes(fragment)
				))?.[1]
			} catch {
				return undefined
			}
		})()
	)
	if (marketVenueId == null)
		return null

	const marketKind = (
		market.category === 'Futures' ?
			MarketKind.Futures
		: market.category === 'Perpetuals' || market.category === 'Perpetual' ?
			MarketKind.Perpetual
		:
			MarketKind.Spot
	)
	const $base = {
		kind: MarketAssetKind.Coin,
		assetKey: baseCoinId,
	} as const
	if (coinpaprikaUsdQuoteWireIds.some((wireId) => wireId === quoteWireId))
		return {
			$base,
			$quote: {
				kind: MarketAssetKind.Currency,
				assetKey: Iso4217.USD,
			},
			$marketVenue: { marketVenueId },
			marketKind,
		}

	const quoteCoinId = coinIdByWireId.get(quoteWireId)
	return (
		quoteCoinId == null ?
			null
		:
			{
				$base,
				$quote: {
					kind: MarketAssetKind.Coin,
					assetKey: quoteCoinId,
				},
				$marketVenue: { marketVenueId },
				marketKind,
			}
	)
}

const dedupeMarketSelectors = (
	markets: CoinpaprikaMarket[],
	scope?: {
		catalogCoinId?: CoinId
		marketVenueId?: MarketVenueId
	}
) => {
	const seen = new Set<string>()
	return markets.flatMap((market) => {
		const marketSelector = coinpaprikaMarketSelector(market, scope)
		if (marketSelector == null)
			return []

		const key = [
			marketSelector.$base.kind,
			marketSelector.$base.assetKey,
			marketSelector.$quote.kind,
			marketSelector.$quote.assetKey,
			marketSelector.$marketVenue.marketVenueId,
			marketSelector.marketKind,
		].join('|')
		if (seen.has(key))
			return []

		seen.add(key)
		return [marketSelector]
	})
}

const coinpaprikaMarketSelectorsForCoin = async (
	publicEnv: SourcePublicEnv,
	catalogCoinId: CoinId,
	coinpaprikaId: string
) => {
	const { getCoinMarkets } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
	return dedupeMarketSelectors(
		await getCoinMarkets({
			publicEnv,
			coinpaprikaId,
		}),
		{
			catalogCoinId,
		}
	)
}

const coinpaprikaMarketSelectorsForVenue = async (
	publicEnv: SourcePublicEnv,
	marketVenueId: MarketVenueId
) => {
	const { coinpaprikaExchangeIdByMarketVenueId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
	const exchangeId = coinpaprikaExchangeIdByMarketVenueId[marketVenueId]
	if (exchangeId == null)
		throw new Error(`Coinpaprika_Rest: exchange not mapped for venue ${marketVenueId}`)

	const { getExchangeMarkets } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
	return dedupeMarketSelectors(
		await getExchangeMarkets({
			publicEnv,
			exchangeId,
		}),
		{
			marketVenueId,
		}
	)
}

export default {
	source: Source.Coinpaprika_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.Coin,
			resolve: {
				CoinId: {
					resolve: async ({ coinId }, context) => {
						const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
						const { getCoinById } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
						const coinpaprikaId = idByCoinId[coinId]
						if (coinpaprikaId == null) throw new Error('Coinpaprika_Rest: coin not mapped')

						const coin = await getCoinById({
							publicEnv: context.publicEnv,
							coinpaprikaId,
						})

						if (
							coin.id !== coinpaprikaId
							|| coin.name == null
							|| coin.name === ''
							|| coin.symbol == null
							|| coin.symbol === ''
						)
							throw new Error('Coinpaprika_Rest: coin response does not match requested coin')

						const logoMedia = (
							coin.logo == null || coin.logo === '' ?
								undefined
							:
								mediaFromUrl(coin.logo, MediaType.Image)
						)
						return {
							name: coin.name,
							symbol: coin.symbol.toUpperCase(),
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

		defineResolver({
			entityType: EntityType.Coin,
			resolve: {
				CoinId: {
					resolve: async ({ coinId }, context) => {
						const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
						const { getTickerById } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
						const coinpaprikaId = idByCoinId[coinId]
						if (coinpaprikaId == null) throw new Error('Coinpaprika_Rest: coin not mapped')

						const ticker = coinpaprikaTickerForRequestedId(
							await getTickerById({
								publicEnv: context.publicEnv,
								coinpaprikaId,
							}),
							coinpaprikaId
						)
						const timestampMs = coinpaprikaTickerTimestampMs(ticker)
						if (!Number.isFinite(timestampMs))
							throw new Error('Coinpaprika_Rest: coin ticker clock missing')

						return [{
							[EntityMetaKey.Selector]: {
								$coin: {
									coinId,
								},
								timestampMs,
								source: Source.Coinpaprika_Rest,
							},
						}]
					},
				}
			},
		})({
				$$timestamps: (coin) => coin,
			}),

		defineResolver({
			entityType: EntityType.Coin_Timestamp,
			resolve: {
				CoinTimestampMsSource: {
					resolve: async ({ $coin, timestampMs: timestampMsSelector, source }, context) => {
						if (source !== Source.Coinpaprika_Rest)
							throw new Error('Coinpaprika_Rest: Coin_Timestamp source mismatch')
						const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
						const { getTickerById } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
						const coinpaprikaId = idByCoinId[$coin.coinId]
						if (coinpaprikaId == null) throw new Error('Coinpaprika_Rest: coin not mapped')

						const ticker = coinpaprikaTickerForRequestedId(
							await getTickerById({
								publicEnv: context.publicEnv,
								coinpaprikaId,
							}),
							coinpaprikaId
						)
						const timestampMs = coinpaprikaTickerTimestampMs(ticker)
						if (!Number.isFinite(timestampMs))
							throw new Error('Coinpaprika_Rest: coin ticker clock missing')
						if (timestampMs !== timestampMsSelector)
							throw new Error('Coinpaprika_Rest: Coin_Timestamp id does not match ticker clock')

						const usdQuote = ticker.quotes?.USD
						const marketCapUsd = usdQuote?.market_cap
						const change24hPercent = usdQuote?.percent_change_24h
						const totalSupply = ticker.total_supply
						return {
							...(ticker.rank != null
							&& Number.isFinite(ticker.rank) && {
								marketCapRank: ticker.rank,
							}),
							...(marketCapUsd != null
							&& Number.isFinite(marketCapUsd) && {
								marketCap: BigInt(Math.round(marketCapUsd)),
								marketCapUsd,
							}),
							...(change24hPercent != null
							&& Number.isFinite(change24hPercent) && {
								change24hPercent,
							}),
							...(totalSupply != null
							&& Number.isFinite(totalSupply)
							&& totalSupply >= 0 && {
								totalSupply: BigInt(Math.round(totalSupply)),
							}),
							transport: 'coinpaprika-ticker',
							providerAssetId: coinpaprikaId,
						}
					},
				},
			},
		})({
				marketCapRank: (coinTimestamp) => coinTimestamp.marketCapRank,
				marketCapUsd: (coinTimestamp) => coinTimestamp.marketCapUsd,
				marketCap: (coinTimestamp) => coinTimestamp.marketCap,
				change24hPercent: (coinTimestamp) => coinTimestamp.change24hPercent,
				totalSupply: (coinTimestamp) => coinTimestamp.totalSupply,
				transport: (coinTimestamp) => coinTimestamp.transport,
				providerAssetId: (coinTimestamp) => coinTimestamp.providerAssetId,
			}),

		defineResolver({
			entityType: EntityType.Market_Timestamp,
			resolve: {
				MarketTimestampMsFeedKey: {
					resolve: async ({ $market, feedKey, timestampMs: timestampMsSelector }, context) => {
						if ($market.marketKind !== MarketKind.Spot)
							throw new Error('Coinpaprika_Rest: Market_Timestamp is spot-only')
						if ($market.$base.kind !== MarketAssetKind.Coin)
							throw new Error('Market source: market base must be catalog coin')
						if (!isSeededCoinCurrencyMarket($market))
							throw new Error('Coinpaprika_Rest: Market_Timestamp is catalog coin USD market only')
						const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
						const { getTickerById } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
						const coinId: CoinId = $market.$base.assetKey
						const coinpaprikaId = idByCoinId[coinId]
						if (coinpaprikaId == null) throw new Error('Coinpaprika_Rest: coin price not mapped')
						if (feedKey !== coinpaprikaId)
							throw new Error('Coinpaprika_Rest: Market_Timestamp feedKey does not match Coinpaprika id')

						const ticker = coinpaprikaTickerForRequestedId(
							await getTickerById({
								publicEnv: context.publicEnv,
								coinpaprikaId,
							}),
							coinpaprikaId
						)
						const price = ticker.quotes?.USD.price
						const updatedAtMs = coinpaprikaTickerTimestampMs(ticker)

						if (price == null || !Number.isFinite(price) || !Number.isFinite(updatedAtMs))
							throw new Error('Coinpaprika_Rest: ticker invalid')
						const timestampMs = updatedAtMs
						if (timestampMs !== timestampMsSelector)
							throw new Error('Coinpaprika_Rest: Market_Timestamp id does not match ticker clock')

						return {
							price: BigInt(Math.round(price * 1e8)),
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

		defineResolver({
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: {
				MarketTimeIntervalTimestampMs: {
					resolve: async ({ $market, timeInterval, timestampMs: timestampMsSelector }, context) => {
						if ($market.marketKind !== MarketKind.Spot)
							throw new Error('Coinpaprika_Rest: OHLC is spot-only')
						if ($market.$base.kind !== MarketAssetKind.Coin)
							throw new Error('Market source: market base must be catalog coin')
						if (!isSeededCoinCurrencyMarket($market))
							throw new Error('Coinpaprika_Rest: OHLC is catalog coin USD market only')
						const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
						if (timeInterval.unit !== marketOhlcDailyTimeInterval.unit || timeInterval.value !== marketOhlcDailyTimeInterval.value)
							throw new Error('Coinpaprika_Rest: OHLC timeInterval must be daily')
						const coinId = $market.$base.assetKey
						const coinpaprikaId = idByCoinId[coinId]
						if (coinpaprikaId == null) throw new Error('Coinpaprika_Rest: OHLC coin not mapped')

						const ohlcCandles = await coinpaprikaOhlcCandles(
							context.publicEnv,
							coinpaprikaId,
							coinpaprikaOhlcLookbackDayCount(context.publicEnv)
						)
						const ohlcCandle = ohlcCandles.find(([timestampMs]) => (
							Math.floor(timestampMs) === timestampMsSelector
						))
						if (ohlcCandle == null) throw new Error('Coinpaprika_Rest: OHLC candle not found for timestamp')
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
		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
						const { coinpaprikaCoins } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
						return coinpaprikaCoins.map(({ coinId }) => ({
							[EntityMetaKey.Selector]: {
								coinId,
							},
						}))
					},
				}
			},
		})({
				$$coins: {
					select: (globalScope) => globalScope,
					resolveCount: (globalScope) => globalScope.length,
				},
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => {
						const { coinById } = await import('$/constants/Coin.ts')
						const { getTickers } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
						const lim = resolverContextRowLimit(context)
						const marketPrices = (await getTickers({
							publicEnv: context.publicEnv,
						})).flatMap((ticker) => {
							const coinId = coinIdByWireId.get(ticker.id)
							const updatedAtMs = coinpaprikaTickerTimestampMs(ticker)
							if (
								coinId == null
								|| !(coinId in coinById)
								|| !Number.isFinite(updatedAtMs)
							)
								return []

							return [{
								[EntityMetaKey.Selector]: {
									$market: marketSelectorFromCatalogCoinCurrencyMarket(seededCoinSpotUsdMarketByCoinId[coinId]),
									timestampMs: updatedAtMs,
									feedKey: ticker.id,
								},
							}]
						})
						return {
							marketPrices: marketPrices.slice(0, lim),
							marketPriceCount: marketPrices.length,
						}
					},
				}
			},
		})({
				$$marketPrices: {
					select: (snapshot) => snapshot.marketPrices,
					resolveCount: (snapshot) => snapshot.marketPriceCount,
				},
			}),


		defineResolver({
			entityType: EntityType.Coin,
				resolve: {
					CoinId: {
						resolve: async ({ coinId }: EntitySelector<typeof schema, EntityType.Coin>, context) => {
							const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
						const coinpaprikaId = idByCoinId[coinId]
						if (coinpaprikaId == null)
							throw new Error('Coinpaprika_Rest: coin not mapped')
						const lim = resolverContextRowLimit(context)
						const venueMarketIds = await coinpaprikaMarketSelectorsForCoin(
							context.publicEnv,
							coinId,
							coinpaprikaId
						)
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

		defineResolver({
			entityType: EntityType.MarketVenue,
			resolve: {
				MarketVenueId: {
					resolve: async ({ marketVenueId }, context) => {
						const lim = resolverContextRowLimit(context)
						return (await coinpaprikaMarketSelectorsForVenue(
							context.publicEnv,
							marketVenueId
						))
							.map((marketId) => ({
								[EntityMetaKey.Selector]: marketId,
							}))
							.slice(0, lim)
					},
				}
			},
		})({
				$$markets: (marketVenue) => marketVenue,
			}),

		defineResolver({
			entityType: EntityType.Market,
			resolve: {
				BaseQuoteMarketVenueKind: {
					resolve: async (entitySelector: EntitySelector<typeof schema, EntityType.Market>, context) => {
						if (entitySelector.marketKind !== MarketKind.Spot)
							return []
						if (entitySelector.$base.kind !== MarketAssetKind.Coin)
							return []
						if (!isSeededCoinCurrencyMarket(entitySelector))
							return []
						const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
						const coinId = entitySelector.$base.assetKey
						if (idByCoinId[coinId] == null) throw new Error('Coinpaprika_Rest: OHLC coin not mapped')
						const coinpaprikaId = idByCoinId[coinId]
						const lim = resolverContextRowLimit(context)
						return (await coinpaprikaOhlcCandles(
							context.publicEnv,
							coinpaprikaId,
							coinpaprikaOhlcLookbackDayCount(context.publicEnv)
						)).map(([timestampMs, open, high, low, close, quoteVolume]) => ({
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
						})).slice(0, lim)
					},
				}
			},
		})({
				$$marketTimeIntervalTimestamps: (market) => market,
			}),

		defineResolver({
			entityType: EntityType.MarketPrice,
			resolve: {
				Market: {
					resolve: async ({ $market }, context) => {
						if ($market.marketKind !== MarketKind.Spot)
							return []
						if ($market.$base.kind !== MarketAssetKind.Coin)
							return []
						if (!isSeededCoinCurrencyMarket($market))
							return []
						const { idByCoinId } = await import('$/sources/Coinpaprika/OpenApi/constants.ts')
						const { getTickerById } = await import('$/sources/Coinpaprika/OpenApi/queries.ts')
						const coinId = $market.$base.assetKey
						const coinpaprikaId = idByCoinId[coinId]
						if (coinpaprikaId == null) throw new Error('Coinpaprika_Rest: coin price not mapped')
						const ticker = coinpaprikaTickerForRequestedId(
							await getTickerById({
								publicEnv: context.publicEnv,
								coinpaprikaId,
							}),
							coinpaprikaId
						)
						const updatedAtMs = coinpaprikaTickerTimestampMs(ticker)
						if (!Number.isFinite(updatedAtMs))
							throw new Error('Coinpaprika_Rest: ticker invalid')
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

		defineResolver({
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

		defineResolver({
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
} satisfies RegisteredSourceResolverModule

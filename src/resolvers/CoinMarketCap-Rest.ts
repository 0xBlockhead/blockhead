import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
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
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
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
	source: Source.CoinMarketCap_Rest,

	resolvers: [
		defineResolver(Source.CoinMarketCap_Rest, {
			entityType: EntityType.Coin,
			resolve: {
				CoinId: {
					resolve: async ({ coinId }, context) => {
						const { coinById } = await import('$/constants/Coin.ts')
						const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
						const { getInfo } = await import('$/sources/CoinMarketCap/Rest/queries.ts')
						const coinMarketCapId = idByCoinId[coinId]
						if (coinMarketCapId == null) throw new Error('CoinMarketCap_Rest: coin not mapped')

						const infoResponse = await getInfo({
							publicEnv: context.publicEnv,
							id: coinMarketCapId,
						})
						const info = (
							infoResponse.data == null ?
								undefined
							:
								Object.values(infoResponse.data)[0]
						)
						if (info == null) throw new Error('CoinMarketCap_Rest: coin info not returned')

						const logoUrl = info.logo
						const logoMedia = mediaFromUrl(logoUrl, MediaType.Image)
						const infoName = info.name ?? ''
						const infoSymbol = info.symbol ?? ''

						return {
							name: (
								infoName === '' ?
									coinById[coinId].symbol
								:
									infoName
							),
							symbol: (
								infoSymbol === '' ?
									coinById[coinId].symbol
								:
									infoSymbol.toUpperCase()
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

		defineResolver(Source.CoinMarketCap_Rest, {
			entityType: EntityType.Market_Timestamp,
			resolve: {
				MarketTimestampMsFeedKey: {
					resolve: async ({ $market, feedKey, timestampMs: timestampMsSelector }, context) => {
						if ($market.marketKind !== MarketKind.Spot)
							throw new Error('CoinMarketCap_Rest: Market_Timestamp is spot-only')
						if ($market.$base.kind !== MarketAssetKind.Coin)
							throw new Error('Market source: market base must be catalog coin')
						if (!catalogCoinCurrencyMarketMatchesMarket($market))
							throw new Error('CoinMarketCap_Rest: Market_Timestamp is catalog coin USD market only')
						const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
						const coinId = $market.$base.assetKey
						const coinMarketCapId = idByCoinId[coinId]
						if (coinMarketCapId == null) throw new Error('CoinMarketCap_Rest: coin price not mapped')
						if (feedKey !== String(coinMarketCapId))
							throw new Error('CoinMarketCap_Rest: Market_Timestamp feedKey does not match CoinMarketCap id')

						const { getInfo, getQuotesLatest } = await import(
							'$/sources/CoinMarketCap/Rest/queries.ts'
						)
						const quoteResponse = await getQuotesLatest({
							publicEnv: context.publicEnv,
							id: coinMarketCapId,
						})
						const infoResponse = await getInfo({
							publicEnv: context.publicEnv,
							id: coinMarketCapId,
						})
						const quote = (
							quoteResponse.data == null ?
								undefined
							:
								Object.values(quoteResponse.data)[0]
						)
						const price = quote?.quote?.USD?.price
						const lastUpdated = quote?.quote?.USD?.last_updated
						const updatedAt = Date.parse(lastUpdated ?? '')
						if (!Number.isFinite(price) || !Number.isFinite(updatedAt))
							throw new Error('CoinMarketCap_Rest: quote invalid')
						const timestampMs = Math.floor(updatedAt)
						if (timestampMs !== timestampMsSelector)
							throw new Error('CoinMarketCap_Rest: Market_Timestamp id does not match quote clock')
						const p = (
							infoResponse.data == null ?
								undefined
							:
								Object.values(infoResponse.data)[0]
						)?.platform
						const caip2 = (
							(p?.slug === 'ethereum' || p?.name === 'Ethereum')
						&& p.token_address != null
						&& /^0x[a-fA-F0-9]{40}$/i.test(p.token_address) ?
								`eip155:1/erc20:${p.token_address.toLowerCase()}`
							:
								undefined
						)

						return {
							price: BigInt(Math.round((price ?? 0) * 1e8)),
							transport: 'coinmarketcap-v2-quotes-and-info-usd-1e8',
							providerAssetId: String(coinMarketCapId),
							...(caip2 && { caip2 }),
						}
					},
				}
			},
		})({
				price: (timestamp) => timestamp.price,
				transport: (timestamp) => timestamp.transport,
				providerAssetId: (timestamp) => timestamp.providerAssetId,
				caip19: (timestamp) => timestamp.caip2,
			}),

		defineResolver(Source.CoinMarketCap_Rest, {
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: {
				MarketTimeIntervalTimestampMs: {
					resolve: async ({ $market, timeInterval, timestampMs: timestampMsSelector }, context) => {
						if ($market.marketKind !== MarketKind.Spot)
							throw new Error('CoinMarketCap_Rest: OHLC is spot-only')
						if ($market.$base.kind !== MarketAssetKind.Coin)
							throw new Error('Market source: market base must be catalog coin')
						if (!catalogCoinCurrencyMarketMatchesMarket($market))
							throw new Error('CoinMarketCap_Rest: OHLC is catalog coin USD market only')
						const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
						const { getOhlcvHistoricalRows } = await import(
							'$/sources/CoinMarketCap/Rest/queries.ts'
						)
						if (timeInterval.unit !== marketOhlcDailyTimeInterval.unit || timeInterval.value !== marketOhlcDailyTimeInterval.value)
							throw new Error('CoinMarketCap_Rest: OHLC timeInterval must be daily')
						const coinId = $market.$base.assetKey
						const coinMarketCapId = idByCoinId[coinId]
						if (coinMarketCapId == null) throw new Error('CoinMarketCap_Rest: OHLC coin not mapped')

						const ohlcCandles = await getOhlcvHistoricalRows({
							publicEnv: context.publicEnv,
							id: coinMarketCapId,
							lookbackDayCount: marketOhlcDefaultLookbackDayCount,
						})
						const ohlcCandle = ohlcCandles.find(([timestampMs]) => (
							Math.floor(timestampMs) === timestampMsSelector
						))
						if (ohlcCandle == null) throw new Error('CoinMarketCap_Rest: OHLC candle not found for timestamp')
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

		defineResolver(Source.CoinMarketCap_Rest, {
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
						const { CoinId, coinById } = await import('$/constants/Coin.ts')
						const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
						return (
							Object.values(CoinId)
								.filter((coinId) => idByCoinId[coinId] != null && coinId in coinById)
								.map((coinId) => (
								{
									[EntityMetaKey.Selector]: {
										coinId,
									},
								}
								))
						)
					},
				}
			},
		})({
				$$coins: (coins) => coins,
			}),

		defineResolver(Source.CoinMarketCap_Rest, {
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => {
						const { CoinId, coinById } = await import('$/constants/Coin.ts')
						const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
						const { getQuotesLatest } = await import(
							'$/sources/CoinMarketCap/Rest/queries.ts'
						)
						const lim = resolverContextRowLimit(context)
						return (
							(await Promise.all(
								Object.values(CoinId)
									.filter((coinId) => idByCoinId[coinId] != null && coinId in coinById)
									.slice(0, lim)
									.map(async (coinId) => {
										const coinMarketCapId = idByCoinId[coinId]
										if (coinMarketCapId == null)
											return []
										const quoteResponse = await getQuotesLatest({
											publicEnv: context.publicEnv,
											id: coinMarketCapId,
										})
										const quote = (
											quoteResponse.data == null ?
												undefined
											:
												Object.values(quoteResponse.data)[0]
										)
										const updatedAt = Date.parse(quote?.quote?.USD?.last_updated ?? '')
										if (!Number.isFinite(updatedAt))
											return []
										return [
											{
												[EntityMetaKey.Selector]: {
													$market: marketSelectorFromCatalogCoinCurrencyMarket(seededCoinSpotUsdMarketByCoinId[coinId]),
													timestampMs: Math.floor(updatedAt),
													feedKey: String(coinMarketCapId),
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
				$$marketPrices: (marketPrices) => marketPrices,
			}),

		defineResolver(Source.CoinMarketCap_Rest, {
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
						const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
						const { getOhlcvHistoricalRows } = await import(
							'$/sources/CoinMarketCap/Rest/queries.ts'
						)
						const coinId = entitySelector.$base.assetKey
						if (idByCoinId[coinId] == null) throw new Error('CoinMarketCap_Rest: OHLC coin not mapped')
						const coinMarketCapId = idByCoinId[coinId]
						const lim = resolverContextRowLimit(context)
						return (
							(await Promise.all([marketOhlcDayLookbackValues.find((value) => value >= lim) ?? marketOhlcDefaultLookbackDayCount].map(async (value) => {
							const ohlcCandles = await getOhlcvHistoricalRows({
								publicEnv: context.publicEnv,
								id: coinMarketCapId,
								lookbackDayCount: value,
							})
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
				$$marketTimeIntervalTimestamps: (timestamps) => timestamps,
			}),

		defineResolver(Source.CoinMarketCap_Rest, {
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
						const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
						const coinId = $market.$base.assetKey
						const coinMarketCapId = idByCoinId[coinId]
						if (coinMarketCapId == null) throw new Error('CoinMarketCap_Rest: coin price not mapped')
						const { getQuotesLatest } = await import(
							'$/sources/CoinMarketCap/Rest/queries.ts'
						)
						const quoteResponse = await getQuotesLatest({
							publicEnv: context.publicEnv,
							id: coinMarketCapId,
						})
						const quote = (
							quoteResponse.data == null ?
								undefined
							:
								Object.values(quoteResponse.data)[0]
						)
						const lastUpdated = quote?.quote?.USD?.last_updated
						const updatedAt = Date.parse(lastUpdated ?? '')
						if (!Number.isFinite(updatedAt))
							throw new Error('CoinMarketCap_Rest: quote invalid')
						return [
							{
								[EntityMetaKey.Selector]: {
									$market: $market,
									timestampMs: Math.floor(updatedAt),
									feedKey: String(coinMarketCapId),
								},
							},
						]
					},
				}
			},
		})({
				$$quotes: (quotes) => quotes,
			}),

		defineResolver(Source.CoinMarketCap_Rest, {
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

		defineResolver(Source.CoinMarketCap_Rest, {
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
				$parentMarket: (market) => market,
			}),
	],
}

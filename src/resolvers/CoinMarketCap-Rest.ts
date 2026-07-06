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
	type MarketIdLabelInput,
} from '$/constants/Market.ts'
import { Iso4217 } from '$/constants/Currency.ts'
import {
	localCatalogCoinSpotUsdMarkets,
	localCatalogCoinSpotUsdMarketByCoinId,
	localCatalogSpotMarketsWithCoinAsQuote,
	localCatalogSpotMarketsWithCurrencyAsBase,
	type CatalogCoinCoinMarket,
	type CatalogCoinCurrencyMarket,
	type CatalogCurrencyCurrencyMarket,
} from '$/constants/MarketCatalog.ts'
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
	source: Source.CoinMarketCap_Rest,

	resolvers: [
		defineResolver(Source.CoinMarketCap_Rest, {
			entityType: EntityType.Coin,
			resolve: {
				[CoinSelector.CoinId]: async ({ coinId }, context) => {
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
				}
			},
		})({
			fields: {
				name: (coin) => coin.name,
				symbol: (coin) => coin.symbol,
				$logo: (coin) => coin.$logo,
			},
		}),

		defineResolver(Source.CoinMarketCap_Rest, {
			entityType: EntityType.Market_Timestamp,
			resolve: {
				[Market_TimestampSelector.MarketTimestampMsFeedKey]: async ({ $market, feedKey, timestampMs: timestampMsSelector }, context) => {
					if ($market.marketKind !== MarketKind.Spot)
						throw new Error('CoinMarketCap_Rest: Market_Timestamp is spot-only')
					if ($market.$base.kind !== MarketAssetKind.Coin)
						throw new Error('Market source: market base must be catalog coin')
					if (!catalogCoinCurrencyMarketMatchesMarket(localCatalogCoinSpotUsdMarketByCoinId[$market.$base.$coin.coinId], $market))
						throw new Error('CoinMarketCap_Rest: Market_Timestamp is catalog coin USD market only')
					const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
					const coinId = $market.$base.$coin.coinId
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
				}
			},
		})({
			fields: {
				price: (timestamp) => timestamp.price,
				transport: (timestamp) => timestamp.transport,
				providerAssetId: (timestamp) => timestamp.providerAssetId,
				caip19: (timestamp) => timestamp.caip2,
			},
		}),

		defineResolver(Source.CoinMarketCap_Rest, {
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: {
				[Market_TimeInterval_TimestampSelector.MarketTimeIntervalTimestampMs]: async ({ $market, timeInterval, timestampMs: timestampMsSelector }, context) => {
					if ($market.marketKind !== MarketKind.Spot)
						throw new Error('CoinMarketCap_Rest: OHLC is spot-only')
					if ($market.$base.kind !== MarketAssetKind.Coin)
						throw new Error('Market source: market base must be catalog coin')
					if (!catalogCoinCurrencyMarketMatchesMarket(localCatalogCoinSpotUsdMarketByCoinId[$market.$base.$coin.coinId], $market))
						throw new Error('CoinMarketCap_Rest: OHLC is catalog coin USD market only')
					const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
					const { getOhlcvHistoricalRows } = await import(
						'$/sources/CoinMarketCap/Rest/queries.ts'
					)
					if (timeInterval.unit !== marketOhlcDailyTimeInterval.unit || timeInterval.value !== marketOhlcDailyTimeInterval.value)
						throw new Error('CoinMarketCap_Rest: OHLC timeInterval must be daily')
					const coinId = $market.$base.$coin.coinId
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

		defineResolver(Source.CoinMarketCap_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
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
				}
			},
		})({
			fields: {
				$$coins: (coins) => coins,
			},
		}),

		defineResolver(Source.CoinMarketCap_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
					const { CoinId, coinById } = await import('$/constants/Coin.ts')
					const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
					return (
						Object.values(CoinId)
							.filter((coinId) => idByCoinId[coinId] != null && coinId in coinById)
							.map((coinId) => (
							{
								[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCurrencyMarket(localCatalogCoinSpotUsdMarketByCoinId[coinId]),
							}
							))
					)
				}
			},
		})({
			fields: {
				$$markets: (markets) => markets,
			},
		}),

		defineResolver(Source.CoinMarketCap_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => {
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
												$market: marketSelectorFromCatalogCoinCurrencyMarket(localCatalogCoinSpotUsdMarketByCoinId[coinId]),
												timestampMs: Math.floor(updatedAt),
												feedKey: String(coinMarketCapId),
											},
										},
									]
								})
						)).flat()
					)
				}
			},
		})({
			fields: {
				$$marketPrices: (marketPrices) => marketPrices,
			},
		}),

		defineResolver(Source.CoinMarketCap_Rest, {
			entityType: EntityType.Coin,
				resolve: {
					[CoinSelector.CoinId]: async ({ coinId }: EntitySelector<typeof schema, EntityType.Coin>) => {
						return (
							[
								{
								[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCurrencyMarket(localCatalogCoinSpotUsdMarketByCoinId[coinId]),
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

		defineResolver(Source.CoinMarketCap_Rest, {
			entityType: EntityType.Coin,
				resolve: {
					[CoinSelector.CoinId]: async ({ coinId }: EntitySelector<typeof schema, EntityType.Coin>) => {
						const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
						return (
							localCatalogSpotMarketsWithCoinAsQuote
							.filter((catalogMarket) => catalogMarket.quoteCoinId === coinId)
							.map(marketSelectorFromCatalogCoinCoinMarket)
							.filter((marketId) => (
							idByCoinId[marketId.$base.$coin.coinId] != null
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

		defineResolver(Source.CoinMarketCap_Rest, {
			entityType: EntityType.Currency,
			resolve: {
				[CurrencySelector.Iso4217]: async ({ iso4217 }: EntitySelector<typeof schema, EntityType.Currency>) => {
					const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
					return (
						(
						iso4217 === Iso4217.USD ?
							localCatalogCoinSpotUsdMarkets.filter((catalogMarket) => (
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
				$$marketsWithCurrencyAsQuote: (markets) => markets,
			},
		}),

		defineResolver(Source.CoinMarketCap_Rest, {
			entityType: EntityType.Currency,
			resolve: {
				[CurrencySelector.Iso4217]: async ({ iso4217 }: EntitySelector<typeof schema, EntityType.Currency>) => {
					const markets = localCatalogSpotMarketsWithCurrencyAsBase
						.filter((catalogMarket) => catalogMarket.baseIso4217 === iso4217)
						.map((catalogMarket) => ({
							[EntityMetaKey.Selector]: marketSelectorFromCatalogCurrencyCurrencyMarket(catalogMarket),
						}))
					if (markets.length === 0)
						throw new Error(`CoinMarketCap_Rest: no catalog markets with ${iso4217} as base`)
					return markets
				}
			},
		})({
			fields: {
				$$marketsWithCurrencyAsBase: (markets) => markets,
			},
		}),

		defineResolver(Source.CoinMarketCap_Rest, {
			entityType: EntityType.Market,
			resolve: {
				[MarketSelector.BaseQuoteMarketVenueKind]: async (entitySelector: EntitySelector<typeof schema, EntityType.Market>, context) => {
					if (entitySelector.marketKind !== MarketKind.Spot)
						return []
					if (entitySelector.$base.kind !== MarketAssetKind.Coin)
						return []
					if (!catalogCoinCurrencyMarketMatchesMarket(localCatalogCoinSpotUsdMarketByCoinId[entitySelector.$base.$coin.coinId], entitySelector))
						return []
					const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
					const { getOhlcvHistoricalRows } = await import(
						'$/sources/CoinMarketCap/Rest/queries.ts'
					)
					const coinId = entitySelector.$base.$coin.coinId
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
				$$marketTimeIntervalTimestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver(Source.CoinMarketCap_Rest, {
			entityType: EntityType.MarketPrice,
			resolve: {
				[MarketPriceSelector.Market]: async ({ $market }, context) => {
					if ($market.marketKind !== MarketKind.Spot)
						return []
					if ($market.$base.kind !== MarketAssetKind.Coin)
						return []
					if (!catalogCoinCurrencyMarketMatchesMarket(localCatalogCoinSpotUsdMarketByCoinId[$market.$base.$coin.coinId], $market))
						return []
					const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
					const coinId = $market.$base.$coin.coinId
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
				}
			},
		})({
			fields: {
				$$quotes: (quotes) => quotes,
			},
		}),

		defineResolver(Source.CoinMarketCap_Rest, {
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

		defineResolver(Source.CoinMarketCap_Rest, {
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: {
				[Market_TimeInterval_TimestampSelector.MarketTimeIntervalTimestampMs]: async ({ $market }) => (
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
	],
}

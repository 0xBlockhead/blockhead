import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
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
import { caip19Erc20 } from '$/lib/caip19.ts'
import { mediaFromUrl } from '$/lib/media.ts'
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
				[Market_TimestampSelector.MarketTimestampMsFeedKey]: async ({ $market, timestampMs: timestampMsSelector }, context) => {
				if ($market.marketKind !== MarketKind.Spot) {
					throw new Error('CoinMarketCap_Rest: Market_Timestamp is spot-only')
				}
				if ($market.$base.kind !== MarketAssetKind.Coin) {
					throw new Error('Market source: market base must be catalog coin')
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[$market.$base.$coin.coinId]) !== stringify($market)) {
					throw new Error('CoinMarketCap_Rest: Market_Timestamp is catalog coin USD market only')
				}
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				const coinId = $market.$base.$coin.coinId
				const coinMarketCapId = idByCoinId[coinId]
				if (coinMarketCapId == null) throw new Error('CoinMarketCap_Rest: coin price not mapped')

				const { getInfo, getQuotesLatest } = await import(
					'$/sources/CoinMarketCap/Rest/queries.ts',
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
				if (!Number.isFinite(price) || !Number.isFinite(updatedAt)) {
					throw new Error('CoinMarketCap_Rest: quote invalid')
				}
				const timestampMs = Math.floor(updatedAt)
				if (timestampMs !== timestampMsSelector) {
					throw new Error('CoinMarketCap_Rest: Market_Timestamp id does not match quote clock')
				}
				const p = (
					infoResponse.data == null
						? undefined
					:
						Object.values(infoResponse.data)[0]
				)?.platform
				const caip2 = (
					(p?.slug === 'ethereum' || p?.name === 'Ethereum')
					&& p.token_address != null
					&& /^0x[a-fA-F0-9]{40}$/i.test(p.token_address) ?
						caip19Erc20(1, p.token_address.toLowerCase() as `0x${string}`)
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
				[Market_TimeInterval_TimestampSelector.MarketTimeIntervalTimestampMsFeedKey]: async ({ $market, timeInterval, timestampMs: timestampMsSelector, feedKey }, context) => {
				if ($market.marketKind !== MarketKind.Spot) {
					throw new Error('CoinMarketCap_Rest: OHLC is spot-only')
				}
				if ($market.$base.kind !== MarketAssetKind.Coin) {
					throw new Error('Market source: market base must be catalog coin')
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[$market.$base.$coin.coinId]) !== stringify($market)) {
					throw new Error('CoinMarketCap_Rest: OHLC is catalog coin USD market only')
				}
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				const { getOhlcvHistoricalRows } = await import(
					'$/sources/CoinMarketCap/Rest/queries.ts',
				)
				assertCoingeckoDayOhlcTimeInterval(timeInterval, 'CoinMarketCap_Rest')
				const coinId = $market.$base.$coin.coinId
				const coinMarketCapId = idByCoinId[coinId]
				if (coinMarketCapId == null) throw new Error('CoinMarketCap_Rest: OHLC coin not mapped')

				const ohlcCandles = await getOhlcvHistoricalRows({
					publicEnv: context.publicEnv,
					id: coinMarketCapId,
					days: timeInterval.value,
				})
				const ohlcCandle = ohlcCandles.find(([timestampMs]) => (
					Math.floor(timestampMs) === timestampMsSelector
				))
				if (ohlcCandle == null) throw new Error('CoinMarketCap_Rest: OHLC candle not found for timestamp')
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

		defineResolver(Source.CoinMarketCap_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				return (
					Object.entries(idByCoinId)
						.filter(([coinId]) => coinId in coinById)
						.map(([coinId]) => (
							{
								[EntityMetaKey.Selector]: {
									coinId: coinId as CoinId,
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
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				return (
					Object.entries(idByCoinId)
						.filter(([coinId]) => coinId in coinById)
						.map(([coinId]) => (
							{
								[EntityMetaKey.Selector]: catalogCoinUsdMarketIdByCoinId[coinId],
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
				[_GlobalSelector.Scope]: async () => {
				throw new Error('CoinMarketCap_Rest: $$marketTimeIntervalTimestamps is not implemented')
			}
			},
		})({
				fields: {
				$$marketTimeIntervalTimestamps: (timestamps) => timestamps,
			},
			}),

		defineResolver(Source.CoinMarketCap_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
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
				$$marketPrices: (marketPrices) => marketPrices,
			},
			}),

		defineResolver(Source.CoinMarketCap_Rest, {
			entityType: EntityType.Coin,
			resolve: {
				[CoinSelector.CoinId]: async ({ coinId }: EntitySelector<typeof schema, EntityType.Coin>) => {
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				if (idByCoinId[coinId] == null) {
					throw new Error(`CoinMarketCap_Rest: $$marketsWithCoinAsBase unsupported for coin ${coinId}`)
				}
				return (
					[
						{
							[EntityMetaKey.Selector]: catalogCoinUsdMarketIdByCoinId[coinId],
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
				if (idByCoinId[coinId] == null) {
					return []
				}
				return (
					catalogSpotMarketsWithCoinAsQuote
						.filter((catalogMarket) => catalogMarket.quoteCoinId === coinId)
						.map((catalogMarket) => catalogMarket.marketId)
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
				$$marketsWithCurrencyAsQuote: (markets) => markets,
			},
			}),

		defineResolver(Source.CoinMarketCap_Rest, {
			entityType: EntityType.Currency,
			resolve: {
				[CurrencySelector.Iso4217]: async ({ iso4217 }: EntitySelector<typeof schema, EntityType.Currency>) => {
				const markets = catalogSpotMarketsWithCurrencyAsBase
						.filter((catalogMarket) => catalogMarket.iso4217 === iso4217)
						.map((catalogMarket) => ({
							[EntityMetaKey.Selector]: catalogMarket.marketId,
						}))
				if (markets.length === 0) {
					throw new Error(`CoinMarketCap_Rest: no catalog markets with ${iso4217} as base`)
				}
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
				if (entitySelector.marketKind !== MarketKind.Spot) {
					return []
				}
				if (entitySelector.$base.kind !== MarketAssetKind.Coin) {
					return []
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entitySelector.$base.$coin.coinId]) !== stringify(entitySelector)) {
					return []
				}
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				const { getOhlcvHistoricalRows } = await import(
					'$/sources/CoinMarketCap/Rest/queries.ts',
				)
				const coinId = entitySelector.$base.$coin.coinId
				if (idByCoinId[coinId] == null) throw new Error('CoinMarketCap_Rest: OHLC coin not mapped')
				const coinMarketCapId = idByCoinId[coinId]
				const lim = resolverContextRowLimit(context)
				const candles = []
				for (const value of coingeckoOhlcDayWindowLengths) {
					const timeInterval = (
						{
							unit: MarketTimeIntervalUnit.Day,
							value,
						}
					)
					const ohlcCandles = await getOhlcvHistoricalRows({
						publicEnv: context.publicEnv,
						id: coinMarketCapId,
						days: value,
					})
					candles.push(
						...candlesFromOhlc(
							entitySelector,
							timeInterval,
							String(coinMarketCapId),
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
				$$marketTimeIntervalTimestamps: (timestamps) => timestamps,
			},
			}),

		defineResolver(Source.CoinMarketCap_Rest, {
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
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				const coinId = $market.$base.$coin.coinId
				const coinMarketCapId = idByCoinId[coinId]
				if (coinMarketCapId == null) throw new Error('CoinMarketCap_Rest: coin price not mapped')
				const { getQuotesLatest } = await import(
					'$/sources/CoinMarketCap/Rest/queries.ts',
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
				if (!Number.isFinite(updatedAt)) {
					throw new Error('CoinMarketCap_Rest: quote invalid')
				}
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
				[Market_TimeInterval_TimestampSelector.MarketTimeIntervalTimestampMsFeedKey]: async ({ $market }: EntitySelector<typeof schema, EntityType.Market_TimeInterval_Timestamp>) => (
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

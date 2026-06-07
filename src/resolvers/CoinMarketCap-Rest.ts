import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
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
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { MediaType } from '$/schema/Media.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.CoinMarketCap_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.Coin,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId, context) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				const { getInfo } = await import('$/sources/CoinMarketCap/Rest/queries.ts')
				const coinMarketCapId = idByCoinId[entityId.coinId]
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
					...(infoName !== '' && { name: infoName }),
					...(infoSymbol !== '' && { symbol: infoSymbol.toUpperCase() }),
					...(infoSymbol === '' && {
						symbol: coinById[entityId.coinId].symbol,
					}),
					...(logoMedia != null && { $logo: logoMedia }),
				}
			},
			fields: {
				name: (coin) => coin.name,
				symbol: (coin) => coin.symbol,
				$logo: (coin) => coin.$logo,
			},
		}),

		defineResolver({
			entityType: EntityType.Market_Timestamp,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId, context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('CoinMarketCap_Rest: Market_Timestamp is spot-only')
				}
				if (entityId.$market.$base.kind !== MarketAssetKind.Coin) {
					throw new Error('Market source: market base must be catalog coin')
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$market.$base.$coin.coinId]) !== stringify(entityId.$market)) {
					throw new Error('CoinMarketCap_Rest: Market_Timestamp is catalog coin USD market only')
				}
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				const coinId = entityId.$market.$base.$coin.coinId
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
				if (entityId.timestampMs !== timestampMs) {
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
			},
			fields: {
				price: (timestamp) => timestamp.price,
				transport: (timestamp) => timestamp.transport,
				providerAssetId: (timestamp) => timestamp.providerAssetId,
				caip19: (timestamp) => timestamp.caip2,
			},
		}),

		defineResolver({
			entityType: EntityType.Market_TimeInterval_Timestamp,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId, context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('CoinMarketCap_Rest: OHLC is spot-only')
				}
				if (entityId.$market.$base.kind !== MarketAssetKind.Coin) {
					throw new Error('Market source: market base must be catalog coin')
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$market.$base.$coin.coinId]) !== stringify(entityId.$market)) {
					throw new Error('CoinMarketCap_Rest: OHLC is catalog coin USD market only')
				}
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				const { getOhlcvHistoricalRows } = await import(
					'$/sources/CoinMarketCap/Rest/queries.ts',
				)
				assertCoingeckoDayOhlcTimeInterval(entityId.timeInterval, 'CoinMarketCap_Rest')
				const coinId = entityId.$market.$base.$coin.coinId
				const coinMarketCapId = idByCoinId[coinId]
				if (coinMarketCapId == null) throw new Error('CoinMarketCap_Rest: OHLC coin not mapped')

				const ohlcCandles = await getOhlcvHistoricalRows({
					publicEnv: context.publicEnv,
					id: coinMarketCapId,
					days: entityId.timeInterval.value,
				})
				const ohlcCandle = ohlcCandles.find(([timestampMs]) => (
					Math.floor(timestampMs) === entityId.timestampMs
				))
				if (ohlcCandle == null) throw new Error('CoinMarketCap_Rest: OHLC candle not found for timestamp')
				return (
					candleFromOhlc(
						entityId.$market,
						entityId.timeInterval,
					ohlcCandle,
					)
				)
			},
			fields: {
				open: (timestamp) => timestamp.open,
				high: (timestamp) => timestamp.high,
				low: (timestamp) => timestamp.low,
				close: (timestamp) => timestamp.close,
				volume: (timestamp) => timestamp.volume,
				quoteVolume: (timestamp) => timestamp.quoteVolume,
				tradeCount: (timestamp) => timestamp.tradeCount,
				vwap: (timestamp) => timestamp.vwap,
			},
		}),

		defineResolver({
			entityType: EntityType._Global,
			accepts: [EntityIdProjection.Identity],
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				return (
					Object.entries(idByCoinId)
						.filter(([coinId]) => coinId in coinById)
						.map(([coinId]) => (
							{
								[EntityMetaKey.Id]: {
									coinId: coinId as CoinId,
								},
							}
						))
				)
			},
			fields: {
				$$coins: (coins) => coins,
			},
		}),

		defineResolver({
			entityType: EntityType._Global,
			accepts: [EntityIdProjection.Identity],
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				return (
					Object.entries(idByCoinId)
						.filter(([coinId]) => coinId in coinById)
						.map(([coinId]) => (
							{
								[EntityMetaKey.Id]: catalogCoinUsdMarketIdByCoinId[coinId],
							}
						))
				)
			},
			fields: {
				$$markets: (markets) => markets,
			},
		}),

		defineResolver({
			entityType: EntityType._Global,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => {
				throw new Error('CoinMarketCap_Rest: $$marketTimeIntervalTimestamps is not implemented')
			},
			fields: {
				$$marketTimeIntervalTimestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver({
			entityType: EntityType._Global,
			accepts: [EntityIdProjection.Identity],
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				return (
					Object.entries(idByCoinId)
						.filter(([coinId]) => coinId in coinById)
						.map(([coinId]) => (
							{
								[EntityMetaKey.Id]: {
									$market: catalogCoinUsdMarketIdByCoinId[coinId],
								},
							}
						))
				)
			},
			fields: {
				$$marketPrices: (marketPrices) => marketPrices,
			},
		}),

		defineResolver({
			entityType: EntityType.Coin,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>) => {
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				if (idByCoinId[entityId.coinId] == null) {
					throw new Error(`CoinMarketCap_Rest: $$marketsWithCoinAsBase unsupported for coin ${entityId.coinId}`)
				}
				return (
					[
						{
							[EntityMetaKey.Id]: catalogCoinUsdMarketIdByCoinId[entityId.coinId],
						},
					]
				)
			},
			fields: {
				$$marketsWithCoinAsBase: (markets) => markets,
			},
		}),

		defineResolver({
			entityType: EntityType.Coin,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>) => {
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				if (idByCoinId[entityId.coinId] == null) {
					return []
				}
				return (
					catalogSpotMarketsWithCoinAsQuote
						.filter((catalogMarket) => catalogMarket.quoteCoinId === entityId.coinId)
						.map((catalogMarket) => catalogMarket.marketId)
						.filter((marketId) => (
							idByCoinId[marketId.$base.$coin.coinId] != null
						))
						.map((marketId) => (
							{
								[EntityMetaKey.Id]: marketId,
							}
						))
				)
			},
			fields: {
				$$marketsWithCoinAsQuote: (markets) => markets,
			},
		}),

		defineResolver({
			entityType: EntityType.Currency,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				return (
					(
						entityId.iso4217 === Iso4217.USD ?
							catalogMarketsWithCurrencyAsQuoteUsd.filter((marketId) => (
								idByCoinId[marketId.$base.$coin.coinId] != null
							))
						:
							[]
					).map((marketId) => ({
						[EntityMetaKey.Id]: marketId,
					}))
				)
			},
			fields: {
				$$marketsWithCurrencyAsQuote: (markets) => markets,
			},
		}),

		defineResolver({
			entityType: EntityType.Currency,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
				const markets = catalogSpotMarketsWithCurrencyAsBase
						.filter((catalogMarket) => catalogMarket.iso4217 === entityId.iso4217)
						.map((catalogMarket) => ({
							[EntityMetaKey.Id]: catalogMarket.marketId,
						}))
				if (markets.length === 0) {
					throw new Error(`CoinMarketCap_Rest: no catalog markets with ${entityId.iso4217} as base`)
				}
				return markets
			},
			fields: {
				$$marketsWithCurrencyAsBase: (markets) => markets,
			},
		}),

		defineResolver({
			entityType: EntityType.Market,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market>, context) => {
				if (entityId.marketKind !== MarketKind.Spot) {
					return []
				}
				if (entityId.$base.kind !== MarketAssetKind.Coin) {
					return []
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$base.$coin.coinId]) !== stringify(entityId)) {
					return []
				}
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				const { getOhlcvHistoricalRows } = await import(
					'$/sources/CoinMarketCap/Rest/queries.ts',
				)
				const coinId = entityId.$base.$coin.coinId
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
							entityId,
							timeInterval,
							ohlcCandles,
						),
					)
				}
				return (
					candles.slice(0, lim)
				)
			},
			fields: {
				$$marketTimeIntervalTimestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver({
			entityType: EntityType.MarketPrice,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId, context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					return []
				}
				if (entityId.$market.$base.kind !== MarketAssetKind.Coin) {
					return []
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$market.$base.$coin.coinId]) !== stringify(entityId.$market)) {
					return []
				}
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				const coinId = entityId.$market.$base.$coin.coinId
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
						[EntityMetaKey.Id]: {
							$market: entityId.$market,
							timestampMs: Math.floor(updatedAt),
						},
					},
				]
			},
			fields: {
				$$quotes: (quotes) => quotes,
			},
		}),

		defineResolver({
			entityType: EntityType.MarketPrice,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.MarketPrice>) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
				}
			),
			fields: {
				$parentMarket: (market) => market,
			},
		}),

		defineResolver({
			entityType: EntityType.Market_TimeInterval_Timestamp,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market_TimeInterval_Timestamp>) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
				}
			),
			fields: {
				$parentMarket: (market) => market,
			},
		}),
	],
}

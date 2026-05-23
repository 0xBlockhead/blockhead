import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import type { CoinId } from '$/constants/Coin.ts'
import {
	MarketAssetKind,
	MarketKind,
	MarketTimeIntervalUnit,
	coingeckoOhlcDayWindowLengths,
} from '$/constants/Market.ts'
import {
	catalogMarketsWithCurrencyAsBase,
	catalogMarketsWithCurrencyAsQuote,
	usdCurrencyMarketAssetLeg,
} from '$/constants/Currency.ts'
import { marketTimestampFieldsFromObservation } from '$/resolvers/_marketSpotTimestamp.ts'
import {
	assertCoingeckoDayOhlcTimeInterval,
	candleEntitiesFromOhlcWireRows,
	candleEntityFromOhlcWireRow,
} from '$/lib/marketOhlcCandles.ts'
import { catalogCoinUsdMarketId } from '$/constants/MarketCatalog.ts'
import { caip19Erc20 } from '$/lib/caip19.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { MediaType } from '$/schema/Media.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.CoinMarketCap_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Coin,
			resolve: async (entityId, context) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				const { getCoinMarketCapInfo } = await import('$/sources/CoinMarketCap/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.CoinMarketCap_Rest)
				const coinMarketCapId = idByCoinId[entityId.coinId]
				if (coinMarketCapId == null) throw new Error('CoinMarketCap_Rest: coin not mapped')

				const infoResponse = await getCoinMarketCapInfo({
					publicEnv,
					id: coinMarketCapId,
				})
				const info = (
					infoResponse.data == null ?
						undefined
					:	Object.values(infoResponse.data)[0]
				)
				if (info == null) throw new Error('CoinMarketCap_Rest: coin info not returned')

				const logoUrl = info.logo
				const logoMedia = mediaFromUrl(logoUrl, MediaType.Image)

				return {
					...(info.name.trim() !== '' && { name: info.name.trim() }),
					...(info.symbol.trim() !== '' && { symbol: info.symbol.trim().toUpperCase() }),
					...(info.symbol.trim() === '' && coinById[entityId.coinId] != null && {
						symbol: coinById[entityId.coinId].symbol,
					}),
					...(logoMedia != null && { $logo: logoMedia }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Market_Timestamp,
			resolve: async (entityId, context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('CoinMarketCap_Rest: Market_Timestamp is spot-only')
				}
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				const publicEnv = sourcePublicEnv(context, Source.CoinMarketCap_Rest)
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
						entityId.$market.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null) throw new Error('CoinMarketCap_Rest: market base is not a catalog coin')
				const coinMarketCapId = idByCoinId[coinId]
				if (coinMarketCapId == null) throw new Error('CoinMarketCap_Rest: coin price not mapped')

				const { getCoinMarketCapInfo, getCoinMarketCapQuotesLatest } = await import(
					'$/sources/CoinMarketCap/Rest/queries.ts',
				)
				const [quoteResponse, infoResponse] = await Promise.all([
					getCoinMarketCapQuotesLatest({
						publicEnv,
						id: coinMarketCapId,
					}),
					getCoinMarketCapInfo({
						publicEnv,
						id: coinMarketCapId,
					}),
				])
				const quote = (
					quoteResponse.data == null ?
						undefined
					:	Object.values(quoteResponse.data)[0]
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
					:	Object.values(infoResponse.data)[0]
				)?.platform
				const caip19 = (
					(p?.slug === 'ethereum' || p?.name === 'Ethereum')
					&& p?.token_address != null
					&& /^0x[a-fA-F0-9]{40}$/i.test(p.token_address.trim()) ?
						caip19Erc20(1, p.token_address.trim().toLowerCase() as `0x${string}`)
					:
						undefined
				)

				return marketTimestampFieldsFromObservation({
					timestampMs,
					price: BigInt(Math.round(price * 1e8)),
					transport: 'coinmarketcap-v2-quotes-and-info-usd-1e8',
					providerAssetId: String(coinMarketCapId),
					...(caip19 != null && { caip19 }),
				})
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: async (entityId, context) => {
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				const { getCoinMarketCapOhlcvHistoricalCoingeckoShape } = await import(
					'$/sources/CoinMarketCap/Rest/queries.ts',
				)
				const publicEnv = sourcePublicEnv(context, Source.CoinMarketCap_Rest)
				assertCoingeckoDayOhlcTimeInterval(entityId.timeInterval, 'CoinMarketCap_Rest')
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
						entityId.$market.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null) throw new Error('CoinMarketCap_Rest: OHLC market base is not a catalog coin')
				const coinMarketCapId = idByCoinId[coinId]
				if (coinMarketCapId == null) throw new Error('CoinMarketCap_Rest: OHLC coin not mapped')

				const rows = await getCoinMarketCapOhlcvHistoricalCoingeckoShape({
					publicEnv,
					id: coinMarketCapId,
					days: entityId.timeInterval.value,
				})
				const row = rows.find(([timestampMs]) => (
					Math.floor(timestampMs) === entityId.timestampMs
				))
				if (row == null) throw new Error('CoinMarketCap_Rest: OHLC candle not found for timestamp')
				return (
					candleEntityFromOhlcWireRow(
						entityId.$market,
						entityId.timeInterval,
						row,
					)
				)
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$coins',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				return (
					Object.entries(idByCoinId)
						.filter(([coinId]) => coinById[coinId as keyof typeof coinById] != null)
						.map(([coinId]) => (
							{
								[EntityMetaKey.Id]: {
									coinId: coinId as CoinId,
								},
							}
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$markets',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				return (
					Object.entries(idByCoinId)
						.filter(([coinId]) => coinById[coinId as keyof typeof coinById] != null)
						.map(([coinId]) => (
							{
								[EntityMetaKey.Id]: catalogCoinUsdMarketId(coinId),
							}
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$marketTimeIntervalTimestamps',
			resolve: async () => {
				throw new Error('CoinMarketCap_Rest: $$marketTimeIntervalTimestamps is not implemented')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$marketPrices',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				return (
					Object.entries(idByCoinId)
						.filter(([coinId]) => coinById[coinId as keyof typeof coinById] != null)
						.map(([coinId]) => (
							{
								[EntityMetaKey.Id]: {
									$market: catalogCoinUsdMarketId(coinId),
								},
							}
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsBase',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>) => {
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				if (idByCoinId[entityId.coinId] == null) {
					throw new Error(`CoinMarketCap_Rest: $$marketsWithCoinAsBase unsupported for coin ${entityId.coinId}`)
				}
				return (
					[
						{
							[EntityMetaKey.Id]: catalogCoinUsdMarketId(entityId.coinId),
						},
					]
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsQuote',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { catalogMarketsWithCoinAsQuote } = await import('$/constants/MarketCatalog.ts')
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				if (coinById[entityId.coinId as keyof typeof coinById] == null) {
					throw new Error(`CoinMarketCap_Rest: $$marketsWithCoinAsQuote unsupported for coin ${entityId.coinId}`)
				}
				if (idByCoinId[entityId.coinId] == null) {
					throw new Error(`CoinMarketCap_Rest: $$marketsWithCoinAsQuote unsupported for coin ${entityId.coinId}`)
				}
				return (
					catalogMarketsWithCoinAsQuote(
						entityId.coinId,
						(baseCoinId) => idByCoinId[baseCoinId] != null,
					).map((marketId) => (
						{
							[EntityMetaKey.Id]: marketId,
						}
					))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Currency,
			fieldName: '$$marketsWithCurrencyAsQuote',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				return (
					catalogMarketsWithCurrencyAsQuote(
						entityId.iso4217,
						(coinId) => (
							coinById[coinId as keyof typeof coinById] != null
							&& idByCoinId[coinId] != null
						),
					).map((marketId) => (
						{
							[EntityMetaKey.Id]: marketId,
						}
					))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Currency,
			fieldName: '$$marketsWithCurrencyAsBase',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
				const markets = catalogMarketsWithCurrencyAsBase(entityId.iso4217).map((marketId) => (
					{
						[EntityMetaKey.Id]: marketId,
					}
				))
				if (markets.length === 0) {
					throw new Error(`CoinMarketCap_Rest: no catalog markets with ${entityId.iso4217} as base`)
				}
				return markets
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Market,
			fieldName: '$$marketTimeIntervalTimestamps',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market>, context) => {
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				const { getCoinMarketCapOhlcvHistoricalCoingeckoShape } = await import(
					'$/sources/CoinMarketCap/Rest/queries.ts',
				)
				const coinId = (
					entityId.$base.kind === MarketAssetKind.Coin ?
						entityId.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null) throw new Error('CoinMarketCap_Rest: OHLC market base is not a catalog coin')
				if (idByCoinId[coinId] == null) throw new Error('CoinMarketCap_Rest: OHLC coin not mapped')
				const publicEnv = sourcePublicEnv(context, Source.CoinMarketCap_Rest)
				const coinMarketCapId = idByCoinId[coinId]
				if (coinMarketCapId == null) throw new Error('CoinMarketCap_Rest: OHLC coin not mapped')
				const lim = resolverLoadSubsetRowLimit(context)
				const candles = (
					(
						await Promise.all(
							[...coingeckoOhlcDayWindowLengths].map(async (value) => {
								const timeInterval = (
									{
										unit: MarketTimeIntervalUnit.Day,
										value,
									}
								)
								const rows = await getCoinMarketCapOhlcvHistoricalCoingeckoShape({
									publicEnv,
									id: coinMarketCapId,
									days: value,
								})
								return (
									candleEntitiesFromOhlcWireRows(
										entityId,
										timeInterval,
										rows,
									)
								)
							}),
						)
					).flat()
				)
				return (
					candles
						.toSorted((left, right) => (
							left[EntityMetaKey.Id].timestampMs < right[EntityMetaKey.Id].timestampMs ?
								1
							: left[EntityMetaKey.Id].timestampMs > right[EntityMetaKey.Id].timestampMs ?
								-1
							:
								0
						))
						.slice(0, lim)
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.MarketPrice,
			fieldName: '$$quotes',
			resolve: async (entityId, context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('CoinMarketCap_Rest: MarketPrice $$quotes is spot-only')
				}
				const { idByCoinId } = await import('$/sources/CoinMarketCap/Rest/constants.ts')
				const publicEnv = sourcePublicEnv(context, Source.CoinMarketCap_Rest)
				const coinId = (
					entityId.$market.$base.kind === MarketAssetKind.Coin ?
						entityId.$market.$base.$coin.coinId
					:	undefined
				)
				if (coinId == null) throw new Error('CoinMarketCap_Rest: market base is not a catalog coin')
				const coinMarketCapId = idByCoinId[coinId]
				if (coinMarketCapId == null) throw new Error('CoinMarketCap_Rest: coin price not mapped')
				const { getCoinMarketCapQuotesLatest } = await import(
					'$/sources/CoinMarketCap/Rest/queries.ts',
				)
				const quoteResponse = await getCoinMarketCapQuotesLatest({
					publicEnv,
					id: coinMarketCapId,
				})
				const quote = (
					quoteResponse.data == null ?
						undefined
					:	Object.values(quoteResponse.data)[0]
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.MarketPrice,
			fieldName: '$$parentMarket',
			resolve: async (entityId: EntityId<typeof schema, EntityType.MarketPrice>) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
				}
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Market_TimeInterval_Timestamp,
			fieldName: '$$parentMarket',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market_TimeInterval_Timestamp>) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
				}
			),
		}),
	],
}

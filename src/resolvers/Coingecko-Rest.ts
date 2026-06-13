import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import type { CoinId } from '$/constants/Coin.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
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
import { caip19Erc20, caip19Slip44, Slip44 } from '$/lib/caip19.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
import { MediaType } from '$/schema/Media.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default {
	source: Source.Coingecko_Rest,

	resolvers: [
		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.Coin,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { CoinId, coinById } = await import('$/constants/Coin.ts')
				const { decimalsByCoinId, idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoin } = await import('$/sources/Coingecko/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const coingeckoId = idByCoinId[entityId.coinId]
				if (coingeckoId == null) throw new Error('Coingecko_Rest: coin not mapped')
				const coin = await getCoin(publicEnv, coingeckoId)
				if (coin == null) throw new Error('Coingecko_Rest: coin not returned by API')

				const decimals = (
					Object.values(coin.detail_platforms ?? {})
						.find((platform) => platform.decimal_place != null)
						?.decimal_place
					?? decimalsByCoinId[entityId.coinId]
				)
				const logoUrl = coin.image?.large ?? coin.image?.small ?? coin.image?.thumb
				const logoMedia = mediaFromUrl(logoUrl, MediaType.Image)

				const md = coin.market_data
				const coinName = coin.name

				return {
					symbol: coinById[entityId.coinId].symbol,
					...(coinName !== '' && { name: coinName }),
					...(decimals != null && { decimals }),
					...(logoMedia != null && { $logo: logoMedia }),
					...(md?.market_cap_rank != null
						&& Number.isFinite(md.market_cap_rank) && {
						marketCapRank: md.market_cap_rank,
					}),
					...(md?.market_cap?.usd != null
						&& Number.isFinite(md.market_cap.usd) && {
						marketCapUsd: md.market_cap.usd,
					}),
				}
			}
			},
		})({
				fields: {
				symbol: (coin) => coin.symbol,
				name: (coin) => coin.name,
				decimals: (coin) => coin.decimals,
				$logo: (coin) => coin.$logo,
				marketCapRank: (coin) => coin.marketCapRank,
				marketCapUsd: (coin) => coin.marketCapUsd,
			},
			}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { CoinId } = await import('$/constants/Coin.ts')
				const {
					decimalsByCoinId,
					coinIdByWireId,
				} = await import('$/sources/Coingecko/Rest/constants.ts')
				const {
					findAssetPlatformByChainId,
					getCoinByAssetPlatformContract,
				} = await import('$/sources/Coingecko/Rest/queries.ts')
				const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const knownCoinIds = Object.values(CoinId)
				const pickCoingeckoCoinImageUrl = (coingeckoCoin: { image?: { large?: string; small?: string; thumb?: string } } | undefined) => (
					coingeckoCoin?.image?.large
						?? coingeckoCoin?.image?.small
						?? coingeckoCoin?.image?.thumb
				)
				if (entityId.type === CoinInstanceType.NativeCurrency) {
					const chain = (
						await singleFlight(fetchRpcsJson)()
					)
						.find((candidateChain) => (
							candidateChain.chainId === Number(entityId.$network.caip2.reference)
						))
					if (chain == null) throw new Error('Coingecko_Rest: native coin chain not in chainlist')

					const symbol = chain.nativeCurrency.symbol.toUpperCase()
					const nativeCurrency = {
						coinId: knownCoinIds.find((candidateCoinId) => candidateCoinId === symbol) ?? CoinId.Unknown,
						name: chain.nativeCurrency.name,
						symbol,
						decimals: chain.nativeCurrency.decimals,
						slip44: chain.slip44,
					}
					const nativeCurrencyName = nativeCurrency.name
					return {
						coinId: nativeCurrency.coinId,
						...(nativeCurrencyName !== '' && { name: nativeCurrencyName }),
						symbol: nativeCurrency.symbol,
						decimals: nativeCurrency.decimals,
						...(nativeCurrency.slip44 != null && { caip19: caip19Slip44(Number(entityId.$network.caip2.reference), nativeCurrency.slip44) }),
					}
				}

				const caip19 = caip19Erc20(
					Number(entityId.$network.caip2.reference),
					entityId.$contract.address,
				)
				const assetPlatform = await findAssetPlatformByChainId(
					publicEnv,
					Number(entityId.$network.caip2.reference),
				)
				if (assetPlatform == null) {
					throw new Error('Coingecko_Rest: no asset platform for chain')
				}

				const coin = await getCoinByAssetPlatformContract({
					publicEnv,
					assetPlatformId: assetPlatform.id,
					contractAddress: entityId.$contract.address,
				})

				if (coin == null) {
					throw new Error('Coingecko_Rest: ERC-20 contract not found on asset platform')
				}

				const coinId = coinIdByWireId[coin.id] ?? CoinId.Unknown
				const decimals = (
					coin.detail_platforms?.[assetPlatform.id]?.decimal_place
					?? Object.values(coin.detail_platforms ?? {})
						.find((platform) => platform.decimal_place != null)
						?.decimal_place
					?? decimalsByCoinId[coinId]
				)
				const iconUrl = pickCoingeckoCoinImageUrl(coin)
				const iconMedia = mediaFromUrl(iconUrl, MediaType.Image)
				const coinName = coin.name

				return {
					coinId,
					symbol: coin.symbol.toUpperCase(),
					...(coinName !== '' && { name: coinName }),
					...(decimals != null && { decimals }),
					caip19,
					...(iconMedia != null && { $icon: iconMedia }),
				}
			}
			},
		})({
				fields: {
				coinId: (coinInstance) => coinInstance.coinId,
				name: (coinInstance) => coinInstance.name,
				symbol: (coinInstance) => coinInstance.symbol,
				decimals: (coinInstance) => coinInstance.decimals,
				caip19: (coinInstance) => coinInstance.caip19,
				$icon: (coinInstance) => coinInstance.$icon,
			},
			}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.Market,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				if (entityId.marketKind === MarketKind.Spot) {
					return {}
				}
				throw new Error('Coingecko_Rest: derivative Market fields use Coingecko_OpenApi')
			}
			},
		})({
				fields: {},
			}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.Market_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('Coingecko_Rest: Market_Timestamp is spot-only')
				}
				if (entityId.$market.$base.kind !== MarketAssetKind.Coin) {
					throw new Error('Market source: market base must be catalog coin')
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$market.$base.$coin.coinId]) !== stringify(entityId.$market)) {
					throw new Error('Coingecko_Rest: Market_Timestamp is catalog coin USD market only')
				}
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoinMarketSpot } = await import('$/sources/Coingecko/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const coinId = entityId.$market.$base.$coin.coinId
				const coingeckoId = idByCoinId[coinId]
				if (coingeckoId == null) throw new Error('Coingecko_Rest: coin price not mapped')

				const spot = await getCoinMarketSpot(
					publicEnv,
					coingeckoId,
				)
				if (spot == null) throw new Error('Coingecko_Rest: coin market spot not returned')
				const { usd, lastUpdatedAtSec, coin } = spot
				const timestampMs = lastUpdatedAtSec * 1000
				if (entityId.timestampMs !== timestampMs) {
					throw new Error('Coingecko_Rest: Market_Timestamp id does not match spot clock')
				}
				const eth = coin.platforms?.ethereum
				const caip19 = (
					eth != null && /^0x[a-fA-F0-9]{40}$/.test(eth) ?
						caip19Erc20(1, eth.toLowerCase() as `0x${string}`)
					: coin.id === 'ethereum' ?
						caip19Slip44(1, Slip44.Ether)
					:
						undefined
				)

				return {
					price: BigInt(Math.round(usd * 1e8)),
					transport: 'coingecko-coins-id-market-data-usd-1e8',
					providerAssetId: coingeckoId,
					...(caip19 && { caip19 }),
				}
			}
			},
		})({
				fields: {
				price: (timestamp) => timestamp.price,
				transport: (timestamp) => timestamp.transport,
				providerAssetId: (timestamp) => timestamp.providerAssetId,
				caip19: (timestamp) => timestamp.caip19,
			},
			}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('Coingecko_Rest: OHLC is spot-only')
				}
				if (entityId.$market.$base.kind !== MarketAssetKind.Coin) {
					throw new Error('Market source: market base must be catalog coin')
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$market.$base.$coin.coinId]) !== stringify(entityId.$market)) {
					throw new Error('Coingecko_Rest: OHLC is catalog coin USD market only')
				}
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoinOhlc } = await import('$/sources/Coingecko/Rest/queries.ts')
				const publicEnv = context.publicEnv
				assertCoingeckoDayOhlcTimeInterval(entityId.timeInterval, 'Coingecko_Rest')
				const coinId = entityId.$market.$base.$coin.coinId
				const coingeckoId = idByCoinId[coinId]
				if (coingeckoId == null) throw new Error('Coingecko_Rest: OHLC coin not mapped')
				const ohlcCandles = await getCoinOhlc({
					publicEnv,
					coingeckoId,
					vs: 'usd',
					days: entityId.timeInterval.value,
				})
				const ohlcCandle = ohlcCandles.find(([timestampMs]) => (
					Math.floor(timestampMs) === entityId.timestampMs
				))
				if (ohlcCandle == null) throw new Error('Coingecko_Rest: OHLC candle not found for timestamp')
				return (
					candleFromOhlc(
						entityId.$market,
						entityId.timeInterval,
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
				volume: (timestamp) => timestamp.volume,
				quoteVolume: (timestamp) => timestamp.quoteVolume,
				tradeCount: (timestamp) => timestamp.tradeCount,
				vwap: (timestamp) => timestamp.vwap,
			},
			}),
		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>, context) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { coinIdByWireId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoinsMarketsPage } = await import('$/sources/Coingecko/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const lim = Math.min(resolverContextRowLimit(context), 250)
				const markets = await getCoinsMarketsPage({
					publicEnv,
					vsCurrency: 'usd',
					order: 'market_cap_desc',
					perPage: lim,
					page: 1,
				})
				return (
					markets
						.flatMap((coinMarket) => {
							const coinId = coinIdByWireId[coinMarket.id]
							if (coinId == null) return []
							const rank = coinMarket.market_cap_rank
							const cap = coinMarket.market_cap
							return [
								{
									[EntityMetaKey.Id]: {
										coinId,
									},
									...(rank != null && Number.isFinite(rank) && {
										marketCapRank: rank,
									}),
									...(cap != null && Number.isFinite(cap) && {
										marketCapUsd: cap,
									}),
								},
							]
						})
				)
			}
			},
		})({
				fields: {
				$$coins: (globalScope) => globalScope,
			},
			}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				return (
					Object.entries(idByCoinId)
						.filter(([coinId]) => coinId in coinById)
						.map(([coinId]) => ({
							[EntityMetaKey.Id]: catalogCoinUsdMarketIdByCoinId[coinId],
						}))
				)
			}
			},
		})({
				fields: {
				$$markets: (globalScope) => globalScope,
			},
			}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				return (
					Object.entries(idByCoinId)
						.filter(([coinId]) => coinId in coinById)
						.map(([coinId]) => ({
							[EntityMetaKey.Id]: {
								$market: catalogCoinUsdMarketIdByCoinId[coinId],
							},
						}))
				)
			}
			},
		})({
				fields: {
				$$marketPrices: (globalScope) => globalScope,
			},
			}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>, context) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoinOhlc } = await import('$/sources/Coingecko/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const lim = resolverContextRowLimit(context)
				const catalogCoinIds = (
					Object.entries(idByCoinId)
						.filter(([coinId]) => coinId in coinById)
						.map(([coinId]) => coinId as CoinId)
				)
				const previewCoinIds = catalogCoinIds.slice(
					0,
					Math.min(catalogCoinIds.length, Math.max(1, Math.ceil(lim / 24))),
				)
				const previewTimeInterval = (
					{
						unit: MarketTimeIntervalUnit.Day,
						value: 7,
					}
				)
				const candles = []
				for (const coinId of previewCoinIds) {
					const $market = catalogCoinUsdMarketIdByCoinId[coinId]
					const coingeckoId = idByCoinId[coinId]
					if (coingeckoId == null) continue
					const ohlcCandles = await getCoinOhlc({
						publicEnv,
						coingeckoId,
						vs: 'usd',
						days: previewTimeInterval.value,
					})
					candles.push(
						...candlesFromOhlc(
							$market,
							previewTimeInterval,
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
				$$marketTimeIntervalTimestamps: (globalScope) => globalScope,
			},
			}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.Coin,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { fetchCoinInstanceStubsForCoin } = await import(
					'$/sources/Coingecko/Rest/coinInstances.ts'
				)
				if (idByCoinId[entityId.coinId] == null) {
					throw new Error(`Coingecko_Rest: $$coinInstances unsupported for coin ${entityId.coinId}`)
				}
				return singleFlight(fetchCoinInstanceStubsForCoin)(
					entityId.coinId,
					context.publicEnv,
				)
			}
			},
		})({
				fields: {
				$$coinInstances: (coin) => coin,
			},
			}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { resolveCoinInstanceRepresentation } = await import(
					'$/sources/Coingecko/Rest/coinInstances.ts'
				)
				return resolveCoinInstanceRepresentation(
					entityId,
					context.publicEnv,
				)
			}
			},
		})({
				fields: {
				representation: (coinInstance) => coinInstance,
			},
			}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { resolveCanonicalCoinInstanceEntityId } = await import(
					'$/sources/Coingecko/Rest/coinInstances.ts'
				)
				const canonicalId = await resolveCanonicalCoinInstanceEntityId(
					entityId,
					context.publicEnv,
				)
				return (
					canonicalId == null ?
						undefined
					:
						{ [EntityMetaKey.Id]: canonicalId }
				)
			}
			},
		})({
				fields: {
				$canonicalInstance: (coinInstance) => coinInstance,
			},
			}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.Coin,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.Coin>) => {
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				if (idByCoinId[entityId.coinId] == null) {
					throw new Error(`Coingecko_Rest: $$marketsWithCoinAsBase unsupported for coin ${entityId.coinId}`)
				}
				return (
					[
						{
							[EntityMetaKey.Id]: catalogCoinUsdMarketIdByCoinId[entityId.coinId],
						},
					]
				)
			}
			},
		})({
				fields: {
				$$marketsWithCoinAsBase: (coin) => coin,
			},
			}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.Coin,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.Coin>) => {
				const { catalogMarketsWithCoinAsQuoteByQuoteCoinId } = await import('$/constants/MarketCatalog.ts')
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				if (idByCoinId[entityId.coinId] == null) {
					return []
				}
				return (
					(catalogSpotMarketsWithCoinAsQuote
						.filter((catalogMarket) => catalogMarket.quoteCoinId === entityId.coinId)
						.map((catalogMarket) => catalogMarket.marketId))
						.filter((marketId) => (
							idByCoinId[marketId.$base.$coin.coinId] != null
						))
						.map((marketId) => ({
							[EntityMetaKey.Id]: marketId,
						}))
				)
			}
			},
		})({
				fields: {
				$$marketsWithCoinAsQuote: (coin) => coin,
			},
			}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.Currency,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
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
			}
			},
		})({
				fields: {
				$$marketsWithCurrencyAsQuote: (currency) => currency,
			},
			}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.Currency,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
				const markets = catalogSpotMarketsWithCurrencyAsBase
						.filter((catalogMarket) => catalogMarket.iso4217 === entityId.iso4217)
						.map((catalogMarket) => ({
							[EntityMetaKey.Id]: catalogMarket.marketId,
						}))
				if (markets.length === 0) {
					throw new Error(`Coingecko_Rest: no catalog markets with ${entityId.iso4217} as base`)
				}
				return markets
			}
			},
		})({
				fields: {
				$$marketsWithCurrencyAsBase: (currency) => currency,
			},
			}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EntityIdProjection.Identity]: async () => {
				throw new Error('Coingecko_Rest: $$marketsWithInstanceAsBase is unsupported')
			}
			},
		})({
				fields: {
				$$marketsWithInstanceAsBase: (coinInstance) => coinInstance,
			},
			}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EntityIdProjection.Identity]: async () => {
				throw new Error('Coingecko_Rest: $$marketsWithInstanceAsQuote is unsupported')
			}
			},
		})({
				fields: {
				$$marketsWithInstanceAsQuote: (coinInstance) => coinInstance,
			},
			}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.Market,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.Market>) => (
				entityId.$base.kind === MarketAssetKind.Coin ?
					{
						[EntityMetaKey.Id]: {
							coinId: entityId.$base.$coin.coinId,
						},
					}
				:
					undefined
			)
			},
		})({
				fields: {
				$baseCoin: (market) => market,
			},
			}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.Market,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.Market>) => (
				(
				entityId.$base.kind === MarketAssetKind.Coin
				&& entityId.marketKind === MarketKind.Spot
				&& stringify(catalogCoinUsdMarketIdByCoinId[entityId.$base.$coin.coinId]) === stringify(entityId)
			) ?
					[
						{
							[EntityMetaKey.Id]: {
								$market: entityId,
							},
						},
					]
				:
					[]
			)
			},
		})({
				fields: {
				$$marketPrices: (market) => market,
			},
			}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.Market,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				if (entityId.marketKind !== MarketKind.Spot) {
					return []
				}
				if (entityId.$base.kind !== MarketAssetKind.Coin) {
					return []
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$base.$coin.coinId]) !== stringify(entityId)) {
					return []
				}
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoinOhlc } = await import('$/sources/Coingecko/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const coinId = entityId.$base.$coin.coinId
				const coingeckoId = idByCoinId[coinId]
				if (coingeckoId == null) throw new Error('Coingecko_Rest: OHLC coin not mapped')
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
						publicEnv,
						coingeckoId,
						vs: 'usd',
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
			}
			},
		})({
				fields: {
				$$marketTimeIntervalTimestamps: (market) => market,
			},
			}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.MarketPrice,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					return []
				}
				if (entityId.$market.$base.kind !== MarketAssetKind.Coin) {
					return []
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$market.$base.$coin.coinId]) !== stringify(entityId.$market)) {
					return []
				}
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoinMarketSpot } = await import('$/sources/Coingecko/Rest/queries.ts')
				const publicEnv = context.publicEnv
				const coinId = entityId.$market.$base.$coin.coinId
				const coingeckoId = idByCoinId[coinId]
				if (coingeckoId == null) throw new Error('Coingecko_Rest: coin price not mapped')
				const spot = await getCoinMarketSpot(publicEnv, coingeckoId)
				if (spot == null) throw new Error('Coingecko_Rest: coin market spot not returned')
				return [
					{
						[EntityMetaKey.Id]: {
							$market: entityId.$market,
							timestampMs: spot.lastUpdatedAtSec * 1000,
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

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.MarketPrice,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.MarketPrice>) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
				}
			)
			},
		})({
				fields: {
				$parentMarket: (marketPrice) => marketPrice,
			},
			}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId: EntityId<typeof schema, EntityType.Market_TimeInterval_Timestamp>) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
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

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
	catalogMarketsWithCoinAsQuoteByQuoteCoinId,
	catalogMarketsWithCurrencyAsBaseByIso4217,
	catalogMarketsWithCurrencyAsQuoteUsd,
} from '$/constants/MarketCatalog.ts'
import {
	assertCoingeckoDayOhlcTimeInterval,
	candleEntitiesFromOhlcWireRows,
	candleEntityFromOhlcWireRow,
} from '$/lib/marketOhlcCandles.ts'
import { stringify } from 'devalue'
import { caip19Erc20, caip19Slip44, Slip44 } from '$/lib/caip19.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { CoinInstanceType } from '$/schema/CoinInstance.ts'
import { MediaType } from '$/schema/Media.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.Coingecko_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.Coin,
			resolve: async (entityId, context) => {
				const { CoinId, coinById } = await import('$/constants/Coin.ts')
				const { decimalsByCoinId, idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoingeckoCoin } = await import('$/sources/Coingecko/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_Rest)
				const coingeckoId = idByCoinId[entityId.coinId]
				if (coingeckoId == null) throw new Error('Coingecko_Rest: coin not mapped')
				const coin = await getCoingeckoCoin(publicEnv, coingeckoId)
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
				const coinName = coin.name.trim()

				return {
					symbol: coinById[entityId.coinId]?.symbol ?? coin.symbol.trim().toUpperCase(),
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
			},
		}),

		defineEntityResolver({
			entityType: EntityType.CoinInstance,
			resolve: async (entityId, context) => {
				const { CoinId } = await import('$/constants/Coin.ts')
				const {
					decimalsByCoinId,
					coinIdByWireId,
				} = await import('$/sources/Coingecko/Rest/constants.ts')
				const {
					findCoingeckoAssetPlatformByChainId,
					getCoingeckoCoinByAssetPlatformContract,
				} = await import('$/sources/Coingecko/Rest/queries.ts')
				const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_Rest)
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
							candidateChain.chainId === entityId.$network.chainId
						))
					if (chain == null) throw new Error('Coingecko_Rest: native coin chain not in chainlist')

					const symbol = chain.nativeCurrency.symbol.trim().toUpperCase()
					const nativeCurrency = {
						coinId: knownCoinIds.find((candidateCoinId) => candidateCoinId === symbol) ?? CoinId.Unknown,
						name: chain.nativeCurrency.name,
						symbol,
						decimals: chain.nativeCurrency.decimals,
						slip44: chain.slip44,
					}
					const nativeCurrencyName = nativeCurrency.name.trim()
					return {
						coinId: nativeCurrency.coinId,
						...(nativeCurrencyName !== '' && { name: nativeCurrencyName }),
						symbol: nativeCurrency.symbol,
						decimals: nativeCurrency.decimals,
						...(nativeCurrency.slip44 != null && { caip19: caip19Slip44(entityId.$network.chainId, nativeCurrency.slip44) }),
					}
				}

				const caip19 = caip19Erc20(
					entityId.$network.chainId,
					entityId.$contract.address,
				)
				const assetPlatform = await findCoingeckoAssetPlatformByChainId(
					publicEnv,
					entityId.$network.chainId,
				)
				if (assetPlatform == null) {
					throw new Error('Coingecko_Rest: no asset platform for chain')
				}

				const coin = await getCoingeckoCoinByAssetPlatformContract({
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
				const coinName = coin.name.trim()

				return {
					coinId,
					symbol: coin.symbol.trim().toUpperCase(),
					...(coinName !== '' && { name: coinName }),
					...(decimals != null && { decimals }),
					caip19,
					...(iconMedia != null && { $icon: iconMedia }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Market,
			resolve: async (entityId) => {
				if (entityId.marketKind === MarketKind.Spot) {
					return {}
				}
				throw new Error('Coingecko_Rest: derivative Market fields use Coingecko_OpenApi')
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Market_Timestamp,
			resolve: async (entityId, context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('Coingecko_Rest: Market_Timestamp is spot-only')
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$market.$base.$coin.coinId]) !== stringify(entityId.$market)) {
					throw new Error('Coingecko_Rest: Market_Timestamp is catalog coin USD market only')
				}
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoingeckoCoinMarketSpot } = await import('$/sources/Coingecko/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_Rest)
				const coinId = entityId.$market.$base.$coin.coinId
				const coingeckoId = idByCoinId[coinId]
				if (coingeckoId == null) throw new Error('Coingecko_Rest: coin price not mapped')

				const spot = await getCoingeckoCoinMarketSpot(
					publicEnv,
					coingeckoId,
				)
				if (spot == null) throw new Error('Coingecko_Rest: coin market spot not returned')
				const { usd, lastUpdatedAtSec, coin } = spot
				const timestampMs = lastUpdatedAtSec * 1000
				if (entityId.timestampMs !== timestampMs) {
					throw new Error('Coingecko_Rest: Market_Timestamp id does not match spot clock')
				}
				const eth = coin.platforms?.ethereum?.trim()
				const caip19 = (
					eth != null && /^0x[a-fA-F0-9]{40}$/.test(eth) ?
						caip19Erc20(1, eth.toLowerCase() as `0x${string}`)
					: coin.id === 'ethereum' ?
						caip19Slip44(1, Slip44.Ether)
					:	undefined
				)

				return {
					price: BigInt(Math.round(usd * 1e8)),
					...('coingecko-coins-id-market-data-usd-1e8' && {
						transport: 'coingecko-coins-id-market-data-usd-1e8',
					}),
					...(coingeckoId !== undefined && { providerAssetId: coingeckoId }),
					...(caip19 && { caip19 }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: async (entityId, context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					throw new Error('Coingecko_Rest: OHLC is spot-only')
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$market.$base.$coin.coinId]) !== stringify(entityId.$market)) {
					throw new Error('Coingecko_Rest: OHLC is catalog coin USD market only')
				}
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoingeckoCoinOhlc } = await import('$/sources/Coingecko/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_Rest)
				assertCoingeckoDayOhlcTimeInterval(entityId.timeInterval, 'Coingecko_Rest')
				const coinId = entityId.$market.$base.$coin.coinId
				const coingeckoId = idByCoinId[coinId]
				if (coingeckoId == null) throw new Error('Coingecko_Rest: OHLC coin not mapped')
				const rows = await getCoingeckoCoinOhlc({
					publicEnv,
					coingeckoId,
					vs: 'usd',
					days: entityId.timeInterval.value,
				})
				const row = rows.find(([timestampMs]) => (
					Math.floor(timestampMs) === entityId.timestampMs
				))
				if (row == null) throw new Error('Coingecko_Rest: OHLC candle not found for timestamp')
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
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>, context) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { coinIdByWireId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoingeckoCoinsMarketsPage } = await import('$/sources/Coingecko/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_Rest)
				const lim = Math.min(resolverLoadSubsetRowLimit(context), 250)
				const markets = await getCoingeckoCoinsMarketsPage({
					publicEnv,
					vsCurrency: 'usd',
					order: 'market_cap_desc',
					perPage: lim,
					page: 1,
				})
				return (
					markets
						.flatMap((row) => {
							const coinId = coinIdByWireId[row.id]
							if (coinId == null || coinById[coinId] == null) return []
							const rank = row.market_cap_rank
							const cap = row.market_cap
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$markets',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				return (
					Object.entries(idByCoinId)
						.filter(([coinId]) => coinId in coinById)
						.map(([coinId]) => ({
							[EntityMetaKey.Id]: catalogCoinUsdMarketIdByCoinId[coinId],
						}))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$marketPrices',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$marketTimeIntervalTimestamps',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>, context) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoingeckoCoinOhlc } = await import('$/sources/Coingecko/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_Rest)
				const lim = resolverLoadSubsetRowLimit(context)
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
					const rows = await getCoingeckoCoinOhlc({
						publicEnv,
						coingeckoId,
						vs: 'usd',
						days: previewTimeInterval.value,
					})
					candles.push(
						...candleEntitiesFromOhlcWireRows(
							$market,
							previewTimeInterval,
							rows,
						),
					)
				}
				return (
					candles.slice(0, lim)
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$coinInstances',
			resolve: async (entityId, context) => {
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { fetchCoinInstanceStubsForCoin } = await import(
					'$/sources/Coingecko/Rest/coinInstances.ts'
				)
				if (idByCoinId[entityId.coinId] == null) {
					throw new Error(`Coingecko_Rest: $$coinInstances unsupported for coin ${entityId.coinId}`)
				}
				return singleFlight(fetchCoinInstanceStubsForCoin)(
					entityId.coinId,
					sourcePublicEnv(context, Source.Coingecko_Rest),
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.CoinInstance,
			fieldName: 'representation',
			resolve: async (entityId, context) => {
				const { resolveCoinInstanceRepresentation } = await import(
					'$/sources/Coingecko/Rest/coinInstances.ts'
				)
				return resolveCoinInstanceRepresentation(
					entityId,
					sourcePublicEnv(context, Source.Coingecko_Rest),
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.CoinInstance,
			fieldName: '$canonicalInstance',
			resolve: async (entityId, context) => {
				const { resolveCanonicalCoinInstanceEntityId } = await import(
					'$/sources/Coingecko/Rest/coinInstances.ts'
				)
				const canonicalId = await resolveCanonicalCoinInstanceEntityId(
					entityId,
					sourcePublicEnv(context, Source.Coingecko_Rest),
				)
				return (
					canonicalId == null ?
						undefined
					:	{ [EntityMetaKey.Id]: canonicalId }
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsBase',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>) => {
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsQuote',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>) => {
				const { catalogMarketsWithCoinAsQuoteByQuoteCoinId } = await import('$/constants/MarketCatalog.ts')
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				if (idByCoinId[entityId.coinId] == null) {
					return []
				}
				return (
					(catalogMarketsWithCoinAsQuoteByQuoteCoinId[entityId.coinId] ?? [])
						.filter((marketId) => (
							idByCoinId[marketId.$base.$coin.coinId] != null
						))
						.map((marketId) => ({
							[EntityMetaKey.Id]: marketId,
						}))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Currency,
			fieldName: '$$marketsWithCurrencyAsQuote',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Currency,
			fieldName: '$$marketsWithCurrencyAsBase',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
				const markets = (catalogMarketsWithCurrencyAsBaseByIso4217[entityId.iso4217] ?? []).map((marketId) => ({
						[EntityMetaKey.Id]: marketId,
					}))
				if (markets.length === 0) {
					throw new Error(`Coingecko_Rest: no catalog markets with ${entityId.iso4217} as base`)
				}
				return markets
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.CoinInstance,
			fieldName: '$$marketsWithInstanceAsBase',
			resolve: async () => {
				throw new Error('Coingecko_Rest: $$marketsWithInstanceAsBase is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.CoinInstance,
			fieldName: '$$marketsWithInstanceAsQuote',
			resolve: async () => {
				throw new Error('Coingecko_Rest: $$marketsWithInstanceAsQuote is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Market,
			fieldName: '$$baseCoin',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market>) => (
				entityId.$base.kind === MarketAssetKind.Coin ?
					{
						[EntityMetaKey.Id]: {
							coinId: entityId.$base.$coin.coinId,
						},
					}
				:	undefined
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Market,
			fieldName: '$$marketPrices',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market>) => (
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
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Market,
			fieldName: '$$marketTimeIntervalTimestamps',
			resolve: async (entityId, context) => {
				if (entityId.marketKind !== MarketKind.Spot) {
					return []
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$base.$coin.coinId]) !== stringify(entityId)) {
					return []
				}
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoingeckoCoinOhlc } = await import('$/sources/Coingecko/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_Rest)
				const coinId = entityId.$base.$coin.coinId
				const coingeckoId = idByCoinId[coinId]
				if (coingeckoId == null) throw new Error('Coingecko_Rest: OHLC coin not mapped')
				const lim = resolverLoadSubsetRowLimit(context)
				const candles = []
				for (const value of coingeckoOhlcDayWindowLengths) {
					const timeInterval = (
						{
							unit: MarketTimeIntervalUnit.Day,
							value,
						}
					)
					const rows = await getCoingeckoCoinOhlc({
						publicEnv,
						coingeckoId,
						vs: 'usd',
						days: value,
					})
					candles.push(
						...candleEntitiesFromOhlcWireRows(
							entityId,
							timeInterval,
							rows,
						),
					)
				}
				return (
					candles.slice(0, lim)
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.MarketPrice,
			fieldName: '$$quotes',
			resolve: async (entityId, context) => {
				if (entityId.$market.marketKind !== MarketKind.Spot) {
					return []
				}
				if (stringify(catalogCoinUsdMarketIdByCoinId[entityId.$market.$base.$coin.coinId]) !== stringify(entityId.$market)) {
					return []
				}
				const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
				const { getCoingeckoCoinMarketSpot } = await import('$/sources/Coingecko/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Coingecko_Rest)
				const coinId = entityId.$market.$base.$coin.coinId
				const coingeckoId = idByCoinId[coinId]
				if (coingeckoId == null) throw new Error('Coingecko_Rest: coin price not mapped')
				const spot = await getCoingeckoCoinMarketSpot(publicEnv, coingeckoId)
				if (spot == null) throw new Error('Coingecko_Rest: coin market spot not returned')
				return [
					{
						[EntityMetaKey.Id]: {
							$market: entityId.$market,
							timestampMs: spot.lastUpdatedAtSec * 1000,
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

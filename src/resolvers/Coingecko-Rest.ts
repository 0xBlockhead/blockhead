import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
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
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
import { MediaType } from '$/schema/Media.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'
import { CoinSelector } from '$/schema/Coin.ts'
import { Coin_TimestampSelector } from '$/schema/Coin_Timestamp.ts'
import { EvmCoinInstanceSelector } from '$/schema/EvmCoinInstance.ts'
import { MarketSelector } from '$/schema/Market.ts'
import { Market_TimestampSelector } from '$/schema/Market_Timestamp.ts'
import { Market_TimeInterval_TimestampSelector } from '$/schema/Market_TimeInterval_Timestamp.ts'
import { CurrencySelector } from '$/schema/Currency.ts'
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
	source: Source.Coingecko_Rest,

	resolvers: [
		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.Coin,
			resolve: {
				[CoinSelector.CoinId]: async ({ coinId }, context) => {
					const { CoinId, coinById } = await import('$/constants/Coin.ts')
					const { decimalsByCoinId, idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					const { getCoin } = await import('$/sources/Coingecko/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const coingeckoId = idByCoinId[coinId]
					if (coingeckoId == null) throw new Error('Coingecko_Rest: coin not mapped')
					const coin = await getCoin(publicEnv, coingeckoId)
					if (coin == null) throw new Error('Coingecko_Rest: coin not returned by API')

					const decimals = (
						Object.values(coin.detail_platforms ?? {})
							.find((platform) => platform.decimal_place != null)
							?.decimal_place
					?? decimalsByCoinId[coinId]
					)
					const logoUrl = coin.image?.large ?? coin.image?.small ?? coin.image?.thumb
					const logoMedia = mediaFromUrl(logoUrl, MediaType.Image)

					const coinName = coin.name
					if (decimals == null)
						throw new Error('Coingecko_Rest: coin decimals not mapped')

					return {
						symbol: coinById[coinId].symbol,
						name: (
							coinName === '' ?
								coinById[coinId].symbol
							:
								coinName
						),
						decimals,
						...(logoMedia != null && { $logo: logoMedia }),
					}
				}
			},
		})({
			fields: {
				symbol: (coin) => coin.symbol,
				name: (coin) => coin.name,
				decimals: (coin) => coin.decimals,
				$logo: (coin) => coin.$logo,
			},
		}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.Coin_Timestamp,
			resolve: {
				[Coin_TimestampSelector.CoinTimestampMsSource]: async ({ $coin, timestampMs: timestampMsSelector }, context) => {
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					const { getCoin } = await import('$/sources/Coingecko/Rest/queries.ts')
					const coingeckoId = idByCoinId[$coin.coinId]
					if (coingeckoId == null) throw new Error('Coingecko_Rest: coin not mapped')
					const coin = await getCoin(context.publicEnv, coingeckoId)
					if (coin == null) throw new Error('Coingecko_Rest: coin not returned by API')
					const timestampMs = Date.parse(coin.market_data?.last_updated ?? '')
					if (!Number.isFinite(timestampMs))
						throw new Error('Coingecko_Rest: coin market-data clock missing')
					if (timestampMs !== timestampMsSelector)
						throw new Error('Coingecko_Rest: Coin_Timestamp id does not match market-data clock')
					return {
						...(coin.market_data?.market_cap_rank != null
						&& Number.isFinite(coin.market_data.market_cap_rank) && {
							marketCapRank: coin.market_data.market_cap_rank,
						}),
						...(coin.market_data?.market_cap?.usd != null
						&& Number.isFinite(coin.market_data.market_cap.usd) && {
							marketCapUsd: coin.market_data.market_cap.usd,
						}),
						transport: 'coingecko-coin',
						providerAssetId: coingeckoId,
					}
				},
			},
		})({
			fields: {
				marketCapRank: (coinTimestamp) => coinTimestamp.marketCapRank,
				marketCapUsd: (coinTimestamp) => coinTimestamp.marketCapUsd,
				transport: (coinTimestamp) => coinTimestamp.transport,
				providerAssetId: (coinTimestamp) => coinTimestamp.providerAssetId,
			},
		}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EvmCoinInstanceSelector.NetworkTypeContract]: async ({ $contract, $network, type }, context) => {
					if (type !== CoinInstanceType.Erc20Token)
						throw new Error('Coingecko_Rest: NetworkTypeContract supports ERC-20 only')

					const { CoinId } = await import('$/constants/Coin.ts')
					const {
						decimalsByCoinId,
						coinIdByWireId,
					} = await import('$/sources/Coingecko/Rest/constants.ts')
					const {
						findAssetPlatformByChainId,
						getCoinByAssetPlatformContract,
					} = await import('$/sources/Coingecko/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const contractAddress = EvmAddress.assert($contract.address.toLowerCase())
					const caip19 = `eip155:${Number($network.caip2.reference)}/erc20:${contractAddress}`
					const assetPlatform = await findAssetPlatformByChainId(
						publicEnv,
						Number($network.caip2.reference)
					)
					if (assetPlatform == null)
						throw new Error('Coingecko_Rest: no asset platform for chain')

					const coin = await getCoinByAssetPlatformContract({
						publicEnv,
						assetPlatformId: assetPlatform.id,
						contractAddress,
					})

					if (coin == null)
						throw new Error('Coingecko_Rest: ERC-20 contract not found on asset platform')

					const coinId = coinIdByWireId[coin.id] ?? CoinId.Unknown
					const decimals = (
						coin.detail_platforms?.[assetPlatform.id]?.decimal_place
					?? Object.values(coin.detail_platforms ?? {})
						.find((platform) => platform.decimal_place != null)
						?.decimal_place
					?? decimalsByCoinId[coinId]
					)
					const iconUrl = coin.image?.large ?? coin.image?.small ?? coin.image?.thumb
					const iconMedia = mediaFromUrl(iconUrl, MediaType.Image)
					const coinName = coin.name
					if (decimals == null)
						throw new Error('Coingecko_Rest: ERC-20 decimals not mapped')

					return {
						coinId,
						symbol: coin.symbol.toUpperCase(),
						...(coinName !== '' && { name: coinName }),
						decimals,
						caip19,
						...(iconUrl != null && { iconUrl }),
						...(iconMedia != null && { $icon: iconMedia }),
					}
				},
			},
		})({
			fields: {
				coinId: (coinInstance) => coinInstance.coinId,
				name: (coinInstance) => coinInstance.name,
				symbol: (coinInstance) => coinInstance.symbol,
				decimals: (coinInstance) => coinInstance.decimals,
				caip19: (coinInstance) => coinInstance.caip19,
				iconUrl: (coinInstance) => coinInstance.iconUrl,
				$icon: (coinInstance) => coinInstance.$icon,
			},
		}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.Market_Timestamp,
			resolve: {
				[Market_TimestampSelector.MarketTimestampMsFeedKey]: async ({ $market, feedKey, timestampMs: timestampMsSelector }, context) => {
					if ($market.marketKind !== MarketKind.Spot)
						throw new Error('Coingecko_Rest: Market_Timestamp is spot-only')
					if ($market.$base.kind !== MarketAssetKind.Coin)
						throw new Error('Market source: market base must be catalog coin')
					if (stringify(marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[$market.$base.$coin.coinId])) !== stringify($market))
						throw new Error('Coingecko_Rest: Market_Timestamp is catalog coin USD market only')
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					const { getCoinMarketSpot } = await import('$/sources/Coingecko/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const coinId = $market.$base.$coin.coinId
					const coingeckoId = idByCoinId[coinId]
					if (coingeckoId == null) throw new Error('Coingecko_Rest: coin price not mapped')
					if (feedKey !== coingeckoId)
						throw new Error('Coingecko_Rest: Market_Timestamp feedKey does not match Coingecko id')

					const spot = await getCoinMarketSpot(
						publicEnv,
						coingeckoId
					)
					if (spot == null) throw new Error('Coingecko_Rest: coin market spot not returned')
					const { usd, lastUpdatedAtSec, coin } = spot
					const timestampMs = lastUpdatedAtSec * 1000
					if (timestampMs !== timestampMsSelector)
						throw new Error('Coingecko_Rest: Market_Timestamp id does not match spot clock')
					const eth = coin.platforms?.ethereum
					const caip19 = (
						eth != null && /^0x[a-fA-F0-9]{40}$/.test(eth) ?
							`eip155:1/erc20:${eth.toLowerCase()}`
						:
							coin.id === 'ethereum' ?
								'eip155:1/slip44:60'
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
				[Market_TimeInterval_TimestampSelector.MarketTimeIntervalTimestampMs]: async ({ $market, timeInterval, timestampMs: timestampMsSelector }, context) => {
					if ($market.marketKind !== MarketKind.Spot)
						throw new Error('Coingecko_Rest: OHLC is spot-only')
					if ($market.$base.kind !== MarketAssetKind.Coin)
						throw new Error('Market source: market base must be catalog coin')
					if (stringify(marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[$market.$base.$coin.coinId])) !== stringify($market))
						throw new Error('Coingecko_Rest: OHLC is catalog coin USD market only')
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					const { getCoinOhlc } = await import('$/sources/Coingecko/Rest/queries.ts')
					const publicEnv = context.publicEnv
					if (timeInterval.unit !== marketOhlcDailyTimeInterval.unit || timeInterval.value !== marketOhlcDailyTimeInterval.value)
						throw new Error('Coingecko_Rest: OHLC timeInterval must be daily')
					const coinId = $market.$base.$coin.coinId
					const coingeckoId = idByCoinId[coinId]
					if (coingeckoId == null) throw new Error('Coingecko_Rest: OHLC coin not mapped')
					const ohlcCandles = await getCoinOhlc({
						publicEnv,
						coingeckoId,
						vs: 'usd',
						lookbackDayCount: marketOhlcDefaultLookbackDayCount,
					})
					const ohlcCandle = ohlcCandles.find(([timestampMs]) => (
						Math.floor(timestampMs) === timestampMsSelector
					))
					if (ohlcCandle == null) throw new Error('Coingecko_Rest: OHLC candle not found for timestamp')
					const [timestampMs, open, high, low, close] = ohlcCandle
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
					}
				}
			},
		})({
			fields: {
				open: (timestamp) => timestamp.open,
				high: (timestamp) => timestamp.high,
				low: (timestamp) => timestamp.low,
				close: (timestamp) => timestamp.close,
			},
		}),
		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => {
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
									[EntityMetaKey.Selector]: {
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
			entityType: EntityType.Coin,
			resolve: {
				[CoinSelector.CoinId]: async ({ coinId }, context) => {
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					const { getCoin } = await import('$/sources/Coingecko/Rest/queries.ts')
					const coingeckoId = idByCoinId[coinId]
					if (coingeckoId == null) throw new Error('Coingecko_Rest: coin not mapped')
					const coin = await getCoin(context.publicEnv, coingeckoId)
					if (coin == null) throw new Error('Coingecko_Rest: coin not returned by API')
					const timestampMs = Date.parse(coin.market_data?.last_updated ?? '')
					if (!Number.isFinite(timestampMs))
						throw new Error('Coingecko_Rest: coin market-data clock missing')
					return [
						{
							[EntityMetaKey.Selector]: {
								$coin: {
									coinId,
								},
								timestampMs,
								source: Source.Coingecko_Rest,
							},
							...(coin.market_data?.market_cap_rank != null
							&& Number.isFinite(coin.market_data.market_cap_rank) && {
								marketCapRank: coin.market_data.market_cap_rank,
							}),
							...(coin.market_data?.market_cap?.usd != null
							&& Number.isFinite(coin.market_data.market_cap.usd) && {
								marketCapUsd: coin.market_data.market_cap.usd,
							}),
							transport: 'coingecko-coin',
							providerAssetId: coingeckoId,
						},
					]
				},
			},
		})({
			fields: {
				$$timestamps: (coinTimestamps) => coinTimestamps,
			},
		}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
					const { CoinId, coinById } = await import('$/constants/Coin.ts')
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					return (
						Object.values(CoinId)
							.filter((coinId) => idByCoinId[coinId] != null && coinId in coinById)
							.map((coinId) => ({
								[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[coinId]),
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
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => {
					const { CoinId, coinById } = await import('$/constants/Coin.ts')
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					const { getCoinMarketSpot } = await import('$/sources/Coingecko/Rest/queries.ts')
					const lim = resolverContextRowLimit(context)
					return (
						(await Promise.all(
							Object.values(CoinId)
								.filter((coinId) => idByCoinId[coinId] != null && coinId in coinById)
								.slice(0, lim)
								.map(async (coinId) => {
									const coingeckoId = idByCoinId[coinId]
									if (coingeckoId == null)
										return []
									const spot = await getCoinMarketSpot(context.publicEnv, coingeckoId)
									if (spot == null)
										return []
									return [
										{
											[EntityMetaKey.Selector]: {
												$market: marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[coinId]),
												timestampMs: spot.lastUpdatedAtSec * 1000,
												feedKey: coingeckoId,
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
				$$marketQuotes: (globalScope) => globalScope,
			},
		}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => {
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
						Math.min(catalogCoinIds.length, Math.max(1, Math.ceil(lim / 24)))
					)
					return (
						(await Promise.all(previewCoinIds.map(async (coinId) => {
						const $market = marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[coinId])
						const coingeckoId = idByCoinId[coinId]
						if (coingeckoId == null)
							return []

						const ohlcCandles = await getCoinOhlc({
							publicEnv,
							coingeckoId,
							vs: 'usd',
							lookbackDayCount: 7,
						})
						return ohlcCandles.map(([timestampMs, open, high, low, close]) => ({
							[EntityMetaKey.Selector]: {
								$market,
								timeInterval: marketOhlcDailyTimeInterval,
								timestampMs: Math.floor(timestampMs),
							} satisfies EntitySelector<typeof schema, EntityType.Market_TimeInterval_Timestamp>,
							open: BigInt(Math.round(open * 1e8)),
							high: BigInt(Math.round(high * 1e8)),
							low: BigInt(Math.round(low * 1e8)),
							close: BigInt(Math.round(close * 1e8)),
						}))
						}))).flat().slice(0, lim)
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
				[CoinSelector.CoinId]: async ({ coinId }, context) => {
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					const { fetchCoinInstanceStubsForCoin } = await import(
						'$/sources/Coingecko/Rest/coinInstances.ts'
					)
					if (idByCoinId[coinId] == null)
						return []
					return fetchCoinInstanceStubsForCoin(
						coinId,
						context.publicEnv
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
				[EvmCoinInstanceSelector.NetworkType]: async (entitySelector, context) => {
					const { resolveCoinInstanceRepresentation } = await import(
						'$/sources/Coingecko/Rest/coinInstances.ts'
					)
					return resolveCoinInstanceRepresentation(
						entitySelector,
						context.publicEnv
					)
				},
				[EvmCoinInstanceSelector.NetworkTypeContract]: async (entitySelector, context) => {
					const { resolveCoinInstanceRepresentation } = await import(
						'$/sources/Coingecko/Rest/coinInstances.ts'
					)
					return resolveCoinInstanceRepresentation(
						entitySelector,
						context.publicEnv
					)
				},
			},
		})({
			fields: {
				representation: (coinInstance) => coinInstance,
			},
		}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EvmCoinInstanceSelector.NetworkType]: async (entitySelector, context) => {
					const { resolveCanonicalCoinInstanceEntitySelector } = await import(
						'$/sources/Coingecko/Rest/coinInstances.ts'
					)
						const canonicalId = await resolveCanonicalCoinInstanceEntitySelector(
							entitySelector,
							context.publicEnv
						)
						return canonicalId == null ? undefined : { [EntityMetaKey.Selector]: canonicalId }
				},
				[EvmCoinInstanceSelector.NetworkTypeContract]: async (entitySelector, context) => {
					const { resolveCanonicalCoinInstanceEntitySelector } = await import(
						'$/sources/Coingecko/Rest/coinInstances.ts'
					)
						const canonicalId = await resolveCanonicalCoinInstanceEntitySelector(
							entitySelector,
							context.publicEnv
						)
						return canonicalId == null ? undefined : { [EntityMetaKey.Selector]: canonicalId }
				},
			},
		})({
			fields: {
				$canonicalInstance: (coinInstance) => coinInstance,
			},
		}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.Coin,
				resolve: {
					[CoinSelector.CoinId]: async ({ coinId }: EntitySelector<typeof schema, EntityType.Coin>) => {
						return (
							[
								{
								[EntityMetaKey.Selector]: marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[coinId]),
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
					[CoinSelector.CoinId]: async ({ coinId }: EntitySelector<typeof schema, EntityType.Coin>) => {
						const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
						return (
							(catalogSpotMarketsWithCoinAsQuote
							.filter((catalogMarket) => catalogMarket.quoteCoinId === coinId)
							.map(marketSelectorFromCatalogCoinCoinMarket))
							.filter((marketId) => (
							idByCoinId[marketId.$base.$coin.coinId] != null
							))
							.map((marketId) => ({
								[EntityMetaKey.Selector]: marketId,
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
				[CurrencySelector.Iso4217]: async ({ iso4217 }: EntitySelector<typeof schema, EntityType.Currency>) => {
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
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

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.Currency,
			resolve: {
				[CurrencySelector.Iso4217]: async ({ iso4217 }: EntitySelector<typeof schema, EntityType.Currency>) => {
					const markets = catalogSpotMarketsWithCurrencyAsBase
						.filter((catalogMarket) => catalogMarket.baseIso4217 === iso4217)
						.map((catalogMarket) => ({
							[EntityMetaKey.Selector]: marketSelectorFromCatalogCurrencyCurrencyMarket(catalogMarket),
						}))
					if (markets.length === 0)
						throw new Error(`Coingecko_Rest: no catalog markets with ${iso4217} as base`)
					return markets
				}
			},
		})({
			fields: {
				$$marketsWithCurrencyAsBase: (currency) => currency,
			},
		}),

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.Market,
			resolve: {
				[MarketSelector.BaseQuoteMarketVenueKind]: async ({ $base }: EntitySelector<typeof schema, EntityType.Market>) => (
					$base.kind === MarketAssetKind.Coin ?
						{
							[EntityMetaKey.Selector]: {
								coinId: $base.$coin.coinId,
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
				[MarketSelector.BaseQuoteMarketVenueKind]: async (entitySelector: EntitySelector<typeof schema, EntityType.Market>) => (
					(
						entitySelector.$base.kind === MarketAssetKind.Coin
					&& entitySelector.marketKind === MarketKind.Spot
					&& stringify(marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[entitySelector.$base.$coin.coinId])) === stringify(entitySelector)
					) ?
						[
							{
								[EntityMetaKey.Selector]: {
									$market: entitySelector,
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
				[MarketSelector.BaseQuoteMarketVenueKind]: async (entitySelector, context) => {
					if (entitySelector.marketKind !== MarketKind.Spot)
						return []
					if (entitySelector.$base.kind !== MarketAssetKind.Coin)
						return []
					if (stringify(marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[entitySelector.$base.$coin.coinId])) !== stringify(entitySelector))
						return []
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					const { getCoinOhlc } = await import('$/sources/Coingecko/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const coinId = entitySelector.$base.$coin.coinId
					const coingeckoId = idByCoinId[coinId]
					if (coingeckoId == null) throw new Error('Coingecko_Rest: OHLC coin not mapped')
					const lim = resolverContextRowLimit(context)
					return (
						(await Promise.all([marketOhlcDayLookbackValues.find((value) => value >= lim) ?? marketOhlcDefaultLookbackDayCount].map(async (value) => {
						const ohlcCandles = await getCoinOhlc({
							publicEnv,
							coingeckoId,
							vs: 'usd',
							lookbackDayCount: value,
						})
						return ohlcCandles.map(([timestampMs, open, high, low, close]) => ({
							[EntityMetaKey.Selector]: {
								$market: entitySelector,
								timeInterval: marketOhlcDailyTimeInterval,
								timestampMs: Math.floor(timestampMs),
							} satisfies EntitySelector<typeof schema, EntityType.Market_TimeInterval_Timestamp>,
							open: BigInt(Math.round(open * 1e8)),
							high: BigInt(Math.round(high * 1e8)),
							low: BigInt(Math.round(low * 1e8)),
							close: BigInt(Math.round(close * 1e8)),
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

		defineResolver(Source.Coingecko_Rest, {
			entityType: EntityType.MarketPrice,
			resolve: {
				[MarketPriceSelector.Market]: async ({ $market }, context) => {
					if ($market.marketKind !== MarketKind.Spot)
						return []
					if ($market.$base.kind !== MarketAssetKind.Coin)
						return []
					if (stringify(marketSelectorFromCatalogCoinCurrencyMarket(catalogCoinSpotUsdMarketByCoinId[$market.$base.$coin.coinId])) !== stringify($market))
						return []
					const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
					const { getCoinMarketSpot } = await import('$/sources/Coingecko/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const coinId = $market.$base.$coin.coinId
					const coingeckoId = idByCoinId[coinId]
					if (coingeckoId == null) throw new Error('Coingecko_Rest: coin price not mapped')
					const spot = await getCoinMarketSpot(publicEnv, coingeckoId)
					if (spot == null) throw new Error('Coingecko_Rest: coin market spot not returned')
					return [
						{
							[EntityMetaKey.Selector]: {
								$market: $market,
								timestampMs: spot.lastUpdatedAtSec * 1000,
								feedKey: coingeckoId,
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

		defineResolver(Source.Coingecko_Rest, {
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
				$parentMarket: (timestamp) => timestamp,
			},
		}),
	],
}

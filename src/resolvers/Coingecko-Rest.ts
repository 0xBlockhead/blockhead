import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { CoinId } from '$/constants/Coin.ts'
import { Iso4217 } from '$/constants/Currency.ts'
import {
	MarketAssetKind,
	MarketKind,
	marketOhlcDefaultLookbackDayCount,
	marketOhlcDailyTimeInterval,
	marketOhlcDayLookbackValues,
} from '$/constants/Market.ts'
import {
	seededCoinSpotUsdMarketByCoinId,
} from '$/constants/MarketCatalog.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	isSeededCoinCurrencyMarket,
	marketSelectorFromCatalogCoinCurrencyMarket,
} from '$/resolvers/market.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	entitySelectorKey,
} from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import {
	entityDefinitionByType,
	schema,
} from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import type {
	CoingeckoCoin,
	CoingeckoCoinTicker,
	CoingeckoDerivativesExchangeTicker,
} from '$/sources/Coingecko/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const coingeckoMarketSpot = (coin: CoingeckoCoin | undefined) => {
	if (coin == null)
		return undefined

	const usd = coin.market_data?.current_price?.usd
	if (usd == null || !Number.isFinite(usd))
		return undefined

	const lastUpdatedAtSec = Date.parse(coin.market_data?.last_updated ?? '') / 1000
	if (!Number.isFinite(lastUpdatedAtSec))
		return undefined

	return {
		coin,
		usd,
		lastUpdatedAtSec,
	}
}

const coingeckoSpotExchangeIdentifierByMarketVenueId = {
	[MarketVenueId.Binance]: 'binance',
	[MarketVenueId.Coinbase]: 'gdax',
	[MarketVenueId.Deribit]: 'deribit',
	[MarketVenueId.Kraken]: 'kraken',
	[MarketVenueId.Kucoin]: 'kucoin',
	[MarketVenueId.Okx]: 'okex',
	[MarketVenueId.Uniswap]: 'uniswap_v3',
	[MarketVenueId.PancakeSwap]: 'pancakeswap_new',
} as const satisfies Partial<Record<MarketVenueId, string>>

const coingeckoMarketSelectorKey = (
	market: EntitySelector<typeof schema, EntityType.Market>
) => entitySelectorKey(
	schema,
	entityDefinitionByType[EntityType.Market],
	market
)

const coingeckoSpotMarketSelector = (
	ticker: CoingeckoCoinTicker,
	catalogCoinId: CoinId,
	coinIdByWireId: ReadonlyMap<string, CoinId>
): EntitySelector<typeof schema, EntityType.Market> | null => {
	if (coinIdByWireId.get(ticker.coin_id) !== catalogCoinId)
		return null

	const marketVenueId = Object.values(MarketVenueId).find((candidate) => (
		coingeckoSpotExchangeIdentifierByMarketVenueId[candidate] === ticker.market.identifier
	))
	if (marketVenueId == null)
		return null

	const isUsdQuote = (
		ticker.target === 'USD'
		|| ticker.target === 'USDT'
		|| ticker.target_coin_id === 'usd-coin'
		|| ticker.target_coin_id === 'tether'
	)
	if (isUsdQuote)
		return {
			$base: {
				kind: MarketAssetKind.Coin,
				assetKey: catalogCoinId,
			},
			$quote: {
				kind: MarketAssetKind.Currency,
				assetKey: Iso4217.USD,
			},
			$marketVenue: { marketVenueId },
			marketKind: MarketKind.Spot,
		}

	const quoteCoinId = coinIdByWireId.get(ticker.target_coin_id)
	if (quoteCoinId == null)
		return null

	return {
		$base: {
			kind: MarketAssetKind.Coin,
			assetKey: catalogCoinId,
		},
		$quote: {
			kind: MarketAssetKind.Coin,
			assetKey: quoteCoinId,
		},
		$marketVenue: { marketVenueId },
		marketKind: MarketKind.Spot,
	}
}

const coingeckoDerivativeMarketSelector = (
	ticker: CoingeckoDerivativesExchangeTicker,
	marketVenueId: MarketVenueId,
	coinIdByWireId: ReadonlyMap<string, CoinId>
): EntitySelector<typeof schema, EntityType.Market> | null => {
	const baseCoinId = coinIdByWireId.get(ticker.coin_id)
	if (
		baseCoinId == null
		|| (
			ticker.target_coin_id !== 'usd-coin'
			&& ticker.target_coin_id !== 'tether'
		)
	)
		return null

	return {
		$base: {
			kind: MarketAssetKind.Coin,
			assetKey: baseCoinId,
		},
		$quote: {
			kind: MarketAssetKind.Currency,
			assetKey: Iso4217.USD,
		},
		$marketVenue: { marketVenueId },
		marketKind: (
			ticker.contract_type === 'futures'
			|| ticker.expired_at != null ?
				MarketKind.Futures
			:
				MarketKind.Perpetual
		),
	}
}

const coingeckoSpotMarketSelectorsForCoin = async (
	publicEnv: SourcePublicEnv,
	catalogCoinId: CoinId,
	coingeckoId: string
) => {
	const { coinIdByWireId } = await import('$/sources/Coingecko/Rest/constants.ts')
	const { getCoinTickers } = await import('$/sources/Coingecko/Rest/queries.ts')
	const seen = new Set<string>()
	return (await getCoinTickers({
		publicEnv,
		id: coingeckoId,
		order: 'volume_desc',
	}))?.tickers.flatMap((ticker) => {
		const market = coingeckoSpotMarketSelector(
			ticker,
			catalogCoinId,
			coinIdByWireId
		)
		if (market == null)
			return []

		const key = coingeckoMarketSelectorKey(market)
		if (seen.has(key))
			return []

		seen.add(key)
		return [market]
	}) ?? []
}

const coingeckoDerivativeMarketSelectors = async (
	publicEnv: SourcePublicEnv,
	catalogCoinId?: CoinId
) => {
	const {
		coingeckoDerivativesExchangeIdByMarketVenueId,
		coinIdByWireId,
	} = await import('$/sources/Coingecko/Rest/constants.ts')
	const { getDerivativesExchange } = await import('$/sources/Coingecko/Rest/queries.ts')
	const seen = new Set<string>()
	return (await Promise.all(
		Object.values(MarketVenueId)
			.flatMap((marketVenueId) => {
				const exchangeId = coingeckoDerivativesExchangeIdByMarketVenueId[marketVenueId]
				return exchangeId == null ? [] : [{
					marketVenueId,
					exchangeId,
				}]
			})
			.map(async ({ marketVenueId, exchangeId }) => (
				(await getDerivativesExchange({
					publicEnv,
					id: exchangeId,
				}))?.tickers?.flatMap((ticker) => {
					const market = coingeckoDerivativeMarketSelector(
						ticker,
						marketVenueId,
						coinIdByWireId
					)
					if (
						market == null
						|| (
							catalogCoinId != null
							&& market.$base.assetKey !== catalogCoinId
						)
					)
						return []

					const key = coingeckoMarketSelectorKey(market)
					if (seen.has(key))
						return []

					seen.add(key)
					return [market]
				}) ?? []
			))
	)).flat()
}

const coingeckoDerivativeTickerForMarket = async (
	market: EntitySelector<typeof schema, EntityType.Market>,
	publicEnv: SourcePublicEnv
) => {
	const {
		coingeckoDerivativesExchangeIdByMarketVenueId,
		coinIdByWireId,
	} = await import('$/sources/Coingecko/Rest/constants.ts')
	const exchangeId = (
		coingeckoDerivativesExchangeIdByMarketVenueId[
			market.$marketVenue.marketVenueId
		]
	)
	if (exchangeId == null)
		throw new Error(
			`Coingecko_Rest: derivatives exchange not mapped for venue ${market.$marketVenue.marketVenueId}`
		)

	const { getDerivativesExchange } = await import('$/sources/Coingecko/Rest/queries.ts')
	const ticker = (await getDerivativesExchange({
		publicEnv,
		id: exchangeId,
	}))?.tickers?.find((exchangeTicker) => {
		const exchangeMarket = coingeckoDerivativeMarketSelector(
			exchangeTicker,
			market.$marketVenue.marketVenueId,
			coinIdByWireId
		)
		return (
			exchangeMarket != null
			&& coingeckoMarketSelectorKey(exchangeMarket) === coingeckoMarketSelectorKey(market)
		)
	})
	if (ticker == null)
		throw new Error(
			`Coingecko_Rest: no derivative ticker for ${market.$marketVenue.marketVenueId} market`
		)

	return ticker
}

export default {
	source: Source.Coingecko_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.Market_Derivative_Timestamp,
			resolve: {
				MarketTimestampMsFeedKey: {
					resolve: async ({ $market }, context) => {
						if ($market.marketKind === MarketKind.Spot)
							throw new Error('Coingecko_Rest: Market_Derivative_Timestamp is derivative-only')

						const ticker = await coingeckoDerivativeTickerForMarket(
							$market,
							context.publicEnv
						)
						return {
							fundingRate: ticker.funding_rate,
							openInterestUsd: BigInt(Math.round(ticker.open_interest_usd)),
							indexBasisPercent: ticker.index_basis_percentage,
							...(ticker.expired_at != null && {
								expiredAtMs: ticker.expired_at * 1_000,
							}),
							lastTradedAtMs: ticker.last_traded * 1_000,
							providerAssetId: ticker.symbol,
							transport: 'coingecko-derivatives-exchange',
						}
					},
				},
			},
		})({
			fundingRate: (timestamp) => timestamp.fundingRate,
			openInterestUsd: (timestamp) => timestamp.openInterestUsd,
			indexBasisPercent: (timestamp) => timestamp.indexBasisPercent,
			expiredAtMs: (timestamp) => timestamp.expiredAtMs,
			lastTradedAtMs: (timestamp) => timestamp.lastTradedAtMs,
			providerAssetId: (timestamp) => timestamp.providerAssetId,
			transport: (timestamp) => timestamp.transport,
		}),

		defineResolver({
			entityType: EntityType.Market,
			resolve: {
				BaseQuoteMarketVenueKind: {
					resolve: async (entitySelector, context) => {
						if (entitySelector.marketKind === MarketKind.Spot)
							return []

						const ticker = await coingeckoDerivativeTickerForMarket(
							entitySelector,
							context.publicEnv
						)
						return [{
							[EntityMetaKey.Selector]: {
								$market: entitySelector,
								timestampMs: ticker.last_traded * 1_000,
								feedKey: `coingecko:${ticker.symbol}`,
							},
						}]
					},
				},
			},
		})({
			$$derivativeTimestamps: (market) => market,
		}),

		defineResolver({
			entityType: EntityType.Market_Derivative_Timestamp,
			resolve: {
				MarketTimestampMsFeedKey: {
					resolve: async ({ $market }) => ({
						[EntityMetaKey.Selector]: $market,
					}),
				},
			},
		})({
			$parentMarket: (_timestamp, { $market }) => ({
				[EntityMetaKey.Selector]: $market,
			}),
		}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_globalScopeEntitySelector, context) => (
						(await coingeckoDerivativeMarketSelectors(context.publicEnv))
							.slice(0, resolverContextRowLimit(context))
							.map((market) => ({
								[EntityMetaKey.Selector]: market,
							}))
					),
				},
			},
		})({
			$$markets: (globalScope) => globalScope,
		}),

		defineResolver({
			entityType: EntityType.Coin,
			resolve: {
				CoinId: {
					resolve: async ({ coinId }, context) => {
						const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
						const coingeckoId = idByCoinId[coinId]

						return [
							...await coingeckoSpotMarketSelectorsForCoin(
								context.publicEnv,
								coinId,
								coingeckoId
							),
							...await coingeckoDerivativeMarketSelectors(
								context.publicEnv,
								coinId
							),
						]
							.slice(0, resolverContextRowLimit(context))
							.map((market) => ({
								[EntityMetaKey.Selector]: market,
							}))
					},
				},
			},
		})({
			$$marketsWithCoinAsBase: (coin) => coin,
		}),

		defineResolver({
			entityType: EntityType.Coin,
			resolve: {
				CoinId: {
					resolve: async ({ coinId }, context) => {
						const { coinById } = await import('$/constants/Coin.ts')
						const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
						const { getCoin } = await import('$/sources/Coingecko/Rest/queries.ts')
						const coingeckoId = idByCoinId[coinId]
						const coin = await getCoin({
							publicEnv: context.publicEnv,
							id: coingeckoId,
						})
						if (coin == null) throw new Error('Coingecko_Rest: coin not returned by API')

						const logoUrl = coin.image.large
						const logoMedia = mediaFromUrl(logoUrl, MediaType.Image)

						const coinName = coin.name
						return {
							symbol: coinById[coinId].symbol,
							name: (
								coinName === '' ?
									coinById[coinId].symbol
								:
									coinName
							),
							...(logoMedia != null && { $logo: logoMedia }),
							coinId,
							timestampMs: Date.parse(coin.market_data?.last_updated ?? ''),
						}
					},
				}
			},
		})({
				symbol: (coin) => coin.symbol,
				name: (coin) => coin.name,
				$logo: (coin) => coin.$logo,
				$$timestamps: (coin) => {
					if (!Number.isFinite(coin.timestampMs))
						throw new Error('Coingecko_Rest: coin market-data clock missing')
					return [{
						[EntityMetaKey.Selector]: {
							$coin: {
								coinId: coin.coinId,
							},
							timestampMs: coin.timestampMs,
							source: Source.Coingecko_Rest,
						},
					}]
				},
			}),

		defineResolver({
			entityType: EntityType.Coin_Timestamp,
			resolve: {
				CoinTimestampMsSource: {
					resolve: async ({ $coin, timestampMs: timestampMsSelector }, context) => {
						const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
						const { getCoin } = await import('$/sources/Coingecko/Rest/queries.ts')
						const coingeckoId = idByCoinId[$coin.coinId]
						const coin = await getCoin({
							publicEnv: context.publicEnv,
							id: coingeckoId,
						})
						if (coin == null) throw new Error('Coingecko_Rest: coin not returned by API')
						const marketData = coin.market_data
						const timestampMs = Date.parse(marketData?.last_updated ?? '')
						if (!Number.isFinite(timestampMs))
							throw new Error('Coingecko_Rest: coin market-data clock missing')
						if (timestampMs !== timestampMsSelector)
							throw new Error('Coingecko_Rest: Coin_Timestamp id does not match market-data clock')
						return {
							...(marketData?.market_cap_rank != null
							&& Number.isFinite(marketData.market_cap_rank) && {
								marketCapRank: marketData.market_cap_rank,
							}),
							...(marketData?.market_cap?.usd != null
							&& Number.isFinite(marketData.market_cap.usd) && {
								marketCapUsd: marketData.market_cap.usd,
							}),
							transport: 'coingecko-coin',
							providerAssetId: coingeckoId,
						}
					},
				},
			},
		})({
				marketCapRank: (coinTimestamp) => coinTimestamp.marketCapRank,
				marketCapUsd: (coinTimestamp) => coinTimestamp.marketCapUsd,
				transport: (coinTimestamp) => coinTimestamp.transport,
				providerAssetId: (coinTimestamp) => coinTimestamp.providerAssetId,
			}),

		defineResolver({
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				NetworkTypeContract: {
					resolve: async ({ $contract, $network, type }, context) => {
						if (type !== CoinInstanceType.Erc20Token)
							throw new Error('Coingecko_Rest: NetworkTypeContract supports ERC-20 only')
						if (!('caip2' in $network))
							throw new Error('Coingecko_Rest: NetworkTypeContract requires a CAIP-2 network')

						const {
							coingeckoAssetPlatformIdByChainId,
							coinIdByWireId,
						} = await import('$/sources/Coingecko/Rest/constants.ts')
						const { getCoinByContract } = await import('$/sources/Coingecko/Rest/queries.ts')
						const publicEnv = context.publicEnv
						const contractAddress = EvmAddress.assert($contract.address.toLowerCase())
						const caip19 = `eip155:${Number($network.caip2.reference)}/erc20:${contractAddress}`
						const assetPlatformId = coingeckoAssetPlatformIdByChainId[Number($network.caip2.reference)]
						if (assetPlatformId == null)
							throw new Error('Coingecko_Rest: no asset platform for chain')

						const coin = await getCoinByContract({
							publicEnv,
							id: assetPlatformId,
							contract_address: contractAddress,
						})

						if (coin == null)
							throw new Error('Coingecko_Rest: ERC-20 contract not found on asset platform')

						const coinId = coinIdByWireId.get(coin.id) ?? CoinId.Unknown
						const decimals = coin.detail_platforms[assetPlatformId]?.decimal_place
						const iconUrl = coin.image.large
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
			},
		})({
				Erc20Token: {
					coinId: (coinInstance) => coinInstance.coinId,
					name: (coinInstance) => coinInstance.name,
					symbol: (coinInstance) => coinInstance.symbol,
					decimals: (coinInstance) => coinInstance.decimals,
					caip19: (coinInstance) => coinInstance.caip19,
					iconUrl: (coinInstance) => coinInstance.iconUrl,
					$icon: (coinInstance) => coinInstance.$icon,
				},
			}),

		defineResolver({
			entityType: EntityType.Market_Timestamp,
			resolve: {
				MarketTimestampMsFeedKey: {
					resolve: async ({ $market, feedKey, timestampMs: timestampMsSelector }, context) => {
						if ($market.marketKind !== MarketKind.Spot)
							throw new Error('Coingecko_Rest: Market_Timestamp is spot-only')
						if ($market.$base.kind !== MarketAssetKind.Coin)
							throw new Error('Market source: market base must be catalog coin')
						if (!isSeededCoinCurrencyMarket($market))
							throw new Error('Coingecko_Rest: Market_Timestamp is catalog coin USD market only')
						const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
						const { getCoin } = await import('$/sources/Coingecko/Rest/queries.ts')
						const coinId = $market.$base.assetKey
						const coingeckoId = idByCoinId[coinId]
						if (feedKey !== coingeckoId)
							throw new Error('Coingecko_Rest: Market_Timestamp feedKey does not match Coingecko id')

						const spot = coingeckoMarketSpot(await getCoin({
							publicEnv: context.publicEnv,
							id: coingeckoId,
						}))
						if (spot == null) throw new Error('Coingecko_Rest: coin market spot not returned')
						const { usd, lastUpdatedAtSec, coin } = spot
						const timestampMs = lastUpdatedAtSec * 1000
						if (timestampMs !== timestampMsSelector)
							throw new Error('Coingecko_Rest: Market_Timestamp id does not match spot clock')
						const eth = coin.platforms.ethereum
						const caip19 = (
							/^0x[a-fA-F0-9]{40}$/.test(eth) ?
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
					},
				}
			},
		})({
				price: (timestamp) => timestamp.price,
				transport: (timestamp) => timestamp.transport,
				providerAssetId: (timestamp) => timestamp.providerAssetId,
				caip19: (timestamp) => timestamp.caip19,
			}),

		defineResolver({
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: {
				MarketTimeIntervalTimestampMs: {
					resolve: async ({ $market, timeInterval, timestampMs: timestampMsSelector }, context) => {
						if ($market.marketKind !== MarketKind.Spot)
							throw new Error('Coingecko_Rest: OHLC is spot-only')
						if ($market.$base.kind !== MarketAssetKind.Coin)
							throw new Error('Market source: market base must be catalog coin')
						if (!isSeededCoinCurrencyMarket($market))
							throw new Error('Coingecko_Rest: OHLC is catalog coin USD market only')
						const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
						const { getCoinOhlc } = await import('$/sources/Coingecko/Rest/queries.ts')
						if (timeInterval.unit !== marketOhlcDailyTimeInterval.unit || timeInterval.value !== marketOhlcDailyTimeInterval.value)
							throw new Error('Coingecko_Rest: OHLC timeInterval must be daily')
						const coinId = $market.$base.assetKey
						const coingeckoId = idByCoinId[coinId]
						const ohlcCandles = await getCoinOhlc({
							publicEnv: context.publicEnv,
							id: coingeckoId,
							vs_currency: 'usd',
							days: marketOhlcDefaultLookbackDayCount,
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
					},
				}
			},
		})({
				open: (timestamp) => timestamp.open,
				high: (timestamp) => timestamp.high,
				low: (timestamp) => timestamp.low,
				close: (timestamp) => timestamp.close,
			}),
		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_globalScopeEntitySelector, context) => {
						const { coinIdByWireId } = await import('$/sources/Coingecko/Rest/constants.ts')
						const { getCoinsMarkets } = await import('$/sources/Coingecko/Rest/queries.ts')
						const lim = Math.min(resolverContextRowLimit(context), 250)
						const markets = await getCoinsMarkets({
							publicEnv: context.publicEnv,
							vs_currency: 'usd',
							order: 'market_cap_desc',
							per_page: lim,
							page: 1,
							sparkline: false,
						})
						return (
							markets
								.flatMap((coinMarket) => {
								const coinId = coinIdByWireId.get(coinMarket.id)
								if (coinId == null) return []
								return [
									{
										[EntityMetaKey.Selector]: {
											coinId,
										},
									},
								]
								})
						)
					},
				}
			},
		})({
				$$coins: (globalScope) => globalScope,
			}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_globalScopeEntitySelector, context) => {
						const {
							coingeckoCatalogCoinIds,
							idByCoinId,
						} = await import('$/sources/Coingecko/Rest/constants.ts')
						const { getCoin } = await import('$/sources/Coingecko/Rest/queries.ts')
						const lim = resolverContextRowLimit(context)
						return (
							(await Promise.all(
								coingeckoCatalogCoinIds
									.slice(0, lim)
									.map(async (coinId) => {
										const coingeckoId = idByCoinId[coinId]
										const spot = coingeckoMarketSpot(await getCoin({
											publicEnv: context.publicEnv,
											id: coingeckoId,
										}))
										if (spot == null)
											return []
										return [
											{
												[EntityMetaKey.Selector]: {
													$market: marketSelectorFromCatalogCoinCurrencyMarket(seededCoinSpotUsdMarketByCoinId[coinId]),
													timestampMs: spot.lastUpdatedAtSec * 1000,
													feedKey: coingeckoId,
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

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_globalScopeEntitySelector, context) => {
						const {
							coingeckoCatalogCoinIds,
							idByCoinId,
						} = await import('$/sources/Coingecko/Rest/constants.ts')
						const { getCoinOhlc } = await import('$/sources/Coingecko/Rest/queries.ts')
						const lim = resolverContextRowLimit(context)
						return (
							(await Promise.all(coingeckoCatalogCoinIds
								.slice(0, Math.max(1, Math.ceil(lim / 24)))
								.map(async (coinId) => {
									const $market = marketSelectorFromCatalogCoinCurrencyMarket(seededCoinSpotUsdMarketByCoinId[coinId])
									const coingeckoId = idByCoinId[coinId]

									const ohlcCandles = await getCoinOhlc({
										publicEnv: context.publicEnv,
										id: coingeckoId,
										vs_currency: 'usd',
										days: 7,
									})
									return ohlcCandles.map(([timestampMs, open, high, low, close]) => ({
										[EntityMetaKey.Selector]: {
											$market,
											timeInterval: marketOhlcDailyTimeInterval,
											timestampMs: Math.floor(timestampMs),
										} satisfies EntitySelector<typeof schema, EntityType.Market_TimeInterval_Timestamp>,
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.Market_TimeInterval_Timestamp, [], 'open')]: BigInt(Math.round(open * 1e8)),
											[entityFieldAddressKey(EntityType.Market_TimeInterval_Timestamp, [], 'high')]: BigInt(Math.round(high * 1e8)),
											[entityFieldAddressKey(EntityType.Market_TimeInterval_Timestamp, [], 'low')]: BigInt(Math.round(low * 1e8)),
											[entityFieldAddressKey(EntityType.Market_TimeInterval_Timestamp, [], 'close')]: BigInt(Math.round(close * 1e8)),
										},
									}))
								}))).flat().slice(0, lim)
						)
					},
				}
			},
		})({
				$$marketTimeIntervalTimestamps: (globalScope) => globalScope,
			}),

		defineResolver({
			entityType: EntityType.Coin,
			resolve: {
				CoinId: {
					resolve: async ({ coinId }, context) => {
						const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
						const { fetchCoinInstanceStubsForCoin } = await import(
							'$/resolvers/Coingecko/Rest/coinInstances.ts'
						)
						return fetchCoinInstanceStubsForCoin(
							coinId,
							context.publicEnv
						)
					},
				}
			},
		})({
				$$coinInstances: (coin) => coin,
			}),

		defineResolver({
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				NetworkType: {
					resolve: async (entitySelector, context) => {
						if (
							entitySelector.type !== CoinInstanceType.NativeCurrency
							|| !('caip2' in entitySelector.$network)
						)
							return undefined

						const { resolveCoinInstanceRepresentation } = await import(
							'$/resolvers/Coingecko/Rest/coinInstances.ts'
						)
						return resolveCoinInstanceRepresentation(
							{
								...entitySelector,
								type: CoinInstanceType.NativeCurrency,
								$network: {
									caip2: entitySelector.$network.caip2,
								},
							},
							context.publicEnv
						)
					},
				},
				NetworkTypeContract: {
					resolve: async (entitySelector, context) => {
						if (
							!('caip2' in entitySelector.$network)
							|| !('caip2' in entitySelector.$contract.$network)
						)
							return undefined

						const { resolveCoinInstanceRepresentation } = await import(
							'$/resolvers/Coingecko/Rest/coinInstances.ts'
						)
						return resolveCoinInstanceRepresentation(
							{
								...entitySelector,
								$network: {
									caip2: entitySelector.$network.caip2,
								},
								$contract: {
									...entitySelector.$contract,
									$network: {
										caip2: entitySelector.$contract.$network.caip2,
									},
								},
							},
							context.publicEnv
						)
					},
				},
			},
		})({
				NativeCurrency: {
					representation: (coinInstance) => coinInstance,
				},
				Erc20Token: {
					representation: (coinInstance) => coinInstance,
				},
			}),

		defineResolver({
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				NetworkType: {
					resolve: async (entitySelector, context) => {
						if (
							entitySelector.type !== CoinInstanceType.NativeCurrency
							|| !('caip2' in entitySelector.$network)
						)
							return undefined

						const { resolveCanonicalCoinInstanceEntitySelector } = await import(
							'$/resolvers/Coingecko/Rest/coinInstances.ts'
							)
							const canonicalId = await resolveCanonicalCoinInstanceEntitySelector(
								{
									...entitySelector,
									type: CoinInstanceType.NativeCurrency,
									$network: {
										caip2: entitySelector.$network.caip2,
									},
								},
								context.publicEnv
							)
							return canonicalId == null ? undefined : { [EntityMetaKey.Selector]: canonicalId }
					},
				},
				NetworkTypeContract: {
					resolve: async (entitySelector, context) => {
						if (
							!('caip2' in entitySelector.$network)
							|| !('caip2' in entitySelector.$contract.$network)
						)
							return undefined

						const { resolveCanonicalCoinInstanceEntitySelector } = await import(
							'$/resolvers/Coingecko/Rest/coinInstances.ts'
							)
							const canonicalId = await resolveCanonicalCoinInstanceEntitySelector(
								{
									...entitySelector,
									$network: {
										caip2: entitySelector.$network.caip2,
									},
									$contract: {
										...entitySelector.$contract,
										$network: {
											caip2: entitySelector.$contract.$network.caip2,
										},
									},
								},
								context.publicEnv
							)
							return canonicalId == null ? undefined : { [EntityMetaKey.Selector]: canonicalId }
					},
				},
			},
		})({
				NativeCurrency: {
					$canonicalInstance: (coinInstance) => coinInstance,
				},
				Erc20Token: {
					$canonicalInstance: (coinInstance) => coinInstance,
				},
			}),

		defineResolver({
			entityType: EntityType.Market,
			resolve: {
				BaseQuoteMarketVenueKind: {
					resolve: async (entitySelector) => (
						isSeededCoinCurrencyMarket(entitySelector) ?
							{
								[EntityMetaKey.Selector]: {
									coinId: entitySelector.$base.assetKey,
								},
							}
						:
							undefined
					),
				}
			},
		})({
				$baseCoin: (market) => market,
			}),

		defineResolver({
			entityType: EntityType.Market,
			resolve: {
				BaseQuoteMarketVenueKind: {
					resolve: async (entitySelector) => (
						(
							entitySelector.$base.kind === MarketAssetKind.Coin
						&& entitySelector.marketKind === MarketKind.Spot
						&& isSeededCoinCurrencyMarket(entitySelector)
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
					),
				}
			},
		})({
				$$marketPrices: (market) => market,
			}),

		defineResolver({
			entityType: EntityType.Market,
			resolve: {
				BaseQuoteMarketVenueKind: {
					resolve: async (entitySelector, context) => {
						if (entitySelector.marketKind !== MarketKind.Spot)
							return []
						if (entitySelector.$base.kind !== MarketAssetKind.Coin)
							return []
						if (!isSeededCoinCurrencyMarket(entitySelector))
							return []
						const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
						const { getCoinOhlc } = await import('$/sources/Coingecko/Rest/queries.ts')
						const coinId = entitySelector.$base.assetKey
						const coingeckoId = idByCoinId[coinId]
						const lim = resolverContextRowLimit(context)
						return (await getCoinOhlc({
							publicEnv: context.publicEnv,
							id: coingeckoId,
							vs_currency: 'usd',
							days: marketOhlcDayLookbackValues.find((value) => value >= lim) ?? marketOhlcDefaultLookbackDayCount,
						})).map(([timestampMs, open, high, low, close]) => ({
							[EntityMetaKey.Selector]: {
								$market: entitySelector,
								timeInterval: marketOhlcDailyTimeInterval,
								timestampMs: Math.floor(timestampMs),
							} satisfies EntitySelector<typeof schema, EntityType.Market_TimeInterval_Timestamp>,
							open: BigInt(Math.round(open * 1e8)),
							high: BigInt(Math.round(high * 1e8)),
							low: BigInt(Math.round(low * 1e8)),
							close: BigInt(Math.round(close * 1e8)),
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
						const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
						const { getCoin } = await import('$/sources/Coingecko/Rest/queries.ts')
						const coinId = $market.$base.assetKey
						const coingeckoId = idByCoinId[coinId]
						const spot = coingeckoMarketSpot(await getCoin({
							publicEnv: context.publicEnv,
							id: coingeckoId,
						}))
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
					resolve: async ({ $market }) => (
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
} satisfies RegisteredSourceResolverModule<Source.Coingecko_Rest>

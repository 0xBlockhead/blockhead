import type { CoinId } from '$/constants/Coin.ts'
import { Iso4217 } from '$/constants/Currency.ts'
import { MarketAssetKind, MarketKind } from '$/constants/Market.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import type { MarketVenueId as _MarketVenueId } from '$/constants/MarketVenue.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type {
	CoingeckoDerivativesExchangeTicker,
	CoingeckoOpenApiCoinTicker,
} from '$/sources/Coingecko/OpenApi/types.ts'


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


export const marketVenueIdFromCoingeckoExchangeIdentifier = (
	identifier: string | undefined
): _MarketVenueId | null => {
	if (identifier == null || identifier === '') {
		return null
	}
	for (const [marketVenueId, exchangeIdentifier] of (
		Object.entries(coingeckoSpotExchangeIdentifierByMarketVenueId) as [
			_MarketVenueId,
			string,
		][]
	)) {
		if (exchangeIdentifier === identifier) {
			return marketVenueId
		}
	}
	return null
}


export const marketKindFromCoingeckoContractType = (
	contractType: string | undefined,
	expiredAt: string | null | undefined
): MarketKind => (
	contractType === 'futures' || (expiredAt != null && expiredAt !== '') ?
		MarketKind.Futures
	:
		MarketKind.Perpetual
)


export const quoteCoingeckoTargetCoinIds = new Set([
	'usd-coin',
	'tether',
])

export const catalogCoinIdByCoingeckoId = (
	idByCoinId: Partial<Record<CoinId, string>>
): Record<string, CoinId> => (
	Object.fromEntries(
		(
			Object.entries(idByCoinId) as [CoinId, string | undefined][]
		).flatMap(([catalogCoinId, coingeckoId]) => (
			coingeckoId == null ?
				[]
			:
				[[coingeckoId, catalogCoinId]]
		))
	)
)

export const marketEntitySelectorFromCoingeckoDerivativesExchangeTicker = (
	ticker: CoingeckoDerivativesExchangeTicker,
	marketVenueId: MarketVenueId,
	catalogCoinIdByCoingeckoIdMap: Record<string, CoinId>
): EntitySelector<typeof schema, EntityType.Market> | null => {
	const baseCoinId = (
		ticker.coin_id == null ?
			undefined
		:
			catalogCoinIdByCoingeckoIdMap[ticker.coin_id]
	)
	if (
		baseCoinId == null
		|| (
			ticker.target_coin_id != null
			&& !quoteCoingeckoTargetCoinIds.has(ticker.target_coin_id)
		)
	) {
		return null
	}
	return {
		$base: {
			kind: MarketAssetKind.Coin,
			$coin: { coinId: baseCoinId },
		},
		$quote: {
			kind: MarketAssetKind.Currency,
			$currency: { iso4217: Iso4217.USD },
		},
		$marketVenue: {
			marketVenueId,
		},
		marketKind: marketKindFromCoingeckoContractType(
			ticker.contract_type,
			ticker.expired_at
		),
	}
}

export const marketEntitySelectorFromCoingeckoSpotTicker = (
	ticker: CoingeckoOpenApiCoinTicker,
	catalogCoinId: CoinId,
	catalogCoinIdByCoingeckoIdMap: Record<string, CoinId>
): EntitySelector<typeof schema, EntityType.Market> | null => {
	const coingeckoBaseId = ticker.coin_id
	if (
		coingeckoBaseId == null
		|| catalogCoinIdByCoingeckoIdMap[coingeckoBaseId] !== catalogCoinId
	) {
		return null
	}
	const marketVenueId = marketVenueIdFromCoingeckoExchangeIdentifier(
		ticker.market?.identifier
	)
	if (marketVenueId == null) {
		return null
	}
	const quoteCoinId = (
		ticker.target_coin_id == null ?
			undefined
		:
			catalogCoinIdByCoingeckoIdMap[ticker.target_coin_id]
	)
	if (
		ticker.target_coin_id != null
		&& quoteCoingeckoTargetCoinIds.has(ticker.target_coin_id)
	) {
		return {
			$base: {
				kind: MarketAssetKind.Coin,
				$coin: { coinId: catalogCoinId },
			},
			$quote: {
				kind: MarketAssetKind.Currency,
				$currency: { iso4217: Iso4217.USD },
			},
			$marketVenue: { marketVenueId },
			marketKind: MarketKind.Spot,
		}
	}
	if (quoteCoinId != null) {
		return {
			$base: {
				kind: MarketAssetKind.Coin,
				$coin: { coinId: catalogCoinId },
			},
			$quote: {
				kind: MarketAssetKind.Coin,
				$coin: { coinId: quoteCoinId },
			},
			$marketVenue: { marketVenueId },
			marketKind: MarketKind.Spot,
		}
	}
	if (ticker.target === 'USD' || ticker.target === 'USDT') {
		return {
			$base: {
				kind: MarketAssetKind.Coin,
				$coin: { coinId: catalogCoinId },
			},
			$quote: {
				kind: MarketAssetKind.Currency,
				$currency: { iso4217: Iso4217.USD },
			},
			$marketVenue: { marketVenueId },
			marketKind: MarketKind.Spot,
		}
	}
	return null
}


export const derivativeTickerMatchesMarket = (
	marketId: EntitySelector<typeof schema, EntityType.Market>,
	ticker: CoingeckoDerivativesExchangeTicker,
	catalogCoinIdByCoingeckoIdMap: Record<string, string>
): boolean => (
	marketId.$base.kind === MarketAssetKind.Coin
	&& marketId.$quote.kind === MarketAssetKind.Currency
	&& marketId.$quote.$currency.iso4217 === Iso4217.USD
	&& ticker.coin_id != null
	&& catalogCoinIdByCoingeckoIdMap[ticker.coin_id] === marketId.$base.$coin.coinId
	&& (
		ticker.target_coin_id == null
		|| quoteCoingeckoTargetCoinIds.has(ticker.target_coin_id)
	)
	&& marketKindFromCoingeckoContractType(
		ticker.contract_type,
		ticker.expired_at
	) === marketId.marketKind
)

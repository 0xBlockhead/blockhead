// Types
import type { CoinId } from '$/constants/Coin.ts'
import { coins } from '$/constants/Coin.ts'
import { Iso4217, iso4217WithCatalogUsdCrossAsBase } from '$/constants/Currency.ts'
import {
	MarketAssetKind,
	MarketKind,
	type MarketIdLabelInput,
} from '$/constants/Market.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import { tradingViewMarketByCoinId } from '$/sources/TradingView/Rest/constants.ts'


type CatalogCoinCurrencyMarketId = {
	$base: {
		kind: MarketAssetKind.Coin
		$coin: { coinId: CoinId }
	}
	$quote: {
		kind: MarketAssetKind.Currency
		$currency: { iso4217: Iso4217 }
	}
	$marketVenue: { marketVenueId: MarketVenueId }
	marketKind: MarketKind.Spot
}

type CatalogCoinCoinMarketId = {
	$base: {
		kind: MarketAssetKind.Coin
		$coin: { coinId: CoinId }
	}
	$quote: {
		kind: MarketAssetKind.Coin
		$coin: { coinId: CoinId }
	}
	$marketVenue: { marketVenueId: MarketVenueId }
	marketKind: MarketKind.Spot
}

type CatalogCurrencyCurrencyMarketId = {
	$base: {
		kind: MarketAssetKind.Currency
		$currency: { iso4217: Iso4217 }
	}
	$quote: {
		kind: MarketAssetKind.Currency
		$currency: { iso4217: Iso4217 }
	}
	$marketVenue: { marketVenueId: MarketVenueId }
	marketKind: MarketKind.Spot
}


/** Venue for catalog fiat-major / USD crosses (e.g. EUR/USD). */
export const catalogFiatUsdCrossMarketVenueId = MarketVenueId.Coinbase


// Constants
export const catalogCoinSpotUsdMarkets = coins.map((coin) => {
	const marketVenueId = (
		tradingViewMarketByCoinId[coin.id]?.marketVenueId
		?? MarketVenueId.Binance
	)
	const marketId = {
		$base: {
			kind: MarketAssetKind.Coin,
			$coin: { coinId: coin.id },
		},
		$quote: {
			kind: MarketAssetKind.Currency,
			$currency: { iso4217: Iso4217.USD },
		},
		$marketVenue: {
			marketVenueId,
		},
		marketKind: MarketKind.Spot,
	} satisfies MarketIdLabelInput

	return {
		coinId: coin.id,
		marketVenueId,
		marketId,
	}
}) satisfies readonly {
	coinId: CoinId
	marketVenueId: MarketVenueId
	marketId: CatalogCoinCurrencyMarketId
}[]

export const catalogSpotMarketsWithCoinAsQuote = coins.flatMap((quoteCoin) => (
	coins.flatMap((coin) => (
		coin.id === quoteCoin.id ?
			[]
		:
			[{
			quoteCoinId: quoteCoin.id,
			baseCoinId: coin.id,
			marketVenueId: (
				tradingViewMarketByCoinId[coin.id]?.marketVenueId
				?? MarketVenueId.Binance
			),
			marketId: {
				$base: {
					kind: MarketAssetKind.Coin,
					$coin: { coinId: coin.id },
				},
				$quote: {
					kind: MarketAssetKind.Coin,
					$coin: { coinId: quoteCoin.id },
				},
				$marketVenue: {
					marketVenueId: (
						tradingViewMarketByCoinId[coin.id]?.marketVenueId
						?? MarketVenueId.Binance
					),
				},
				marketKind: MarketKind.Spot,
			} satisfies MarketIdLabelInput,
		}]
	))
)) satisfies readonly {
	quoteCoinId: CoinId
	baseCoinId: CoinId
	marketVenueId: MarketVenueId
	marketId: CatalogCoinCoinMarketId
}[]

export const catalogSpotMarketsWithCurrencyAsQuote = coins.map((coin) => {
	const marketVenueId = (
		tradingViewMarketByCoinId[coin.id]?.marketVenueId
		?? MarketVenueId.Binance
	)

	return {
		baseCoinId: coin.id,
		marketVenueId,
		marketId: {
			$base: {
				kind: MarketAssetKind.Coin,
				$coin: { coinId: coin.id },
			},
			$quote: {
				kind: MarketAssetKind.Currency,
				$currency: { iso4217: Iso4217.USD },
			},
			$marketVenue: {
				marketVenueId,
			},
			marketKind: MarketKind.Spot,
		} satisfies MarketIdLabelInput,
	}
}) satisfies readonly {
	baseCoinId: CoinId
	marketVenueId: MarketVenueId
	marketId: CatalogCoinCurrencyMarketId
}[]

export const catalogSpotMarketsWithCurrencyAsBase = iso4217WithCatalogUsdCrossAsBase.map((iso4217) => ({
	iso4217,
	marketId: {
		$base: {
			kind: MarketAssetKind.Currency,
			$currency: { iso4217 },
		},
		$quote: {
			kind: MarketAssetKind.Currency,
			$currency: { iso4217: Iso4217.USD },
		},
		$marketVenue: {
			marketVenueId: catalogFiatUsdCrossMarketVenueId,
		},
		marketKind: MarketKind.Spot,
	} satisfies MarketIdLabelInput,
})) satisfies readonly {
	iso4217: Iso4217
	marketId: CatalogCurrencyCurrencyMarketId
}[]


// Lookups

export const catalogCoinUsdMarketIdByCoinId = Object.fromEntries(
	catalogCoinSpotUsdMarkets.map((catalogRow) => [
		catalogRow.coinId,
		catalogRow.marketId,
	]),
)

export const catalogMarketsWithCoinAsQuoteByQuoteCoinId = Object.fromEntries(
	[
		...new Set(catalogSpotMarketsWithCoinAsQuote.map((catalogRow) => catalogRow.quoteCoinId)),
	].map((quoteCoinId) => [
		quoteCoinId,
		catalogSpotMarketsWithCoinAsQuote
			.filter((catalogRow) => catalogRow.quoteCoinId === quoteCoinId)
			.map((catalogRow) => catalogRow.marketId),
	]),
)

/** Spot catalog markets with USD (or other fiat) as quote — `marketId` rows only. */
export const catalogMarketsWithCurrencyAsQuoteUsd = catalogSpotMarketsWithCurrencyAsQuote.map((
	catalogRow,
) => catalogRow.marketId)

export const catalogMarketsWithCurrencyAsBaseByIso4217 = Object.fromEntries(
	catalogSpotMarketsWithCurrencyAsBase.map((catalogRow) => [
		catalogRow.iso4217,
		[catalogRow.marketId],
	]),
)

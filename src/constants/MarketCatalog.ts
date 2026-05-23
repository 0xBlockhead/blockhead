// Types/constants
import type { CoinId } from '$/constants/Coin.ts'
import { coins } from '$/constants/Coin.ts'
import { Iso4217 } from '$/constants/Currency.ts'
import { MarketAssetKind, MarketKind } from '$/constants/Market.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import { tradingViewMarketByCoinId } from '$/sources/TradingView/Rest/constants.ts'


/** Venue for catalog fiat-major / USD crosses (e.g. EUR/USD). */
export const catalogFiatUsdCrossMarketVenueId = MarketVenueId.Coinbase

export const catalogMarketVenueIdForCoin = (coinId: string) => (
	tradingViewMarketByCoinId[coinId as CoinId]?.marketVenueId
	?? MarketVenueId.Binance
)

export const catalogCoinUsdMarketId = (coinId: string) => (
	{
		$base: {
			kind: MarketAssetKind.Coin,
			$coin: { coinId },
		},
		$quote: {
			kind: MarketAssetKind.Currency,
			$currency: { iso4217: Iso4217.USD },
		},
		$marketVenue: {
			marketVenueId: catalogMarketVenueIdForCoin(coinId),
		},
		marketKind: MarketKind.Spot,
	}
)

export const catalogMarketsWithCoinAsQuote = (
	quoteCoinId: string,
	coinIdFilter?: (baseCoinId: string) => boolean,
) => (
	coins.flatMap((coin) => (
		coin.id === quoteCoinId
		|| coinIdFilter != null && !coinIdFilter(coin.id) ?
			[]
		:	[{
			$base: {
				kind: MarketAssetKind.Coin,
				$coin: { coinId: coin.id },
			},
			$quote: {
				kind: MarketAssetKind.Coin,
				$coin: { coinId: quoteCoinId },
			},
			$marketVenue: {
				marketVenueId: catalogMarketVenueIdForCoin(coin.id),
			},
			marketKind: MarketKind.Spot,
		}]
	))
)

// Types/constants
import type { CoinId } from '$/constants/Coin.ts'
import { Iso4217 } from '$/constants/Currency.ts'
import { MarketAssetKind } from '$/constants/Market.ts'
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
	}
)

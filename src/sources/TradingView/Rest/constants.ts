import { CoinId } from '$/constants/Coin.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'

export const tradingViewCryptoScannerPath = '/crypto/scan' as const

export const marketVenueIdByTradingViewExchangeId: Partial<Record<string, MarketVenueId>> = {
	BINANCE: MarketVenueId.Binance,
	COINBASE: MarketVenueId.Coinbase,
	DERIBIT: MarketVenueId.Deribit,
	KRAKEN: MarketVenueId.Kraken,
	KUCOIN: MarketVenueId.Kucoin,
	OKX: MarketVenueId.Okx,
	PANCAKESWAP: MarketVenueId.PancakeSwap,
	UNISWAP: MarketVenueId.Uniswap,
}

export const tradingViewExchangeIdByMarketVenueId: Partial<Record<MarketVenueId, string>> = Object.fromEntries(
	Object.entries(marketVenueIdByTradingViewExchangeId)
		.map(([exchangeId, marketVenueId]) => [
			marketVenueId,
			exchangeId,
		])
)

export const tradingViewMarketByCoinId = Object.fromEntries(
	([
		{
			coinId: CoinId.AAVE,
			ticker: 'BINANCE:AAVEUSDT',
		},
		{
			coinId: CoinId.ADA,
			ticker: 'BINANCE:ADAUSDT',
		},
		{
			coinId: CoinId.APT,
			ticker: 'BINANCE:APTUSDT',
		},
		{
			coinId: CoinId.ARB,
			ticker: 'BINANCE:ARBUSDT',
		},
		{
			coinId: CoinId.AVAX,
			ticker: 'BINANCE:AVAXUSDT',
		},
		{
			coinId: CoinId.BNB,
			ticker: 'BINANCE:BNBUSDT',
		},
		{
			coinId: CoinId.BTC,
			ticker: 'BINANCE:BTCUSDT',
		},
		{
			coinId: CoinId.ETH,
			ticker: 'BINANCE:ETHUSDT',
		},
		{
			coinId: CoinId.FIL,
			ticker: 'BINANCE:FILUSDT',
		},
		{
			coinId: CoinId.LINK,
			ticker: 'BINANCE:LINKUSDT',
		},
		{
			coinId: CoinId.OP,
			ticker: 'BINANCE:OPUSDT',
		},
		{
			coinId: CoinId.POL,
			ticker: 'BINANCE:POLUSDT',
		},
		{
			coinId: CoinId.SEI,
			ticker: 'BINANCE:SEIUSDT',
		},
		{
			coinId: CoinId.SOL,
			ticker: 'BINANCE:SOLUSDT',
		},
		{
			coinId: CoinId.UNI,
			ticker: 'BINANCE:UNIUSDT',
		},
		{
			coinId: CoinId.USDC,
			ticker: 'BINANCE:USDCUSDT',
		},
		{
			coinId: CoinId.XDC,
			ticker: 'KUCOIN:XDCUSDT',
		},
	] as const satisfies readonly {
		coinId: CoinId
		ticker: string
	}[])
		.flatMap((entry) => {
			const exchangeId = entry.ticker.split(':')[0]
			return (
				marketVenueIdByTradingViewExchangeId[exchangeId] == null ?
					[]
				:
					[
						[
							entry.coinId,
							{
								ticker: entry.ticker,
								marketVenueId: marketVenueIdByTradingViewExchangeId[exchangeId],
							},
						],
					]
			)
		})
) as Partial<Record<
	CoinId,
	{
		ticker: string
		marketVenueId: MarketVenueId
	}
>>

import { CoinId } from '$/constants/Coin.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'


// Constants

export const tradingViewMarkets = [
	{
		coinId: CoinId.AAVE,
		ticker: 'BINANCE:AAVEUSDT',
		marketVenueId: MarketVenueId.Binance,
	},
	{
		coinId: CoinId.ADA,
		ticker: 'BINANCE:ADAUSDT',
		marketVenueId: MarketVenueId.Binance,
	},
	{
		coinId: CoinId.APT,
		ticker: 'BINANCE:APTUSDT',
		marketVenueId: MarketVenueId.Binance,
	},
	{
		coinId: CoinId.ARB,
		ticker: 'BINANCE:ARBUSDT',
		marketVenueId: MarketVenueId.Binance,
	},
	{
		coinId: CoinId.AVAX,
		ticker: 'BINANCE:AVAXUSDT',
		marketVenueId: MarketVenueId.Binance,
	},
	{
		coinId: CoinId.BNB,
		ticker: 'BINANCE:BNBUSDT',
		marketVenueId: MarketVenueId.Binance,
	},
	{
		coinId: CoinId.BTC,
		ticker: 'BINANCE:BTCUSDT',
		marketVenueId: MarketVenueId.Binance,
	},
	{
		coinId: CoinId.ETH,
		ticker: 'BINANCE:ETHUSDT',
		marketVenueId: MarketVenueId.Binance,
	},
	{
		coinId: CoinId.FIL,
		ticker: 'BINANCE:FILUSDT',
		marketVenueId: MarketVenueId.Binance,
	},
	{
		coinId: CoinId.LINK,
		ticker: 'BINANCE:LINKUSDT',
		marketVenueId: MarketVenueId.Binance,
	},
	{
		coinId: CoinId.OP,
		ticker: 'BINANCE:OPUSDT',
		marketVenueId: MarketVenueId.Binance,
	},
	{
		coinId: CoinId.POL,
		ticker: 'BINANCE:POLUSDT',
		marketVenueId: MarketVenueId.Binance,
	},
	{
		coinId: CoinId.SEI,
		ticker: 'BINANCE:SEIUSDT',
		marketVenueId: MarketVenueId.Binance,
	},
	{
		coinId: CoinId.SOL,
		ticker: 'BINANCE:SOLUSDT',
		marketVenueId: MarketVenueId.Binance,
	},
	{
		coinId: CoinId.UNI,
		ticker: 'BINANCE:UNIUSDT',
		marketVenueId: MarketVenueId.Binance,
	},
	{
		coinId: CoinId.USDC,
		ticker: 'BINANCE:USDCUSDT',
		marketVenueId: MarketVenueId.Binance,
	},
	{
		coinId: CoinId.XDC,
		ticker: 'KUCOIN:XDCUSDT',
		marketVenueId: MarketVenueId.Kucoin,
	},
] as const satisfies readonly {
	coinId: CoinId
	ticker: string
	marketVenueId: MarketVenueId
}[]


// Lookups

export const tradingViewMarketByCoinIdAndMarketVenueId = Object.fromEntries(
	tradingViewMarkets.map((market) => [
		`${market.coinId}:${market.marketVenueId}`,
		market,
	])
)

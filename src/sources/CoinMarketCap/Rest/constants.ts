import { CoinId } from '$/constants/Coin.ts'

export const coinMarketCapApiBaseUrl = 'https://pro-api.coinmarketcap.com'

const coinMarketCapCoinCatalog = [
	{ coinId: CoinId.AAVE, coinMarketCapId: 7278 },
	{ coinId: CoinId.ADA, coinMarketCapId: 2010 },
	{ coinId: CoinId.APT, coinMarketCapId: 21794 },
	{ coinId: CoinId.ARB, coinMarketCapId: 11841 },
	{ coinId: CoinId.AVAX, coinMarketCapId: 5805 },
	{ coinId: CoinId.BNB, coinMarketCapId: 1839 },
	{ coinId: CoinId.BTC, coinMarketCapId: 1 },
	{ coinId: CoinId.CELO, coinMarketCapId: 5567 },
	{ coinId: CoinId.ETH, coinMarketCapId: 1027 },
	{ coinId: CoinId.FIL, coinMarketCapId: 2280 },
	{ coinId: CoinId.LINK, coinMarketCapId: 1975 },
	{ coinId: CoinId.OP, coinMarketCapId: 11840 },
	{ coinId: CoinId.SEI, coinMarketCapId: 23149 },
	{ coinId: CoinId.SOL, coinMarketCapId: 5426 },
	{ coinId: CoinId.STETH, coinMarketCapId: 8085 },
	{ coinId: CoinId.UNI, coinMarketCapId: 7083 },
	{ coinId: CoinId.USDC, coinMarketCapId: 3408 },
	{ coinId: CoinId.USDT, coinMarketCapId: 825 },
	{ coinId: CoinId.WBTC, coinMarketCapId: 3717 },
	{ coinId: CoinId.XDC, coinMarketCapId: 2634 },
] as const satisfies readonly {
	coinId: CoinId
	coinMarketCapId: number
}[]

export const coinMarketCapIdByCoinId = Object.fromEntries(
	coinMarketCapCoinCatalog
		.map((entry) => [
			entry.coinId,
			entry.coinMarketCapId,
		]),
) as Partial<Record<CoinId, number>>

export const coinIdByCoinMarketCapId = Object.fromEntries(
	coinMarketCapCoinCatalog
		.map((entry) => [
			entry.coinMarketCapId,
			entry.coinId,
		]),
) as Partial<Record<number, CoinId>>

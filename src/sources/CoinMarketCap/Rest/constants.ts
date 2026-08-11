import { CoinId } from '$/constants/Coin.ts'

const catalog = [
	{ coinId: CoinId.AAVE, wireId: 7278 },
	{ coinId: CoinId.ADA, wireId: 2010 },
	{ coinId: CoinId.APT, wireId: 21794 },
	{ coinId: CoinId.ARB, wireId: 11841 },
	{ coinId: CoinId.AVAX, wireId: 5805 },
	{ coinId: CoinId.BNB, wireId: 1839 },
	{ coinId: CoinId.BTC, wireId: 1 },
	{ coinId: CoinId.CELO, wireId: 5567 },
	{ coinId: CoinId.ETH, wireId: 1027 },
	{ coinId: CoinId.FIL, wireId: 2280 },
	{ coinId: CoinId.LINK, wireId: 1975 },
	{ coinId: CoinId.OP, wireId: 11840 },
	{ coinId: CoinId.SEI, wireId: 23149 },
	{ coinId: CoinId.SOL, wireId: 5426 },
	{ coinId: CoinId.STETH, wireId: 8085 },
	{ coinId: CoinId.UNI, wireId: 7083 },
	{ coinId: CoinId.USDC, wireId: 3408 },
	{ coinId: CoinId.USDT, wireId: 825 },
	{ coinId: CoinId.WBTC, wireId: 3717 },
	{ coinId: CoinId.XDC, wireId: 2634 },
] as const satisfies readonly {
	coinId: CoinId
	wireId: number
}[]

/** Numeric coin ids for `/v1/cryptocurrency/quotes/latest?id=…`. */
export const idByCoinId = Object.fromEntries(
	catalog
		.map((entry) => [
			entry.coinId,
			entry.wireId,
		])
)

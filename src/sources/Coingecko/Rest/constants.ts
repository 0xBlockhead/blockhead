import { CoinId } from '$/constants/Coin.ts'

export const coingeckoDemoBaseUrl = 'https://api.coingecko.com/api/v3'

export const coingeckoProBaseUrl = 'https://pro-api.coingecko.com/api/v3'

const coingeckoCoinCatalog = [
	{ coinId: CoinId.AAVE, coingeckoId: 'aave', decimals: 18 },
	{ coinId: CoinId.ADA, coingeckoId: 'cardano', decimals: 6 },
	{ coinId: CoinId.APT, coingeckoId: 'aptos', decimals: 8 },
	{ coinId: CoinId.ARB, coingeckoId: 'arbitrum', decimals: 18 },
	{ coinId: CoinId.AVAX, coingeckoId: 'avalanche-2', decimals: 18 },
	{ coinId: CoinId.BNB, coingeckoId: 'binancecoin', decimals: 18 },
	{ coinId: CoinId.BTC, coingeckoId: 'bitcoin', decimals: 8 },
	{ coinId: CoinId.CELO, coingeckoId: 'celo', decimals: 18 },
	{ coinId: CoinId.EDU, coingeckoId: 'open-campus', decimals: 18 },
	{ coinId: CoinId.ETH, coingeckoId: 'ethereum', decimals: 18 },
	{ coinId: CoinId.FIL, coingeckoId: 'filecoin', decimals: 18 },
	{ coinId: CoinId.LINK, coingeckoId: 'chainlink', decimals: 18 },
	{ coinId: CoinId.MATIC, coingeckoId: 'matic-network', decimals: 18 },
	{ coinId: CoinId.MITO, coingeckoId: undefined, decimals: 18 },
	{ coinId: CoinId.OP, coingeckoId: 'optimism', decimals: 18 },
	{ coinId: CoinId.POL, coingeckoId: 'polygon-ecosystem-token', decimals: 18 },
	{ coinId: CoinId.S, coingeckoId: undefined, decimals: 18 },
	{ coinId: CoinId.SEI, coingeckoId: 'sei-network', decimals: 18 },
	{ coinId: CoinId.SOL, coingeckoId: 'solana', decimals: 9 },
	{ coinId: CoinId.STETH, coingeckoId: 'staked-ether', decimals: 18 },
	{ coinId: CoinId.TAC, coingeckoId: undefined, decimals: 18 },
	{ coinId: CoinId.UNI, coingeckoId: 'uniswap', decimals: 18 },
	{ coinId: CoinId.USDC, coingeckoId: 'usd-coin', decimals: 6 },
	{ coinId: CoinId.USDT, coingeckoId: 'tether', decimals: 6 },
	{ coinId: CoinId.WBTC, coingeckoId: 'wrapped-bitcoin', decimals: 8 },
	{ coinId: CoinId.XDC, coingeckoId: 'xdce', decimals: 18 },
] as const satisfies readonly {
	coinId: CoinId
	coingeckoId?: string
	decimals?: number
}[]

export const coingeckoIdByCoinId = Object.fromEntries(
	coingeckoCoinCatalog
		.flatMap((entry) => (
			entry.coingeckoId == null ?
				[]
			:	[[entry.coinId, entry.coingeckoId] as const]
		)),
) as Partial<Record<CoinId, string>>

export const coinIdByCoingeckoId = Object.fromEntries(
	coingeckoCoinCatalog
		.flatMap((entry) => (
			entry.coingeckoId == null ?
				[]
			:	[[entry.coingeckoId, entry.coinId] as const]
		)),
) as Partial<Record<string, CoinId>>

export const coinDecimalsByCoinId = Object.fromEntries(
	coingeckoCoinCatalog
		.flatMap((entry) => (
			entry.decimals == null ?
				[]
			:	[[entry.coinId, entry.decimals] as const]
		)),
) as Partial<Record<CoinId, number>>

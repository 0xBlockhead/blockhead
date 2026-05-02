import { CoinId } from '$/constants/Coin.ts'

/** Demo vs pro API hosts (REST path {@link pathPrefix}). */
export const demoOrigin = 'https://api.coingecko.com' as const
export const proOrigin = 'https://pro-api.coingecko.com' as const

export const pathPrefix = '/api/v3' as const

export const demoBaseUrl = `${demoOrigin}${pathPrefix}` as const

export const proBaseUrl = `${proOrigin}${pathPrefix}` as const

const catalog = [
	{ coinId: CoinId.AAVE, wireId: 'aave', decimals: 18 },
	{ coinId: CoinId.ADA, wireId: 'cardano', decimals: 6 },
	{ coinId: CoinId.APT, wireId: 'aptos', decimals: 8 },
	{ coinId: CoinId.ARB, wireId: 'arbitrum', decimals: 18 },
	{ coinId: CoinId.AVAX, wireId: 'avalanche-2', decimals: 18 },
	{ coinId: CoinId.BNB, wireId: 'binancecoin', decimals: 18 },
	{ coinId: CoinId.BTC, wireId: 'bitcoin', decimals: 8 },
	{ coinId: CoinId.CELO, wireId: 'celo', decimals: 18 },
	{ coinId: CoinId.EDU, wireId: 'open-campus', decimals: 18 },
	{ coinId: CoinId.ETH, wireId: 'ethereum', decimals: 18 },
	{ coinId: CoinId.FIL, wireId: 'filecoin', decimals: 18 },
	{ coinId: CoinId.LINK, wireId: 'chainlink', decimals: 18 },
	{ coinId: CoinId.MATIC, wireId: 'matic-network', decimals: 18 },
	{ coinId: CoinId.MITO, wireId: 'mitosis', decimals: 18 },
	{ coinId: CoinId.OP, wireId: 'optimism', decimals: 18 },
	{ coinId: CoinId.POL, wireId: 'polygon-ecosystem-token', decimals: 18 },
	{ coinId: CoinId.S, wireId: 'sonic-3', decimals: 18 },
	{ coinId: CoinId.SEI, wireId: 'sei-network', decimals: 18 },
	{ coinId: CoinId.SOL, wireId: 'solana', decimals: 9 },
	{ coinId: CoinId.STETH, wireId: 'staked-ether', decimals: 18 },
	{ coinId: CoinId.TAC, wireId: 'tac', decimals: 18 },
	{ coinId: CoinId.UNI, wireId: 'uniswap', decimals: 18 },
	{ coinId: CoinId.USDC, wireId: 'usd-coin', decimals: 6 },
	{ coinId: CoinId.USDT, wireId: 'tether', decimals: 6 },
	{ coinId: CoinId.WBTC, wireId: 'wrapped-bitcoin', decimals: 8 },
	{ coinId: CoinId.XDC, wireId: 'xdce', decimals: 18 },
] as const satisfies readonly {
	coinId: CoinId
	wireId?: string
	decimals?: number
}[]

/** CoinGecko coin id strings (`/coins/{id}` path segment). */
export const idByCoinId = Object.fromEntries(
	catalog
		.flatMap((entry) => (
			entry.wireId == null ?
				[]
			:	[[entry.coinId, entry.wireId] as const]
		)),
) as Partial<Record<CoinId, string>>

export const coinIdByWireId = Object.fromEntries(
	catalog
		.flatMap((entry) => (
			entry.wireId == null ?
				[]
			:	[[entry.wireId, entry.coinId] as const]
		)),
) as Partial<Record<string, CoinId>>

export const decimalsByCoinId = Object.fromEntries(
	catalog
		.flatMap((entry) => (
			entry.decimals == null ?
				[]
			:	[[entry.coinId, entry.decimals] as const]
		)),
) as Partial<Record<CoinId, number>>

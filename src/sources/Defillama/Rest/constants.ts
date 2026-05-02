import { CoinId } from '$/constants/Coin.ts'

/**
 * Coin ids accepted by {@link coinsOrigin} current-prices API (`coingecko:…`, etc.).
 * @see https://docs.llama.fi/coin-prices-api
 */
export const defillamaCurrentPriceIdByCoinId: Partial<Record<CoinId, string>> = {
	[CoinId.AAVE]: 'coingecko:aave',
	[CoinId.ADA]: 'coingecko:cardano',
	[CoinId.APT]: 'coingecko:aptos',
	[CoinId.ARB]: 'coingecko:arbitrum',
	[CoinId.AVAX]: 'coingecko:avalanche-2',
	[CoinId.BNB]: 'coingecko:binancecoin',
	[CoinId.BTC]: 'coingecko:bitcoin',
	[CoinId.CELO]: 'coingecko:celo',
	[CoinId.EDU]: 'coingecko:open-campus',
	[CoinId.ETH]: 'coingecko:ethereum',
	[CoinId.FIL]: 'coingecko:filecoin',
	[CoinId.LINK]: 'coingecko:chainlink',
	[CoinId.MITO]: 'coingecko:mitosis',
	[CoinId.MATIC]: 'coingecko:matic-network',
	[CoinId.OP]: 'coingecko:optimism',
	[CoinId.POL]: 'coingecko:polygon-ecosystem-token',
	[CoinId.S]: 'coingecko:sonic-3',
	[CoinId.SEI]: 'coingecko:sei-network',
	[CoinId.SOL]: 'coingecko:solana',
	[CoinId.STETH]: 'coingecko:staked-ether',
	[CoinId.TAC]: 'coingecko:tac',
	[CoinId.UNI]: 'coingecko:uniswap',
	[CoinId.USDC]: 'coingecko:usd-coin',
	[CoinId.USDT]: 'coingecko:tether',
	[CoinId.WBTC]: 'coingecko:wrapped-bitcoin',
	[CoinId.XDC]: 'coingecko:xdce',
}

/**
 * Public current-prices host — `GET /prices/current/{coins}` (comma-separated path segment).
 * Pro uses `https://pro-api.llama.fi/<API_KEY>/coins/prices/current/{coins}` (not this host).
 * @see https://docs.llama.fi/coin-prices-api
 */
export const coinsOrigin = 'https://coins.llama.fi' as const

export const coinsBaseUrl = coinsOrigin

/**
 * Pro API host: `https://pro-api.llama.fi/<KEY>/…`.
 * @see https://docs.llama.fi/pro-api
 */
export const proOrigin = 'https://pro-api.llama.fi' as const

export const proBaseUrl = proOrigin

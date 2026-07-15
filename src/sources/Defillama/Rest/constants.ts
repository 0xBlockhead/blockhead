import { CoinId } from '$/constants/Coin.ts'

export const defillamaCurrentPriceIds = [
	{
		coinId: CoinId.AAVE,
		providerCoinId: 'coingecko:aave',
	},
	{
		coinId: CoinId.ADA,
		providerCoinId: 'coingecko:cardano',
	},
	{
		coinId: CoinId.ARB,
		providerCoinId: 'coingecko:arbitrum',
	},
	{
		coinId: CoinId.AVAX,
		providerCoinId: 'coingecko:avalanche-2',
	},
	{
		coinId: CoinId.BNB,
		providerCoinId: 'coingecko:binancecoin',
	},
	{
		coinId: CoinId.BTC,
		providerCoinId: 'coingecko:bitcoin',
	},
	{
		coinId: CoinId.ETH,
		providerCoinId: 'coingecko:ethereum',
	},
	{
		coinId: CoinId.FIL,
		providerCoinId: 'coingecko:filecoin',
	},
	{
		coinId: CoinId.LINK,
		providerCoinId: 'coingecko:chainlink',
	},
	{
		coinId: CoinId.MITO,
		providerCoinId: 'coingecko:mitosis',
	},
	{
		coinId: CoinId.POL,
		providerCoinId: 'coingecko:polygon-ecosystem-token',
	},
	{
		coinId: CoinId.S,
		providerCoinId: 'coingecko:sonic-3',
	},
	{
		coinId: CoinId.SEI,
		providerCoinId: 'coingecko:sei-network',
	},
	{
		coinId: CoinId.SOL,
		providerCoinId: 'coingecko:solana',
	},
	{
		coinId: CoinId.STETH,
		providerCoinId: 'coingecko:staked-ether',
	},
	{
		coinId: CoinId.UNI,
		providerCoinId: 'coingecko:uniswap',
	},
	{
		coinId: CoinId.USDC,
		providerCoinId: 'coingecko:usd-coin',
	},
	{
		coinId: CoinId.WBTC,
		providerCoinId: 'coingecko:wrapped-bitcoin',
	},
] as const satisfies readonly {
	coinId: CoinId
	providerCoinId: string
}[]

/**
 * Coin ids accepted by {@link coinsOrigin} current-prices API (`coingecko:…`, etc.).
 * Keep this list to ids proven to return current prices. Missing keys mean this
 * source does not currently support that catalog coin.
 *
 * @see https://docs.llama.fi/coin-prices-api
 */
export const defillamaCurrentPriceIdByCoinId = Object.fromEntries(
	defillamaCurrentPriceIds
		.map(({
			coinId,
			providerCoinId,
		}) => [
			coinId,
			providerCoinId,
		])
) as Partial<Record<CoinId, string>>

/**
 * Public current-prices host — `GET /prices/current/{coins}` (comma-separated path segment).
 * Pro uses `https://pro-api.llama.fi/<API_KEY>/coins/prices/current/{coins}` (not this host).
 * @see https://docs.llama.fi/coin-prices-api
 */
export const coinsOrigin = 'https://coins.llama.fi' as const

export const iconsOrigin = 'https://icons.llama.fi' as const

export const coinsBaseUrl = coinsOrigin

/**
 * Pro API host: `https://pro-api.llama.fi/<KEY>/…`.
 * @see https://docs.llama.fi/pro-api
 */
export const proOrigin = 'https://pro-api.llama.fi' as const

export const proBaseUrl = proOrigin

export const defillamaOrigins = [
	{
		origin: coinsOrigin,
		corsEnabled: false,
	},
	{
		origin: iconsOrigin,
		corsEnabled: false,
	},
	{
		origin: proOrigin,
		corsEnabled: false,
	},
] as const

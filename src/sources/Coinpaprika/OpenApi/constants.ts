import { CoinId } from '$/constants/Coin.ts'

/** Free vs bearer-auth hosts (REST path {@link pathPrefix}). */
export const freeOrigin = 'https://api.coinpaprika.com' as const
export const proOrigin = 'https://api-pro.coinpaprika.com' as const

export const pathPrefix = '/v1' as const

export const freeBaseUrl = `${freeOrigin}${pathPrefix}` as const

export const proBaseUrl = `${proOrigin}${pathPrefix}` as const

const catalog = [
	{ coinId: CoinId.AAVE, wireId: 'aave-aave', decimals: 18 },
	{ coinId: CoinId.ADA, wireId: 'ada-cardano', decimals: 6 },
	{ coinId: CoinId.APT, wireId: 'apt-aptos', decimals: 8 },
	{ coinId: CoinId.ARB, wireId: 'arb-arbitrum', decimals: 18 },
	{ coinId: CoinId.AVAX, wireId: 'avax-avalanche', decimals: 18 },
	{ coinId: CoinId.BNB, wireId: 'bnb-binance-coin', decimals: 18 },
	{ coinId: CoinId.BTC, wireId: 'btc-bitcoin', decimals: 8 },
	{ coinId: CoinId.CELO, wireId: 'celo-celo', decimals: 18 },
	{ coinId: CoinId.ETH, wireId: 'eth-ethereum', decimals: 18 },
	{ coinId: CoinId.FIL, wireId: 'fil-filecoin', decimals: 18 },
	{ coinId: CoinId.LINK, wireId: 'link-chainlink', decimals: 18 },
	{ coinId: CoinId.OP, wireId: 'op-optimism', decimals: 18 },
	{ coinId: CoinId.SEI, wireId: 'sei-sei', decimals: 18 },
	{ coinId: CoinId.SOL, wireId: 'sol-solana', decimals: 9 },
	{ coinId: CoinId.STETH, wireId: 'steth-lido-staked-ether', decimals: 18 },
	{ coinId: CoinId.UNI, wireId: 'uni-uniswap', decimals: 18 },
	{ coinId: CoinId.USDC, wireId: 'usdc-usd-coin', decimals: 6 },
	{ coinId: CoinId.USDT, wireId: 'usdt-tether', decimals: 6 },
	{ coinId: CoinId.WBTC, wireId: 'wbtc-wrapped-bitcoin', decimals: 8 },
	{ coinId: CoinId.XDC, wireId: 'xdc-xdc-network', decimals: 18 },
] as const satisfies readonly {
	coinId: CoinId
	wireId: string
	decimals: number
}[]

export const idByCoinId: Partial<Record<CoinId, string>> = Object.fromEntries(
	catalog
		.map((entry) => [
			entry.coinId,
			entry.wireId,
		]),
)

export const coinIdByWireId: Partial<Record<string, CoinId>> = Object.fromEntries(
	catalog
		.map((entry) => [
			entry.wireId,
			entry.coinId,
		]),
)

export const decimalsByCoinId: Partial<Record<CoinId, number>> = Object.fromEntries(
	catalog
		.map((entry) => [
			entry.coinId,
			entry.decimals,
		]),
)

export const coinpaprikaCatalogCoinIds: readonly CoinId[] = catalog.map((entry) => entry.coinId)

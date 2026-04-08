import { CoinId } from '$/constants/Coin.ts'

export const coinpaprikaFreeApiBaseUrl = 'https://api.coinpaprika.com/v1'

export const coinpaprikaProApiBaseUrl = 'https://api-pro.coinpaprika.com/v1'

const coinpaprikaCoinCatalog = [
	{ coinId: CoinId.AAVE, coinpaprikaId: 'aave-aave', decimals: 18 },
	{ coinId: CoinId.ADA, coinpaprikaId: 'ada-cardano', decimals: 6 },
	{ coinId: CoinId.APT, coinpaprikaId: 'apt-aptos', decimals: 8 },
	{ coinId: CoinId.ARB, coinpaprikaId: 'arb-arbitrum', decimals: 18 },
	{ coinId: CoinId.AVAX, coinpaprikaId: 'avax-avalanche', decimals: 18 },
	{ coinId: CoinId.BNB, coinpaprikaId: 'bnb-binance-coin', decimals: 18 },
	{ coinId: CoinId.BTC, coinpaprikaId: 'btc-bitcoin', decimals: 8 },
	{ coinId: CoinId.CELO, coinpaprikaId: 'celo-celo', decimals: 18 },
	{ coinId: CoinId.ETH, coinpaprikaId: 'eth-ethereum', decimals: 18 },
	{ coinId: CoinId.FIL, coinpaprikaId: 'fil-filecoin', decimals: 18 },
	{ coinId: CoinId.LINK, coinpaprikaId: 'link-chainlink', decimals: 18 },
	{ coinId: CoinId.OP, coinpaprikaId: 'op-optimism', decimals: 18 },
	{ coinId: CoinId.SEI, coinpaprikaId: 'sei-sei', decimals: 18 },
	{ coinId: CoinId.SOL, coinpaprikaId: 'sol-solana', decimals: 9 },
	{ coinId: CoinId.STETH, coinpaprikaId: 'steth-lido-staked-ether', decimals: 18 },
	{ coinId: CoinId.UNI, coinpaprikaId: 'uni-uniswap', decimals: 18 },
	{ coinId: CoinId.USDC, coinpaprikaId: 'usdc-usd-coin', decimals: 6 },
	{ coinId: CoinId.USDT, coinpaprikaId: 'usdt-tether', decimals: 6 },
	{ coinId: CoinId.WBTC, coinpaprikaId: 'wbtc-wrapped-bitcoin', decimals: 8 },
	{ coinId: CoinId.XDC, coinpaprikaId: 'xdc-xdc-network', decimals: 18 },
] as const satisfies readonly {
	coinId: CoinId
	coinpaprikaId: string
	decimals: number
}[]

export const coinpaprikaIdByCoinId = Object.fromEntries(
	coinpaprikaCoinCatalog
		.map((entry) => [
			entry.coinId,
			entry.coinpaprikaId,
		]),
) as Partial<Record<CoinId, string>>

export const coinIdByCoinpaprikaId = Object.fromEntries(
	coinpaprikaCoinCatalog
		.map((entry) => [
			entry.coinpaprikaId,
			entry.coinId,
		]),
) as Partial<Record<string, CoinId>>

export const coinpaprikaDecimalsByCoinId = Object.fromEntries(
	coinpaprikaCoinCatalog
		.map((entry) => [
			entry.coinId,
			entry.decimals,
		]),
) as Partial<Record<CoinId, number>>

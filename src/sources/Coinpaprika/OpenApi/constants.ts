import { CoinId } from '$/constants/Coin.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'

const catalog = [
	{ coinId: CoinId.AAVE, wireId: 'aave-aave' },
	{ coinId: CoinId.ADA, wireId: 'ada-cardano' },
	{ coinId: CoinId.APT, wireId: 'apt-aptos' },
	{ coinId: CoinId.ARB, wireId: 'arb-arbitrum' },
	{ coinId: CoinId.AVAX, wireId: 'avax-avalanche' },
	{ coinId: CoinId.BNB, wireId: 'bnb-binance-coin' },
	{ coinId: CoinId.BTC, wireId: 'btc-bitcoin' },
	{ coinId: CoinId.CELO, wireId: 'celo-celo' },
	{ coinId: CoinId.ETH, wireId: 'eth-ethereum' },
	{ coinId: CoinId.FIL, wireId: 'fil-filecoin' },
	{ coinId: CoinId.LINK, wireId: 'link-chainlink' },
	{ coinId: CoinId.OP, wireId: 'op-optimism' },
	{ coinId: CoinId.SEI, wireId: 'sei-sei' },
	{ coinId: CoinId.SOL, wireId: 'sol-solana' },
	{ coinId: CoinId.STETH, wireId: 'steth-lido-staked-ether' },
	{ coinId: CoinId.TRX, wireId: 'trx-tron' },
	{ coinId: CoinId.UNI, wireId: 'uni-uniswap' },
	{ coinId: CoinId.USDC, wireId: 'usdc-usd-coin' },
	{ coinId: CoinId.USDT, wireId: 'usdt-tether' },
	{ coinId: CoinId.WBTC, wireId: 'wbtc-wrapped-bitcoin' },
	{ coinId: CoinId.XDC, wireId: 'xdc-xdc-network' },
] as const satisfies readonly {
	coinId: CoinId
	wireId: string
}[]

export const idByCoinId = Object.fromEntries(
	catalog
		.map((entry) => [
			entry.coinId,
			entry.wireId,
		])
)

export const coinIdByWireId = new Map(
	catalog
		.map((entry) => [
			entry.wireId,
			entry.coinId,
		])
)

/** Hostname fragment → catalog venue (from `market_url` on coin markets). */
export const coinpaprikaMarketVenueIdByHostnameFragment = [
	['binance.', MarketVenueId.Binance],
	['coinbase.', MarketVenueId.Coinbase],
	['kraken.', MarketVenueId.Kraken],
	['kucoin.', MarketVenueId.Kucoin],
	['okx.', MarketVenueId.Okx],
	['deribit.', MarketVenueId.Deribit],
	['uniswap.', MarketVenueId.Uniswap],
	['pancakeswap.', MarketVenueId.PancakeSwap],
] as const satisfies readonly [string, MarketVenueId][]

/** Quote wire ids treated as USD legs for catalog markets. */
export const coinpaprikaUsdQuoteWireIds = [
	'usdt-tether',
	'usdc-usd-coin',
	'busd-binance-usd',
	'dai-dai',
] as const

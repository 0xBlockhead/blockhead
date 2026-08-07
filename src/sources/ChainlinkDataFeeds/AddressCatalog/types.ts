import { type as arktype } from 'arktype'


const evmAddress = arktype('/^0x[0-9a-f]{40}$/')
const assetSymbol = arktype('/^[A-Z0-9][A-Z0-9.-]{0,31}$/')


export const chainlinkPriceFeedCatalogRowWire = arktype({
	chainId: 'number.integer > 0',
	proxyAddress: evmAddress,
	baseAsset: assetSymbol,
	quoteAsset: assetSymbol,
	decimals: 'number.integer >= 0 <= 255',
	feedKind: 'string > 0',
	label: 'string > 0',
})

export type ChainlinkPriceFeedCatalogRow = typeof chainlinkPriceFeedCatalogRowWire.infer

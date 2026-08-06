import { type as arktype } from 'arktype'


const morphoGraphqlChainWire = arktype({
	id: 'number.integer > 0',
})

const morphoGraphqlAddressAssetWire = arktype({
	address: 'string',
})

const morphoGraphqlVaultAssetWire = arktype({
	address: 'string',
	decimals: 'number.integer >= 0',
})

/** GraphQL BigInt scalars arrive as number when safe, else decimal string. */
const morphoGraphqlAmountWire = arktype('number | string')

export const morphoGraphqlMarketStateWire = arktype({
	supplyAssets: morphoGraphqlAmountWire,
	supplyShares: morphoGraphqlAmountWire,
	borrowAssets: morphoGraphqlAmountWire,
	borrowShares: morphoGraphqlAmountWire,
	timestamp: 'number.integer >= 0',
	blockNumber: morphoGraphqlAmountWire,
})

export const morphoGraphqlMarketWire = arktype({
	marketId: 'string',
	'creationBlockNumber?': 'number.integer >= 0',
	chain: morphoGraphqlChainWire,
	loanAsset: morphoGraphqlAddressAssetWire,
	collateralAsset: morphoGraphqlAddressAssetWire,
	lltv: 'string',
	irmAddress: 'string',
	oracle: morphoGraphqlAddressAssetWire,
	'state?': morphoGraphqlMarketStateWire.or(arktype('null')),
})

export const morphoGraphqlMarketsDataWire = arktype({
	markets: {
		items: morphoGraphqlMarketWire.array(),
	},
})

export const morphoGraphqlMarketDataWire = arktype({
	'marketById?': morphoGraphqlMarketWire.or(arktype('null')),
})

export const morphoGraphqlVaultWire = arktype({
	address: 'string',
	symbol: 'string',
	name: 'string',
	listed: 'boolean',
	asset: morphoGraphqlVaultAssetWire,
	chain: morphoGraphqlChainWire,
})

export const morphoGraphqlVaultsDataWire = arktype({
	vaults: {
		items: morphoGraphqlVaultWire.array(),
	},
})

export const morphoGraphqlVaultDataWire = arktype({
	'vaultByAddress?': morphoGraphqlVaultWire.or(arktype('null')),
})

export const morphoGraphqlAccountMarketPositionWire = arktype({
	market: {
		marketId: 'string',
	},
	state: {
		supplyAssets: 'string',
		supplyShares: 'string',
		borrowAssets: 'string',
		borrowShares: 'string',
		collateral: 'string',
		'supplyAssetsUsd?': 'number',
		'borrowAssetsUsd?': 'number',
		'collateralUsd?': 'number',
	},
})

export const morphoGraphqlAccountVaultPositionWire = arktype({
	vault: {
		address: 'string',
		name: 'string',
		symbol: 'string',
	},
	state: {
		assets: 'string',
		shares: 'string',
		'assetsUsd?': 'number',
	},
})

export const morphoGraphqlAccountPositionsDataWire = arktype({
	userByAddress: arktype({
		address: 'string',
		marketPositions: morphoGraphqlAccountMarketPositionWire.array(),
		vaultPositions: morphoGraphqlAccountVaultPositionWire.array(),
	}).or(arktype('null')),
})

export type MorphoGraphqlMarketWire = typeof morphoGraphqlMarketWire.infer
export type MorphoGraphqlMarketStateWire = typeof morphoGraphqlMarketStateWire.infer
export type MorphoGraphqlVaultWire = typeof morphoGraphqlVaultWire.infer
export type MorphoGraphqlAccountMarketPositionWire = typeof morphoGraphqlAccountMarketPositionWire.infer
export type MorphoGraphqlAccountVaultPositionWire = typeof morphoGraphqlAccountVaultPositionWire.infer

export type MorphoGraphqlMarketState = {
	totalSupplyAssets: string
	totalSupplyShares: string
	totalBorrowAssets: string
	totalBorrowShares: string
	lastAccrualTimestamp: number
	lastIndexedBlock: string
}

export type MorphoGraphqlMarket = {
	marketId: `0x${string}`
	chainId: number
	loanAssetAddress: `0x${string}`
	collateralAssetAddress: `0x${string}`
	lltvWad: string
	irmAddress: `0x${string}`
	oracleAddress: `0x${string}`
	creationBlockNumber?: string
	state?: MorphoGraphqlMarketState
}

export type MorphoGraphqlVault = {
	address: `0x${string}`
	chainId: number
	symbol: string
	name: string
	listed: boolean
	assetAddress: `0x${string}`
	assetDecimals: number
}

export type MorphoGraphqlAccountMarketPosition = {
	protocol: 'Morpho Blue'
	kind: 'market'
	chainId: number
	account: `0x${string}`
	marketId: `0x${string}`
	supplyAssets: string
	supplyShares: string
	borrowAssets: string
	borrowShares: string
	collateral: string
	supplyAssetsUsd?: number
	borrowAssetsUsd?: number
	collateralUsd?: number
}

export type MorphoGraphqlAccountVaultPosition = {
	protocol: 'Morpho Vault'
	kind: 'vault'
	chainId: number
	account: `0x${string}`
	vaultAddress: `0x${string}`
	vaultName: string
	vaultSymbol: string
	assets: string
	shares: string
	assetsUsd?: number
}

export type MorphoGraphqlAccountPosition =
	| MorphoGraphqlAccountMarketPosition
	| MorphoGraphqlAccountVaultPosition

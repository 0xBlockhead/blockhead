import { type as arktype } from 'arktype'


const morphoGraphqlChainWire = arktype({
	id: 'number.integer > 0',
})

const morphoGraphqlAddressAssetWire = arktype({
	address: 'string',
	/** Optional metadata — transport-only until APP enrolls asset label fields. */
	'symbol?': 'string',
	'decimals?': 'number.integer >= 0',
})

const morphoGraphqlVaultAssetWire = arktype({
	address: 'string',
	decimals: 'number.integer >= 0',
})

/** GraphQL BigInt scalars arrive as number when safe, else decimal string. */
const morphoGraphqlAmountWire = arktype('number | string')

const morphoGraphqlRewardWire = arktype({
	asset: {
		address: 'string',
		chain: morphoGraphqlChainWire,
	},
	'supplyApr?': 'number',
	'borrowApr?': 'number',
})

export const morphoGraphqlMarketStateWire = arktype({
	supplyAssets: morphoGraphqlAmountWire,
	supplyShares: morphoGraphqlAmountWire,
	borrowAssets: morphoGraphqlAmountWire,
	borrowShares: morphoGraphqlAmountWire,
	timestamp: 'number.integer >= 0',
	blockNumber: morphoGraphqlAmountWire,
	/** GraphQL Float fee — transport-only; enrolled feeWad uses Morpho_Rest. */
	fee: 'number',
	utilization: 'number',
	supplyApy: 'number',
	borrowApy: 'number',
	liquidityAssets: morphoGraphqlAmountWire,
	'collateralAssets?': morphoGraphqlAmountWire.or(arktype('null')),
	'supplyAssetsUsd?': 'number',
	'borrowAssetsUsd?': 'number',
	'collateralAssetsUsd?': 'number',
	'liquidityAssetsUsd?': 'number',
	'netSupplyApy?': 'number',
	'netBorrowApy?': 'number',
	'avgSupplyApy?': 'number',
	'avgBorrowApy?': 'number',
	'avgNetSupplyApy?': 'number',
	'avgNetBorrowApy?': 'number',
	'rewards?': morphoGraphqlRewardWire.array(),
})

export const morphoGraphqlMarketWire = arktype({
	marketId: 'string',
	'creationBlockNumber?': morphoGraphqlAmountWire,
	/** GraphQL listed flag — transport-only (no enrolled MorphoMarket.listed). */
	'listed?': 'boolean',
	chain: morphoGraphqlChainWire,
	loanAsset: morphoGraphqlAddressAssetWire,
	collateralAsset: morphoGraphqlAddressAssetWire,
	lltv: 'string',
	irmAddress: 'string',
	oracle: morphoGraphqlAddressAssetWire,
	'state?': morphoGraphqlMarketStateWire.or(arktype('null')),
})

const morphoGraphqlPageInfoWire = arktype({
	countTotal: 'number.integer >= 0',
})

export const morphoGraphqlMarketsDataWire = arktype({
	markets: {
		items: morphoGraphqlMarketWire.array(),
		pageInfo: morphoGraphqlPageInfoWire,
	},
})

export const morphoGraphqlMarketDataWire = arktype({
	'marketById?': morphoGraphqlMarketWire.or(arktype('null')),
})

export const morphoGraphqlVaultStateWire = arktype({
	totalAssets: morphoGraphqlAmountWire,
	totalSupply: morphoGraphqlAmountWire,
	timestamp: 'number.integer >= 0',
	blockNumber: morphoGraphqlAmountWire,
	/** Float tip metrics — transport-only until APP enrolls MorphoVault observation fields. */
	'totalAssetsUsd?': 'number',
	'apy?': 'number',
	'netApy?': 'number',
	'netApyExcludingRewards?': 'number',
	'avgNetApy?': 'number',
	'avgNetApyExcludingRewards?': 'number',
	'fee?': 'number',
	'sharePriceUsd?': 'number',
	'sharePriceNumber?': 'number',
	'allRewards?': morphoGraphqlRewardWire.array(),
})

export const morphoGraphqlVaultWire = arktype({
	address: 'string',
	symbol: 'string',
	name: 'string',
	listed: 'boolean',
	asset: morphoGraphqlVaultAssetWire,
	chain: morphoGraphqlChainWire,
	'state?': morphoGraphqlVaultStateWire.or(arktype('null')),
})

export const morphoGraphqlVaultsDataWire = arktype({
	vaults: {
		items: morphoGraphqlVaultWire.array(),
		pageInfo: morphoGraphqlPageInfoWire,
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
		supplyAssets: morphoGraphqlAmountWire,
		supplyShares: morphoGraphqlAmountWire,
		borrowAssets: morphoGraphqlAmountWire,
		borrowShares: morphoGraphqlAmountWire,
		collateral: morphoGraphqlAmountWire,
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
		assets: morphoGraphqlAmountWire,
		shares: morphoGraphqlAmountWire,
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
export type MorphoGraphqlVaultStateWire = typeof morphoGraphqlVaultStateWire.infer
export type MorphoGraphqlAccountMarketPositionWire = typeof morphoGraphqlAccountMarketPositionWire.infer
export type MorphoGraphqlAccountVaultPositionWire = typeof morphoGraphqlAccountVaultPositionWire.infer

export type MorphoGraphqlReward = {
	assetAddress: `0x${string}`
	assetChainId: number
	supplyApr?: number
	borrowApr?: number
}

export type MorphoGraphqlMarketState = {
	totalSupplyAssets: string
	totalSupplyShares: string
	totalBorrowAssets: string
	totalBorrowShares: string
	lastAccrualTimestamp: number
	lastIndexedBlock: string
	/** GraphQL Float fee — lossy vs Rest feeWad; transport-only. */
	fee: number
	utilization: number
	supplyApy: number
	borrowApy: number
	liquidityAssets: string
	collateralAssets?: string
	supplyAssetsUsd?: number
	borrowAssetsUsd?: number
	collateralAssetsUsd?: number
	liquidityAssetsUsd?: number
	netSupplyApy?: number
	netBorrowApy?: number
	avgSupplyApy?: number
	avgBorrowApy?: number
	avgNetSupplyApy?: number
	avgNetBorrowApy?: number
	rewards?: MorphoGraphqlReward[]
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
	listed?: boolean
	loanAssetSymbol?: string
	loanAssetDecimals?: number
	collateralAssetSymbol?: string
	collateralAssetDecimals?: number
	state?: MorphoGraphqlMarketState
}

export type MorphoGraphqlVaultState = {
	totalAssets: string
	totalSupply: string
	lastAccrualTimestamp: number
	lastIndexedBlock: string
	totalAssetsUsd?: number
	apy?: number
	netApy?: number
	netApyExcludingRewards?: number
	avgNetApy?: number
	avgNetApyExcludingRewards?: number
	fee?: number
	sharePriceUsd?: number
	sharePriceNumber?: number
	allRewards?: MorphoGraphqlReward[]
}

export type MorphoGraphqlListPage<_Item> = {
	items: _Item[]
	countTotal: number
}

export type MorphoGraphqlVault = {
	address: `0x${string}`
	chainId: number
	symbol: string
	name: string
	listed: boolean
	assetAddress: `0x${string}`
	assetDecimals: number
	state?: MorphoGraphqlVaultState
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

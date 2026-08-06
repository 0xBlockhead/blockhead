import { type as arktype } from 'arktype'

export const morphoBlueMarketConfigWire = arktype({
	chain_id: 'number.integer > 0',
	market_id: 'string',
	loan_token: 'string',
	collateral_token: 'string',
	oracle_address: 'string',
	irm_address: 'string',
	lltv_wad: 'string',
	creation_block_number: 'string',
})

export const morphoBlueMarketStateWire = arktype({
	chain_id: 'number.integer > 0',
	market_id: 'string',
	last_indexed_block: 'string',
	last_accrual_timestamp: 'number.integer >= 0',
	total_supply_assets: 'string',
	total_supply_shares: 'string',
	total_borrow_assets: 'string',
	total_borrow_shares: 'string',
	fee_wad: 'string',
})

export const morphoBlueMarketConfigResponseWire = arktype({
	'data?': morphoBlueMarketConfigWire,
})

export const morphoBlueMarketStateResponseWire = arktype({
	'data?': morphoBlueMarketStateWire,
})

export type MorphoBlueMarketConfigWire = typeof morphoBlueMarketConfigWire.infer
export type MorphoBlueMarketStateWire = typeof morphoBlueMarketStateWire.infer

export type MorphoBlueMarketConfigResponse = {
	data?: MorphoBlueMarketConfigWire
}

export type MorphoBlueMarketStateResponse = {
	data?: MorphoBlueMarketStateWire
}

export type MorphoBlueMarketConfig = {
	chainId: number
	marketId: `0x${string}`
	loanToken: `0x${string}`
	collateralToken: `0x${string}`
	oracleAddress: `0x${string}`
	irmAddress: `0x${string}`
	lltvWad: string
	creationBlockNumber: string
}

export type MorphoBlueMarketState = {
	chainId: number
	marketId: `0x${string}`
	lastIndexedBlock: string
	lastAccrualTimestamp: number
	totalSupplyAssets: string
	totalSupplyShares: string
	totalBorrowAssets: string
	totalBorrowShares: string
	feeWad: string
}

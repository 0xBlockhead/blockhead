export type EulerAssetRefWire = {
	address?: string
	symbol?: string
	decimals?: number
	name?: string
}

export type EulerOracleInfoWire = {
	oracle?: string
	name?: string
}

export type EulerVaultFeesWire = {
	interestFee?: number
}

export type EulerVaultSummaryWire = {
	chainId?: number
	address?: string
	vaultType?: string
	name?: string
	symbol?: string
	decimals?: number
	asset?: EulerAssetRefWire
	totalAssets?: string
	totalBorrows?: string
	totalSupplyUsd?: number
	totalBorrowsUsd?: number
	utilization?: number
	supplyApy?: number
	borrowApy?: number
	snapshotTimestamp?: string
	createdAt?: string
}

export type EulerVaultDetailWire = EulerVaultSummaryWire & {
	dToken?: string
	oracle?: EulerOracleInfoWire
	governor?: string
	governorAdmin?: string
	supplyCap?: string
	borrowCap?: string
	totalShares?: string
	totalBorrowed?: string
	totalCash?: string
	fees?: EulerVaultFeesWire
	createdAtBlock?: string
}

export type EulerVaultListResponse = {
	data?: EulerVaultSummaryWire[]
	meta?: {
		total?: number
		offset?: number
		limit?: number
	}
}

export type EulerVaultDetailResponse = {
	data?: EulerVaultDetailWire
}

export type EulerEvkVaultSummary = {
	chainId: number
	vaultAddress: `0x${string}`
	name: string
	symbol: string
	decimals: number
	assetAddress: `0x${string}`
	assetSymbol: string
	totalAssets: string
	totalBorrows: string
	totalSupplyUsd: number
	totalBorrowsUsd: number
	utilization: number
	supplyApy: number
	borrowApy: number
	createdAt: string
}

export type EulerEvkVaultDetail = EulerEvkVaultSummary & {
	dTokenAddress?: `0x${string}`
	oracleAddress?: `0x${string}`
	governorAddress?: `0x${string}`
	supplyCap?: string
	borrowCap?: string
	interestFee?: number
}

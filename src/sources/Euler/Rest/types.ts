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

export type EulerAccountPositionSubAccountWire = {
	owner?: string
	timestamp?: string
	lastAccountStatusCheckTimestamp?: string
	enabledControllers?: string[]
	enabledCollaterals?: string[]
	isLockdownMode?: boolean
	isPermitDisabledMode?: boolean
}

export type EulerAccountPositionSnapshotWire = {
	timestamp?: string
	ageSeconds?: number
	source?: string
	method?: string
}

export type EulerAccountPositionWire = {
	chainId?: number
	account?: string
	vault?: string
	vaultType?: string
	asset?: string
	shares?: string
	assets?: string
	borrowed?: string
	assetsValue?: string
	debtValue?: string
	isCollateral?: boolean
	balanceForwarderEnabled?: boolean
	isController?: boolean
	liquidity?: unknown
	subAccount?: EulerAccountPositionSubAccountWire
	snapshot?: EulerAccountPositionSnapshotWire
}

export type EulerAccountPositionsResponse = {
	data?: EulerAccountPositionWire[]
	meta?: {
		hasMore?: boolean
		offset?: number
		limit?: number
		timestamp?: string
	}
	freshness?: {
		latestSnapshotTimestamp?: string | null
		ageSeconds?: number | null
		timestamp?: string
		mode?: string
		forceFreshRequested?: boolean
		refreshTriggered?: boolean
		refreshCompleted?: boolean
		timedOut?: boolean
		rateLimited?: boolean
		fallbackReason?: string | null
		waitedMs?: number
	}
}

export type EulerAccountPosition = {
	chainId: number
	account: `0x${string}`
	vaultAddress: `0x${string}`
	vaultType: string
	assetAddress: `0x${string}`
	shares: string
	assets: string
	borrowed: string
	assetsValue: string
	debtValue: string
	isCollateral: boolean
	balanceForwarderEnabled: boolean
	isController: boolean
	liquidity: unknown
	subAccount: {
		owner: `0x${string}`
		timestamp: string
		lastAccountStatusCheckTimestamp: string
		enabledControllers: `0x${string}`[]
		enabledCollaterals: `0x${string}`[]
		isLockdownMode: boolean
		isPermitDisabledMode: boolean
	}
	snapshot: {
		timestamp: string
		ageSeconds: number
		source: string
		method: string
	}
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
	createdAtBlock?: string
}

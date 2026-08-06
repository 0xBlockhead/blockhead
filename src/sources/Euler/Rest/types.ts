export type EulerAssetRefWire = {
	address?: string
	symbol?: string
	decimals?: number
	name?: string | null
}

export type EulerOracleInfoWire = {
	oracle?: string
	name?: string
}

export type EulerVaultFeesWire = {
	interestFee?: number
	accumulatedFeesShares?: string
	accumulatedFeesAssets?: string
	governorFeeReceiver?: string
	protocolFeeReceiver?: string
	protocolFeeShare?: number
}

/** Contract interest-rate decimals — transport-only; enrolled APYs use float supplyApy/borrowApy. */
export type EulerVaultInterestRatesWire = {
	borrowSPY?: string
	borrowAPY?: string
	supplyAPY?: string
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
	creator?: string
	unitOfAccount?: EulerAssetRefWire
	supplyCap?: string
	borrowCap?: string
	totalShares?: string
	totalBorrowed?: string
	totalCash?: string
	cash?: string
	interestRate?: string
	interestAccumulator?: string
	accumulatedFees?: string
	fees?: EulerVaultFeesWire
	interestRates?: EulerVaultInterestRatesWire
	createdAtBlock?: string
	timestamp?: string
	evcCompatibleAsset?: boolean
	exchangeRate?: string | null
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

export type EulerAccountLiquidityValueWire = {
	value?: string
	valueUsd?: number
}

export type EulerAccountPositionLiquidityWire = {
	vaultAddress?: string
	unitOfAccount?: string
	daysToLiquidation?: number | 'Infinity' | 'MoreThanAYear'
	liabilityValue?: EulerAccountLiquidityValueWire
	totalCollateralValue?: EulerAccountLiquidityValueWire
	collaterals?: {
		address?: string
		value?: EulerAccountLiquidityValueWire
		marketPriceUsd?: number
		valueUsd?: number
	}[]
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
	liquidity?: EulerAccountPositionLiquidityWire | null
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

export type EulerAccountPositionLiquidity = {
	vaultAddress: `0x${string}`
	unitOfAccount: `0x${string}`
	daysToLiquidation: number | 'Infinity' | 'MoreThanAYear'
	liabilityValue?: {
		value: string
		valueUsd?: number
	}
	totalCollateralValue?: {
		value: string
		valueUsd?: number
	}
	collaterals: {
		address: `0x${string}`
		value?: {
			value: string
			valueUsd?: number
		}
		marketPriceUsd?: number
		valueUsd?: number
	}[]
} | null

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
	/** Transport-only liquidity lens — unenrolled on EulerEvkVaultPosition. */
	liquidity: EulerAccountPositionLiquidity
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
	vaultType: 'evk'
	name: string
	symbol: string
	decimals: number
	assetAddress: `0x${string}`
	assetSymbol: string
	/** Transport-only asset metadata leftovers. */
	assetName?: string
	assetDecimals?: number
	totalAssets: string
	totalBorrows: string
	totalSupplyUsd: number
	totalBorrowsUsd: number
	utilization: number
	supplyApy: number
	borrowApy: number
	createdAt: string
	snapshotTimestamp?: string
}

export type EulerEvkVaultDetail = EulerEvkVaultSummary & {
	dTokenAddress?: `0x${string}`
	oracleAddress?: `0x${string}`
	/** Transport-only oracle label. */
	oracleName?: string
	governorAddress?: `0x${string}`
	governorAdminAddress?: `0x${string}`
	creatorAddress?: `0x${string}`
	unitOfAccountAddress?: `0x${string}`
	unitOfAccountSymbol?: string
	supplyCap?: string
	borrowCap?: string
	/** Raw share/borrow/cash leftovers — unenrolled beside totalAssets/totalBorrows. */
	totalShares?: string
	totalBorrowed?: string
	totalCash?: string
	cash?: string
	interestRate?: string
	interestAccumulator?: string
	accumulatedFees?: string
	interestFee?: number
	accumulatedFeesShares?: string
	accumulatedFeesAssets?: string
	governorFeeReceiver?: `0x${string}`
	protocolFeeReceiver?: `0x${string}`
	protocolFeeShare?: number
	/** Exact decimal-string APYs from interestRates — unenrolled beside float supplyApy/borrowApy. */
	borrowSpy?: string
	borrowApyExact?: string
	supplyApyExact?: string
	createdAtBlock?: string
	observationTimestamp?: string
	evcCompatibleAsset?: boolean
	exchangeRate?: string
}

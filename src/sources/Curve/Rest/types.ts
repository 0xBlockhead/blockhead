/**
 * Curve Finance REST wire shapes (`api.curve.finance/v1`).
 * @see https://api.curve.finance/v1/documentation/
 * @see https://api.curve.finance/v1/getPools/{blockchainId}/{registryId}
 * @see https://api.curve.finance/v1/getPools/all/{blockchainId}
 * @see https://api.curve.finance/v1/getAllGauges
 * @see https://api.curve.finance/v1/getAllGaugesStatus
 * @see https://api.curve.finance/v1/getLendingVaults/all/{blockchainId}
 */
import { type as arktype } from 'arktype'

export type CurvePoolListItemWire = {
	type: string
	address: string
}

export type CurvePoolListResponse = {
	success: boolean
	data: {
		poolList: CurvePoolListItemWire[]
	}
}

export type CurvePoolCoinWire = {
	address: string
	decimals: string
	symbol: string
	name: string
	poolBalance?: string
	usdPrice?: number | null
	isBasePoolLpToken?: boolean
}

export type CurvePoolWire = {
	id: string
	address: string
	name: string
	symbol: string
	lpTokenAddress: string
	coinsAddresses: string[]
	decimals: string[]
	coins: CurvePoolCoinWire[]
	registryId?: string
	blockchainId?: string
	virtualPrice?: string | null
	amplificationCoefficient?: string | null
	totalSupply?: string | null
	usdTotal?: number | null
	usdTotalExcludingBasePool?: number | null
	isMetaPool?: boolean
	isBroken?: boolean
	usesRateOracle?: boolean
	gaugeAddress?: string | null
	assetType?: number | null
	assetTypeName?: string | null
	creationBlockNumber?: number | null
	creationTs?: number | null
	implementation?: string | null
	gaugeCrvApy?: number[] | null
	gaugeFutureCrvApy?: number[] | null
	poolUrls?: {
		swap?: string[] | null
		deposit?: string[] | null
		withdraw?: string[] | null
	} | null
}

export type CurvePoolsResponse = {
	success: boolean
	data: {
		poolData: CurvePoolWire[]
		tvl?: number
	}
}

export type CurveGaugeDataWire = {
	inflation_rate?: string | number | null
	working_supply?: string | number | null
}

export type CurveGaugeControllerWire = {
	gauge_relative_weight?: string | number | null
	gauge_future_relative_weight?: string | number | null
	get_gauge_weight?: string | number | null
	inflation_rate?: string | number | null
}

export type CurveGaugeStatusFlagsWire = {
	areCrvRewardsStuckInBridge?: boolean
	rewardsNeedNudging?: boolean
}

export type CurveGaugeWire = {
	name: string
	shortName?: string
	isPool: boolean
	factory?: boolean
	blockchainId: string
	gauge: string
	type?: string
	gaugeType?: string
	side_chain?: boolean
	is_killed?: boolean
	hasNoCrv?: boolean
	poolAddress?: string | null
	swap?: string | null
	swap_token?: string | null
	lendingVaultAddress?: string | null
	rootGauge?: string | null
	lpTokenPrice?: number | null
	virtualPrice?: string | number | null
	gaugeCrvApy?: number[] | null
	gaugeFutureCrvApy?: number[] | null
	gauge_data?: CurveGaugeDataWire | null
	gauge_controller?: CurveGaugeControllerWire | null
	gaugeStatus?: CurveGaugeStatusFlagsWire | null
}

export type CurveAllGaugesResponse = {
	success: boolean
	data: Record<string, CurveGaugeWire>
}

export type CurveGaugeScopeStatusWire = {
	scopeId: string
	blockchainId: string
	source: string
	cacheKey: string
	cacheStatus: string
	isStale: boolean
	generatedTimeMs: number
	cachedAt: number
	staleAt: number
	expireAt: number
	gaugeCount: number
	missingRequiredGauges: string[]
	missingRequiredGaugeCount: number
	buildDurationMs: number
	lastAttemptTimeMs: number
	lastSuccessTimeMs: number | null
	lastErrorTimeMs: number | null
	lastError: string | null
}

export type CurveAllGaugesStatusResponse = {
	success: boolean
	data: {
		scopes: CurveGaugeScopeStatusWire[]
		staleScopes: CurveGaugeScopeStatusWire[]
		failedScopes: CurveGaugeScopeStatusWire[]
		scopesWithMissingRequiredGauges: CurveGaugeScopeStatusWire[]
	}
}

export type CurveLendingVaultAssetWire = {
	symbol: string
	decimals: number
	address: string
	blockchainId: string
	usdPrice?: number | null
}

export type CurveLendingVaultRatesWire = {
	borrowApr?: number | null
	borrowApy?: number | null
	borrowApyPcent?: number | null
	lendApr?: number | null
	lendApy?: number | null
	lendApyPcent?: number | null
}

export type CurveLendingVaultWire = {
	id: string
	name: string
	address: string
	controllerAddress: string
	ammAddress: string
	monetaryPolicyAddress: string
	blockchainId: string
	registryId: string
	gaugeAddress?: string | null
	rates?: CurveLendingVaultRatesWire | null
	assets: {
		borrowed: CurveLendingVaultAssetWire
		collateral: CurveLendingVaultAssetWire
	}
	vaultShares?: {
		pricePerShare?: number | null
		totalShares?: number | null
	} | null
	totalSupplied?: {
		total?: number | null
		usdTotal?: number | null
	} | null
	borrowed?: {
		total?: number | null
		usdTotal?: number | null
	} | null
	availableToBorrow?: {
		total?: number | null
		usdTotal?: number | null
	} | null
	usdTotal?: number | null
}

export type CurveLendingVaultsResponse = {
	success: boolean
	data: {
		lendingVaultData: CurveLendingVaultWire[]
		tvl?: number
	}
}

const curvePoolCoinEnvelope = arktype({
	address: 'string',
	decimals: 'string',
	symbol: 'string',
	name: 'string',
	'poolBalance?': 'string',
	'usdPrice?': 'number | null',
	'isBasePoolLpToken?': 'boolean',
})
const curvePoolEnvelope = arktype({
	id: 'string',
	address: 'string',
	name: 'string',
	symbol: 'string',
	lpTokenAddress: 'string',
	coinsAddresses: 'string[]',
	decimals: 'string[]',
	coins: curvePoolCoinEnvelope.array(),
	'registryId?': 'string',
	'blockchainId?': 'string',
	'virtualPrice?': 'string | null',
	'amplificationCoefficient?': 'string | null',
	'totalSupply?': 'string | null',
	'usdTotal?': 'number | null',
	'usdTotalExcludingBasePool?': 'number | null',
	'isMetaPool?': 'boolean',
	'isBroken?': 'boolean',
	'usesRateOracle?': 'boolean',
	'gaugeAddress?': 'string | null',
	'assetType?': 'number | null',
	'assetTypeName?': 'string | null',
	'creationBlockNumber?': 'number | null',
	'creationTs?': 'number | null',
	'implementation?': 'string | null',
	'gaugeCrvApy?': 'number[] | null',
	'gaugeFutureCrvApy?': 'number[] | null',
	'poolUrls?': arktype({
		'swap?': 'string[] | null',
		'deposit?': 'string[] | null',
		'withdraw?': 'string[] | null',
	}).or('null'),
})

export const curvePoolListEnvelope = arktype({
	success: 'true',
	data: {
		poolList: arktype({
			type: 'string',
			address: 'string',
		}).array(),
	},
})
export const curvePoolsEnvelope = arktype({
	success: 'true',
	data: {
		poolData: curvePoolEnvelope.array(),
		'tvl?': 'number',
	},
})

const curveGaugeDataEnvelope = arktype({
	'inflation_rate?': 'string | number | null',
	'working_supply?': 'string | number | null',
})
const curveGaugeControllerEnvelope = arktype({
	'gauge_relative_weight?': 'string | number | null',
	'gauge_future_relative_weight?': 'string | number | null',
	'get_gauge_weight?': 'string | number | null',
	'inflation_rate?': 'string | number | null',
})
const curveGaugeStatusFlagsEnvelope = arktype({
	'areCrvRewardsStuckInBridge?': 'boolean',
	'rewardsNeedNudging?': 'boolean',
})
export const curveGaugeEnvelope = arktype({
	name: 'string',
	'shortName?': 'string',
	isPool: 'boolean',
	'factory?': 'boolean',
	blockchainId: 'string',
	gauge: 'string',
	'type?': 'string',
	'gaugeType?': 'string',
	'side_chain?': 'boolean',
	'is_killed?': 'boolean',
	'hasNoCrv?': 'boolean',
	'poolAddress?': 'string | null',
	'swap?': 'string | null',
	'swap_token?': 'string | null',
	'lendingVaultAddress?': 'string | null',
	'rootGauge?': 'string | null',
	'lpTokenPrice?': 'number | null',
	'virtualPrice?': 'string | number | null',
	'gaugeCrvApy?': 'number[] | null',
	'gaugeFutureCrvApy?': 'number[] | null',
	'gauge_data?': curveGaugeDataEnvelope.or('null'),
	'gauge_controller?': curveGaugeControllerEnvelope.or('null'),
	'gaugeStatus?': curveGaugeStatusFlagsEnvelope.or('null'),
})
export const curveAllGaugesEnvelope = arktype({
	success: 'true',
	data: 'Record<string, unknown>',
})

const curveGaugeScopeStatusEnvelope = arktype({
	scopeId: 'string',
	blockchainId: 'string',
	source: 'string',
	cacheKey: 'string',
	cacheStatus: 'string',
	isStale: 'boolean',
	generatedTimeMs: 'number',
	cachedAt: 'number',
	staleAt: 'number',
	expireAt: 'number',
	gaugeCount: 'number',
	missingRequiredGauges: 'string[]',
	missingRequiredGaugeCount: 'number',
	buildDurationMs: 'number',
	lastAttemptTimeMs: 'number',
	lastSuccessTimeMs: 'number | null',
	lastErrorTimeMs: 'number | null',
	lastError: 'string | null',
})
export const curveAllGaugesStatusEnvelope = arktype({
	success: 'true',
	data: {
		scopes: curveGaugeScopeStatusEnvelope.array(),
		staleScopes: curveGaugeScopeStatusEnvelope.array(),
		failedScopes: curveGaugeScopeStatusEnvelope.array(),
		scopesWithMissingRequiredGauges: curveGaugeScopeStatusEnvelope.array(),
	},
})

const curveLendingVaultAssetEnvelope = arktype({
	symbol: 'string',
	decimals: 'number',
	address: 'string',
	blockchainId: 'string',
	'usdPrice?': 'number | null',
})
const curveLendingVaultEnvelope = arktype({
	id: 'string',
	name: 'string',
	address: 'string',
	controllerAddress: 'string',
	ammAddress: 'string',
	monetaryPolicyAddress: 'string',
	blockchainId: 'string',
	registryId: 'string',
	'gaugeAddress?': 'string | null',
	'rates?': arktype({
		'borrowApr?': 'number | null',
		'borrowApy?': 'number | null',
		'borrowApyPcent?': 'number | null',
		'lendApr?': 'number | null',
		'lendApy?': 'number | null',
		'lendApyPcent?': 'number | null',
	}).or('null'),
	assets: {
		borrowed: curveLendingVaultAssetEnvelope,
		collateral: curveLendingVaultAssetEnvelope,
	},
	'vaultShares?': arktype({
		'pricePerShare?': 'number | null',
		'totalShares?': 'number | null',
	}).or('null'),
	'totalSupplied?': arktype({
		'total?': 'number | null',
		'usdTotal?': 'number | null',
	}).or('null'),
	'borrowed?': arktype({
		'total?': 'number | null',
		'usdTotal?': 'number | null',
	}).or('null'),
	'availableToBorrow?': arktype({
		'total?': 'number | null',
		'usdTotal?': 'number | null',
	}).or('null'),
	'usdTotal?': 'number | null',
})
export const curveLendingVaultsEnvelope = arktype({
	success: 'true',
	data: {
		lendingVaultData: curveLendingVaultEnvelope.array(),
		'tvl?': 'number',
	},
})

export type CurvePoolListItem = {
	blockchainId: string
	chainId: number
	registryId: string
	poolAddress: `0x${string}`
}

export type CurvePoolCoinSnapshot = {
	address: `0x${string}`
	symbol: string
	name: string
	decimals: string
	poolBalance?: string
	usdPrice?: number
	isBasePoolLpToken?: boolean
}

export type CurvePoolSnapshot = {
	blockchainId: string
	chainId: number
	registryId: string
	poolAddress: `0x${string}`
	name: string
	symbol: string
	lpTokenAddress: `0x${string}`
	coinAddresses: `0x${string}`[]
	coins: CurvePoolCoinSnapshot[]
	virtualPrice?: string
	amplificationCoefficient?: string
	totalSupply?: string
	usdTotal?: number
	isMetaPool?: boolean
	gaugeAddress?: `0x${string}`
	assetTypeName?: string
	creationBlockNumber?: number
	creationTs?: number
}

export type CurveGaugeSnapshot = {
	key: string
	blockchainId: string
	chainId: number
	gaugeAddress: `0x${string}`
	name: string
	shortName?: string
	isPool: boolean
	isFactory: boolean
	isSideChain: boolean
	isKilled: boolean
	hasNoCrv: boolean
	poolAddress?: `0x${string}`
	lpTokenAddress?: `0x${string}`
	lendingVaultAddress?: `0x${string}`
	rootGaugeAddress?: `0x${string}`
	type?: string
	gaugeType?: string
	workingSupply?: string
	inflationRate?: string
	gaugeRelativeWeight?: string
	gaugeFutureRelativeWeight?: string
	gaugeWeight?: string
	lpTokenPrice?: number
	gaugeCrvApy?: readonly [number, number]
	gaugeFutureCrvApy?: readonly [number, number]
	areCrvRewardsStuckInBridge?: boolean
	rewardsNeedNudging?: boolean
}

export type CurveGaugeScopeStatus = {
	scopeId: string
	blockchainId: string
	source: string
	cacheStatus: string
	isStale: boolean
	gaugeCount: number
	missingRequiredGaugeCount: number
	generatedTimeMs: number
	cachedAt: number
	staleAt: number
	expireAt: number
	lastSuccessTimeMs?: number
	lastErrorTimeMs?: number
	lastError?: string
}

export type CurveLendingVaultAssetSnapshot = {
	symbol: string
	decimals: number
	address: `0x${string}`
	blockchainId: string
	usdPrice?: number
}

export type CurveLendingVaultSnapshot = {
	id: string
	name: string
	blockchainId: string
	chainId: number
	registryId: string
	vaultAddress: `0x${string}`
	controllerAddress: `0x${string}`
	ammAddress: `0x${string}`
	monetaryPolicyAddress: `0x${string}`
	borrowedAsset: CurveLendingVaultAssetSnapshot
	collateralAsset: CurveLendingVaultAssetSnapshot
	gaugeAddress?: `0x${string}`
	borrowApr?: number
	borrowApy?: number
	borrowApyPcent?: number
	lendApr?: number
	lendApy?: number
	lendApyPcent?: number
	pricePerShare?: number
	totalShares?: number
	totalSupplied?: number
	totalSuppliedUsd?: number
	totalBorrowed?: number
	totalBorrowedUsd?: number
	availableToBorrow?: number
	availableToBorrowUsd?: number
	usdTotal?: number
}

export type CurvePoolVolumeWire = {
	address: string
	type: string
	volumeUSD: number
	latestDailyApyPcent?: number | null
	latestWeeklyApyPcent?: number | null
	includedApyPcentFromLsts?: number | null
	virtualPrice?: number | string | null
}

export type CurveVolumesResponse = {
	success: boolean
	data: {
		pools: CurvePoolVolumeWire[]
		totalVolumes?: number
	}
	generatedTimeMs?: number
}

export const curveVolumesEnvelope = arktype({
	success: 'true',
	data: {
		pools: arktype({
			address: 'string',
			type: 'string',
			volumeUSD: 'number',
			'latestDailyApyPcent?': 'number | null',
			'latestWeeklyApyPcent?': 'number | null',
			'includedApyPcentFromLsts?': 'number | null',
			'virtualPrice?': 'number | string | null',
		}).array(),
		'totalVolumes?': 'number',
	},
	'generatedTimeMs?': 'number',
})

export type CurvePoolVolumeSnapshot = {
	blockchainId: string
	chainId: number
	registryId: string
	poolAddress: `0x${string}`
	volumeUsd: number
	latestDailyApyPcent?: number
	latestWeeklyApyPcent?: number
	includedApyPcentFromLsts?: number
	virtualPrice?: string
}

import { type as arktype } from 'arktype'

type AaveChainWire = {
	chainId: number
	name: string
	icon?: string
}

type AaveAmountWire = {
	value: string
}

type AaveEmodeCategoryWire = {
	id: number
	label: string
	maxLTV: AaveAmountWire
	liquidationThreshold: AaveAmountWire
	liquidationPenalty: AaveAmountWire
}

export type AaveMarketWire = {
	name: string
	address: string
	icon: string
	totalMarketSize: string
	totalAvailableLiquidity: string
	chain: AaveChainWire
	/** Transport-only — not enrolled on `AaveMarket`. */
	eModeCategories?: AaveEmodeCategoryWire[]
}

type AaveTokenAmountWire = {
	amount: AaveAmountWire
	usd?: string
}

type AaveCurrencyWire = {
	address: string
	name: string
	symbol: string
	decimals: number
	imageUrl: string
	chainId: number
}

/**
 * Reserve wire from AaveKit `market { reserves { … } }`.
 * Enrolled projections use underlying / size / supply+borrow APY / liquidity / freeze flags
 * plus max LTV, liquidation threshold, and liquidation bonus.
 */
type AaveIsolationModeConfigWire = {
	canBeCollateral: boolean
	canBeBorrowed: boolean
	debtCeiling: AaveTokenAmountWire
	debtCeilingDecimals: number
	totalBorrows?: AaveTokenAmountWire
}

type AaveReserveWire = {
	underlyingToken: AaveCurrencyWire
	aToken?: AaveCurrencyWire
	vToken?: AaveCurrencyWire
	isFrozen: boolean
	isPaused: boolean
	flashLoanEnabled?: boolean
	permitSupported?: boolean
	isolationModeConfig?: AaveIsolationModeConfigWire | null
	usdExchangeRate?: string
	usdOracleAddress?: string
	/** Transport-only — not enrolled on `AaveReserve`. */
	interestRateStrategyAddress?: string
	/** Transport-only — not enrolled on `AaveReserve`. */
	unbacked?: AaveTokenAmountWire
	size: AaveTokenAmountWire
	supplyInfo: {
		apy: AaveAmountWire
		canBeCollateral?: boolean
		maxLTV?: AaveAmountWire
		liquidationThreshold?: AaveAmountWire
		liquidationBonus?: AaveAmountWire
		supplyCapReached?: boolean
		supplyCap?: AaveTokenAmountWire
	}
	borrowInfo?: {
		apy: AaveAmountWire
		availableLiquidity: AaveTokenAmountWire
		utilizationRate?: AaveAmountWire
		borrowCapReached?: boolean
		borrowCap?: AaveTokenAmountWire
		total?: AaveTokenAmountWire
		reserveFactor?: AaveAmountWire
		variableRateSlope1?: AaveAmountWire
		variableRateSlope2?: AaveAmountWire
		optimalUsageRate?: AaveAmountWire
	} | null
}

export type AaveMarketSnapshotWire = AaveMarketWire & {
	reserves: AaveReserveWire[]
}

export type AaveMarketsData = {
	markets?: AaveMarketWire[] | null
}

export type AaveMarketData = {
	market?: AaveMarketSnapshotWire | null
}

export type AaveUserSupplyPositionWire = {
	market: {
		address: string
		chain: {
			chainId: number
		}
	}
	currency: {
		address: string
		symbol: string
		decimals: number
		name?: string
		chainId: number
	}
	balance: {
		amount: {
			value: string
		}
		usd: string
	}
	apy: {
		value: string
	}
	isCollateral: boolean
	canBeCollateral: boolean
}

export type AaveUserBorrowPositionWire = {
	market: {
		address: string
		chain: {
			chainId: number
		}
	}
	currency: {
		address: string
		symbol: string
		decimals: number
		name?: string
		chainId: number
	}
	debt: {
		amount: {
			value: string
		}
		usd: string
	}
	apy: {
		value: string
	}
}

export type AaveAccountPositionsData = {
	userSupplies: AaveUserSupplyPositionWire[]
	userBorrows: AaveUserBorrowPositionWire[]
}

export type AaveUserMarketStateData = {
	userMarketState: {
		/** Null when the account has no borrow, including supply-only accounts. */
		healthFactor: string | null
		currentLiquidationThreshold: { value: string }
		ltv: { value: string }
		/** Amounts in the base currency used by the market's price feed. */
		totalCollateralBase: string
		totalDebtBase: string
		availableBorrowsBase: string
		netAPY: { value: string }
	}
}

export type AaveAccountSupplyPosition = {
	protocol: 'Aave V3'
	kind: 'supply'
	chainId: number
	account: `0x${string}`
	poolAddress: `0x${string}`
	underlyingTokenAddress: `0x${string}`
	symbol: string
	decimals: number
	name?: string
	balance: string
	balanceUsd: string
	apy: string
	isCollateral: boolean
	/** Transport-only — not enrolled on `AaveReservePosition` (do not freestyle). */
	canBeCollateral: boolean
}

export type AaveAccountBorrowPosition = {
	protocol: 'Aave V3'
	kind: 'borrow'
	chainId: number
	account: `0x${string}`
	poolAddress: `0x${string}`
	underlyingTokenAddress: `0x${string}`
	symbol: string
	decimals: number
	name?: string
	debt: string
	debtUsd: string
	apy: string
}

export type AaveAccountPosition =
	| AaveAccountSupplyPosition
	| AaveAccountBorrowPosition

const aaveAmountEnvelope = arktype({
	value: 'string',
})

export const aaveUserMarketStateEnvelope = arktype({
	healthFactor: arktype('string').or(arktype.null),
	currentLiquidationThreshold: aaveAmountEnvelope,
	ltv: aaveAmountEnvelope,
	totalCollateralBase: 'string',
	totalDebtBase: 'string',
	availableBorrowsBase: 'string',
	netAPY: aaveAmountEnvelope,
})

const aaveTokenAmountEnvelope = arktype({
	amount: aaveAmountEnvelope,
	'usd?': 'string',
})

const aaveCurrencyEnvelope = arktype({
	address: 'string',
	name: 'string',
	symbol: 'string',
	decimals: 'number.integer >= 0',
	imageUrl: 'string',
	chainId: 'number',
})

const aaveMarketSummaryEnvelope = arktype({
	name: 'string',
	address: 'string',
	icon: 'string',
	totalMarketSize: 'string',
	totalAvailableLiquidity: 'string',
	chain: {
		chainId: 'number',
		name: 'string',
		'icon?': 'string',
	},
})

const aaveEmodeCategoryEnvelope = arktype({
	id: 'number.integer >= 0',
	label: 'string',
	maxLTV: aaveAmountEnvelope,
	liquidationThreshold: aaveAmountEnvelope,
	liquidationPenalty: aaveAmountEnvelope,
})

export const aaveMarketEnvelope = aaveMarketSummaryEnvelope.and({
	'eModeCategories?': aaveEmodeCategoryEnvelope.array(),
	reserves: arktype({
		underlyingToken: aaveCurrencyEnvelope,
		'aToken?': aaveCurrencyEnvelope,
		'vToken?': aaveCurrencyEnvelope,
		isFrozen: 'boolean',
		isPaused: 'boolean',
		'flashLoanEnabled?': 'boolean',
		'permitSupported?': 'boolean',
		'isolationModeConfig?': arktype({
			canBeCollateral: 'boolean',
			canBeBorrowed: 'boolean',
			debtCeiling: aaveTokenAmountEnvelope,
			debtCeilingDecimals: 'number.integer >= 0',
			'totalBorrows?': aaveTokenAmountEnvelope,
		}).or(arktype.null),
		'usdExchangeRate?': 'string',
		'usdOracleAddress?': 'string',
		'interestRateStrategyAddress?': 'string',
		'unbacked?': aaveTokenAmountEnvelope,
		size: aaveTokenAmountEnvelope,
		supplyInfo: {
			apy: aaveAmountEnvelope,
			'canBeCollateral?': 'boolean',
			'maxLTV?': aaveAmountEnvelope,
			'liquidationThreshold?': aaveAmountEnvelope,
			'liquidationBonus?': aaveAmountEnvelope,
			'supplyCapReached?': 'boolean',
			'supplyCap?': aaveTokenAmountEnvelope,
		},
		'borrowInfo?': arktype({
			apy: aaveAmountEnvelope,
			availableLiquidity: aaveTokenAmountEnvelope,
			'utilizationRate?': aaveAmountEnvelope,
			'borrowCapReached?': 'boolean',
			'borrowCap?': aaveTokenAmountEnvelope,
			'total?': aaveTokenAmountEnvelope,
			'reserveFactor?': aaveAmountEnvelope,
			'variableRateSlope1?': aaveAmountEnvelope,
			'variableRateSlope2?': aaveAmountEnvelope,
			'optimalUsageRate?': aaveAmountEnvelope,
		}).or(arktype.null),
	}).array(),
})
export const aaveMarketsEnvelope = aaveMarketSummaryEnvelope.array()

const aaveAccountPositionMarketWire = arktype({
	address: 'string',
	chain: {
		chainId: 'number',
	},
})

const aaveAccountPositionCurrencyWire = arktype({
	address: 'string',
	symbol: 'string',
	decimals: 'number.integer >= 0',
	'name?': 'string',
	chainId: 'number',
})

export const aaveUserSupplyPositionEnvelope = arktype({
	market: aaveAccountPositionMarketWire,
	currency: aaveAccountPositionCurrencyWire,
	balance: {
		amount: {
			value: 'string',
		},
		usd: 'string',
	},
	apy: {
		value: 'string',
	},
	isCollateral: 'boolean',
	canBeCollateral: 'boolean',
})

export const aaveUserBorrowPositionEnvelope = arktype({
	market: aaveAccountPositionMarketWire,
	currency: aaveAccountPositionCurrencyWire,
	debt: {
		amount: {
			value: 'string',
		},
		usd: 'string',
	},
	apy: {
		value: 'string',
	},
})

export const aaveAccountPositionsEnvelope = arktype({
	userSupplies: aaveUserSupplyPositionEnvelope.array(),
	userBorrows: aaveUserBorrowPositionEnvelope.array(),
})

import type { JsonValue } from '$/typescript/JsonValue.ts'

export type HyperliquidMeta = {
	universe: {
		name: string
		szDecimals: number
		maxLeverage: number
		marginTableId?: number
		onlyIsolated?: boolean
		isDelisted?: boolean
		marginMode?: 'strictIsolated' | 'noCross'
	}[]
	marginTables?: [
		number,
		{
			description: string
			marginTiers: {
				lowerBound: string
				maxLeverage: number
			}[]
		},
	][]
	collateralToken?: number
}

export type HyperliquidAssetCtx = {
	funding: string
	openInterest: string
	prevDayPx: string
	dayNtlVlm: string
	premium: string | null
	oraclePx: string
	markPx: string
	midPx: string | null
	impactPxs: [
		string,
		string,
	] | null
	dayBaseVlm?: string
}

export type HyperliquidMetaAndAssetCtxs = [
	HyperliquidMeta,
	HyperliquidAssetCtx[],
]

export type HyperliquidSpotMeta = {
	tokens: {
		name: string
		szDecimals: number
		weiDecimals: number
		index: number
		tokenId?: string
		isCanonical?: boolean
		fullName?: string | null
		deployerTradingFeeShare?: string
		evmContract?: {
			address: string
			evm_extra_wei_decimals: number
		} | null
	}[]
	universe: {
		name: string
		tokens: [number, number]
		index: number
		isCanonical?: boolean
	}[]
}

export type HyperliquidClearinghouseState = {
	marginSummary: {
		accountValue: string
		totalNtlPos: string
		totalRawUsd: string
		totalMarginUsed: string
	}
	crossMarginSummary: {
		accountValue: string
		totalNtlPos: string
		totalRawUsd: string
		totalMarginUsed: string
	}
	assetPositions: {
		type: string
		position: {
			coin: string
			szi: string
			entryPx?: string | null
			positionValue: string
			unrealizedPnl: string
			returnOnEquity: string
			liquidationPx?: string | null
			marginUsed: string
			maxLeverage: number
			cumFunding: {
				allTime: string
				sinceChange: string
				sinceOpen: string
			}
			leverage: JsonValue
		}
	}[]
	withdrawable: string
	crossMaintenanceMarginUsed: string
	time: number
}

export type HyperliquidSpotClearinghouseState = {
	balances: {
		coin: string
		token: number
		total: string
		hold: string
		entryNtl: string
	}[]
}

export type HyperliquidFrontendOrder = {
	coin: string
	side: string
	limitPx: string
	sz: string
	oid: number
	timestamp: number
	triggerCondition: string
	isTrigger: boolean
	triggerPx: string
	children: JsonValue[]
	isPositionTpsl: boolean
	reduceOnly: boolean
	orderType: string
	origSz: string
	tif?: string
	cloid?: string | null
}

export type HyperliquidHistoricalOrder = {
	order: HyperliquidFrontendOrder
	status: string
	statusTimestamp: number
}

export type HyperliquidFill = {
	closedPnl: string
	coin: string
	crossed: boolean
	dir: string
	hash: string
	oid: number
	px: string
	side: string
	startPosition: string
	sz: string
	time: number
	fee: string
	feeToken: string
	tid: number
	builderFee?: string
	twapId?: number | null
}

export type HyperliquidUserVaultEquity = {
	vaultAddress: string
	equity: string
}

export type HyperliquidUserRole = (
	| {
		role: 'agent'
		data: {
			user: string
		}
	}
	| {
		role: 'subAccount'
		data: {
			master: string
		}
	}
	| {
		role: 'user' | 'vault' | 'missing'
	}
)

export type HyperliquidValidatorSummary = {
	validator: string
	signer: string
	name: string
	description: string
	nRecentBlocks: number
	stake: number
	isJailed: boolean
	isActive: boolean
	commission: string
}

export type HyperliquidL2Book = {
	coin: string
	time: number
	levels: [
		{
			px: string
			sz: string
			n: number
		}[],
		{
			px: string
			sz: string
			n: number
		}[],
	]
}

export type HyperliquidCandle = {
	t: number
	T: number
	s: string
	i: string
	o: string
	c: string
	h: string
	l: string
	v: string
	n: number
}

export type HyperliquidVaultFollower = {
	user: string
	vaultEquity: string
	pnl: string
	allTimePnl: string
	daysFollowing: number
	vaultEntryTime: number
	lockupUntil: number
}

export type HyperliquidPortfolioWindow = {
	accountValueHistory: [
		timestampMs: number,
		accountValue: string,
	][]
	pnlHistory: [
		timestampMs: number,
		pnl: string,
	][]
	vlm: string
}

export type HyperliquidPortfolio = [
	window: string,
	state: HyperliquidPortfolioWindow,
][]

export type HyperliquidVaultRelationship = (
	| {
		type: 'parent'
		data: {
			childAddresses: string[]
		}
	}
	| {
		type: 'child'
		data: {
			parentAddress?: string
		}
	}
	| {
		type: 'normal'
	}
	| null
)

export type HyperliquidVaultDetails = {
	name: string
	vaultAddress: string
	leader: string
	description: string
	portfolio: HyperliquidPortfolio
	apr: number
	followerState: HyperliquidVaultFollower | null
	leaderFraction: number
	leaderCommission: number
	followers: HyperliquidVaultFollower[]
	maxDistributable: number
	maxWithdrawable: number
	isClosed: boolean
	relationship: HyperliquidVaultRelationship
	allowDeposits: boolean
	alwaysCloseOnWithdraw: boolean
}

export type HyperliquidUserFees = {
	dailyUserVlm: JsonValue[]
	feeSchedule: JsonValue
	userCrossRate: string
	userAddRate: string
	userSpotCrossRate: string
	userSpotAddRate: string
	activeReferralDiscount: string
	trial: JsonValue
	feeTrialReward: string
	nextTrialAvailableTimestamp: number | null
	stakingLink: JsonValue
	activeStakingDiscount: JsonValue
}

export type HyperliquidDelegatorSummary = {
	delegated: string
	undelegated: string
	totalPendingWithdrawal: string
	nPendingWithdrawals: number
}

export type HyperliquidUserAbstraction = (
	| 'unifiedAccount'
	| 'portfolioMargin'
	| 'disabled'
	| 'default'
	| 'dexAbstraction'
)

export type HyperliquidBorrowLendPositionState = {
	borrow: {
		basis: string
		value: string
	}
	supply: {
		basis: string
		value: string
	}
}

export type HyperliquidBorrowLendUserState = {
	tokenToState: [
		tokenIndex: number,
		state: HyperliquidBorrowLendPositionState,
	][]
	health: string
	healthFactor: string | null
}

export type HyperliquidBorrowLendReserveState = {
	borrowYearlyRate: string
	supplyYearlyRate: string
	balance: string
	utilization: string
	oraclePx: string
	ltv: string
	totalSupplied: string
	totalBorrowed: string
}

export type HyperliquidBorrowLendReserveStateRow = [
	tokenIndex: number,
	state: HyperliquidBorrowLendReserveState,
]

export type HyperliquidVaultSummary = {
	name: string
	vaultAddress: string
	leader: string
	tvl: string
	isClosed: boolean
	createTimeMillis: number
	relationship: HyperliquidVaultRelationship
}

export type HyperliquidOrderStatus = (
	| {
		status: 'order'
		order: HyperliquidHistoricalOrder
	}
	| {
		status: 'unknownOid' | 'unknownCloid' | string
	}
)

export type HyperliquidOpenOrder = {
	coin: string
	limitPx: string
	oid: number
	side: string
	sz: string
	timestamp: number
}

export type HyperliquidAllMids = Record<string, string>

export type HyperliquidPredictedFundingVenue = {
	fundingRate: string
	nextFundingTime: number
	fundingIntervalHours: number
}

export type HyperliquidPredictedFunding = [
	coin: string,
	venues: [
		venue: string,
		state: HyperliquidPredictedFundingVenue,
	][],
]

export type HyperliquidFundingHistoryRow = {
	coin: string
	fundingRate: string
	premium: string
	time: number
}

export type HyperliquidSpotAssetCtx = {
	prevDayPx: string
	dayNtlVlm: string
	markPx: string
	midPx: string | null
	circulatingSupply: string
	coin: string
	totalSupply: string
	dayBaseVlm?: string
}

export type HyperliquidSpotMetaAndAssetCtxs = [
	HyperliquidSpotMeta,
	HyperliquidSpotAssetCtx[],
]

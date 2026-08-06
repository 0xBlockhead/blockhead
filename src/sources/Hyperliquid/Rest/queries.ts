import { type as arktype } from 'arktype'
import { throwHttpError } from '$/lib/http.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	HyperliquidBorrowLendReserveStateRow,
	HyperliquidBorrowLendUserState,
	HyperliquidCandle,
	HyperliquidClearinghouseState,
	HyperliquidDelegatorSummary,
	HyperliquidFill,
	HyperliquidFrontendOrder,
	HyperliquidHistoricalOrder,
	HyperliquidL2Book,
	HyperliquidMeta,
	HyperliquidMetaAndAssetCtxs,
	HyperliquidOrderStatus,
	HyperliquidSpotClearinghouseState,
	HyperliquidSpotMeta,
	HyperliquidUserAbstraction,
	HyperliquidUserFees,
	HyperliquidUserRole,
	HyperliquidUserVaultEquity,
	HyperliquidValidatorSummary,
	HyperliquidVaultDetails,
	HyperliquidVaultSummary,
} from '$/sources/Hyperliquid/Rest/types.ts'
import { hyperliquidCandleIntervals } from '$/sources/Hyperliquid/Rest/constants.ts'
import bindings from '$/sources/Hyperliquid/bindings.ts'

const binding = bindings[Source.Hyperliquid].find(
	({ apiFamily }) => apiFamily === ApiFamily.RestJson
)

if (binding == null)
	throw new Error('Hyperliquid_Rest: Info binding is missing')

const hyperliquidPerpMarketEnvelope = arktype({
	name: 'string',
	szDecimals: 'number',
	maxLeverage: 'number',
	'marginTableId?': 'number',
	'onlyIsolated?': 'boolean',
	'isDelisted?': 'boolean',
	'marginMode?': "'strictIsolated' | 'noCross'",
})
const hyperliquidMetaEnvelope = arktype({
	universe: hyperliquidPerpMarketEnvelope.array(),
	'marginTables?': arktype([
		'number',
		{
			description: 'string',
			marginTiers: arktype({
				lowerBound: 'string',
				maxLeverage: 'number',
			}).array(),
		},
	]).array(),
	'collateralToken?': 'number',
})
const hyperliquidAssetCtxEnvelope = arktype({
	funding: 'string',
	openInterest: 'string',
	prevDayPx: 'string',
	dayNtlVlm: 'string',
	premium: 'string | null',
	oraclePx: 'string',
	markPx: 'string',
	midPx: 'string | null',
	impactPxs: arktype([
		'string',
		'string',
	]).or(arktype.null),
	'dayBaseVlm?': 'string',
})
const hyperliquidSpotMetaEnvelope = arktype({
	tokens: arktype({
		name: 'string',
		szDecimals: 'number',
		weiDecimals: 'number',
		index: 'number',
		'tokenId?': 'string',
		'isCanonical?': 'boolean',
		'fullName?': 'string | null',
		'deployerTradingFeeShare?': 'string',
		'evmContract?': arktype({
			address: 'string',
			evm_extra_wei_decimals: 'number',
		}).or(arktype.null),
	}).array(),
	universe: arktype({
		name: 'string',
		tokens: [
			'number',
			'number',
		],
		index: 'number',
		'isCanonical?': 'boolean',
	}).array(),
})
const hyperliquidValidatorSummaryEnvelope = arktype({
	validator: 'string',
	signer: 'string',
	name: 'string',
	description: 'string',
	nRecentBlocks: 'number',
	stake: 'number',
	isJailed: 'boolean',
	isActive: 'boolean',
	commission: 'string',
})
const hyperliquidVaultDetailsEnvelope = arktype({
	name: 'string',
	vaultAddress: 'string',
	leader: 'string',
	description: 'string',
	portfolio: 'unknown',
	apr: 'number',
	followerState: 'unknown',
	leaderFraction: 'number',
	leaderCommission: 'number',
	followers: arktype({
		user: 'string',
		vaultEquity: 'string',
		pnl: 'string',
		allTimePnl: 'string',
		daysFollowing: 'number',
		vaultEntryTime: 'number',
		lockupUntil: 'number',
	}).array(),
	maxDistributable: 'number',
	maxWithdrawable: 'number',
	isClosed: 'boolean',
	relationship: 'object | null',
	allowDeposits: 'boolean',
	alwaysCloseOnWithdraw: 'boolean',
})
const hyperliquidVaultSummaryEnvelope = arktype({
	name: 'string',
	vaultAddress: 'string',
	leader: 'string',
	tvl: 'string',
	isClosed: 'boolean',
	createTimeMillis: 'number',
	relationship: 'object | null',
})
const hyperliquidBorrowLendReserveStateEnvelope = arktype({
	borrowYearlyRate: 'string',
	supplyYearlyRate: 'string',
	balance: 'string',
	utilization: 'string',
	oraclePx: 'string',
	ltv: 'string',
	totalSupplied: 'string',
	totalBorrowed: 'string',
})
const hyperliquidBorrowLendReserveStateRowEnvelope = arktype([
	'number',
	hyperliquidBorrowLendReserveStateEnvelope,
])
const hyperliquidBorrowLendPositionStateEnvelope = arktype({
	borrow: {
		basis: 'string',
		value: 'string',
	},
	supply: {
		basis: 'string',
		value: 'string',
	},
})
const hyperliquidBorrowLendUserStateEnvelope = arktype({
	tokenToState: arktype([
		'number',
		hyperliquidBorrowLendPositionStateEnvelope,
	]).array(),
	health: 'string',
	healthFactor: 'string | null',
})
const hyperliquidMarginSummaryEnvelope = arktype({
	accountValue: 'string',
	totalNtlPos: 'string',
	totalRawUsd: 'string',
	totalMarginUsed: 'string',
})
const hyperliquidClearinghouseStateEnvelope = arktype({
	marginSummary: hyperliquidMarginSummaryEnvelope,
	crossMarginSummary: hyperliquidMarginSummaryEnvelope,
	assetPositions: arktype({
		type: 'string',
		position: {
			coin: 'string',
			szi: 'string',
			'entryPx?': 'string | null',
			positionValue: 'string',
			unrealizedPnl: 'string',
			returnOnEquity: 'string',
			'liquidationPx?': 'string | null',
			marginUsed: 'string',
			maxLeverage: 'number',
			cumFunding: {
				allTime: 'string',
				sinceChange: 'string',
				sinceOpen: 'string',
			},
			leverage: 'unknown',
		},
	}).array(),
	withdrawable: 'string',
	crossMaintenanceMarginUsed: 'string',
	time: 'number',
})
const hyperliquidSpotClearinghouseStateEnvelope = arktype({
	balances: arktype({
		coin: 'string',
		token: 'number',
		total: 'string',
		hold: 'string',
		entryNtl: 'string',
	}).array(),
})
const hyperliquidFrontendOrderEnvelope = arktype({
	coin: 'string',
	side: 'string',
	limitPx: 'string',
	sz: 'string',
	oid: 'number',
	timestamp: 'number',
	triggerCondition: 'string',
	isTrigger: 'boolean',
	triggerPx: 'string',
	children: 'unknown[]',
	isPositionTpsl: 'boolean',
	reduceOnly: 'boolean',
	orderType: 'string',
	origSz: 'string',
	'tif?': 'string',
	'cloid?': 'string | null',
})
const hyperliquidHistoricalOrderEnvelope = arktype({
	order: hyperliquidFrontendOrderEnvelope,
	status: 'string',
	statusTimestamp: 'number',
})
const hyperliquidFillEnvelope = arktype({
	closedPnl: 'string',
	coin: 'string',
	crossed: 'boolean',
	dir: 'string',
	hash: 'string',
	oid: 'number',
	px: 'string',
	side: 'string',
	startPosition: 'string',
	sz: 'string',
	time: 'number',
	fee: 'string',
	feeToken: 'string',
	tid: 'number',
	'builderFee?': 'string',
	'twapId?': 'number | null',
})
const hyperliquidUserVaultEquityEnvelope = arktype({
	vaultAddress: 'string',
	equity: 'string',
})
const hyperliquidUserFeesEnvelope = arktype({
	dailyUserVlm: 'unknown[]',
	feeSchedule: 'unknown',
	userCrossRate: 'string',
	userAddRate: 'string',
	userSpotCrossRate: 'string',
	userSpotAddRate: 'string',
	activeReferralDiscount: 'string',
	trial: 'unknown',
	feeTrialReward: 'string',
	nextTrialAvailableTimestamp: 'number | null',
	stakingLink: 'unknown',
	activeStakingDiscount: 'unknown',
})
const hyperliquidDelegatorSummaryEnvelope = arktype({
	delegated: 'string',
	undelegated: 'string',
	totalPendingWithdrawal: 'string',
	nPendingWithdrawals: 'number',
})
const hyperliquidUserAbstractionEnvelope = arktype(
	"'unifiedAccount' | 'portfolioMargin' | 'disabled' | 'default' | 'dexAbstraction'"
)
const hyperliquidL2BookEnvelope = arktype({
	coin: 'string',
	time: 'number',
	levels: [
		arktype({
			px: 'string',
			sz: 'string',
			n: 'number',
		}).array(),
		arktype({
			px: 'string',
			sz: 'string',
			n: 'number',
		}).array(),
	],
})
const hyperliquidCandleEnvelope = arktype({
	t: 'number',
	T: 'number',
	s: 'string',
	i: 'string',
	o: 'string',
	c: 'string',
	h: 'string',
	l: 'string',
	v: 'string',
	n: 'number',
})
const hyperliquidOrderStatusEnvelope = arktype({
	status: 'string',
	'order?': hyperliquidHistoricalOrderEnvelope,
})

export const hyperliquidRestEndpoints = binding.endpoints.map((endpoint) => ({
	url: endpoint.locator,
	transportType: TransportType.Http,
	providerName: 'Hyperliquid',
}))

const info = async <_Result>({
	body,
}: {
	body: JsonValue
}) => {
	const response = await sourceFetch(
		binding,
		firstHttpUrlForBinding(binding),
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(body),
		}
	)
	if (!response.ok) await throwHttpError('Hyperliquid_Rest', response)
	return response.json<_Result>()
}

export const getMeta = () => (
	info<HyperliquidMeta>({
		body: {
			type: 'meta',
		},
	})
)

/**
 * https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint/perpetuals
 */
export const getMetaAndAssetCtxs = async () => {
	const snapshot = await info<HyperliquidMetaAndAssetCtxs>({
		body: {
			type: 'metaAndAssetCtxs',
		},
	})
	if (
		snapshot.length !== 2
		|| !hyperliquidMetaEnvelope.allows(snapshot[0])
		|| !hyperliquidAssetCtxEnvelope.array().allows(snapshot[1])
	)
		throw new Error('Hyperliquid_Rest: invalid metaAndAssetCtxs response envelope')

	return snapshot
}

export const getSpotMeta = async () => {
	const spotMeta = await info<HyperliquidSpotMeta>({
		body: {
			type: 'spotMeta',
		},
	})
	if (!hyperliquidSpotMetaEnvelope.allows(spotMeta))
		throw new Error('Hyperliquid_Rest: invalid spotMeta response envelope')

	return spotMeta
}

export const getClearinghouseState = async ({
	user,
}: {
	user: string
}) => {
	const state = await info<HyperliquidClearinghouseState>({
		body: {
			type: 'clearinghouseState',
			user,
		},
	})
	if (!hyperliquidClearinghouseStateEnvelope.allows(state))
		throw new Error('Hyperliquid_Rest: invalid clearinghouseState response envelope')

	return state
}

export const getSpotClearinghouseState = async ({
	user,
}: {
	user: string
}) => {
	const state = await info<HyperliquidSpotClearinghouseState>({
		body: {
			type: 'spotClearinghouseState',
			user,
		},
	})
	if (!hyperliquidSpotClearinghouseStateEnvelope.allows(state))
		throw new Error('Hyperliquid_Rest: invalid spotClearinghouseState response envelope')

	return state
}

export const getHistoricalOrders = async ({
	user,
}: {
	user: string
}) => {
	const orders = await info<HyperliquidHistoricalOrder[]>({
		body: {
			type: 'historicalOrders',
			user,
		},
	})
	if (!hyperliquidHistoricalOrderEnvelope.array().allows(orders))
		throw new Error('Hyperliquid_Rest: invalid historicalOrders response envelope')

	return orders
}

export const getUserFillsByTime = async ({
	user,
	startTime,
	endTime,
}: {
	user: string
	startTime: number
	endTime?: number
}) => {
	if (!Number.isSafeInteger(startTime) || startTime < 0)
		throw new Error(`Hyperliquid_Rest: invalid fill start time ${startTime}`)

	if (endTime != null && (!Number.isSafeInteger(endTime) || endTime < startTime))
		throw new Error(`Hyperliquid_Rest: invalid fill end time ${endTime}`)

	const fills = await info<HyperliquidFill[]>({
		body: {
			type: 'userFillsByTime',
			user,
			startTime,
			...(endTime != null && { endTime }),
			aggregateByTime: false,
		},
	})
	if (!hyperliquidFillEnvelope.array().allows(fills))
		throw new Error('Hyperliquid_Rest: invalid userFillsByTime response envelope')

	return fills
}

export const getUserVaultEquities = async ({
	user,
}: {
	user: string
}) => {
	const equities = await info<HyperliquidUserVaultEquity[]>({
		body: {
			type: 'userVaultEquities',
			user,
		},
	})
	if (!hyperliquidUserVaultEquityEnvelope.array().allows(equities))
		throw new Error('Hyperliquid_Rest: invalid userVaultEquities response envelope')

	return equities
}

export const getUserRole = ({
	user,
}: {
	user: string
}) => (
	info<HyperliquidUserRole>({
		body: {
			type: 'userRole',
			user,
		},
	})
)

export const getValidatorSummaries = async () => {
	const validators = await info<HyperliquidValidatorSummary[]>({
		body: {
			type: 'validatorSummaries',
		},
	})
	if (!hyperliquidValidatorSummaryEnvelope.array().allows(validators))
		throw new Error('Hyperliquid_Rest: invalid validatorSummaries response envelope')

	return validators
}

export const getL2Book = async ({
	coin,
	nSigFigs,
	mantissa,
}: {
	coin: string
	nSigFigs?: 2 | 3 | 4 | 5
	mantissa?: 1 | 2 | 5
}) => {
	if (coin === '')
		throw new Error('Hyperliquid_Rest: invalid book coin')

	if (nSigFigs != null && nSigFigs !== 2 && nSigFigs !== 3 && nSigFigs !== 4 && nSigFigs !== 5)
		throw new Error(`Hyperliquid_Rest: invalid book nSigFigs ${String(nSigFigs)}`)

	if (mantissa != null && nSigFigs !== 5)
		throw new Error('Hyperliquid_Rest: book mantissa requires nSigFigs 5')

	if (mantissa != null && mantissa !== 1 && mantissa !== 2 && mantissa !== 5)
		throw new Error(`Hyperliquid_Rest: invalid book mantissa ${String(mantissa)}`)

	const book = await info<HyperliquidL2Book>({
		body: {
			type: 'l2Book',
			coin,
			...(nSigFigs != null && { nSigFigs }),
			...(mantissa != null && { mantissa }),
		},
	})
	if (!hyperliquidL2BookEnvelope.allows(book))
		throw new Error('Hyperliquid_Rest: invalid l2Book response envelope')

	return book
}

export const getCandleSnapshot = async ({
	coin,
	interval,
	startTime,
	endTime,
}: {
	coin: string
	interval: string
	startTime: number
	endTime?: number
}) => {
	if (coin === '')
		throw new Error('Hyperliquid_Rest: invalid candle coin')

	if (!hyperliquidCandleIntervals.some((candleInterval) => candleInterval === interval))
		throw new Error(`Hyperliquid_Rest: invalid candle interval ${interval}`)

	if (!Number.isSafeInteger(startTime) || startTime < 0)
		throw new Error(`Hyperliquid_Rest: invalid candle start time ${startTime}`)

	if (endTime != null && (!Number.isSafeInteger(endTime) || endTime < startTime))
		throw new Error(`Hyperliquid_Rest: invalid candle end time ${endTime}`)

	const candles = await info<HyperliquidCandle[]>({
		body: {
			type: 'candleSnapshot',
			req: {
				coin,
				interval,
				startTime,
				...(endTime != null && { endTime }),
			},
		},
	})
	if (!hyperliquidCandleEnvelope.array().allows(candles))
		throw new Error('Hyperliquid_Rest: invalid candleSnapshot response envelope')

	return candles
}

export const getVaultDetails = async ({
	vaultAddress,
	user,
}: {
	vaultAddress: string
	user?: string
}) => {
	if (!/^0x[0-9a-fA-F]{40}$/.test(vaultAddress))
		throw new Error(`Hyperliquid_Rest: invalid vault address ${vaultAddress}`)

	if (user != null && !/^0x[0-9a-fA-F]{40}$/.test(user))
		throw new Error(`Hyperliquid_Rest: invalid vault user ${user}`)

	const vault = await info<HyperliquidVaultDetails | null>({
		body: {
			type: 'vaultDetails',
			vaultAddress,
			...(user != null && { user }),
		},
	})
	if (vault != null && !hyperliquidVaultDetailsEnvelope.allows(vault))
		throw new Error('Hyperliquid_Rest: invalid vaultDetails response envelope')

	return vault
}

export const getUserFees = async ({
	user,
}: {
	user: string
}) => {
	const fees = await info<HyperliquidUserFees>({
		body: {
			type: 'userFees',
			user,
		},
	})
	if (!hyperliquidUserFeesEnvelope.allows(fees))
		throw new Error('Hyperliquid_Rest: invalid userFees response envelope')

	return fees
}

export const getDelegatorSummary = async ({
	user,
}: {
	user: string
}) => {
	const summary = await info<HyperliquidDelegatorSummary>({
		body: {
			type: 'delegatorSummary',
			user,
		},
	})
	if (!hyperliquidDelegatorSummaryEnvelope.allows(summary))
		throw new Error('Hyperliquid_Rest: invalid delegatorSummary response envelope')

	return summary
}

export const getUserAbstraction = async ({
	user,
}: {
	user: string
}) => {
	const abstraction = await info<HyperliquidUserAbstraction>({
		body: {
			type: 'userAbstraction',
			user,
		},
	})
	if (!hyperliquidUserAbstractionEnvelope.allows(abstraction))
		throw new Error('Hyperliquid_Rest: invalid userAbstraction response envelope')

	return abstraction
}

export const getUserDexAbstraction = ({
	user,
}: {
	user: string
}) => (
	info<boolean>({
		body: {
			type: 'userDexAbstraction',
			user,
		},
	})
)

export const getApprovedBuilders = async ({
	user,
}: {
	user: string
}) => {
	const builders = await info<string[]>({
		body: {
			type: 'approvedBuilders',
			user,
		},
	})
	if (!arktype('string[]').allows(builders))
		throw new Error('Hyperliquid_Rest: invalid approvedBuilders response envelope')

	return builders
}

export const getBorrowLendUserState = async ({
	user,
}: {
	user: string
}) => {
	const state = await info<HyperliquidBorrowLendUserState>({
		body: {
			type: 'borrowLendUserState',
			user,
		},
	})
	if (!hyperliquidBorrowLendUserStateEnvelope.allows(state))
		throw new Error('Hyperliquid_Rest: invalid borrowLendUserState response envelope')

	for (const [tokenIndex] of state.tokenToState) {
		if (!Number.isSafeInteger(tokenIndex) || tokenIndex < 0)
			throw new Error(`Hyperliquid_Rest: invalid borrow/lend position token index ${String(tokenIndex)}`)
	}

	return state
}

export const getAllBorrowLendReserveStates = async () => {
	const reserves = await info<HyperliquidBorrowLendReserveStateRow[]>({
		body: {
			type: 'allBorrowLendReserveStates',
		},
	})
	if (!hyperliquidBorrowLendReserveStateRowEnvelope.array().allows(reserves))
		throw new Error('Hyperliquid_Rest: invalid allBorrowLendReserveStates response envelope')

	for (const [tokenIndex] of reserves) {
		if (!Number.isSafeInteger(tokenIndex) || tokenIndex < 0)
			throw new Error(`Hyperliquid_Rest: invalid borrow/lend reserve token index ${String(tokenIndex)}`)
	}

	return reserves
}

export const getVaultSummaries = async () => {
	const vaults = await info<HyperliquidVaultSummary[]>({
		body: {
			type: 'vaultSummaries',
		},
	})
	if (!hyperliquidVaultSummaryEnvelope.array().allows(vaults))
		throw new Error('Hyperliquid_Rest: invalid vaultSummaries response envelope')

	return vaults
}

export const getFrontendOpenOrders = async ({
	user,
}: {
	user: string
}) => {
	const orders = await info<HyperliquidFrontendOrder[]>({
		body: {
			type: 'frontendOpenOrders',
			user,
		},
	})
	if (!hyperliquidFrontendOrderEnvelope.array().allows(orders))
		throw new Error('Hyperliquid_Rest: invalid frontendOpenOrders response envelope')

	return orders
}

export const getOrderStatus = async ({
	user,
	oid,
}: {
	user: string
	oid: number | string
}) => {
	if (!/^0x[0-9a-fA-F]{40}$/.test(user))
		throw new Error(`Hyperliquid_Rest: invalid account address ${user}`)

	if (
		typeof oid === 'number' ?
			!Number.isSafeInteger(oid) || oid < 0
		:
			!/^[0-9a-fA-F]{32}$/.test(oid)
	)
		throw new Error(`Hyperliquid_Rest: invalid order id ${String(oid)}`)

	const status = await info<HyperliquidOrderStatus>({
		body: {
			type: 'orderStatus',
			user,
			oid,
		},
	})
	if (!hyperliquidOrderStatusEnvelope.allows(status))
		throw new Error('Hyperliquid_Rest: invalid orderStatus response envelope')

	return status
}

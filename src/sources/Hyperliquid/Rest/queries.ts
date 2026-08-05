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
	HyperliquidBorrowLendUserState,
	HyperliquidCandle,
	HyperliquidClearinghouseState,
	HyperliquidDelegatorSummary,
	HyperliquidFill,
	HyperliquidHistoricalOrder,
	HyperliquidL2Book,
	HyperliquidMeta,
	HyperliquidMetaAndAssetCtxs,
	HyperliquidSpotClearinghouseState,
	HyperliquidSpotMeta,
	HyperliquidUserAbstraction,
	HyperliquidUserFees,
	HyperliquidUserRole,
	HyperliquidUserVaultEquity,
	HyperliquidValidatorSummary,
	HyperliquidVaultDetails,
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
	'onlyIsolated?': 'boolean',
})
const hyperliquidMetaEnvelope = arktype({
	universe: hyperliquidPerpMarketEnvelope.array(),
})
const hyperliquidMetaAndAssetCtxsEnvelope = arktype('unknown[]')
const hyperliquidSpotMetaEnvelope = arktype({
	tokens: arktype({
		name: 'string',
		szDecimals: 'number',
		weiDecimals: 'number',
		index: 'number',
		'tokenId?': 'string',
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
		|| !hyperliquidMetaAndAssetCtxsEnvelope.allows(snapshot[1])
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

export const getClearinghouseState = ({
	user,
}: {
	user: string
}) => (
	info<HyperliquidClearinghouseState>({
		body: {
			type: 'clearinghouseState',
			user,
		},
	})
)

export const getSpotClearinghouseState = ({
	user,
}: {
	user: string
}) => (
	info<HyperliquidSpotClearinghouseState>({
		body: {
			type: 'spotClearinghouseState',
			user,
		},
	})
)

export const getHistoricalOrders = ({
	user,
}: {
	user: string
}) => (
	info<HyperliquidHistoricalOrder[]>({
		body: {
			type: 'historicalOrders',
			user,
		},
	})
)

export const getUserFillsByTime = ({
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

	return info<HyperliquidFill[]>({
		body: {
			type: 'userFillsByTime',
			user,
			startTime,
			...(endTime != null && { endTime }),
			aggregateByTime: false,
		},
	})
}

export const getUserVaultEquities = ({
	user,
}: {
	user: string
}) => (
	info<HyperliquidUserVaultEquity[]>({
		body: {
			type: 'userVaultEquities',
			user,
		},
	})
)

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

export const getL2Book = ({
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

	return info<HyperliquidL2Book>({
		body: {
			type: 'l2Book',
			coin,
			...(nSigFigs != null && { nSigFigs }),
			...(mantissa != null && { mantissa }),
		},
	})
}

export const getCandleSnapshot = ({
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

	return info<HyperliquidCandle[]>({
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

export const getUserFees = ({
	user,
}: {
	user: string
}) => (
	info<HyperliquidUserFees>({
		body: {
			type: 'userFees',
			user,
		},
	})
)

export const getDelegatorSummary = ({
	user,
}: {
	user: string
}) => (
	info<HyperliquidDelegatorSummary>({
		body: {
			type: 'delegatorSummary',
			user,
		},
	})
)

export const getUserAbstraction = ({
	user,
}: {
	user: string
}) => (
	info<HyperliquidUserAbstraction>({
		body: {
			type: 'userAbstraction',
			user,
		},
	})
)

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

export const getApprovedBuilders = ({
	user,
}: {
	user: string
}) => (
	info<string[]>({
		body: {
			type: 'approvedBuilders',
			user,
		},
	})
)

export const getBorrowLendUserState = ({
	user,
}: {
	user: string
}) => (
	info<HyperliquidBorrowLendUserState>({
		body: {
			type: 'borrowLendUserState',
			user,
		},
	})
)

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
	HyperliquidSpotClearinghouseState,
	HyperliquidSpotMeta,
	HyperliquidUserAbstraction,
	HyperliquidUserFees,
	HyperliquidUserRole,
	HyperliquidUserVaultEquity,
	HyperliquidValidatorSummary,
	HyperliquidVaultDetails,
} from '$/sources/Hyperliquid/Rest/types.ts'
import bindings from '$/sources/Hyperliquid/bindings.ts'

const binding = bindings[Source.Hyperliquid].find(
	({ apiFamily }) => apiFamily === ApiFamily.RestJson
)

if (binding == null)
	throw new Error('Hyperliquid Info binding is missing')

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
	if (!response.ok) await throwHttpError('Hyperliquid info', response)
	return response.json<_Result>()
}

export const getMeta = () => (
	info<HyperliquidMeta>({
		body: {
			type: 'meta',
		},
	})
)

export const getSpotMeta = () => (
	info<HyperliquidSpotMeta>({
		body: {
			type: 'spotMeta',
		},
	})
)

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
		throw new Error(`Hyperliquid Info: invalid fill start time ${startTime}`)

	if (endTime != null && (!Number.isSafeInteger(endTime) || endTime < startTime))
		throw new Error(`Hyperliquid Info: invalid fill end time ${endTime}`)

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

export const getValidatorSummaries = () => (
	info<HyperliquidValidatorSummary[]>({
		body: {
			type: 'validatorSummaries',
		},
	})
)

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
		throw new Error('Hyperliquid Info: invalid book coin')

	if (nSigFigs != null && nSigFigs !== 2 && nSigFigs !== 3 && nSigFigs !== 4 && nSigFigs !== 5)
		throw new Error(`Hyperliquid Info: invalid book nSigFigs ${String(nSigFigs)}`)

	if (mantissa != null && nSigFigs !== 5)
		throw new Error('Hyperliquid Info: book mantissa requires nSigFigs 5')

	if (mantissa != null && mantissa !== 1 && mantissa !== 2 && mantissa !== 5)
		throw new Error(`Hyperliquid Info: invalid book mantissa ${String(mantissa)}`)

	return info<HyperliquidL2Book>({
		body: {
			type: 'l2Book',
			coin,
			...(nSigFigs != null && { nSigFigs }),
			...(mantissa != null && { mantissa }),
		},
	})
}

const candleIntervals = new Set([
	'1m',
	'3m',
	'5m',
	'15m',
	'30m',
	'1h',
	'2h',
	'4h',
	'8h',
	'12h',
	'1d',
	'3d',
	'1w',
	'1M',
])

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
		throw new Error('Hyperliquid Info: invalid candle coin')

	if (!candleIntervals.has(interval))
		throw new Error(`Hyperliquid Info: invalid candle interval ${interval}`)

	if (!Number.isSafeInteger(startTime) || startTime < 0)
		throw new Error(`Hyperliquid Info: invalid candle start time ${startTime}`)

	if (endTime != null && (!Number.isSafeInteger(endTime) || endTime < startTime))
		throw new Error(`Hyperliquid Info: invalid candle end time ${endTime}`)

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

export const getVaultDetails = ({
	vaultAddress,
	user,
}: {
	vaultAddress: string
	user?: string
}) => {
	if (!/^0x[0-9a-fA-F]{40}$/.test(vaultAddress))
		throw new Error(`Hyperliquid Info: invalid vault address ${vaultAddress}`)

	if (user != null && !/^0x[0-9a-fA-F]{40}$/.test(user))
		throw new Error(`Hyperliquid Info: invalid vault user ${user}`)

	return info<HyperliquidVaultDetails | null>({
		body: {
			type: 'vaultDetails',
			vaultAddress,
			...(user != null && { user }),
		},
	})
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

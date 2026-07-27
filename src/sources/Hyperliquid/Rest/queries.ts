import { throwHttpError } from '$/lib/http.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	HyperliquidClearinghouseState,
	HyperliquidFill,
	HyperliquidHistoricalOrder,
	HyperliquidMeta,
	HyperliquidSpotClearinghouseState,
	HyperliquidSpotMeta,
	HyperliquidUserRole,
	HyperliquidUserVaultEquity,
	HyperliquidValidatorSummary,
} from '$/sources/Hyperliquid/Rest/types.ts'
import bindings from '$/sources/Hyperliquid/bindings.ts'

const binding = bindings[Source.Hyperliquid_Rest]

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

export const getValidatorSummaries = () => (
	info<HyperliquidValidatorSummary[]>({
		body: {
			type: 'validatorSummaries',
		},
	})
)

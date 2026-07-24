import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { throwHttpError } from '$/lib/http.ts'
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

const info = async <_Result>({
	binding,
	body,
}: {
	binding: SourceBinding
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
		},
	)
	if (!response.ok) await throwHttpError('Hyperliquid info', response)
	return response.json<_Result>()
}

export const getMeta = ({ binding }: { binding: SourceBinding }) => (
	info<HyperliquidMeta>({
		binding,
		body: {
			type: 'meta',
		},
	})
)

export const getSpotMeta = ({ binding }: { binding: SourceBinding }) => (
	info<HyperliquidSpotMeta>({
		binding,
		body: {
			type: 'spotMeta',
		},
	})
)

export const getClearinghouseState = ({
	binding,
	user,
}: {
	binding: SourceBinding
	user: string
}) => (
	info<HyperliquidClearinghouseState>({
		binding,
		body: {
			type: 'clearinghouseState',
			user,
		},
	})
)

export const getSpotClearinghouseState = ({
	binding,
	user,
}: {
	binding: SourceBinding
	user: string
}) => (
	info<HyperliquidSpotClearinghouseState>({
		binding,
		body: {
			type: 'spotClearinghouseState',
			user,
		},
	})
)

export const getHistoricalOrders = ({
	binding,
	user,
}: {
	binding: SourceBinding
	user: string
}) => (
	info<HyperliquidHistoricalOrder[]>({
		binding,
		body: {
			type: 'historicalOrders',
			user,
		},
	})
)

export const getUserFillsByTime = ({
	binding,
	user,
	startTime,
	endTime,
}: {
	binding: SourceBinding
	user: string
	startTime: number
	endTime?: number
}) => {
	if (!Number.isSafeInteger(startTime) || startTime < 0)
		throw new Error(`Hyperliquid_Rest: invalid fill start time ${startTime}`)

	if (endTime != null && (!Number.isSafeInteger(endTime) || endTime < startTime))
		throw new Error(`Hyperliquid_Rest: invalid fill end time ${endTime}`)

	return info<HyperliquidFill[]>({
		binding,
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
	binding,
	user,
}: {
	binding: SourceBinding
	user: string
}) => (
	info<HyperliquidUserVaultEquity[]>({
		binding,
		body: {
			type: 'userVaultEquities',
			user,
		},
	})
)

export const getUserRole = ({
	binding,
	user,
}: {
	binding: SourceBinding
	user: string
}) => (
	info<HyperliquidUserRole>({
		binding,
		body: {
			type: 'userRole',
			user,
		},
	})
)

export const getValidatorSummaries = ({ binding }: { binding: SourceBinding }) => (
	info<HyperliquidValidatorSummary[]>({
		binding,
		body: {
			type: 'validatorSummaries',
		},
	})
)

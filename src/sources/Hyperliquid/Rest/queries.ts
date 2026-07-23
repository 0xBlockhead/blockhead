import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { TransportType } from '$/constants/TransportType.ts'
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

const hyperliquidRestOrigin = 'https://api.hyperliquid.xyz' as const

export const hyperliquidOrigins = [
	{
		origin: hyperliquidRestOrigin,
		corsEnabled: true,
	},
] as const

export const hyperliquidMainnetRestEndpoints = [
	{
		restBaseUrl: hyperliquidRestOrigin,
		url: `${hyperliquidRestOrigin}/info`,
		transportType: TransportType.Http,
		providerName: 'Hyperliquid info API',
	},
] as const

const info = async <_Result>({
	restBaseUrl,
	body,
}: {
	restBaseUrl: string
	body: JsonValue
}) => {
	const response = await corsFetch(`${restBaseUrl.replace(/\/$/, '')}/info`, {
		origins: hyperliquidOrigins,
		init: {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(body),
		},
	})
	if (!response.ok) await throwHttpError('Hyperliquid info', response)
	return response.json<_Result>()
}

export const getMeta = ({ restBaseUrl }: { restBaseUrl: string }) => (
	info<HyperliquidMeta>({
		restBaseUrl,
		body: {
			type: 'meta',
		},
	})
)

export const getSpotMeta = ({ restBaseUrl }: { restBaseUrl: string }) => (
	info<HyperliquidSpotMeta>({
		restBaseUrl,
		body: {
			type: 'spotMeta',
		},
	})
)

export const getClearinghouseState = ({
	restBaseUrl,
	user,
}: {
	restBaseUrl: string
	user: string
}) => (
	info<HyperliquidClearinghouseState>({
		restBaseUrl,
		body: {
			type: 'clearinghouseState',
			user,
		},
	})
)

export const getSpotClearinghouseState = ({
	restBaseUrl,
	user,
}: {
	restBaseUrl: string
	user: string
}) => (
	info<HyperliquidSpotClearinghouseState>({
		restBaseUrl,
		body: {
			type: 'spotClearinghouseState',
			user,
		},
	})
)

export const getHistoricalOrders = ({
	restBaseUrl,
	user,
}: {
	restBaseUrl: string
	user: string
}) => (
	info<HyperliquidHistoricalOrder[]>({
		restBaseUrl,
		body: {
			type: 'historicalOrders',
			user,
		},
	})
)

export const getUserFillsByTime = ({
	restBaseUrl,
	user,
	startTime,
	endTime,
}: {
	restBaseUrl: string
	user: string
	startTime: number
	endTime?: number
}) => {
	if (!Number.isSafeInteger(startTime) || startTime < 0)
		throw new Error(`Hyperliquid_Rest: invalid fill start time ${startTime}`)

	if (endTime != null && (!Number.isSafeInteger(endTime) || endTime < startTime))
		throw new Error(`Hyperliquid_Rest: invalid fill end time ${endTime}`)

	return info<HyperliquidFill[]>({
		restBaseUrl,
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
	restBaseUrl,
	user,
}: {
	restBaseUrl: string
	user: string
}) => (
	info<HyperliquidUserVaultEquity[]>({
		restBaseUrl,
		body: {
			type: 'userVaultEquities',
			user,
		},
	})
)

export const getUserRole = ({
	restBaseUrl,
	user,
}: {
	restBaseUrl: string
	user: string
}) => (
	info<HyperliquidUserRole>({
		restBaseUrl,
		body: {
			type: 'userRole',
			user,
		},
	})
)

export const getValidatorSummaries = ({ restBaseUrl }: { restBaseUrl: string }) => (
	info<HyperliquidValidatorSummary[]>({
		restBaseUrl,
		body: {
			type: 'validatorSummaries',
		},
	})
)

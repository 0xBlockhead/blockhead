import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { hyperliquidBindings } from '$/sources/Hyperliquid/bindings.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	HyperliquidClearinghouseState,
	HyperliquidMeta,
	HyperliquidSpotMeta,
	HyperliquidUserRole,
	HyperliquidValidatorSummary,
} from '$/sources/Hyperliquid/Rest/types.ts'

export const hyperliquidOrigins = [
	...new Map(
		hyperliquidBindings
			.flatMap((binding) => binding.endpoints)
			.flatMap((endpoint) => (
				endpoint.origin == null ?
					[]
				:
					[[
						endpoint.origin,
						{
							origin: endpoint.origin,
							corsEnabled: endpoint.corsEnabled === true,
						},
					]]
			))
	).values(),
]

export const hyperliquidMainnetRestEndpoints = hyperliquidBindings
	.slice(0, 1)
	.flatMap((binding) => binding.endpoints)
	.flatMap((endpoint) => (
		endpoint.origin == null ?
			[]
		:
			[{
				restBaseUrl: endpoint.origin,
				url: endpoint.locator,
				transportType: TransportType.Http,
				providerName: 'Hyperliquid info API',
			}]
	))

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

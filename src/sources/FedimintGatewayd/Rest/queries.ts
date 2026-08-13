/**
 * Fedimint gatewayd REST read queries (fail-closed arktype envelopes).
 * @see https://docs.fedimint.org/src/fedimint_gateway_server/rpc_server.rs.html
 * @see https://docs.fedimint.org/fedimint_ln_common/gateway_endpoint_constants/constant.GET_GATEWAY_ID_ENDPOINT.html
 */

import { throwHttpError } from '$/lib/http.ts'
import {
	resolveEnvLocator,
	type SourcePublicEnv,
} from '$/sources/$sources.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/FedimintGatewayd/bindings.ts'
import {
	fedimintGatewayBalancesWire,
	fedimintGatewayInfoWire,
	fedimintListChannelsWire,
	fedimintPaymentSummaryWire,
	type FedimintGatewayBalancesWire,
	type FedimintGatewayInfoWire,
	type FedimintListChannelsWire,
	type FedimintPaymentSummaryWire,
} from '$/sources/FedimintGatewayd/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import { type as arktype } from 'arktype'

const binding = bindings[Source.FedimintGatewayd_Rest][0]

export const localGatewayBindingKey = binding.target.key

const gatewayIdWire = arktype('string > 0')
const nonNegativeSafeInteger = arktype(`number.integer >= 0 <= ${Number.MAX_SAFE_INTEGER}`)

export const resolvedGatewayApiUrl = (
	publicEnv: SourcePublicEnv
) => {
	const url = new URL(
		resolveEnvLocator(binding.endpoints[0].locator, publicEnv)
	)
	if (
		(url.protocol !== 'http:' && url.protocol !== 'https:')
		|| url.username !== ''
		|| url.password !== ''
	)
		throw new Error('FedimintGatewayd_Rest: gateway URL must be an unauthenticated HTTP URL')

	return url.toString().replace(/\/$/, '')
}

const configuredBinding = (publicEnv: SourcePublicEnv) => ({
	...binding,
	endpoints: binding.endpoints.map((endpoint) => ({
		...endpoint,
		locator: resolvedGatewayApiUrl(publicEnv),
	})),
})

const assertEnvelope = <_Value>(
	label: string,
	wire: {
		assert: (value: unknown) => _Value
	},
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`FedimintGatewayd_Rest: invalid ${label} response envelope`)
	}
}

const adminPassword = (
	publicEnv: SourcePublicEnv
) => {
	const value = (publicEnv.FEDIMINT_GATEWAYD_PASSWORD ?? '').trim()
	if (value === '')
		throw new Error('FedimintGatewayd_Rest: missing FEDIMINT_GATEWAYD_PASSWORD')

	return value
}

const requestGatewayJson = async ({
	publicEnv,
	path,
	method = 'GET',
	body,
	authenticated,
}: {
	publicEnv: SourcePublicEnv
	path: string
	method?: 'GET' | 'POST'
	body?: unknown
	authenticated: boolean
}) => {
	const resolved = configuredBinding(publicEnv)
	const response = await sourceFetch(
		resolved,
		httpUrl(resolved, path),
		{
			method,
			headers: {
				...(authenticated && {
					authorization: `Bearer ${adminPassword(publicEnv)}`,
				}),
				...(body !== undefined && {
					'content-type': 'application/json',
				}),
			},
			...(body !== undefined && {
				body: JSON.stringify(body),
			}),
		}
	)
	if (!response.ok)
		await throwHttpError(`${resolved.source} ${path}`, response)

	return response.json()
}

/**
 * GET /v1/id — public LNv1 gateway identity (no admin Bearer).
 */
export const getGatewayId = async ({
	publicEnv,
}: {
	publicEnv: SourcePublicEnv
}) => (
	assertEnvelope(
		'gateway id',
		gatewayIdWire,
		await requestGatewayJson({
			publicEnv,
			path: '/v1/id',
			authenticated: false,
		})
	)
)

/**
 * GET /v1/info — admin Bearer required.
 */
export const getGatewayInfo = async ({
	publicEnv,
}: {
	publicEnv: SourcePublicEnv
}): Promise<FedimintGatewayInfoWire> => {
	const info = assertEnvelope(
		'gateway info',
		fedimintGatewayInfoWire,
		await requestGatewayJson({
			publicEnv,
			path: '/v1/info',
			authenticated: true,
		})
	)
	const federationIds = new Set<string>()
	for (const federation of info.federations) {
		if (federationIds.has(federation.federation_id))
			throw new Error('FedimintGatewayd_Rest: gateway info contains a duplicate federation')
		federationIds.add(federation.federation_id)
	}
	return info
}

/**
 * GET /v1/balances — admin Bearer required.
 */
export const getGatewayBalances = async ({
	publicEnv,
}: {
	publicEnv: SourcePublicEnv
}): Promise<FedimintGatewayBalancesWire> => {
	const balances = assertEnvelope(
		'gateway balances',
		fedimintGatewayBalancesWire,
		await requestGatewayJson({
			publicEnv,
			path: '/v1/balances',
			authenticated: true,
		})
	)
	const federationIds = new Set<string>()
	for (const balance of balances.ecash_balances) {
		if (federationIds.has(balance.federation_id))
			throw new Error('FedimintGatewayd_Rest: gateway balances contains a duplicate federation')
		federationIds.add(balance.federation_id)
	}
	return balances
}

/**
 * GET /v1/list_channels — admin Bearer required.
 */
export const listChannels = async ({
	publicEnv,
}: {
	publicEnv: SourcePublicEnv
}): Promise<FedimintListChannelsWire> => (
	assertEnvelope(
		'list channels',
		fedimintListChannelsWire,
		await requestGatewayJson({
			publicEnv,
			path: '/v1/list_channels',
			authenticated: true,
		})
	)
)

/**
 * POST /v1/payment_summary — admin Bearer required.
 */
export const getPaymentSummary = async ({
	publicEnv,
	startMs,
	endMs,
}: {
	publicEnv: SourcePublicEnv
	startMs: number
	endMs: number
}): Promise<FedimintPaymentSummaryWire> => {
	if (!nonNegativeSafeInteger.allows(startMs) || !nonNegativeSafeInteger.allows(endMs))
		throw new Error('FedimintGatewayd_Rest: payment summary window must use non-negative safe millisecond timestamps')
	if (endMs <= startMs)
		throw new Error('FedimintGatewayd_Rest: payment summary window end must follow its start')

	return assertEnvelope(
		'payment summary',
		fedimintPaymentSummaryWire,
		await requestGatewayJson({
			publicEnv,
			path: '/v1/payment_summary',
			method: 'POST',
			body: {
				start_millis: startMs,
				end_millis: endMs,
			},
			authenticated: true,
		})
	)
}

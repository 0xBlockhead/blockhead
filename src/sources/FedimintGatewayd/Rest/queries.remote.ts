import { query } from '$app/server'
import { env } from '$env/dynamic/private'
import { type } from 'arktype'

import {
	getGatewayBalances as getGatewayBalancesFromGateway,
	getGatewayId as getGatewayIdFromGateway,
	getGatewayInfo as getGatewayInfoFromGateway,
	getPaymentSummary as getPaymentSummaryFromGateway,
	listChannels as listChannelsFromGateway,
	resolvedGatewayApiUrl,
} from '$/sources/FedimintGatewayd/Rest/queries.ts'

const gatewayEndpointEnv = {
	FEDIMINT_GATEWAYD_URL: env.FEDIMINT_GATEWAYD_URL ?? '',
}
const gatewayAdminEnv = {
	...gatewayEndpointEnv,
	FEDIMINT_GATEWAYD_PASSWORD: env.FEDIMINT_GATEWAYD_PASSWORD ?? '',
}

export const getGatewayId = query(() => getGatewayIdFromGateway({ publicEnv: gatewayEndpointEnv }))
export const getGatewayInfo = query(() => getGatewayInfoFromGateway({ publicEnv: gatewayAdminEnv }))
export const getGatewayBalances = query(() => getGatewayBalancesFromGateway({ publicEnv: gatewayAdminEnv }))
export const listChannels = query(() => listChannelsFromGateway({ publicEnv: gatewayAdminEnv }))

const paymentSummaryRemote = query(
	type({
		endMs: 'number',
		startMs: 'number',
	}),
	({ endMs, startMs }) => getPaymentSummaryFromGateway({
		publicEnv: gatewayAdminEnv,
		endMs,
		startMs,
	})
)

export const getPaymentSummary = paymentSummaryRemote

export const getResolvedGatewayApiUrl = query(() => resolvedGatewayApiUrl(gatewayEndpointEnv))

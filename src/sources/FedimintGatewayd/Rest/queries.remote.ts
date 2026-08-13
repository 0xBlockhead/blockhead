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

const privateEnv = {
	FEDIMINT_GATEWAYD_PASSWORD: env.FEDIMINT_GATEWAYD_PASSWORD ?? '',
	FEDIMINT_GATEWAYD_URL: env.FEDIMINT_GATEWAYD_URL ?? '',
}

export const getGatewayId = query(() => getGatewayIdFromGateway({ publicEnv: privateEnv }))
export const getGatewayInfo = query(() => getGatewayInfoFromGateway({ publicEnv: privateEnv }))
export const getGatewayBalances = query(() => getGatewayBalancesFromGateway({ publicEnv: privateEnv }))
export const listChannels = query(() => listChannelsFromGateway({ publicEnv: privateEnv }))

const paymentSummaryRemote = query(
	type({
		endMs: 'number',
		startMs: 'number',
	}),
	({ endMs, startMs }) => getPaymentSummaryFromGateway({
		publicEnv: privateEnv,
		endMs,
		startMs,
	})
)

export const getPaymentSummary = paymentSummaryRemote

export const getResolvedGatewayApiUrl = query(() => resolvedGatewayApiUrl(privateEnv))

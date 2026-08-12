import { query } from '$app/server'
import { env } from '$env/dynamic/private'
import { type } from 'arktype'

import type { SourcePublicEnv } from '$/sources/$sources.ts'
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

const gatewayIdRemote = query(() => getGatewayIdFromGateway({ publicEnv: privateEnv }))
const gatewayInfoRemote = query(() => getGatewayInfoFromGateway({ publicEnv: privateEnv }))
const gatewayBalancesRemote = query(() => getGatewayBalancesFromGateway({ publicEnv: privateEnv }))
const channelsRemote = query(() => listChannelsFromGateway({ publicEnv: privateEnv }))

export const getGatewayId = (_input: { publicEnv: SourcePublicEnv }) => gatewayIdRemote()
export const getGatewayInfo = (_input: { publicEnv: SourcePublicEnv }) => gatewayInfoRemote()
export const getGatewayBalances = (_input: { publicEnv: SourcePublicEnv }) => gatewayBalancesRemote()
export const listChannels = (_input: { publicEnv: SourcePublicEnv }) => channelsRemote()

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

export const getPaymentSummary = ({
	endMs,
	startMs,
}: {
	publicEnv: SourcePublicEnv
	endMs: number
	startMs: number
}) => paymentSummaryRemote({
	endMs,
	startMs,
})

export const getResolvedGatewayApiUrl = query(() => resolvedGatewayApiUrl(privateEnv))

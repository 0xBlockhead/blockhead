/**
 * Helpers for execution endpoints (default per chain, URLs). Constants live in constants/ExecutionEndpoints.ts.
 */

import type { ChainId } from '$/constants/ChainId.ts'
import type { ExecutionEndpoint } from '$/constants/ExecutionEndpoints.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { executionEndpointsByChainId } from '$/constants/ExecutionEndpoints.ts'

export const getDefaultExecutionEndpoint = (
	chainId: number,
): ExecutionEndpoint | undefined =>
	executionEndpointsByChainId[chainId as ChainId]?.[0]

export const getDefaultExecutionEndpointForLive = (
	chainId: number,
): ExecutionEndpoint | undefined => {
	const list = executionEndpointsByChainId[chainId as ChainId] ?? []
	const ws = list.find((e) => e.transportType === TransportType.WebSocket)
	return ws ?? list[0]
}

/** HTTP URLs for chain marked tevmForkTransportCompatible (order matches constants). Use to retry simulation when the first fork RPC fails. */
export const listTevmForkTransportCompatibleHttpUrls = (chainId: number): string[] => {
	const list = executionEndpointsByChainId[chainId as ChainId] ?? []
	return list
		.filter((e) => (
			e.transportType === TransportType.Http &&
			'tevmForkTransportCompatible' in e &&
			e.tevmForkTransportCompatible === true
		))
		.map((e) => e.url)
}

/** First HTTP endpoint for chain with tevmForkTransportCompatible === true; otherwise first HTTP endpoint. Use for Tevm fork-based simulation. */
export const getTevmForkTransportCompatibleExecutionEndpoint = (
	chainId: number,
): ExecutionEndpoint | undefined => {
	const list = executionEndpointsByChainId[chainId as ChainId] ?? []
	const http = list.filter((e) => e.transportType === TransportType.Http)
	return (
		http.find((e) => (
			'tevmForkTransportCompatible' in e &&
			e.tevmForkTransportCompatible === true
		))
		?? http[0]
	)
}

const chainIds = Object.keys(executionEndpointsByChainId).map(Number) as ChainId[]

export const defaultExecutionClientUrls = Object.fromEntries(
	chainIds.flatMap((c) => {
		const ep = executionEndpointsByChainId[c]?.[0]
		return ep ? [[c, ep.url] as const] : []
	}),
) as Partial<Record<ChainId, string>>

export const defaultLiveExecutionClientUrls = Object.fromEntries(
	chainIds.flatMap((c) => {
		const ep = getDefaultExecutionEndpointForLive(c)
		return ep ? [[c, ep.url] as const] : []
	}),
) as Partial<Record<ChainId, string>>

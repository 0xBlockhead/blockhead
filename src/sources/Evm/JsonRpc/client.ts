import { executionEndpointsByChainId } from '$/constants/ExecutionEndpoints.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { corsFetch, throwHttpError } from '$/lib/http.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import type { ChainlistRpcsJsonChain } from '$/sources/Chainlist/Rest/types.ts'
import Voltaire from '$/sources/Voltaire/index.ts'
import { jsonRpcHeaders, jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

type JsonRpcError = {
	code: number
	message: string
	data?: JsonValue
}

type JsonRpcResponse<TResult> = {
	jsonrpc: typeof jsonRpcVersion
	id: number | string | null
	result?: TResult
	error?: JsonRpcError
}

export const jsonRpc = async <_Result>({
	rpcUrl,
	method,
	params,
}: {
	rpcUrl: string
	method: string
	params: JsonValue[]
}): Promise<_Result> => {
	const rpcOrigin = new URL(rpcUrl).origin
	const executionRpcOrigins = Voltaire.origins ?? []
	const knownExecutionRpc = executionRpcOrigins.some((entry) => entry.origin === rpcOrigin)
	const response = await corsFetch(rpcUrl, {
		...(knownExecutionRpc ?
			{ origins: executionRpcOrigins }
		:	{ corsEnabled: true }),
		init: {
			method: 'POST',
			headers: jsonRpcHeaders,
			body: JSON.stringify({
				jsonrpc: jsonRpcVersion,
				id: 1,
				method,
				params,
			}),
		},
	})
	if (!response.ok) await throwHttpError(`JsonRpc ${method}`, response)

	const json = await response.json<JsonRpcResponse<_Result>>()

	if (json.error != null)
		throw new Error(`JsonRpc ${method}: ${json.error.message}`)

	const { result } = json
	if (result === undefined)
		throw new Error(`JsonRpc ${method}: missing result`)

	return result
}

export const jsonRpcUrlWithTransportForChain = async (
	chainId: number,
	chainlistRpcs?: ChainlistRpcsJsonChain[],
): Promise<{ rpcUrl: string; transportType: TransportType } | undefined> => {
	const executionEndpointList = executionEndpointsByChainId[chainId] ?? []
	const defaultExecutionEndpoint = executionEndpointList[0]
	if (defaultExecutionEndpoint != null) {
		return {
			rpcUrl: defaultExecutionEndpoint.url,
			transportType: defaultExecutionEndpoint.transportType,
		}
	}
	const httpExecutionEndpoint = executionEndpointList
		.find((endpoint) => endpoint.transportType === TransportType.Http)
	if (httpExecutionEndpoint != null) {
		return {
			rpcUrl: httpExecutionEndpoint.url,
			transportType: TransportType.Http,
		}
	}
	const chain = (
		chainlistRpcs
		?? await singleFlight((await import('$/sources/Chainlist/Rest/queries.ts')).fetchRpcsJson)()
	).find((candidate) => candidate.chainId === chainId)
	const chainlistFallbackUrl = (
		(chain?.rpc ?? [])
			.filter((entry) => (
				typeof entry === 'string'
				|| (entry.tracking !== 'yes' && entry.tracking !== 'limited')
			))
			.map((entry) => (
				typeof entry === 'string' ?
					entry.trim()
				:	entry.url?.trim()
			))
			.filter((url): url is string => Boolean(url))
			.find((url) => (
				!url.includes('${')
				&& (() => {
					try {
						const parsed = new URL(url.startsWith('http') ? url : `https://${url}`)
						return ![
							/api[_-]?key=/i,
							/apikey=/i,
							/key=[a-zA-Z0-9_-]{20,}/i,
							/getblock\.io\/[a-f0-9]+/i,
							/nodereal\.io\/v1\/[a-f0-9]+/i,
							/ankr\.com\/[^/]+\/[a-f0-9]+/i,
						].some((re) => re.test(`${parsed.origin}${parsed.pathname}${parsed.search}`))
					} catch {
						return false
					}
				})()
			))
	)
	return (
		chainlistFallbackUrl == null ?
			undefined
		:
			{
				rpcUrl: chainlistFallbackUrl,
				transportType: TransportType.Http,
			}
	)
}

export const jsonRpcTransportCandidatesForChain = async (
	chainId: number,
	chainlistRpcs?: ChainlistRpcsJsonChain[],
): Promise<{ rpcUrl: string; transportType: TransportType }[]> => {
	const jsonRpcFallback = await jsonRpcUrlWithTransportForChain(chainId, chainlistRpcs)
	return [
		...(executionEndpointsByChainId[chainId] ?? []).map((endpoint) => ({
			rpcUrl: endpoint.url,
			transportType: endpoint.transportType,
		})),
		...(jsonRpcFallback == null ? [] : [jsonRpcFallback]),
	]
}

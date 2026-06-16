import { executionEndpointsByChainId } from '$/constants/ExecutionEndpoints.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { corsFetch, throwHttpError } from '$/lib/http.ts'
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
	const response = await corsFetch(rpcUrl, {
		origins: Voltaire.origins,
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

export const jsonRpcUrlWithTransportForChain = (
	chainId: number
): { rpcUrl: string; transportType: TransportType } | undefined => {
	const executionEndpointList = executionEndpointsByChainId[chainId] ?? []
	const defaultExecutionEndpoint = executionEndpointList.at(0)
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
}

export const jsonRpcTransportCandidatesForChain = (
	chainId: number
): { rpcUrl: string; transportType: TransportType }[] => (
	(executionEndpointsByChainId[chainId] ?? [])
		.map((endpoint) => ({
			rpcUrl: endpoint.url,
			transportType: endpoint.transportType,
		}))
)

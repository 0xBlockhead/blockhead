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

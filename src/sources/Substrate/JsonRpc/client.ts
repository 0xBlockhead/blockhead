import { jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'
import { corsFetch, throwHttpError } from '$/lib/http.ts'
import type { SourceOrigin } from '$/sources/SourceProvider.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

type JsonRpcResponse<_Result> = {
	jsonrpc: typeof jsonRpcVersion
	id: number | string | null
	result?: _Result
	error?: {
		code: number
		message: string
		data?: JsonValue
	}
}

export const substrateJsonRpc = async <_Result>({
	rpcUrl,
	method,
	params,
	origins,
	label,
}: {
	rpcUrl: string
	method: string
	params: JsonValue[]
	origins: readonly SourceOrigin[]
	label: string
}) => {
	const response = await corsFetch(rpcUrl, {
		origins,
		init: {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				jsonrpc: jsonRpcVersion,
				id: 1,
				method,
				params,
			}),
		},
	})
	if (!response.ok) await throwHttpError(`${label} ${method}`, response)
	const json = await response.json<JsonRpcResponse<_Result>>()
	if (json.error != null) throw new Error(`${label} ${method}: ${json.error.message}`)
	if (json.result === undefined) throw new Error(`${label} ${method}: missing result`)
	return json.result
}

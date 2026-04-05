import { getJson } from '$/lib/fetch.ts'
import { jsonRpcHeaders, jsonRpcVersion } from '$/sources/Evm/JsonRpc/constants.ts'

type JsonRpcError = {
	code: number
	message: string
	data?: unknown
}

type JsonRpcResponse<TResult> = {
	jsonrpc: typeof jsonRpcVersion
	id: number | unknown
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
	params: unknown[]
}): Promise<_Result> => {
	const json = await getJson<JsonRpcResponse<_Result>>(rpcUrl, {
		method: 'POST',
		headers: jsonRpcHeaders,
		body: JSON.stringify({
			jsonrpc: jsonRpcVersion,
			id: 1,
			method,
			params,
		}),
	})
	if (json.error != null)
		throw new Error(`JsonRpc ${method}: ${json.error.message}`)

	return json.result as _Result
}

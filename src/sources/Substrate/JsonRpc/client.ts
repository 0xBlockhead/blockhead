import type { SourceOrigin } from '$/sources/SourceProvider.ts'
import { getJson } from '$/lib/http.ts'

type SubstrateJsonRpcResponse<_Result> = {
	result?: _Result
	error?: {
		message: string
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
	params?: readonly unknown[]
	origins: readonly SourceOrigin[]
	label: string
}): Promise<_Result> => {
	const response = await getJson<SubstrateJsonRpcResponse<_Result>>(rpcUrl, {
		origins,
		init: {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				method,
				params: params ?? [],
			}),
		},
	})
	if (response.error != null)
		throw new Error(`${label} Substrate JSON-RPC ${method}: ${response.error.message}`)
	if (response.result === undefined)
		throw new Error(`${label} Substrate JSON-RPC ${method}: missing result`)

	return response.result
}

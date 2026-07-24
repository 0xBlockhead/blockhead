import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { throwHttpError } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'

type SubstrateJsonRpcResponse<_Result> = {
	result?: _Result
	error?: {
		message: string
	}
}

export const substrateJsonRpc = async <_Result>({
	binding,
	method,
	params,
	label,
}: {
	binding: SourceBinding
	method: string
	params?: readonly unknown[]
	label: string
}): Promise<_Result> => {
	const response = await sourceFetch(
		binding,
		firstHttpUrlForBinding(binding),
		{
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
		}
	)
	if (!response.ok)
		await throwHttpError(`${label} Substrate JSON-RPC ${method}`, response)

	const json = await response.json<SubstrateJsonRpcResponse<_Result>>()
	if (json.error != null)
		throw new Error(`${label} Substrate JSON-RPC ${method}: ${json.error.message}`)
	if (json.result === undefined)
		throw new Error(`${label} Substrate JSON-RPC ${method}: missing result`)

	return json.result
}

import { throwHttpError } from '$/lib/http.ts'
import {
	SourceEndpointKind,
	type SourceBinding,
	type SourceEndpoint,
} from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import {
	jsonRpcHeaders,
	jsonRpcVersion,
} from '$/sources/_shared/wire/JsonRpc2/constants.ts'
import type {
	JsonRpc2Request,
	JsonRpc2Response,
} from '$/sources/_shared/wire/JsonRpc2/types.ts'

export const jsonRpc2 = async <_Result>(
	binding: SourceBinding,
	method: string,
	params?: readonly unknown[] | Readonly<Record<string, unknown>>,
	endpoint?: SourceEndpoint
): Promise<_Result> => {
	if (
		endpoint != null
		&& (
			endpoint.endpointKind !== SourceEndpointKind.HttpUrl
			|| !binding.endpoints.includes(endpoint)
		)
	)
		throw new Error(`${binding.source}: JSON-RPC endpoint is not declared by the binding`)

	const body = {
		jsonrpc: jsonRpcVersion,
		id: 1,
		method,
		...(params != null && {
			params,
		}),
	} satisfies JsonRpc2Request

	const response = await sourceFetch(binding, endpoint?.locator ?? firstHttpUrlForBinding(binding), {
		method: 'POST',
		headers: jsonRpcHeaders,
		body: JSON.stringify(body),
	})

	if (!response.ok)
		await throwHttpError(`JSON-RPC ${method}`, response)

	const json = await response.json<JsonRpc2Response<_Result>>()
	if (json.error != null)
		throw new Error(`JSON-RPC ${method}: ${json.error.message}`)

	if (!('result' in json))
		throw new Error(`JSON-RPC ${method}: missing result`)

	return json.result as _Result
}

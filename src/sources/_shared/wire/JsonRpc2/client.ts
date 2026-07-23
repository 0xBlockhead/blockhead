import { throwHttpError } from '$/lib/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type {
	JsonRpc2Request,
	JsonRpc2Response,
} from '$/sources/_shared/wire/JsonRpc2/types.ts'

export const jsonRpc2 = async <_Result>(
	binding: SourceBinding,
	method: string,
	params?: readonly unknown[] | Readonly<Record<string, unknown>>
): Promise<_Result> => {
	const body = {
		jsonrpc: '2.0',
		id: 1,
		method,
		...(params != null && {
			params,
		}),
	} satisfies JsonRpc2Request

	const response = await sourceFetch(binding, firstHttpUrlForBinding(binding), {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
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

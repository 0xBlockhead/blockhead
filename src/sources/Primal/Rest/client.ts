import { fetchFailedMessage } from '$/lib/http.ts'
import bindings from '$/sources/Primal/bindings.ts'
import type { PrimalPostBody } from '$/sources/Primal/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'

const binding = bindings[Source.Primal_Rest][0]

export const primalGet = <T>(path: string) => (
	sourceGetJson<T>(
		binding,
		`${firstHttpUrlForBinding(binding)}/v1${path.startsWith('/') ? path : `/${path}`}`
	)
)

export const primalPost = async <T>(path: string, body: PrimalPostBody) => {
	const url = `${firstHttpUrlForBinding(binding)}/v1${path.startsWith('/') ? path : `/${path}`}`
	const response = await sourceFetch(
		binding,
		url,
		{
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}
	)
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	return response.json<T>()
}

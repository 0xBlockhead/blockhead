import { fetchFailedMessage } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Sourcify/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const binding = bindings[Source.Sourcify_Rest][0]

export const sourcifyGetJsonOrNull = async <T = JsonValue>({
	path,
}: {
	path: string
}) => {
	const url = `${firstHttpUrlForBinding(binding).replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
	const response = await sourceFetch(binding, url)
	if (response.status === 404) return null
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))
	return response.json<T>()
}

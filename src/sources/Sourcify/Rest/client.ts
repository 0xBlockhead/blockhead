import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import { throwIfHttpNotOk } from '$/lib/http.ts'
import bindings from '$/sources/Sourcify/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const binding = bindings[Source.Sourcify_Rest]

export const sourcifyGetJsonOrNull = async <T = JsonValue>({
	path,
}: {
	path: string
}): Promise<T | null> => {
	const url = `${firstHttpUrlForBinding(binding).replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
	const res = await sourceFetch(binding, url)
	if (res.status === 404) return null
	await throwIfHttpNotOk(res, url)
	return res.json<T>()
}

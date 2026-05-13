import { throwIfHttpNotOk } from '$/lib/http.ts'
import { baseUrl } from '$/sources/Sourcify/Rest/constants.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const sourcifyGetJsonOrNull = async <T = JsonValue>({
	path,
}: {
	path: string
}): Promise<T | null> => {
	const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
	const res = await fetch(url)
	if (res.status === 404) return null
	await throwIfHttpNotOk(res, url)
	return res.json<T>()
}

import { sourcifyApiV2BaseUrl } from '$/sources/Sourcify/Rest/constants.ts'

export const sourcifyGetJsonOrNull = async <T = unknown>({
	path,
}: {
	path: string
}): Promise<T | null> => {
	const url = `${sourcifyApiV2BaseUrl}${path.startsWith('/') ? path : `/${path}`}`
	const res = await fetch(url)
	if (res.status === 404) return null
	if (!res.ok) throw new Error(`Fetch failed (${res.status} ${res.statusText}) for ${url}`)
	return await res.json() as T
}

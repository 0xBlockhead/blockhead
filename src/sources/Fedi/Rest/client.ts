import { env } from '$env/dynamic/public'

import { getJson } from '$/lib/http.ts'
import { fediApiBase, fediOrigins } from '$/sources/Fedi/Rest/constants.ts'

const qs = (o: Record<string, string | undefined>) => {
	const s = new URLSearchParams()
	for (const [k, v] of Object.entries(o)) {
		if (v == null) continue
		s.set(k, v)
	}
	const t = s.toString()
	return t ? `?${t}` : ''
}

const authHeaders = (): Record<string, string> => {
	const t = env.PUBLIC_FEDI_ACCESS_TOKEN
	return (
		typeof t === 'string' && t.trim() !== '' ?
			{ Authorization: `Bearer ${t.trim()}` as const }
		:
			{}
	)
}

export const fediGet = async <T>(path: string, search?: Record<string, string | undefined>) => (
	getJson<T>(`${fediApiBase}${path}${qs(search ?? {})}`, {
		origins: fediOrigins,
		init: { headers: authHeaders() },
	})
)

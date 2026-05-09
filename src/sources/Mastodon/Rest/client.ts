import { env } from '$env/dynamic/public'

import { getJson } from '$/lib/http.ts'
import { mastodonApiBase, mastodonOrigins } from '$/sources/Mastodon/Rest/constants.ts'

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
	const t = env.PUBLIC_MASTODON_ACCESS_TOKEN
	return (
		typeof t === 'string' && t.trim() !== '' ?
			{ Authorization: `Bearer ${t.trim()}` as const }
		:
			{}
	)
}

export const mastodonGet = async <T>(path: string, search?: Record<string, string | undefined>) => (
	getJson<T>(`${mastodonApiBase}${path}${qs(search ?? {})}`, {
		origins: mastodonOrigins,
		init: { headers: authHeaders() },
	})
)

import { getJson } from '$/lib/http.ts'
import { optionalPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { mastodonInstanceByKey } from '$/constants/Mastodon.ts'
import { mastodonOrigins } from '$/sources/Mastodon/index.ts'

const qs = (o: Record<string, string | undefined>) => {
	const s = new URLSearchParams()
	for (const [k, v] of Object.entries(o)) {
		if (v == null) continue
		s.set(k, v)
	}
	const t = s.toString()
	return t ? `?${t}` : ''
}

const authHeaders = (publicEnv: SourcePublicEnv): Record<string, string> => {
	const token = optionalPublicEnvString(publicEnv, 'PUBLIC_MASTODON_ACCESS_TOKEN')
	return (
		token != null ?
			{ Authorization: `Bearer ${token}` as const }
		:
			{}
	)
}

export const mastodonGet = async <T>(
	publicEnv: SourcePublicEnv,
	path: string,
	search?: Record<string, string | undefined>,
	apiVersion = 'v1'
) => (
	getJson<T>(`${mastodonInstanceByKey.mastodon_social.origin}/api/${apiVersion}${path}${qs(search ?? {})}`, {
		origins: mastodonOrigins,
		init: { headers: authHeaders(publicEnv) },
	})
)

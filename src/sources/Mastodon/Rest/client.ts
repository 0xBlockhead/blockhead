import { getJson } from '$/lib/http.ts'
import { optionalPublicEnvString } from '$/lib/sources.ts'
import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { mastodonApiBase } from '$/sources/Mastodon/Rest/constants.ts'
import Mastodon from '$/sources/Mastodon/index.ts'

const qs = (o: Record<string, string | undefined>) => {
	const s = new URLSearchParams()
	for (const [k, v] of Object.entries(o)) {
		if (v == null) continue
		s.set(k, v)
	}
	const t = s.toString()
	return t ? `?${t}` : ''
}

const authHeaders = (publicEnv: SourcePublicEnvFor<Source.Mastodon_Rest>): Record<string, string> => {
	const token = optionalPublicEnvString(publicEnv, 'PUBLIC_MASTODON_ACCESS_TOKEN')
	return (
		token != null ?
			{ Authorization: `Bearer ${token}` as const }
		:
			{}
	)
}

export const mastodonGet = async <T>(
	publicEnv: SourcePublicEnvFor<Source.Mastodon_Rest>,
	path: string,
	search?: Record<string, string | undefined>,
) => (
	getJson<T>(`${mastodonApiBase}${path}${qs(search ?? {})}`, {
		origins: Mastodon.origins,
		init: { headers: authHeaders(publicEnv) },
	})
)

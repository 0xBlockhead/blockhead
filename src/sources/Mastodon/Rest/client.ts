import { corsFetch, getJson } from '$/lib/http.ts'
import { optionalPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { mastodonRestOrigins } from '$/sources/Mastodon/Rest/constants.ts'

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
	instanceOrigin: string,
	path: string,
	search?: Record<string, string | undefined>,
	apiVersion = 'v1'
) => (
	getJson<T>(`${instanceOrigin}/api/${apiVersion}${path}${qs(search ?? {})}`, {
		origins: mastodonRestOrigins,
		init: { headers: authHeaders(publicEnv) },
	})
)

export const mastodonFetch = async (
	publicEnv: SourcePublicEnv,
	instanceOrigin: string,
	path: string,
	search?: Record<string, string | undefined>,
	apiVersion = 'v1'
) => (
	corsFetch(`${instanceOrigin}/api/${apiVersion}${path}${qs(search ?? {})}`, {
		origins: mastodonRestOrigins,
		init: { headers: authHeaders(publicEnv) },
	})
)

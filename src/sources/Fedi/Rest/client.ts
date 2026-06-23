import { getJson } from '$/lib/http.ts'
import { fediInstanceBySlug } from '$/constants/Fedi.ts'
import { optionalPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { fediOrigins } from '$/sources/Fedi/index.ts'

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
	const token = optionalPublicEnvString(publicEnv, 'PUBLIC_FEDI_ACCESS_TOKEN')
	return (
		token != null ?
			{ Authorization: `Bearer ${token}` }
		:
			{}
	)
}

export const fediGet = async <T>(
	publicEnv: SourcePublicEnv,
	path: string,
	search?: Record<string, string | undefined>,
	apiVersion = 'v1'
) => (
	getJson<T>(`${fediInstanceBySlug.fosstodon.origin}/api/${apiVersion}${path}${qs(search ?? {})}`, {
		origins: fediOrigins,
		init: { headers: authHeaders(publicEnv) },
	})
)

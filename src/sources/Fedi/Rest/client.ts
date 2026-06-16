import { getJson } from '$/lib/http.ts'
import { fediInstanceBySlug } from '$/constants/Fedi.ts'
import { optionalPublicEnvString } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import Fedi from '$/sources/Fedi/index.ts'

const qs = (o: Record<string, string | undefined>) => {
	const s = new URLSearchParams()
	for (const [k, v] of Object.entries(o)) {
		if (v == null) continue
		s.set(k, v)
	}
	const t = s.toString()
	return t ? `?${t}` : ''
}

const authHeaders = (publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>): Record<string, string> => {
	const token = optionalPublicEnvString(publicEnv, 'PUBLIC_FEDI_ACCESS_TOKEN')
	return (
		token != null ?
			{ Authorization: `Bearer ${token}` }
		:
			{}
	)
}

export const fediGet = async <T>(
	publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>,
	path: string,
	search?: Record<string, string | undefined>
) => (
	getJson<T>(`${fediInstanceBySlug.fosstodon.origin}/api/v1${path}${qs(search ?? {})}`, {
		origins: Fedi.origins,
		init: { headers: authHeaders(publicEnv) },
	})
)

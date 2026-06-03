import { getJson } from '$/lib/http.ts'
import { optionalPublicEnvString } from '$/lib/sources.ts'
import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { fediApiBase } from '$/sources/Fedi/Rest/constants.ts'
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
			{ Authorization: `Bearer ${token}` as const }
		:
			{}
	)
}

export const fediGet = async <T>(
	publicEnv: SourcePublicEnvFor<Source.Fedi_Rest>,
	path: string,
	search?: Record<string, string | undefined>,
) => (
	getJson<T>(`${fediApiBase}${path}${qs(search ?? {})}`, {
		origins: Fedi.origins,
		init: { headers: authHeaders(publicEnv) },
	})
)

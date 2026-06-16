import { getJson } from '$/lib/http.ts'
import Piped from '$/sources/Piped/index.ts'
import { pipedApiDefaultOrigin } from '$/sources/Piped/Rest/constants.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/Source.ts'

const toQuery = (params: Record<string, string | undefined>) => {
	const sp = new URLSearchParams()
	for (const [key, value] of Object.entries(params)) {
		if (value == null) continue
		sp.set(key, value)
	}
	const query = sp.toString()
	return query ? `?${query}` : ''
}

export const pipedApiGet = async <T>(
	_publicEnv: SourcePublicEnvFor<Source.Piped_Rest>,
	path: `/${string}`,
	params?: Record<string, string | undefined>
): Promise<T> => (
	getJson<T>(
		`${pipedApiDefaultOrigin}${path}${toQuery(params ?? {})}`,
		{ origins: Piped.origins }
	)
)

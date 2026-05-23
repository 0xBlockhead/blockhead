import { getJson } from '$/lib/http.ts'
import X from '$/sources/X/index.ts'
import { xApiV2Base } from '$/sources/X/Rest/constants.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'

const xBearerHeader = (publicEnv: SourcePublicEnvFor<Source.X_Rest>) => {
	const t = publicEnv.PUBLIC_X_API_BEARER
	if (typeof t !== 'string' || t.trim() === '') {
		throw new Error('X_Rest: set PUBLIC_X_API_BEARER (OAuth2 bearer for API v2)')
	}
	return { Authorization: `Bearer ${t.trim()}` as const }
}

export const xApiV2Get = async <T>(
	publicEnv: SourcePublicEnvFor<Source.X_Rest>,
	path: `/${string}`,
): Promise<T> => (
	getJson<T>(`${xApiV2Base}${path}`, {
		origins: X.origins ?? [],
		init: { headers: xBearerHeader(publicEnv) },
	})
)

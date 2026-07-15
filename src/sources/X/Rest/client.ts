import { getJson } from '$/lib/http.ts'
import { requiredPublicEnvString } from '$/sources/$sources.ts'
import {
	xApiV2Base,
	xOrigins,
} from '$/sources/X/Rest/constants.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'

export const xApiV2Get = async <T>(
	publicEnv: SourcePublicEnv,
	path: `/${string}`
): Promise<T> => (
	getJson<T>(`${xApiV2Base}${path}`, {
		origins: xOrigins,
		init: {
			headers: {
				Authorization: `Bearer ${requiredPublicEnvString(publicEnv, 'PUBLIC_X_API_BEARER')}`,
			},
		},
	})
)

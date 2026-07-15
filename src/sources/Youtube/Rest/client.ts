import { getJson } from '$/lib/http.ts'
import { requiredPublicEnvString } from '$/sources/$sources.ts'
import {
	youtubeApiV3Base,
	youtubeOrigins,
} from '$/sources/Youtube/Rest/constants.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'

export const youtubeApiV3Get = async <T>(
	publicEnv: SourcePublicEnv,
	path: `/${string}`,
	params: Record<string, string>
) => {
	return getJson<T>(`${youtubeApiV3Base}${path}?${(
		new URLSearchParams({
			key: requiredPublicEnvString(publicEnv, 'PUBLIC_YOUTUBE_API_KEY'),
			...params,
		}).toString()
	)}`, {
		origins: youtubeOrigins,
	})
}

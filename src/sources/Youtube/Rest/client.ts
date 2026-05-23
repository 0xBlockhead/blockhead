import { getJson } from '$/lib/http.ts'
import Youtube from '$/sources/Youtube/index.ts'
import { youtubeApiV3Base } from '$/sources/Youtube/Rest/constants.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'

export const youtubeApiV3Get = async <T>(
	publicEnv: SourcePublicEnvFor<Source.Youtube_Rest>,
	path: `/${string}`,
	params: Record<string, string>,
) => {
	const key = publicEnv.PUBLIC_YOUTUBE_API_KEY
	if (typeof key !== 'string' || key.trim() === '') {
		throw new Error('Youtube_Rest: set PUBLIC_YOUTUBE_API_KEY (YouTube Data API v3 key)')
	}
	return getJson<T>(`${youtubeApiV3Base}${path}?${(
		new URLSearchParams({
			key: key.trim(),
			...params,
		}).toString()
	)}`, {
		origins: Youtube.origins ?? [],
	})
}

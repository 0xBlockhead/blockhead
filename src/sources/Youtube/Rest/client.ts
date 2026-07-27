import { requiredPublicEnvString } from '$/sources/$sources.ts'
import {
	firstHttpUrlForBinding,
	sourceGetJson,
} from '$/sources/_runtime/http.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import bindings from '$/sources/Youtube/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Youtube_Rest]

export const youtubeApiV3Get = async <T>(
	publicEnv: SourcePublicEnv,
	path: `/${string}`,
	params: Record<string, string>
) => {
	return sourceGetJson<T>(binding, `${firstHttpUrlForBinding(binding)}/youtube/v3${path}?${(
		new URLSearchParams({
			key: requiredPublicEnvString(publicEnv, 'PUBLIC_YOUTUBE_API_KEY'),
			...params,
		}).toString()
	)}`)
}

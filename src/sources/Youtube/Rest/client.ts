import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { requiredPublicEnvString } from '$/sources/$sources.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'
import {
	youtubeApiV3Base,
} from '$/sources/Youtube/Rest/constants.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'

const youtubeRestBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((binding) => binding.source === Source.Youtube_Rest)

if (youtubeRestBinding == null)
	throw new Error('Youtube_Rest: missing source binding')

export const youtubeApiV3Get = async <T>(
	publicEnv: SourcePublicEnv,
	path: `/${string}`,
	params: Record<string, string>
) => {
	return sourceGetJson<T>(youtubeRestBinding, `${youtubeApiV3Base}${path}?${(
		new URLSearchParams({
			key: requiredPublicEnvString(publicEnv, 'PUBLIC_YOUTUBE_API_KEY'),
			...params,
		}).toString()
	)}`)
}

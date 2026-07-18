import { fetchFailedMessage } from '$/lib/http.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'
import {
	redditPublicOrigin,
	redditUserAgent,
} from '$/sources/RedditPublic/Rest/constants.ts'

const redditPublicBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((binding) => binding.source === Source.Reddit_PublicJson)

if (redditPublicBinding == null)
	throw new Error('Reddit_PublicJson: missing source binding')

const redditPublicGet = async (path: string) => {
	const url = `${redditPublicOrigin}${path.startsWith('/') ? path : `/${path}`}`
	const response = await sourceFetch(redditPublicBinding, url, {
		headers: {
			'User-Agent': redditUserAgent,
		},
	})

	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	return response
}

export const redditJsonGet = async <T>(path: string) => (
	(await redditPublicGet(path)).json<T>()
)

export const redditTextGet = async (path: string) => (
	(await redditPublicGet(path)).text()
)

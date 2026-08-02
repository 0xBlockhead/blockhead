import { fetchFailedMessage } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import { redditUserAgent } from '$/sources/RedditPublic/Rest/constants.ts'
import bindings from '$/sources/RedditPublic/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Reddit_PublicJson][0]

const redditPublicGet = async (path: string) => {
	const url = `${firstHttpUrlForBinding(binding)}${path.startsWith('/') ? path : `/${path}`}`
	const response = await sourceFetch(binding, url, {
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

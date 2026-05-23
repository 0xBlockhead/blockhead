import { getJson } from '$/lib/http.ts'
import RedditPublic from '$/sources/RedditPublic/index.ts'
import {
	redditPublicOrigin,
	redditUserAgent,
} from '$/sources/RedditPublic/Rest/constants.ts'

export const redditJsonGet = async <T>(path: string) => (
	getJson<T>(
		`${redditPublicOrigin}${path.startsWith('/') ? path : `/${path}`}`,
		{
			origins: RedditPublic.origins ?? [],
			init: {
				headers: {
					'User-Agent': redditUserAgent,
				},
			},
		},
	)
)

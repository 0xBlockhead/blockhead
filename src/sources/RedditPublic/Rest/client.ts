import {
	getJson,
	getText,
} from '$/lib/http.ts'
import {
	redditPublicOrigin,
	redditPublicOrigins,
	redditUserAgent,
} from '$/sources/RedditPublic/Rest/constants.ts'

export const redditJsonGet = async <T>(path: string) => (
	getJson<T>(
		`${redditPublicOrigin}${path.startsWith('/') ? path : `/${path}`}`,
		{
			origins: redditPublicOrigins,
			init: {
				headers: {
					'User-Agent': redditUserAgent,
				},
			},
		}
	)
)

export const redditTextGet = async (path: string) => (
	getText(
		`${redditPublicOrigin}${path.startsWith('/') ? path : `/${path}`}`,
		{
			origins: redditPublicOrigins,
			init: {
				headers: {
					'User-Agent': redditUserAgent,
				},
			},
		}
	)
)

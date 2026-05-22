import { getJson } from '$/lib/http.ts'
import {
	redditPublicApiOrigins,
	redditPublicOrigin,
	redditUserAgent,
} from '$/sources/RedditPublic/Rest/constants.ts'

export const redditJsonGet = async <T>(path: string) => (
	getJson<T>(
		`${redditPublicOrigin}${path.startsWith('/') ? path : `/${path}`}`,
		{
			origins: redditPublicApiOrigins,
			init: {
				headers: {
					'User-Agent': redditUserAgent,
				},
			},
		},
	)
)

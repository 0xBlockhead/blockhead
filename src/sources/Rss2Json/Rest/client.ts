import { getJson } from '$/lib/http.ts'
import {
	rss2JsonApiOrigins,
	rss2JsonOrigin,
} from '$/sources/Rss2Json/Rest/constants.ts'
import type { Rss2JsonResponse } from '$/sources/Rss2Json/Rest/types.ts'

export const rss2JsonGet = async (
	path: string
) => (
	getJson<Rss2JsonResponse>(
		`${rss2JsonOrigin}${path.startsWith('/') ? path : `/${path}`}`,
		{
			origins: rss2JsonApiOrigins,
		}
	)
)

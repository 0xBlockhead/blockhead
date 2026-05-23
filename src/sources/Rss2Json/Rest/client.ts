import { getJson } from '$/lib/http.ts'
import Rss2Json from '$/sources/Rss2Json/index.ts'
import { rss2JsonOrigin } from '$/sources/Rss2Json/Rest/constants.ts'
import type { Rss2JsonResponseWire } from '$/sources/Rss2Json/Rest/types.ts'

export const rss2JsonGet = async (
	path: string,
) => (
	getJson<Rss2JsonResponseWire>(
		`${rss2JsonOrigin}${path.startsWith('/') ? path : `/${path}`}`,
		{
			origins: Rss2Json.origins ?? [],
		},
	)
)

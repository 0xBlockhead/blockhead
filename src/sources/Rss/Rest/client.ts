import { getText } from '$/lib/http.ts'
import Rss from '$/sources/Rss/index.ts'
import { normalizeRssFeedUrl } from '$/sources/Rss/Rest/constants.ts'
import { parseRssFeedXml } from '$/sources/Rss/Rest/parseFeed.ts'
import type { ParsedRssFeedWire } from '$/sources/Rss/Rest/types.ts'

export const rssFetchFeed = async (feedUrl: string) => (
	parseRssFeedXml(
		await getText(
			normalizeRssFeedUrl(feedUrl),
			{
				origins: Rss.origins ?? [],
			},
		),
	) satisfies ParsedRssFeedWire
)

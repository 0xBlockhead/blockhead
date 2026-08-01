import { rssFetchFeed } from '$/sources/Rss/Rest/client.ts'

export const getFeed = (
	feedUrl: string
) => (
	rssFetchFeed(feedUrl)
)

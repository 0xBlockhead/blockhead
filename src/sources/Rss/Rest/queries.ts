import { rssFetchFeed } from '$/sources/Rss/Rest/client.ts'

export const getFeed = async (
	feedUrl: string
) => (
	rssFetchFeed(feedUrl)
)

export const listFeedItems = async (
	feedUrl: string,
	limit: number
) => (
	(await rssFetchFeed(feedUrl)).items.slice(0, limit)
)

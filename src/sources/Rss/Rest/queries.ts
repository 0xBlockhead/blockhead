import { rssFetchFeed } from '$/sources/Rss/Rest/client.ts'

export const rssGetFeed = async (
	feedUrl: string,
) => (
	rssFetchFeed(feedUrl)
)

export const rssListFeedItems = async (
	feedUrl: string,
	limit: number,
) => (
	(await rssFetchFeed(feedUrl)).items.slice(0, limit)
)

import { rssResolvers } from '$/resolvers/Rss.ts'
import { Source } from '$/sources/Source.ts'

export default rssResolvers({
	loadFeed: async (feedUrl) => (await import('$/sources/Rss/Rest/queries.ts')).getFeed(feedUrl),
	source: Source.Rss_Rest,
})

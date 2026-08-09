import { rssResolvers } from '$/resolvers/Rss.ts'
import { Source } from '$/sources/Source.ts'

export default rssResolvers({
	loadFeed: async (feedUrl) => {
		const { getFeed, rssBindingByOrigin } = await import('$/sources/Rss/Rest/queries.ts')
		const binding = rssBindingByOrigin.get(new URL(feedUrl).origin)
		if (binding == null)
			throw new Error(`Rss_Rest: source binding is missing for ${feedUrl}`)

		return getFeed(binding, feedUrl)
	},
	source: Source.Rss_Rest,
})

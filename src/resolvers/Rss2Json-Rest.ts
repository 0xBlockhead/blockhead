import { optionalNonemptyString } from '$/lib/string.ts'
import { rssResolvers } from '$/resolvers/Rss.ts'
import { Source } from '$/sources/Source.ts'
import { rssTimestampMs } from '$/sources/_shared/interfaces/Rss/constants.ts'

export default rssResolvers({
	loadFeed: async (feedUrl) => {
		const response = await (await import('$/sources/Rss2Json/Rest/queries.ts')).getFeed(
			feedUrl
		)
		const feed = response.feed
		if (feed == null)
			throw new Error('Rss2Json_Rest: feed not found')

		const feedTitle = optionalNonemptyString(feed.title)
		const feedDescription = optionalNonemptyString(feed.description)
		const feedSiteUrl = optionalNonemptyString(feed.link)
		const feedImageUrl = optionalNonemptyString(feed.image)
		return {
			...(feedTitle != null && {
				title: feedTitle,
			}),
			...(feedDescription != null && {
				description: feedDescription,
			}),
			...(feedSiteUrl != null && {
				siteUrl: feedSiteUrl,
			}),
			...(feedImageUrl != null && {
				imageUrl: feedImageUrl,
			}),
			items: (response.items ?? []).map((feedItem) => {
				const itemTitle = optionalNonemptyString(feedItem.title)
				const itemLink = optionalNonemptyString(feedItem.link)
				const itemDescription = optionalNonemptyString(feedItem.description)
				const itemContent = optionalNonemptyString(feedItem.content)
				const itemAuthor = optionalNonemptyString(feedItem.author)
				const itemPublishedAt = rssTimestampMs(feedItem.pubDate)
				const itemEnclosureUrl = optionalNonemptyString(feedItem.enclosure?.[0]?.url)
				return {
					...(feedItem.guid != null && { guid: feedItem.guid }),
					...(itemTitle != null && {
						title: itemTitle,
					}),
					...(itemLink != null && {
						link: itemLink,
					}),
					...(itemDescription != null && {
						description: itemDescription,
					}),
					...(itemContent != null && {
						content: itemContent,
					}),
					...(itemAuthor != null && {
						author: itemAuthor,
					}),
					...(itemPublishedAt != null && { publishedAt: itemPublishedAt }),
					...(feedItem.categories != null && feedItem.categories.length > 0 && {
						categories: feedItem.categories,
					}),
					...(itemEnclosureUrl != null && { enclosureUrl: itemEnclosureUrl }),
				}
			}),
		}
	},
	source: Source.Rss2Json_Rest,
})

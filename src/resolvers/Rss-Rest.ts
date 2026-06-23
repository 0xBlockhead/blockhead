import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { rssNetworkSeedFeeds } from '$/constants/Social/Rss.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { RssFeedSelector } from '$/schema/RssFeed.ts'
import { RssItemSelector } from '$/schema/RssItem.ts'
import { _GlobalRssNetworkSelector } from '$/schema/_GlobalRssNetwork.ts'


export default {
	source: Source.Rss_Rest,

	resolvers: [
		defineResolver(Source.Rss_Rest, {
			entityType: EntityType.RssFeed,
			resolve: {
				[RssFeedSelector.FeedUrl]: async ({ feedUrl: feedUrlSelector }) => {
				const { normalizeRssFeedUrl } = await import('$/sources/Rss/Rest/constants.ts')
				const { getFeed } = await import('$/sources/Rss/Rest/queries.ts')
				const feedUrl = normalizeRssFeedUrl(feedUrlSelector)
				const feed = await getFeed(feedUrl)
				return {
					...(feed.title != null && { title: feed.title }),
					...(feed.description != null && { description: feed.description }),
					...(feed.link != null && { link: feed.link }),
					...(feed.siteUrl != null && { siteUrl: feed.siteUrl }),
					...(feed.language != null && { language: feed.language }),
					...(feed.lastBuildDate != null && {
						lastBuildDate: feed.lastBuildDate,
					}),
					...(feed.imageUrl != null && { imageUrl: feed.imageUrl }),
				}
			}
			}
		})({
				fields: {
			title: (snapshot) => snapshot.title,
			description: (snapshot) => snapshot.description,
			link: (snapshot) => snapshot.link,
			siteUrl: (snapshot) => snapshot.siteUrl,
			language: (snapshot) => snapshot.language,
			lastBuildDate: (snapshot) => snapshot.lastBuildDate,
			imageUrl: (snapshot) => snapshot.imageUrl,
		},
			}),

		defineResolver(Source.Rss_Rest, {
			entityType: EntityType.RssItem,
			resolve: {
				[RssItemSelector.FeedUrlGuid]: async ({ feedUrl: feedUrlSelector, guid }) => {
				const {
					normalizeRssFeedUrl,
					rssItemGuidFromParts,
				} = await import('$/sources/Rss/Rest/constants.ts')
				const { getFeed } = await import('$/sources/Rss/Rest/queries.ts')
				const feedUrl = normalizeRssFeedUrl(feedUrlSelector)
				const feed = await getFeed(feedUrl)
				const feedItem = feed.items.find((candidate) => (
					rssItemGuidFromParts(candidate.guid, candidate.link, candidate.title) === guid
				))
				if (feedItem == null) throw new Error('Rss_Rest: feed item not found')
				return {
					...(feedItem.title != null && { title: feedItem.title }),
					...(feedItem.link != null && { link: feedItem.link }),
					...(feedItem.description != null && { description: feedItem.description }),
					...(feedItem.content != null && { content: feedItem.content }),
					...(feedItem.author != null && { author: feedItem.author }),
					...(feedItem.publishedAt != null && {
						publishedAt: feedItem.publishedAt,
					}),
					...(feedItem.updatedAt != null && {
						updatedAt: feedItem.updatedAt,
					}),
					...(feedItem.categories != null && feedItem.categories.length > 0 && {
						categories: feedItem.categories,
					}),
					...(feedItem.enclosureUrl != null && { enclosureUrl: feedItem.enclosureUrl }),
					...(feedItem.commentsUrl != null && { commentsUrl: feedItem.commentsUrl }),
					$feed: {
						[EntityMetaKey.Selector]: { feedUrl },
					},
				}
			}
			}
		})({
				fields: {
			title: (snapshot) => snapshot.title,
			link: (snapshot) => snapshot.link,
			description: (snapshot) => snapshot.description,
			content: (snapshot) => snapshot.content,
			author: (snapshot) => snapshot.author,
			publishedAt: (snapshot) => snapshot.publishedAt,
			updatedAt: (snapshot) => snapshot.updatedAt,
			categories: (snapshot) => snapshot.categories,
			enclosureUrl: (snapshot) => snapshot.enclosureUrl,
			commentsUrl: (snapshot) => snapshot.commentsUrl,
			$feed: (snapshot) => snapshot.$feed,
		},
			}),

			defineResolver(Source.Rss_Rest, {
				entityType: EntityType._GlobalRssNetwork,
				resolve: {
					[_GlobalRssNetworkSelector.Scope]: async (_entitySelector, context) => {
				const {
					normalizeRssFeedUrl,
					rssItemGuidFromParts,
				} = await import('$/sources/Rss/Rest/constants.ts')
				const { listFeedItems } = await import('$/sources/Rss/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const perFeedLimit = Math.max(1, Math.ceil(limit / rssNetworkSeedFeeds.length))
				const refs: { [EntityMetaKey.Selector]: { feedUrl: string, guid: string } }[] = []
				for (const seedFeed of rssNetworkSeedFeeds) {
					const feedUrl = normalizeRssFeedUrl(seedFeed.feedUrl)
					for (const feedItem of await listFeedItems(feedUrl, perFeedLimit)) {
						const guid = rssItemGuidFromParts(feedItem.guid, feedItem.link, feedItem.title)
						refs.push({
							[EntityMetaKey.Selector]: {
								feedUrl,
								guid,
							},
						})
						if (refs.length >= limit) break
					}
					if (refs.length >= limit) break
				}
				return refs.slice(0, limit)
			}
			}
		    })({
					fields: {
				$$sourceWindowItems: (snapshot) => snapshot,
			},
				}),

		defineResolver(Source.Rss_Rest, {
			entityType: EntityType.RssFeed,
			resolve: {
				[RssFeedSelector.FeedUrl]: async ({ feedUrl: feedUrlSelector }, context) => {
				const {
					normalizeRssFeedUrl,
					rssItemGuidFromParts,
				} = await import('$/sources/Rss/Rest/constants.ts')
				const { listFeedItems } = await import('$/sources/Rss/Rest/queries.ts')
				const feedUrl = normalizeRssFeedUrl(feedUrlSelector)
				const limit = resolverContextRowLimit(context)
				return (
					(await listFeedItems(feedUrl, limit))
						.map((feedItem) => ({
							[EntityMetaKey.Selector]: {
								feedUrl,
								guid: rssItemGuidFromParts(feedItem.guid, feedItem.link, feedItem.title),
							},
						}))
				)
			}
			}
		})({
				fields: {
			$$items: (snapshot) => snapshot,
		},
			}),
	],
}

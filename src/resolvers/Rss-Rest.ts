import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { rssNetworkSeedFeeds } from '$/constants/Social/Rss.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'


export default {
	source: Source.Rss_Rest,

	resolvers: [
		defineResolver(Source.Rss_Rest, {
			entityType: EntityType.RssFeed,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { normalizeRssFeedUrl } = await import('$/sources/Rss/Rest/constants.ts')
				const { getFeed } = await import('$/sources/Rss/Rest/queries.ts')
				const feedUrl = normalizeRssFeedUrl(entityId.feedUrl)
				const feed = await singleFlight(getFeed)(feedUrl)
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
			},
			fields: {
			title: (snapshot) => snapshot.title,
			description: (snapshot) => snapshot.description,
			link: (snapshot) => snapshot.link,
			siteUrl: (snapshot) => snapshot.siteUrl,
			language: (snapshot) => snapshot.language,
			lastBuildDate: (snapshot) => snapshot.lastBuildDate,
			imageUrl: (snapshot) => snapshot.imageUrl,
		}
		}),

		defineResolver(Source.Rss_Rest, {
			entityType: EntityType.RssItem,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const {
					normalizeRssFeedUrl,
					rssItemGuidFromParts,
				} = await import('$/sources/Rss/Rest/constants.ts')
				const { getFeed } = await import('$/sources/Rss/Rest/queries.ts')
				const feedUrl = normalizeRssFeedUrl(entityId.feedUrl)
				const feed = await singleFlight(getFeed)(feedUrl)
				const feedItem = feed.items.find((candidate) => (
					rssItemGuidFromParts(candidate.guid, candidate.link, candidate.title) === entityId.guid
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
						[EntityMetaKey.Id]: { feedUrl },
					},
				}
			}
			},
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
		}
		}),

		defineResolver(Source.Rss_Rest, {
			entityType: EntityType.RssNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (_entityId, context) => {
				const {
					normalizeRssFeedUrl,
					rssItemGuidFromParts,
				} = await import('$/sources/Rss/Rest/constants.ts')
				const { listFeedItems } = await import('$/sources/Rss/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const perFeedLimit = Math.max(1, Math.ceil(limit / rssNetworkSeedFeeds.length))
				const refs: { [EntityMetaKey.Id]: { feedUrl: string, guid: string } }[] = []
				for (const seedFeed of rssNetworkSeedFeeds) {
					const feedUrl = normalizeRssFeedUrl(seedFeed.feedUrl)
					for (const feedItem of await singleFlight(listFeedItems)(feedUrl, perFeedLimit)) {
						const guid = rssItemGuidFromParts(feedItem.guid, feedItem.link, feedItem.title)
						refs.push({
							[EntityMetaKey.Id]: {
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
			},
			fields: {
			$$rssItems: (snapshot) => snapshot,
		}
		}),

		defineResolver(Source.Rss_Rest, {
			entityType: EntityType.RssFeed,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const {
					normalizeRssFeedUrl,
					rssItemGuidFromParts,
				} = await import('$/sources/Rss/Rest/constants.ts')
				const { listFeedItems } = await import('$/sources/Rss/Rest/queries.ts')
				const feedUrl = normalizeRssFeedUrl(entityId.feedUrl)
				const limit = resolverContextRowLimit(context)
				return (
					(await singleFlight(listFeedItems)(feedUrl, limit))
						.map((feedItem) => ({
							[EntityMetaKey.Id]: {
								feedUrl,
								guid: rssItemGuidFromParts(feedItem.guid, feedItem.link, feedItem.title),
							},
						}))
				)
			}
			},
			fields: {
			$$items: (snapshot) => snapshot,
		}
		}),
	],
}

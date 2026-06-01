import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { rssNetworkSeedFeeds } from '$/constants/Social/Rss.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const optionalTrimmedString = (value: string | undefined) => (
	value?.trim() || undefined
)

export default {
	source: Source.Rss_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.RssFeed,
			resolve: async (entityId) => {
				const { normalizeRssFeedUrl } = await import('$/sources/Rss/Rest/constants.ts')
				const { getFeed } = await import('$/sources/Rss/Rest/queries.ts')
				const feedUrl = normalizeRssFeedUrl(entityId.feedUrl)
				const feed = await singleFlight(getFeed)(feedUrl)
				if (feed == null) throw new Error('Rss_Rest: feed not found')
				return {
					...(optionalTrimmedString(feed.title) != null && {
						title: optionalTrimmedString(feed.title),
					}),
					...(optionalTrimmedString(feed.description) != null && {
						description: optionalTrimmedString(feed.description),
					}),
					...(optionalTrimmedString(feed.link) != null && {
						link: optionalTrimmedString(feed.link),
					}),
					...(optionalTrimmedString(feed.siteUrl) != null && {
						siteUrl: optionalTrimmedString(feed.siteUrl),
					}),
					...(optionalTrimmedString(feed.language) != null && {
						language: optionalTrimmedString(feed.language),
					}),
					...(feed.lastBuildDate != null && {
						lastBuildDate: feed.lastBuildDate,
					}),
					...(optionalTrimmedString(feed.imageUrl) != null && {
						imageUrl: optionalTrimmedString(feed.imageUrl),
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.RssItem,
			resolve: async (entityId) => {
				const {
					normalizeRssFeedUrl,
					rssItemGuidFromParts,
				} = await import('$/sources/Rss/Rest/constants.ts')
				const { getFeed } = await import('$/sources/Rss/Rest/queries.ts')
				const feedUrl = normalizeRssFeedUrl(entityId.feedUrl)
				const feed = await singleFlight(getFeed)(feedUrl)
				if (feed == null) throw new Error('Rss_Rest: feed not found')
				const feedItem = feed.items.find((candidate) => (
					rssItemGuidFromParts(candidate.guid, candidate.link, candidate.title) === entityId.guid
				))
				if (feedItem == null) throw new Error('Rss_Rest: feed item not found')
				return {
					...(optionalTrimmedString(feedItem.title) != null && {
						title: optionalTrimmedString(feedItem.title),
					}),
					...(optionalTrimmedString(feedItem.link) != null && {
						link: optionalTrimmedString(feedItem.link),
					}),
					...(optionalTrimmedString(feedItem.description) != null && {
						description: optionalTrimmedString(feedItem.description),
					}),
					...(optionalTrimmedString(feedItem.content) != null && {
						content: optionalTrimmedString(feedItem.content),
					}),
					...(optionalTrimmedString(feedItem.author) != null && {
						author: optionalTrimmedString(feedItem.author),
					}),
					...(feedItem.publishedAt != null && {
						publishedAt: feedItem.publishedAt,
					}),
					...(feedItem.updatedAt != null && {
						updatedAt: feedItem.updatedAt,
					}),
					...(feedItem.categories != null && feedItem.categories.length > 0 && {
						categories: feedItem.categories,
					}),
					...(optionalTrimmedString(feedItem.enclosureUrl) != null && {
						enclosureUrl: optionalTrimmedString(feedItem.enclosureUrl),
					}),
					...(optionalTrimmedString(feedItem.commentsUrl) != null && {
						commentsUrl: optionalTrimmedString(feedItem.commentsUrl),
					}),
					$feed: {
						[EntityMetaKey.Id]: { feedUrl },
					},
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.RssNetwork,
			fieldName: '$$rssItems',
			resolve: async (_entityId, context) => {
				const {
					normalizeRssFeedUrl,
					rssItemGuidFromParts,
				} = await import('$/sources/Rss/Rest/constants.ts')
				const { listFeedItems } = await import('$/sources/Rss/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.RssFeed,
			fieldName: '$$items',
			resolve: async (entityId, context) => {
				const {
					normalizeRssFeedUrl,
					rssItemGuidFromParts,
				} = await import('$/sources/Rss/Rest/constants.ts')
				const { listFeedItems } = await import('$/sources/Rss/Rest/queries.ts')
				const feedUrl = normalizeRssFeedUrl(entityId.feedUrl)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					(await singleFlight(listFeedItems)(feedUrl, limit))
						.map((feedItem) => ({
							[EntityMetaKey.Id]: {
								feedUrl,
								guid: rssItemGuidFromParts(feedItem.guid, feedItem.link, feedItem.title),
							},
						}))
				)
			},
		}),
	],
}

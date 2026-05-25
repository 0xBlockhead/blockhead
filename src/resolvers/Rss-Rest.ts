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
				const { rssGetFeed } = await import('$/sources/Rss/Rest/queries.ts')
				const feedUrl = normalizeRssFeedUrl(entityId.feedUrl)
				const feed = await singleFlight(rssGetFeed)(feedUrl)
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
				const { rssGetFeed } = await import('$/sources/Rss/Rest/queries.ts')
				const feedUrl = normalizeRssFeedUrl(entityId.feedUrl)
				const feed = await singleFlight(rssGetFeed)(feedUrl)
				if (feed == null) throw new Error('Rss_Rest: feed not found')
				const item = feed.items.find((candidate) => (
					rssItemGuidFromParts(candidate.guid, candidate.link, candidate.title) === entityId.guid
				))
				if (item == null) throw new Error('Rss_Rest: item not found')
				return {
					...(optionalTrimmedString(item.title) != null && {
						title: optionalTrimmedString(item.title),
					}),
					...(optionalTrimmedString(item.link) != null && {
						link: optionalTrimmedString(item.link),
					}),
					...(optionalTrimmedString(item.description) != null && {
						description: optionalTrimmedString(item.description),
					}),
					...(optionalTrimmedString(item.content) != null && {
						content: optionalTrimmedString(item.content),
					}),
					...(optionalTrimmedString(item.author) != null && {
						author: optionalTrimmedString(item.author),
					}),
					...(item.publishedAt != null && {
						publishedAt: item.publishedAt,
					}),
					...(item.updatedAt != null && {
						updatedAt: item.updatedAt,
					}),
					...(item.categories != null && item.categories.length > 0 && {
						categories: item.categories,
					}),
					...(optionalTrimmedString(item.enclosureUrl) != null && {
						enclosureUrl: optionalTrimmedString(item.enclosureUrl),
					}),
					...(optionalTrimmedString(item.commentsUrl) != null && {
						commentsUrl: optionalTrimmedString(item.commentsUrl),
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
				const { rssListFeedItems } = await import('$/sources/Rss/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				const perFeedLimit = Math.max(1, Math.ceil(limit / rssNetworkSeedFeeds.length))
				const refs: { [EntityMetaKey.Id]: { feedUrl: string, guid: string } }[] = []
				for (const seedFeed of rssNetworkSeedFeeds) {
					const feedUrl = normalizeRssFeedUrl(seedFeed.feedUrl)
					for (const item of await singleFlight(rssListFeedItems)(feedUrl, perFeedLimit)) {
						const guid = rssItemGuidFromParts(item.guid, item.link, item.title)
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
				const { rssListFeedItems } = await import('$/sources/Rss/Rest/queries.ts')
				const feedUrl = normalizeRssFeedUrl(entityId.feedUrl)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					(await singleFlight(rssListFeedItems)(feedUrl, limit))
						.map((item) => ({
							[EntityMetaKey.Id]: {
								feedUrl,
								guid: rssItemGuidFromParts(item.guid, item.link, item.title),
							},
						}))
				)
			},
		}),
	],
}

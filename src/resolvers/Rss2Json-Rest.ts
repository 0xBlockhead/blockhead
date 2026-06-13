import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { rssNetworkSeedFeeds } from '$/constants/Social/Rss.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'


export default {
	source: Source.Rss2Json_Rest,

	resolvers: [
		defineResolver(Source.Rss2Json_Rest, {
			entityType: EntityType.RssFeed,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { normalizeRssFeedUrl } = await import('$/sources/Rss/Rest/constants.ts')
				const { getFeed } = await import('$/sources/Rss2Json/Rest/queries.ts')
				const feedUrl = normalizeRssFeedUrl(entityId.feedUrl)
				const response = await singleFlight(getFeed)(
					feedUrl,
					1,
					context.publicEnv,
				)
				const feed = response.feed
				if (feed == null) throw new Error('Rss2Json_Rest: feed not found')
				const title = optionalNonemptyString(feed.title)
				const description = optionalNonemptyString(feed.description)
				const link = optionalNonemptyString(feed.link)
				const siteUrl = optionalNonemptyString(feed.url)
				const imageUrl = optionalNonemptyString(feed.image)
				return {
					...(title != null && { title }),
					...(description != null && { description }),
					...(link != null && { link }),
					...(siteUrl != null && { siteUrl }),
					...(imageUrl != null && { imageUrl }),
				}
			}
			}
		})({
				fields: {
			title: (snapshot) => snapshot.title,
			description: (snapshot) => snapshot.description,
			link: (snapshot) => snapshot.link,
			siteUrl: (snapshot) => snapshot.siteUrl,
			imageUrl: (snapshot) => snapshot.imageUrl,
		},
			}),

		defineResolver(Source.Rss2Json_Rest, {
			entityType: EntityType.RssItem,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const {
					normalizeRssFeedUrl,
					rssItemGuidFromParts,
					rssPublishedAtMs,
				} = await import('$/sources/Rss/Rest/constants.ts')
				const { getFeed } = await import('$/sources/Rss2Json/Rest/queries.ts')
				const feedUrl = normalizeRssFeedUrl(entityId.feedUrl)
				const feedItem = (
					(await singleFlight(getFeed)(feedUrl, 50, context.publicEnv)).items ?? []
				).find((candidate) => (
					rssItemGuidFromParts(candidate.guid, candidate.link, candidate.title) === entityId.guid
				))
				if (feedItem == null) throw new Error('Rss2Json_Rest: feed item not found')
				const title = optionalNonemptyString(feedItem.title)
				const link = optionalNonemptyString(feedItem.link)
				const description = optionalNonemptyString(feedItem.description)
				const content = optionalNonemptyString(feedItem.content)
				const author = optionalNonemptyString(feedItem.author)
				const publishedAt = rssPublishedAtMs(feedItem.pubDate)
				const enclosureUrl = optionalNonemptyString(feedItem.enclosure?.[0]?.url)
				return {
					...(title != null && { title }),
					...(link != null && { link }),
					...(description != null && { description }),
					...(content != null && { content }),
					...(author != null && { author }),
					...(publishedAt != null && { publishedAt }),
					...(feedItem.categories != null && feedItem.categories.length > 0 && {
						categories: feedItem.categories,
					}),
					...(enclosureUrl != null && { enclosureUrl }),
					$feed: {
						[EntityMetaKey.Id]: { feedUrl },
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
			categories: (snapshot) => snapshot.categories,
			enclosureUrl: (snapshot) => snapshot.enclosureUrl,
			$feed: (snapshot) => snapshot.$feed,
		},
			}),

		defineResolver(Source.Rss2Json_Rest, {
			entityType: EntityType.RssNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (_entityId, context) => {
				const {
					normalizeRssFeedUrl,
					rssItemGuidFromParts,
				} = await import('$/sources/Rss/Rest/constants.ts')
				const { getFeed } = await import('$/sources/Rss2Json/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const perFeedLimit = Math.max(1, Math.ceil(limit / rssNetworkSeedFeeds.length))
				const refs: { [EntityMetaKey.Id]: { feedUrl: string, guid: string } }[] = []
				for (const seedFeed of rssNetworkSeedFeeds) {
					const feedUrl = normalizeRssFeedUrl(seedFeed.feedUrl)
					for (const feedItem of (await singleFlight(getFeed)(
						feedUrl,
						perFeedLimit,
						context.publicEnv,
					)).items ?? []) {
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
			}
		})({
				fields: {
			$$rssItems: (snapshot) => snapshot,
		},
			}),

		defineResolver(Source.Rss2Json_Rest, {
			entityType: EntityType.RssFeed,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const {
					normalizeRssFeedUrl,
					rssItemGuidFromParts,
				} = await import('$/sources/Rss/Rest/constants.ts')
				const { getFeed } = await import('$/sources/Rss2Json/Rest/queries.ts')
				const feedUrl = normalizeRssFeedUrl(entityId.feedUrl)
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(getFeed)(feedUrl, limit, context.publicEnv)).items ?? [])
						.map((feedItem) => ({
							[EntityMetaKey.Id]: {
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

import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
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
	source: Source.Rss2Json_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.RssFeed,
			resolve: async (entityId, context) => {
				const { normalizeRssFeedUrl } = await import('$/sources/Rss/Rest/constants.ts')
				const { rss2JsonGetFeed } = await import('$/sources/Rss2Json/Rest/queries.ts')
				const feedUrl = normalizeRssFeedUrl(entityId.feedUrl)
				const response = await singleFlight(rss2JsonGetFeed)(
						feedUrl,
						1,
						sourcePublicEnv(context, Source.Rss2Json_Rest),
				)
				const feed = response.feed
				if (feed == null) throw new Error('Rss2Json_Rest: feed not found')
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
					...(optionalTrimmedString(feed.url) != null && {
						siteUrl: optionalTrimmedString(feed.url),
					}),
					...(optionalTrimmedString(feed.image) != null && {
						imageUrl: optionalTrimmedString(feed.image),
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.RssItem,
			resolve: async (entityId, context) => {
				const {
					normalizeRssFeedUrl,
					rssItemGuidFromParts,
					rssPublishedAtMs,
				} = await import('$/sources/Rss/Rest/constants.ts')
				const { rss2JsonGetFeed } = await import('$/sources/Rss2Json/Rest/queries.ts')
				const feedUrl = normalizeRssFeedUrl(entityId.feedUrl)
				const item = (
						(await singleFlight(rss2JsonGetFeed)(feedUrl, 50, sourcePublicEnv(context, Source.Rss2Json_Rest))).items ?? []
				).find((candidate) => (
					rssItemGuidFromParts(candidate.guid, candidate.link, candidate.title) === entityId.guid
				))
				if (item == null) throw new Error('Rss2Json_Rest: item not found')
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
					...(rssPublishedAtMs(item.pubDate) != null && {
						publishedAt: rssPublishedAtMs(item.pubDate),
					}),
					...(item.categories != null && item.categories.length > 0 && {
						categories: item.categories,
					}),
					...(optionalTrimmedString(item.enclosure?.[0]?.url) != null && {
						enclosureUrl: optionalTrimmedString(item.enclosure?.[0]?.url),
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
				const { rss2JsonGetFeed } = await import('$/sources/Rss2Json/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				const perFeedLimit = Math.max(1, Math.ceil(limit / rssNetworkSeedFeeds.length))
				const refs: { [EntityMetaKey.Id]: { feedUrl: string, guid: string } }[] = []
				for (const seedFeed of rssNetworkSeedFeeds) {
					const feedUrl = normalizeRssFeedUrl(seedFeed.feedUrl)
					for (const item of (await singleFlight(rss2JsonGetFeed)(
							feedUrl,
							perFeedLimit,
							sourcePublicEnv(context, Source.Rss2Json_Rest),
					)).items ?? []) {
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
				const { rss2JsonGetFeed } = await import('$/sources/Rss2Json/Rest/queries.ts')
				const feedUrl = normalizeRssFeedUrl(entityId.feedUrl)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
						((await singleFlight(rss2JsonGetFeed)(feedUrl, limit, sourcePublicEnv(context, Source.Rss2Json_Rest))).items ?? [])
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

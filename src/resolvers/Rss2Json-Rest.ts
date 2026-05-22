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
import {
	normalizeRssFeedUrl,
	rssItemGuidFromParts,
	rssPublishedAtMs,
} from '$/sources/Rss/Rest/constants.ts'

const optionalTrimmedString = (value: string | undefined) => (
	value?.trim() ?
		value.trim()
	:
		undefined
)

export default {
	source: Source.Rss2Json_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.RssFeed,
			resolve: async (entityId, context) => {
				const { rss2JsonGetFeed } = await import('$/sources/Rss2Json/Rest/queries.ts')
				const feedUrl = normalizeRssFeedUrl(entityId.feedUrl)
				const response = await singleFlight(rss2JsonGetFeed)(
					feedUrl,
					1,
					context.publicEnv,
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
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.RssItem,
			resolve: async (entityId, context) => {
				const { rss2JsonGetFeed } = await import('$/sources/Rss2Json/Rest/queries.ts')
				const feedUrl = normalizeRssFeedUrl(entityId.feedUrl)
				const item = (
					(await singleFlight(rss2JsonGetFeed)(feedUrl, 50, context.publicEnv)).items ?? []
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
				const { rss2JsonGetFeed } = await import('$/sources/Rss2Json/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				const perFeedLimit = Math.max(1, Math.ceil(limit / rssNetworkSeedFeeds.length))
				const byKey = new Map<string, { [EntityMetaKey.Id]: { feedUrl: string, guid: string } }>()
				for (const seedFeed of rssNetworkSeedFeeds) {
					const feedUrl = normalizeRssFeedUrl(seedFeed.feedUrl)
					for (const item of (await singleFlight(rss2JsonGetFeed)(
						feedUrl,
						perFeedLimit,
						context.publicEnv,
					)).items ?? []) {
						const guid = rssItemGuidFromParts(item.guid, item.link, item.title)
						const key = `${feedUrl}\0${guid}`
						byKey.set(key, {
							[EntityMetaKey.Id]: {
								feedUrl,
								guid,
							},
						})
					}
				}
				return [...byKey.values()].slice(0, limit)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.RssFeed,
			fieldName: '$$items',
			resolve: async (entityId, context) => {
				const { rss2JsonGetFeed } = await import('$/sources/Rss2Json/Rest/queries.ts')
				const feedUrl = normalizeRssFeedUrl(entityId.feedUrl)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(rss2JsonGetFeed)(feedUrl, limit, context.publicEnv)).items ?? [])
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

import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import {
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
				FeedUrl: {
					resolve: async ({ feedUrl: feedUrlSelector }, context) => {
					const {
						normalizeRssFeedUrl,
						rssItemIdentityFromParts,
					} = await import('$/sources/Rss/Rest/constants.ts')
					const { getFeed } = await import('$/sources/Rss2Json/Rest/queries.ts')
					const feedUrl = normalizeRssFeedUrl(feedUrlSelector)
					const response = await getFeed(
						feedUrl,
						resolverContextRowLimit(context)
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
						items: (response.items ?? [])
							.flatMap((feedItem) => {
								const identity = rssItemIdentityFromParts(feedItem.guid, feedItem.link)
								return identity == null ? [] : [{
									[EntityMetaKey.Selector]: {
										$feed: { feedUrl },
										...identity,
									},
								}]
							}),
					}
				},
				}
			}
		})({
			title: (snapshot) => snapshot.title,
			description: (snapshot) => snapshot.description,
			link: (snapshot) => snapshot.link,
			siteUrl: (snapshot) => snapshot.siteUrl,
			imageUrl: (snapshot) => snapshot.imageUrl,
			$$items: (snapshot) => snapshot.items,
		}),

		defineResolver(Source.Rss2Json_Rest, {
			entityType: EntityType.RssItem,
			resolve: {
				FeedIdentity: {
					resolve: async ({
						$feed,
						itemIdentityKind,
						itemIdentity,
					}) => {
					const {
						normalizeRssFeedUrl,
						rssItemIdentityFromParts,
						rssPublishedAtMs,
					} = await import('$/sources/Rss/Rest/constants.ts')
					const { getFeed } = await import('$/sources/Rss2Json/Rest/queries.ts')
					const feedUrl = normalizeRssFeedUrl($feed.feedUrl)
					const feedItem = (
						(await getFeed(feedUrl, 50)).items ?? []
					).find((candidate) => {
						const identity = rssItemIdentityFromParts(candidate.guid, candidate.link)
						return (
							identity?.itemIdentityKind === itemIdentityKind
							&& identity.itemIdentity === itemIdentity
						)
					})
					if (feedItem == null) throw new Error('Rss2Json_Rest: feed item not found')
					const title = optionalNonemptyString(feedItem.title)
					const link = optionalNonemptyString(feedItem.link)
					const description = optionalNonemptyString(feedItem.description)
					const content = optionalNonemptyString(feedItem.content)
					const author = optionalNonemptyString(feedItem.author)
					const publishedAt = rssPublishedAtMs(feedItem.pubDate)
					const enclosureUrl = optionalNonemptyString(feedItem.enclosure?.[0]?.url)
					return {
						itemIdentityKind,
						itemIdentity,
						...(feedItem.guid != null && { guid: feedItem.guid }),
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
							[EntityMetaKey.Selector]: { feedUrl },
						},
					}
				},
				}
			}
		})({
			itemIdentityKind: (snapshot) => snapshot.itemIdentityKind,
			itemIdentity: (snapshot) => snapshot.itemIdentity,
			guid: (snapshot) => snapshot.guid,
			title: (snapshot) => snapshot.title,
			link: (snapshot) => snapshot.link,
			description: (snapshot) => snapshot.description,
			content: (snapshot) => snapshot.content,
			author: (snapshot) => snapshot.author,
			publishedAt: (snapshot) => snapshot.publishedAt,
			categories: (snapshot) => snapshot.categories,
			enclosureUrl: (snapshot) => snapshot.enclosureUrl,
			$feed: (snapshot) => snapshot.$feed,
		}),

		defineResolver(Source.Rss2Json_Rest, {
			entityType: EntityType.RssFeed_Timestamp,
			resolve: {
				FeedTimestampMsSource: {
					resolve: async ({
						$feed,
						timestampMs,
						source,
					}) => {
						if (source !== Source.Rss2Json_Rest)
							throw new Error(`Rss2Json_Rest: unsupported source ${source}`)

						const { normalizeRssFeedUrl } = await import('$/sources/Rss/Rest/constants.ts')
						const { getFeed } = await import('$/sources/Rss2Json/Rest/queries.ts')
						const feedUrl = normalizeRssFeedUrl($feed.feedUrl)
						try {
							return {
								$feed: { [EntityMetaKey.Selector]: { feedUrl } },
								timestampMs,
								source,
								reachable: true,
								observedItemCount: (await getFeed(
									feedUrl,
									50
								)).items?.length ?? 0,
								fetchWindowKind: 'Feed',
							}
						} catch (error) {
							return {
								$feed: { [EntityMetaKey.Selector]: { feedUrl } },
								timestampMs,
								source,
								reachable: false,
								observedItemCount: 0,
								fetchWindowKind: 'Feed',
								error: error instanceof Error ? error.message : String(error),
							}
						}
					},
				},
			},
		})({
			$feed: (snapshot) => snapshot.$feed,
			timestampMs: (snapshot) => snapshot.timestampMs,
			source: (snapshot) => snapshot.source,
			reachable: (snapshot) => snapshot.reachable,
			observedItemCount: (snapshot) => snapshot.observedItemCount,
			fetchWindowKind: (snapshot) => snapshot.fetchWindowKind,
			error: (snapshot) => snapshot.error,
		}),

		defineResolver(Source.Rss2Json_Rest, {
			entityType: EntityType.RssItem_Timestamp,
			resolve: {
				ItemTimestampMsSource: {
					resolve: async ({
						$item,
						timestampMs,
						source,
					}) => {
					if (source !== Source.Rss2Json_Rest)
						throw new Error(`Rss2Json_Rest: unsupported source ${source}`)

					const {
						normalizeRssFeedUrl,
						rssItemIdentityFromParts,
					} = await import('$/sources/Rss/Rest/constants.ts')
					const { getFeed } = await import('$/sources/Rss2Json/Rest/queries.ts')
					try {
						const feedItem = (
							(await getFeed(
								normalizeRssFeedUrl($item.$feed.feedUrl),
								50
							)).items ?? []
						).find((candidate) => {
							const identity = rssItemIdentityFromParts(candidate.guid, candidate.link)
							return (
								identity?.itemIdentityKind === $item.itemIdentityKind
								&& identity.itemIdentity === $item.itemIdentity
							)
						})
						return {
							$item: { [EntityMetaKey.Selector]: $item },
							timestampMs,
							source,
							observed: feedItem != null,
							reachable: true,
							fetchWindowKind: 'Feed',
						}
					} catch (error) {
						return {
							$item: { [EntityMetaKey.Selector]: $item },
							timestampMs,
							source,
							observed: false,
							reachable: false,
							fetchWindowKind: 'Feed',
							error: error instanceof Error ? error.message : String(error),
						}
					}
				},
				}
			}
		})({
			$item: (snapshot) => snapshot.$item,
			timestampMs: (snapshot) => snapshot.timestampMs,
			source: (snapshot) => snapshot.source,
			observed: (snapshot) => snapshot.observed,
			reachable: (snapshot) => snapshot.reachable,
			fetchWindowKind: (snapshot) => snapshot.fetchWindowKind,
			error: (snapshot) => snapshot.error,
		}),
	],
}

import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default {
	source: Source.Rss_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.RssFeed,
			resolve: {
				FeedUrl: {
					resolve: async ({ feedUrl: feedUrlSelector }, context) => {
					const {
						normalizeRssFeedUrl,
						rssItemIdentityFromParts,
					} = await import('$/sources/Rss/Rest/constants.ts')
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
						items: feed.items
							.slice(0, resolverContextRowLimit(context))
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
			language: (snapshot) => snapshot.language,
			lastBuildDate: (snapshot) => snapshot.lastBuildDate,
			imageUrl: (snapshot) => snapshot.imageUrl,
			$$items: (snapshot) => snapshot.items,
		}),

		defineResolver({
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
					} = await import('$/sources/Rss/Rest/constants.ts')
					const { getFeed } = await import('$/sources/Rss/Rest/queries.ts')
					const feedUrl = normalizeRssFeedUrl($feed.feedUrl)
					const feed = await getFeed(feedUrl)
					const feedItem = feed.items.find((candidate) => {
						const identity = rssItemIdentityFromParts(candidate.guid, candidate.link)
						return (
							identity?.itemIdentityKind === itemIdentityKind
							&& identity.itemIdentity === itemIdentity
						)
					})
					if (feedItem == null) throw new Error('Rss_Rest: feed item not found')
					return {
						itemIdentityKind,
						itemIdentity,
						...(feedItem.guid != null && { guid: feedItem.guid }),
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
			updatedAt: (snapshot) => snapshot.updatedAt,
			categories: (snapshot) => snapshot.categories,
			enclosureUrl: (snapshot) => snapshot.enclosureUrl,
			commentsUrl: (snapshot) => snapshot.commentsUrl,
			$feed: (snapshot) => snapshot.$feed,
		}),

		defineResolver({
			entityType: EntityType.RssFeed_Timestamp,
			resolve: {
				FeedTimestampMsSource: {
					resolve: async ({
						$feed,
						timestampMs,
						source,
					}) => {
						if (source !== Source.Rss_Rest)
							throw new Error(`Rss_Rest: unsupported source ${source}`)

						const { normalizeRssFeedUrl } = await import('$/sources/Rss/Rest/constants.ts')
						const { getFeed } = await import('$/sources/Rss/Rest/queries.ts')
						const feedUrl = normalizeRssFeedUrl($feed.feedUrl)
						try {
							return {
								$feed: { [EntityMetaKey.Selector]: { feedUrl } },
								timestampMs,
								source,
								reachable: true,
								observedItemCount: (await getFeed(feedUrl)).items.length,
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

		defineResolver({
			entityType: EntityType.RssItem_Timestamp,
			resolve: {
				ItemTimestampMsSource: {
					resolve: async ({
						$item,
						timestampMs,
						source,
					}) => {
					if (source !== Source.Rss_Rest)
						throw new Error(`Rss_Rest: unsupported source ${source}`)

					const {
						normalizeRssFeedUrl,
						rssItemIdentityFromParts,
					} = await import('$/sources/Rss/Rest/constants.ts')
					const { getFeed } = await import('$/sources/Rss/Rest/queries.ts')
					const feedUrl = normalizeRssFeedUrl($item.$feed.feedUrl)
					try {
						const feedItem = (await getFeed(feedUrl)).items.find((candidate) => {
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
} satisfies RegisteredSourceResolverModule

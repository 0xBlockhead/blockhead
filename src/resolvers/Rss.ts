import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import {
	normalizeRssFeedUrl,
	rssItemIdentityFromParts,
} from '$/sources/_shared/interfaces/Rss/constants.ts'
import type { ParsedRssFeed } from '$/sources/Rss/Rest/types.ts'

const rssFetchWindowKind = 'Feed' as const

export const rssResolvers = <_Source extends Source.Rss_Rest | Source.Rss2Json_Rest>({
	loadFeed,
	source,
}: {
	loadFeed: (feedUrl: string) => Promise<ParsedRssFeed>
	source: _Source
}) => {
	const includesNativeMetadata = source === Source.Rss_Rest
	return {
		source,

		resolvers: [
			defineResolver({
				entityType: EntityType.RssFeed,
				resolve: {
					FeedUrl: {
						resolve: async ({ feedUrl: feedUrlSelector }, context) => {
							const feedUrl = normalizeRssFeedUrl(feedUrlSelector)
							const feed = await loadFeed(feedUrl)
							return {
								...(feed.title != null && { title: feed.title }),
								...(feed.description != null && { description: feed.description }),
								...(feed.link != null && { link: feed.link }),
								...(feed.siteUrl != null && { siteUrl: feed.siteUrl }),
								...(includesNativeMetadata && feed.language != null && {
									language: feed.language,
								}),
								...(includesNativeMetadata && feed.lastBuildDate != null && {
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
				...(includesNativeMetadata && {
					language: (snapshot) => snapshot.language,
					lastBuildDate: (snapshot) => snapshot.lastBuildDate,
				}),
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
							const feedUrl = normalizeRssFeedUrl($feed.feedUrl)
							const feedItem = (await loadFeed(feedUrl)).items.find((candidate) => {
								const identity = rssItemIdentityFromParts(candidate.guid, candidate.link)
								return (
									identity?.itemIdentityKind === itemIdentityKind
									&& identity.itemIdentity === itemIdentity
								)
							})
							if (feedItem == null)
								throw new Error(`${source}: feed item not found`)

							return {
								itemIdentityKind,
								itemIdentity,
								...(feedItem.guid != null && { guid: feedItem.guid }),
								...(feedItem.title != null && { title: feedItem.title }),
								...(feedItem.link != null && { link: feedItem.link }),
								...(feedItem.description != null && { description: feedItem.description }),
								...(feedItem.content != null && { content: feedItem.content }),
								...(feedItem.author != null && { author: feedItem.author }),
								...(feedItem.publishedAt != null && { publishedAt: feedItem.publishedAt }),
								...(includesNativeMetadata && feedItem.updatedAt != null && {
									updatedAt: feedItem.updatedAt,
								}),
								...(feedItem.categories != null && feedItem.categories.length > 0 && {
									categories: feedItem.categories,
								}),
								...(feedItem.enclosureUrl != null && { enclosureUrl: feedItem.enclosureUrl }),
								...(includesNativeMetadata && feedItem.commentsUrl != null && {
									commentsUrl: feedItem.commentsUrl,
								}),
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
				...(includesNativeMetadata && {
					updatedAt: (snapshot) => snapshot.updatedAt,
				}),
				categories: (snapshot) => snapshot.categories,
				enclosureUrl: (snapshot) => snapshot.enclosureUrl,
				...(includesNativeMetadata && {
					commentsUrl: (snapshot) => snapshot.commentsUrl,
				}),
				$feed: (snapshot) => snapshot.$feed,
			}),

			defineResolver({
				entityType: EntityType.RssFeed_Timestamp,
				resolve: {
					FeedTimestampMsSource: {
						resolve: async ({
							$feed,
							timestampMs,
							source: selectorSource,
						}) => {
							if (selectorSource !== source)
								throw new Error(`${source}: unsupported source ${selectorSource}`)

							const feedUrl = normalizeRssFeedUrl($feed.feedUrl)
							try {
								return {
									$feed: { [EntityMetaKey.Selector]: { feedUrl } },
									timestampMs,
									source: selectorSource,
									reachable: true,
									observedItemCount: (await loadFeed(feedUrl)).items.length,
									fetchWindowKind: rssFetchWindowKind,
								}
							} catch (error) {
								return {
									$feed: { [EntityMetaKey.Selector]: { feedUrl } },
									timestampMs,
									source: selectorSource,
									reachable: false,
									observedItemCount: 0,
									fetchWindowKind: rssFetchWindowKind,
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
							source: selectorSource,
						}) => {
							if (selectorSource !== source)
								throw new Error(`${source}: unsupported source ${selectorSource}`)

							const feedUrl = normalizeRssFeedUrl($item.$feed.feedUrl)
							try {
								const feedItem = (await loadFeed(feedUrl)).items.find((candidate) => {
									const identity = rssItemIdentityFromParts(candidate.guid, candidate.link)
									return (
										identity?.itemIdentityKind === $item.itemIdentityKind
										&& identity.itemIdentity === $item.itemIdentity
									)
								})
								return {
									$item: { [EntityMetaKey.Selector]: $item },
									timestampMs,
									source: selectorSource,
									observed: feedItem != null,
									reachable: true,
									fetchWindowKind: rssFetchWindowKind,
								}
							} catch (error) {
								return {
									$item: { [EntityMetaKey.Selector]: $item },
									timestampMs,
									source: selectorSource,
									observed: false,
									reachable: false,
									fetchWindowKind: rssFetchWindowKind,
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
}

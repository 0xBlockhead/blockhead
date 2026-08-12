import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import {
	normalizeRssFeedUrl,
	rssItemIdentityFromParts,
} from '$/sources/_shared/interfaces/Rss/constants.ts'
import type { ParsedRssFeed } from '$/sources/Rss/Rest/types.ts'

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
							const timestampMs = Date.now()
							const itemIdentityKeys = new Set<string>()
							return {
								...(feed.title != null && { title: feed.title }),
								...(feed.description != null && { description: feed.description }),
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
										const key = (
											identity == null ?
												undefined
											:
												`${identity.itemIdentityKind}:${identity.itemIdentity}`
										)
										if (key != null && itemIdentityKeys.has(key))
											throw new Error(`${source}: duplicate feed item identity ${key}`)
										if (key != null)
											itemIdentityKeys.add(key)

										return identity == null ? [] : [{
											[EntityMetaKey.Selector]: {
												$feed: { feedUrl },
												...identity,
											},
											[EntityMetaKey.Fields]: {
												...(feedItem.title != null && {
													[entityFieldAddressKey(EntityType.RssItem, [], 'title')]: feedItem.title,
												}),
												...(feedItem.link != null && {
													[entityFieldAddressKey(EntityType.RssItem, [], 'link')]: feedItem.link,
												}),
												...(feedItem.description != null && {
													[entityFieldAddressKey(EntityType.RssItem, [], 'description')]: feedItem.description,
												}),
												...(feedItem.content != null && {
													[entityFieldAddressKey(EntityType.RssItem, [], 'content')]: feedItem.content,
												}),
												...(feedItem.author != null && {
													[entityFieldAddressKey(EntityType.RssItem, [], 'author')]: feedItem.author,
												}),
												...(feedItem.publishedAt != null && {
													[entityFieldAddressKey(EntityType.RssItem, [], 'publishedAt')]: feedItem.publishedAt,
												}),
												...(includesNativeMetadata && feedItem.updatedAt != null && {
													[entityFieldAddressKey(EntityType.RssItem, [], 'updatedAt')]: feedItem.updatedAt,
												}),
												...(feedItem.categories != null && feedItem.categories.length > 0 && {
													[entityFieldAddressKey(EntityType.RssItem, [], 'categories')]: feedItem.categories,
												}),
												...(feedItem.enclosureUrl != null && {
													[entityFieldAddressKey(EntityType.RssItem, [], 'enclosureUrl')]: feedItem.enclosureUrl,
												}),
												...(includesNativeMetadata && feedItem.commentsUrl != null && {
													[entityFieldAddressKey(EntityType.RssItem, [], 'commentsUrl')]: feedItem.commentsUrl,
												}),
												[entityFieldAddressKey(EntityType.RssItem, [], '$feed')]: {
													[EntityMetaKey.Selector]: { feedUrl },
												},
												[entityFieldAddressKey(EntityType.RssItem, [], '$$timestamps')]: [{
													[EntityMetaKey.Selector]: {
														$item: {
															$feed: { feedUrl },
															...identity,
														},
														timestampMs,
														source,
													},
													[EntityMetaKey.Fields]: {
														[entityFieldAddressKey(EntityType.RssItem_Timestamp, [], 'observed')]: true,
														[entityFieldAddressKey(EntityType.RssItem_Timestamp, [], 'reachable')]: true,
													},
												}],
											},
										}]
									}),
								$$timestamps: [{
									[EntityMetaKey.Selector]: {
										$feed: { feedUrl },
										timestampMs,
										source,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.RssFeed_Timestamp, [], 'reachable')]: true,
										[entityFieldAddressKey(EntityType.RssFeed_Timestamp, [], 'observedItemCount')]: feed.items.length,
									},
								}],
							}
						},
					}
				}
			})({
				title: (snapshot) => snapshot.title,
				description: (snapshot) => snapshot.description,
				siteUrl: (snapshot) => snapshot.siteUrl,
				...(includesNativeMetadata && {
					language: (snapshot) => snapshot.language,
					lastBuildDate: (snapshot) => snapshot.lastBuildDate,
				}),
				imageUrl: (snapshot) => snapshot.imageUrl,
				$$items: (snapshot) => snapshot.items,
				$$timestamps: (snapshot) => snapshot.$$timestamps,
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
								$$timestamps: [{
									[EntityMetaKey.Selector]: {
										$item: {
											$feed: { feedUrl },
											itemIdentityKind,
											itemIdentity,
										},
										timestampMs: Date.now(),
										source,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.RssItem_Timestamp, [], 'observed')]: true,
										[entityFieldAddressKey(EntityType.RssItem_Timestamp, [], 'reachable')]: true,
									},
								}],
							}
						},
					}
				}
			})({
				itemIdentityKind: (snapshot) => snapshot.itemIdentityKind,
				itemIdentity: (snapshot) => snapshot.itemIdentity,
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
				$$timestamps: (snapshot) => snapshot.$$timestamps,
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
								}
							} catch (error) {
								return {
									$feed: { [EntityMetaKey.Selector]: { feedUrl } },
									timestampMs,
									source: selectorSource,
									reachable: false,
									observedItemCount: 0,
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
								}
							} catch (error) {
								return {
									$item: { [EntityMetaKey.Selector]: $item },
									timestampMs,
									source: selectorSource,
									observed: false,
									reachable: false,
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
				error: (snapshot) => snapshot.error,
			}),
		],
	}
}

import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import { errorDisplayMessage } from '$/lib/errors.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { Source } from '$/sources/Source.ts'
import {
	normalizeRssFeedUrl,
	rssItemIdentityFromParts,
} from '$/sources/_shared/interfaces/Rss/constants.ts'
import type { ParsedRssFeed } from '$/sources/Rss/Rest/types.ts'

const readRssSnapshot = <_Data>(snapshot: { data: _Data; error?: never } | { data?: never; error: unknown }): NonNullable<_Data> => {
	if (snapshot.data == null)
		throw snapshot.error

	return snapshot.data
}

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
							let feed: ParsedRssFeed
							try {
								feed = await loadFeed(feedUrl)
							} catch (error) {
								return {
									error,
									feedUrl,
									$$timestamps: [{
										[EntityMetaKey.Selector]: {
											$feed: { feedUrl },
											timestampMs: Date.now(),
											source,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.RssFeed_Timestamp, [], 'reachable')]: false,
											[entityFieldAddressKey(EntityType.RssFeed_Timestamp, [], 'error')]: errorDisplayMessage(error),
										},
									}],
								}
							}
							const timestampMs = Date.now()
							const itemIdentityKeys = new Set<string>()
							return {
								data: {
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
									...(feed.imageUrl != null && { $image: mediaFromUrl(feed.imageUrl, MediaType.Image) }),
									limit: resolverContextRowLimit(context),
									items: feed.items
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
								},
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
				title: (snapshot) => readRssSnapshot(snapshot).title,
				description: (snapshot) => readRssSnapshot(snapshot).description,
				siteUrl: (snapshot) => readRssSnapshot(snapshot).siteUrl,
				...(includesNativeMetadata && {
					language: (snapshot) => readRssSnapshot(snapshot).language,
					lastBuildDate: (snapshot) => readRssSnapshot(snapshot).lastBuildDate,
				}),
				imageUrl: (snapshot) => readRssSnapshot(snapshot).imageUrl,
				$image: (snapshot) => readRssSnapshot(snapshot).$image,
				$$items: {
					select: (snapshot) => {
						const data = readRssSnapshot(snapshot)
						return data.items.slice(0, data.limit)
					},
					resolveCount: (snapshot) => readRssSnapshot(snapshot).items.length,
				},
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
							let feed: ParsedRssFeed
							try {
								feed = await loadFeed(feedUrl)
							} catch (error) {
								return {
									error,
									itemIdentityKind,
									itemIdentity,
									$feed: {
										[EntityMetaKey.Selector]: { feedUrl },
									},
									$$timestamps: [{
										[EntityMetaKey.Selector]: {
											$item: { $feed: { feedUrl }, itemIdentityKind, itemIdentity },
											timestampMs: Date.now(),
											source,
										},
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.RssItem_Timestamp, [], 'reachable')]: false,
											[entityFieldAddressKey(EntityType.RssItem_Timestamp, [], 'error')]: errorDisplayMessage(error),
										},
									}],
								}
							}
							const feedItem = feed.items.find((candidate) => {
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
								$feed: {
									[EntityMetaKey.Selector]: { feedUrl },
								},
								data: {
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
				title: (snapshot) => readRssSnapshot(snapshot).title,
				link: (snapshot) => readRssSnapshot(snapshot).link,
				description: (snapshot) => readRssSnapshot(snapshot).description,
				content: (snapshot) => readRssSnapshot(snapshot).content,
				author: (snapshot) => readRssSnapshot(snapshot).author,
				publishedAt: (snapshot) => readRssSnapshot(snapshot).publishedAt,
				...(includesNativeMetadata && {
					updatedAt: (snapshot) => readRssSnapshot(snapshot).updatedAt,
				}),
				categories: (snapshot) => readRssSnapshot(snapshot).categories,
				enclosureUrl: (snapshot) => readRssSnapshot(snapshot).enclosureUrl,
				...(includesNativeMetadata && {
					commentsUrl: (snapshot) => readRssSnapshot(snapshot).commentsUrl,
				}),
				$feed: (snapshot) => snapshot.$feed,
				$$timestamps: (snapshot) => snapshot.$$timestamps,
			}),

		],
	}
}

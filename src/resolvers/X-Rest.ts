import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { type } from 'arktype'
import { optionalNonemptyString } from '$/lib/string.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type {
	XApiV2Tweet,
	XApiV2User,
} from '$/sources/X/Rest/types.ts'

const xUserReference = (
	id: string,
	users: XApiV2User[] | undefined
) => {
	const user = users?.find((candidate) => candidate.id === id)
	return {
		[EntityMetaKey.Selector]: { id },
		...(user != null && {
			[EntityMetaKey.Fields]: {
				...(optionalNonemptyString(user.username) != null && {
					[entityFieldAddressKey(EntityType.XUser, [], 'username')]:
						optionalNonemptyString(user.username),
				}),
				...(optionalNonemptyString(user.name) != null && {
					[entityFieldAddressKey(EntityType.XUser, [], 'name')]:
						optionalNonemptyString(user.name),
				}),
				...((icon) => icon == null ? {} : {
					[entityFieldAddressKey(EntityType.XUser, [], '$icon')]: icon,
				})(mediaFromUrl(user.profile_image_url, MediaType.Image)),
			},
		}),
	}
}

const xPostReference = (
	id: string,
	tweets: XApiV2Tweet[] | undefined,
	users: XApiV2User[] | undefined
) => {
	const tweet = tweets?.find((candidate) => candidate.id === id)
	const createdAt = Date.parse(tweet?.created_at ?? '')
	return {
		[EntityMetaKey.Selector]: { id },
		...(tweet != null && {
			[EntityMetaKey.Fields]: {
				...(optionalNonemptyString(tweet.text) != null && {
					[entityFieldAddressKey(EntityType.XPost, [], 'text')]:
						optionalNonemptyString(tweet.text),
				}),
				...(Number.isFinite(createdAt) && {
					[entityFieldAddressKey(EntityType.XPost, [], 'createdAt')]: createdAt,
				}),
				...(tweet.author_id != null && {
					[entityFieldAddressKey(EntityType.XPost, [], '$author')]:
						xUserReference(tweet.author_id, users),
				}),
			},
		}),
	}
}

const xUserSnapshotFromWire = (
	xUser: XApiV2User,
	id: string,
	username: string
) => {
	const createdAt = Date.parse(xUser.created_at ?? '')
	const websiteUrl = (
		((urlString) => (
			urlString == null ?
				undefined
			:
				(
					(parsed) => (
						parsed instanceof type.errors ?
							undefined
						:
							parsed
					)
				)(UrlString(urlString))
		))(optionalNonemptyString(xUser.url))
	)
	const name = optionalNonemptyString(xUser.name)
	const description = optionalNonemptyString(xUser.description)
	const location = optionalNonemptyString(xUser.location)
	return {
		id,
		username,
		...(name != null && { name }),
		...(description != null && { description }),
		...(location != null && { location }),
		...(xUser.verified != null && { verified: xUser.verified }),
		...(Number.isFinite(createdAt) && { createdAt }),
		...(websiteUrl != null && { websiteUrl }),
		...((iconMedia) => (
			iconMedia != null && {
				$icon: iconMedia,
			}
		))(mediaFromUrl(xUser.profile_image_url, MediaType.Image)),
		...((bannerMedia) => (
			bannerMedia != null && {
				$profileBanner: bannerMedia,
			}
		))(mediaFromUrl(xUser.profile_banner_url, MediaType.Image)),
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$user: { id },
				timestampMs: Date.now(),
				source: Source.X_Rest,
			},
			[EntityMetaKey.Fields]: {
				...(xUser.public_metrics?.followers_count != null && {
					[entityFieldAddressKey(EntityType.XUser_Timestamp, [], 'followerCount')]:
						xUser.public_metrics.followers_count,
				}),
				...(xUser.public_metrics?.following_count != null && {
					[entityFieldAddressKey(EntityType.XUser_Timestamp, [], 'followingCount')]:
						xUser.public_metrics.following_count,
				}),
				...(xUser.public_metrics?.tweet_count != null && {
					[entityFieldAddressKey(EntityType.XUser_Timestamp, [], 'tweetCount')]:
						xUser.public_metrics.tweet_count,
				}),
				...(xUser.public_metrics?.listed_count != null && {
					[entityFieldAddressKey(EntityType.XUser_Timestamp, [], 'listedCount')]:
						xUser.public_metrics.listed_count,
				}),
			},
		}],
	}
}

const xPostReferenceFromWire = (
	tweet: XApiV2Tweet,
	users: XApiV2User[] | undefined
) => {
	const id = optionalNonemptyString(tweet.id)
	if (id == null) return undefined
	const createdAt = Date.parse(tweet.created_at ?? '')
	const text = optionalNonemptyString(tweet.text)
	return {
		[EntityMetaKey.Selector]: { id },
		[EntityMetaKey.Fields]: {
			...(text != null && {
				[entityFieldAddressKey(EntityType.XPost, [], 'text')]: text,
			}),
			...(Number.isFinite(createdAt) && {
				[entityFieldAddressKey(EntityType.XPost, [], 'createdAt')]: createdAt,
			}),
			...(tweet.author_id != null && {
				[entityFieldAddressKey(EntityType.XPost, [], '$author')]:
					xUserReference(tweet.author_id, users),
			}),
		},
	}
}

export default {
	source: Source.X_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.XUser,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
						const { getUser } = await import('$/sources/X/Rest/queries.ts')
						const xUser = (await getUser(id)).data
						if (xUser == null) throw new Error('X_Rest: user not found')
						if (xUser.id !== id)
							throw new Error(`X_Rest: user id mismatch ${xUser.id} !== ${id}`)
						const username = optionalNonemptyString(xUser.username)
						if (username == null) throw new Error('X_Rest: user username not found')
						return xUserSnapshotFromWire(xUser, id, username)
					},
				},
				Username: {
					resolve: async ({ username }) => {
						const { getUserByUsername } = await import('$/sources/X/Rest/queries.ts')
						const xUser = (await getUserByUsername(username)).data
						if (xUser?.id == null) throw new Error('X_Rest: user not found')
						const resolvedUsername = optionalNonemptyString(xUser.username)
						if (resolvedUsername == null) throw new Error('X_Rest: user username not found')
						return xUserSnapshotFromWire(xUser, xUser.id, resolvedUsername)
					},
				},
			},
		})({
			id: (user) => user.id,
			username: (user) => user.username,
			name: (user) => user.name,
			description: (user) => user.description,
			location: (user) => user.location,
			verified: (user) => user.verified,
			createdAt: (user) => user.createdAt,
			websiteUrl: (user) => user.websiteUrl,
			$icon: (user) => user.$icon,
			$profileBanner: (user) => user.$profileBanner,
			$$timestamps: (user) => user.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.XPost,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
						const { getTweet } = await import('$/sources/X/Rest/queries.ts')
						const response = await getTweet(id)
						const tweet = response.data
						if (tweet == null) throw new Error('X_Rest: post not found')
						if (tweet.id !== id) throw new Error('X_Rest: post id mismatch')
						const mediaByKey = new Map(
							(response.includes?.media ?? []).flatMap((media) => (
							media.media_key == null ?
								[]
							:
								[[
									media.media_key,
									media,
								] as const]
							))
						)
						const createdAt = Date.parse(tweet.created_at ?? '')
						const conversationId = optionalNonemptyString(tweet.conversation_id)
						const replyToId = optionalNonemptyString(
							tweet.referenced_tweets?.find((ref) => ref.type === 'replied_to')?.id
						)
						const quotedId = optionalNonemptyString(
							tweet.referenced_tweets?.find((ref) => ref.type === 'quoted')?.id
						)
						const text = optionalNonemptyString(tweet.text)
						return {
							id,
							...(text != null && { text }),
							...(Number.isFinite(createdAt) && { createdAt }),
							...(conversationId != null && { conversationId }),
							...(replyToId != null && {
								$replyToPost: xPostReference(
									replyToId,
									response.includes?.tweets,
									response.includes?.users
								),
							}),
							...(quotedId != null && {
								$quotedPost: xPostReference(
									quotedId,
									response.includes?.tweets,
									response.includes?.users
								),
							}),
							$$media: (
								tweet.attachments?.media_keys ?? []
							).flatMap((mediaKey) => {
								const wireMedia = mediaByKey.get(mediaKey)
								const media = mediaFromUrl(
									wireMedia?.preview_image_url ?? wireMedia?.url,
									wireMedia?.type === 'video' ?
										MediaType.Video
									:
										MediaType.Image
								)
								if (media == null) return []
								const hash = optionalNonemptyString(wireMedia?.media_key ?? mediaKey)
								return [{
									...media,
									[EntityMetaKey.Fields]: {
										...media[EntityMetaKey.Fields],
										...(hash != null && {
											[entityFieldAddressKey(EntityType.Media, [], 'hash')]: hash,
										}),
									},
								}]
							}),
							...(tweet.author_id != null && {
								$author: xUserReference(
									tweet.author_id,
									response.includes?.users
								),
							}),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$post: { id },
									timestampMs: Date.now(),
									source: Source.X_Rest,
								},
								[EntityMetaKey.Fields]: {
									...(tweet.public_metrics?.like_count != null && {
										[entityFieldAddressKey(EntityType.XPost_Timestamp, [], 'likeCount')]:
											tweet.public_metrics.like_count,
									}),
									...(tweet.public_metrics?.retweet_count != null && {
										[entityFieldAddressKey(EntityType.XPost_Timestamp, [], 'retweetCount')]:
											tweet.public_metrics.retweet_count,
									}),
									...(tweet.public_metrics?.reply_count != null && {
										[entityFieldAddressKey(EntityType.XPost_Timestamp, [], 'replyCount')]:
											tweet.public_metrics.reply_count,
									}),
									...(tweet.public_metrics?.quote_count != null && {
										[entityFieldAddressKey(EntityType.XPost_Timestamp, [], 'quoteCount')]:
											tweet.public_metrics.quote_count,
									}),
								},
							}],
						}
					},
				}
			},
		})({
			id: (post) => post.id,
			text: (post) => post.text,
			createdAt: (post) => post.createdAt,
			conversationId: (post) => post.conversationId,
			$replyToPost: (post) => post.$replyToPost,
			$quotedPost: (post) => post.$quotedPost,
			$$media: (post) => post.$$media,
			$author: (post) => post.$author,
			$$timestamps: (post) => post.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.XUser,
			resolve: {
				Id: {
					resolve: async ({ id }, context) => {
						const { listUserTweets } = await import('$/sources/X/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return {
							userId: id,
							page: await listUserTweets(
								id,
								limit,
								context.providerContinuationToken
							),
						}
					},
				},
			},
		})({
			$$posts: {
				select: ({ page, userId }) => (
					(page.data ?? [])
						.flatMap((wirePost) => (
							wirePost.id == null
							|| wirePost.author_id !== userId ?
								[]
							:
								[{
									[EntityMetaKey.Selector]: { id: wirePost.id },
									[EntityMetaKey.Fields]: {
										...(optionalNonemptyString(wirePost.text) != null && {
											[entityFieldAddressKey(EntityType.XPost, [], 'text')]:
												optionalNonemptyString(wirePost.text),
										}),
										...(Number.isFinite(Date.parse(wirePost.created_at ?? '')) && {
											[entityFieldAddressKey(EntityType.XPost, [], 'createdAt')]:
												Date.parse(wirePost.created_at ?? ''),
										}),
										[entityFieldAddressKey(EntityType.XPost, [], '$author')]:
											xUserReference(userId, page.includes?.users),
									},
								}]
							))
				),
				continuation: ({ page, userId }) => (
					page.meta?.next_token == null || page.meta.next_token === '' ?
						{
							operation: 'users/:id/tweets',
							target: userId,
							terminal: true,
						}
					:
						{
							operation: 'users/:id/tweets',
							target: userId,
							terminal: false,
							token: page.meta.next_token,
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.XNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { searchRecentTweets } = await import('$/sources/X/Rest/queries.ts')
						return searchRecentTweets(
							resolverContextRowLimit(context),
							context.providerContinuationToken
						)
					},
				},
			},
		})({
			$$xUsers: {
				select: (page) => (
					(page.includes?.users ?? []).flatMap((user) => {
						const id = optionalNonemptyString(user.id)
						return id == null ? [] : [xUserReference(id, page.includes?.users)]
					})
				),
				continuation: (page) => (
					page.meta?.next_token == null || page.meta.next_token === '' ?
						{
							operation: 'tweets/search/recent',
							target: 'api-v2',
							terminal: true,
						}
					:
						{
							operation: 'tweets/search/recent',
							target: 'api-v2',
							terminal: false,
							token: page.meta.next_token,
						}
				),
			},
			$$xPosts: {
				select: (page) => (
					(page.data ?? []).flatMap((tweet) => {
						const reference = xPostReferenceFromWire(tweet, page.includes?.users)
						return reference == null ? [] : [reference]
					})
				),
				continuation: (page) => (
					page.meta?.next_token == null || page.meta.next_token === '' ?
						{
							operation: 'tweets/search/recent',
							target: 'api-v2',
							terminal: true,
						}
					:
						{
							operation: 'tweets/search/recent',
							target: 'api-v2',
							terminal: false,
							token: page.meta.next_token,
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType._GlobalXNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { searchRecentTweets } = await import('$/sources/X/Rest/queries.ts')
						return searchRecentTweets(
							resolverContextRowLimit(context),
							context.providerContinuationToken
						)
					},
				},
			},
		})({
			$$observedUsers: {
				select: (page) => (
					(page.includes?.users ?? []).flatMap((user) => {
						const id = optionalNonemptyString(user.id)
						return id == null ? [] : [xUserReference(id, page.includes?.users)]
					})
				),
				continuation: (page) => (
					page.meta?.next_token == null || page.meta.next_token === '' ?
						{
							operation: 'tweets/search/recent',
							target: 'api-v2',
							terminal: true,
						}
					:
						{
							operation: 'tweets/search/recent',
							target: 'api-v2',
							terminal: false,
							token: page.meta.next_token,
						}
				),
			},
			$$observedPosts: {
				select: (page) => (
					(page.data ?? []).flatMap((tweet) => {
						const reference = xPostReferenceFromWire(tweet, page.includes?.users)
						return reference == null ? [] : [reference]
					})
				),
				continuation: (page) => (
					page.meta?.next_token == null || page.meta.next_token === '' ?
						{
							operation: 'tweets/search/recent',
							target: 'api-v2',
							terminal: true,
						}
					:
						{
							operation: 'tweets/search/recent',
							target: 'api-v2',
							terminal: false,
							token: page.meta.next_token,
						}
				),
			},
		}),
	],
} satisfies RegisteredSourceResolverModule

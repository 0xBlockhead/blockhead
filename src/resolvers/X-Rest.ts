import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { type } from 'arktype'
import { optionalNonemptyString } from '$/lib/string.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { MediaType } from '$/schema/Media.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type {
	XApiV2Tweet,
	XApiV2User,
} from '$/sources/X/Rest/types.ts'
import { XUserSelector } from '$/schema/XUser.ts'
import { XPostSelector } from '$/schema/XPost.ts'
import { XUser_TimestampSelector } from '$/schema/XUser_Timestamp.ts'
import { XPost_TimestampSelector } from '$/schema/XPost_Timestamp.ts'
import { XNetworkSelector } from '$/schema/XNetwork.ts'

export default {
	source: Source.X_Rest,

	resolvers: [
		defineResolver(Source.X_Rest, {
			entityType: EntityType.XUser,
			resolve: {
				[XUserSelector.Id]: async ({ id }, context) => {
					const { getUser } = await import('$/sources/X/Rest/queries.ts')
					const xUser = (await getUser(context.publicEnv, id)).data
					if (xUser == null) throw new Error('X_Rest: user not found')
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
					const username = optionalNonemptyString(xUser.username)
					const name = optionalNonemptyString(xUser.name)
					const description = optionalNonemptyString(xUser.description)
					const location = optionalNonemptyString(xUser.location)
					if (xUser.id != null && xUser.id !== id)
						throw new Error(`X_Rest: user id mismatch ${xUser.id} !== ${id}`)
					if (username == null) throw new Error('X_Rest: user username not found')

					return {
						id,
						username,
						...(name != null && { name }),
						...(description != null && { description }),
						...(location != null && { location }),
						...(xUser.verified != null && { verified: xUser.verified }),
						...(Number.isFinite(createdAt) && { createdAt }),
						...(websiteUrl != null && { websiteUrl }),
						...((
							iconMedia
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(xUser.profile_image_url, MediaType.Image)),
						...((
							bannerMedia
					) => (
						bannerMedia != null && {
							$profileBanner: bannerMedia,
						}
					))(mediaFromUrl(xUser.profile_banner_url, MediaType.Image)),
					}
				},
			},
		})({
			fields: {
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
			},
		}),

		defineResolver(Source.X_Rest, {
			entityType: EntityType.XPost,
			resolve: {
				[XPostSelector.Id]: async ({ id }, context) => {
					const { getTweet } = await import('$/sources/X/Rest/queries.ts')
					const response = await getTweet(context.publicEnv, id)
					const tweet = response.data
					if (tweet == null) throw new Error('X_Rest: post not found')
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
						...(text != null && { text }),
						...(Number.isFinite(createdAt) && { createdAt }),
						...(conversationId != null && { conversationId }),
						...(replyToId != null && {
							$replyToPost: { [EntityMetaKey.Selector]: { id: replyToId } },
						}),
						...(quotedId != null && {
							$quotedPost: { [EntityMetaKey.Selector]: { id: quotedId } },
						}),
						postUrl: UrlString.assert(`https://x.com/i/web/status/${id}`),
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
						return media == null ? [] : [media]
						}),
						$author: (
							tweet.author_id == null ?
								undefined
							:
								{
									[EntityMetaKey.Selector]: { id: tweet.author_id },
								}
						),
					}
				}
			},
		})({
			fields: {
				text: (post) => post.text,
				createdAt: (post) => post.createdAt,
				conversationId: (post) => post.conversationId,
				$replyToPost: (post) => post.$replyToPost,
				$quotedPost: (post) => post.$quotedPost,
				postUrl: (post) => post.postUrl,
				$$media: (post) => post.$$media,
				$author: (post) => post.$author,
			},
		}),

		defineResolver(Source.X_Rest, {
			entityType: EntityType.XUser_Timestamp,
			resolve: {
				[XUser_TimestampSelector.XUserTimestampMs]: async ({ $user }, context) => {
					if (!('id' in $user)) throw new Error('X_Rest: user timestamp requires id selector')

					const { getUser } = await import('$/sources/X/Rest/queries.ts')
					const user = (await getUser(context.publicEnv, $user.id)).data
					if (user == null) throw new Error('X_Rest: user not found')
					return {
						followerCount: user.public_metrics?.followers_count,
						followingCount: user.public_metrics?.following_count,
						tweetCount: user.public_metrics?.tweet_count,
						listedCount: user.public_metrics?.listed_count,
					}
				}
			},
		})({
			fields: {
				followerCount: (timestamp) => timestamp.followerCount,
				followingCount: (timestamp) => timestamp.followingCount,
				tweetCount: (timestamp) => timestamp.tweetCount,
				listedCount: (timestamp) => timestamp.listedCount,
			},
		}),

		defineResolver(Source.X_Rest, {
			entityType: EntityType.XPost_Timestamp,
			resolve: {
				[XPost_TimestampSelector.XPostTimestampMs]: async ({ $post }, context) => {
					const { getTweet } = await import('$/sources/X/Rest/queries.ts')
					const tweet = (await getTweet(context.publicEnv, $post.id)).data
					if (tweet == null) throw new Error('X_Rest: post not found')
					return {
						likeCount: tweet.public_metrics?.like_count,
						retweetCount: tweet.public_metrics?.retweet_count,
						replyCount: tweet.public_metrics?.reply_count,
						quoteCount: tweet.public_metrics?.quote_count,
					}
				}
			},
		})({
			fields: {
				likeCount: (timestamp) => timestamp.likeCount,
				retweetCount: (timestamp) => timestamp.retweetCount,
				replyCount: (timestamp) => timestamp.replyCount,
				quoteCount: (timestamp) => timestamp.quoteCount,
			},
		}),

		defineResolver(Source.X_Rest, {
			entityType: EntityType.XPost,
			resolve: {
				[XPostSelector.Id]: async ({ id }, context) => {
					const { getTweet } = await import('$/sources/X/Rest/queries.ts')
					const tweet = (await getTweet(context.publicEnv, id)).data
					if (tweet == null) throw new Error('X_Rest: post not found')
					return [
						{
							[EntityMetaKey.Selector]: {
								$post: { id },
								timestampMs: Date.now(),
							},
							likeCount: tweet.public_metrics?.like_count,
							retweetCount: tweet.public_metrics?.retweet_count,
							replyCount: tweet.public_metrics?.reply_count,
							quoteCount: tweet.public_metrics?.quote_count,
						},
					]
				}
			},
		})({
			fields: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver(Source.X_Rest, {
			entityType: EntityType.XUser,
			resolve: {
				[XUserSelector.Id]: async ({ id }, context) => {
					const { getUser } = await import('$/sources/X/Rest/queries.ts')
					const user = (await getUser(context.publicEnv, id)).data
					if (user == null) throw new Error('X_Rest: user not found')
					return [
						{
							[EntityMetaKey.Selector]: {
								$user: {
									id,
								},
								timestampMs: Date.now(),
							},
							followerCount: user.public_metrics?.followers_count,
							followingCount: user.public_metrics?.following_count,
							tweetCount: user.public_metrics?.tweet_count,
							listedCount: user.public_metrics?.listed_count,
						},
					]
				},
			},
		})({
			fields: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver(Source.X_Rest, {
			entityType: EntityType.XUser,
			resolve: {
				[XUserSelector.Id]: async ({ id }, context) => {
					const { listUserTweets } = await import('$/sources/X/Rest/queries.ts')
					const limit = resolverContextRowLimit(context)
					const { data = [] } = await listUserTweets(context.publicEnv, id, limit)
					return (
						data
							.flatMap((wirePost) => (
							wirePost.id == null ?
								[]
							:
								[{
									[EntityMetaKey.Selector]: { id: wirePost.id },
								}]
							))
					)
				},
			},
		})({
			fields: {
				$$posts: (posts) => posts,
			},
		}),
	],
}

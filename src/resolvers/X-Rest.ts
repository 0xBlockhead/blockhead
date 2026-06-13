import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { type } from 'arktype'
import { optionalNonemptyString } from '$/lib/string.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import {
	EntityIdProjection,
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

export default {
	source: Source.X_Rest,

	resolvers: [
		defineResolver(Source.X_Rest, {
			entityType: EntityType.XUser,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getUser } = await import('$/sources/X/Rest/queries.ts')
				if (!('id' in entityId))
					throw new Error('X_Rest: XUser username lookup is unsupported')

				const xUser = (await singleFlight(getUser)(context.publicEnv, entityId.id)).data
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
				return {
					id: xUser.id,
					...(username != null && { username }),
					...(name != null && { name }),
					...(description != null && { description }),
					...(location != null && { location }),
					...(xUser.verified != null && { verified: xUser.verified }),
					...(Number.isFinite(createdAt) && { createdAt }),
					...(websiteUrl != null && { websiteUrl }),
					...(xUser.public_metrics?.followers_count != null && {
						followerCount: xUser.public_metrics.followers_count,
					}),
					...(xUser.public_metrics?.following_count != null && {
						followingCount: xUser.public_metrics.following_count,
					}),
					...(xUser.public_metrics?.tweet_count != null && {
						tweetCount: xUser.public_metrics.tweet_count,
					}),
					...(xUser.public_metrics?.listed_count != null && {
						listedCount: xUser.public_metrics.listed_count,
					}),
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(xUser.profile_image_url, MediaType.Image)),
					...((
						bannerMedia,
					) => (
						bannerMedia != null && {
							$profileBanner: bannerMedia,
						}
					))(mediaFromUrl(xUser.profile_banner_url, MediaType.Image)),
				}
			},
				['id']: async (entityId, context) => {
				const { getUser } = await import('$/sources/X/Rest/queries.ts')
				if (!('id' in entityId))
					throw new Error('X_Rest: XUser username lookup is unsupported')

				const xUser = (await singleFlight(getUser)(context.publicEnv, entityId.id)).data
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
				return {
					id: xUser.id,
					...(username != null && { username }),
					...(name != null && { name }),
					...(description != null && { description }),
					...(location != null && { location }),
					...(xUser.verified != null && { verified: xUser.verified }),
					...(Number.isFinite(createdAt) && { createdAt }),
					...(websiteUrl != null && { websiteUrl }),
					...(xUser.public_metrics?.followers_count != null && {
						followerCount: xUser.public_metrics.followers_count,
					}),
					...(xUser.public_metrics?.following_count != null && {
						followingCount: xUser.public_metrics.following_count,
					}),
					...(xUser.public_metrics?.tweet_count != null && {
						tweetCount: xUser.public_metrics.tweet_count,
					}),
					...(xUser.public_metrics?.listed_count != null && {
						listedCount: xUser.public_metrics.listed_count,
					}),
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(xUser.profile_image_url, MediaType.Image)),
					...((
						bannerMedia,
					) => (
						bannerMedia != null && {
							$profileBanner: bannerMedia,
						}
					))(mediaFromUrl(xUser.profile_banner_url, MediaType.Image)),
				}
			}
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
				followerCount: (user) => user.followerCount,
				followingCount: (user) => user.followingCount,
				tweetCount: (user) => user.tweetCount,
				listedCount: (user) => user.listedCount,
				$icon: (user) => user.$icon,
				$profileBanner: (user) => user.$profileBanner,
			},
			}),

		defineResolver(Source.X_Rest, {
			entityType: EntityType.XPost,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getTweet } = await import('$/sources/X/Rest/queries.ts')
				const response = await singleFlight(getTweet)(context.publicEnv, entityId.id)
				const tweet = response.data
				if (tweet == null) throw new Error('X_Rest: post not found')
				const mediaByKey = new Map(
					(response.includes?.media ?? []).flatMap((media) => (
						media.media_key == null ?
							[]
						:
							[[media.media_key, media] as const]
					)),
				)
				const createdAt = Date.parse(tweet.created_at ?? '')
				const conversationId = optionalNonemptyString(tweet.conversation_id)
				const replyToId = optionalNonemptyString(
					tweet.referenced_tweets?.find((ref) => ref.type === 'replied_to')?.id,
				)
				const quotedId = optionalNonemptyString(
					tweet.referenced_tweets?.find((ref) => ref.type === 'quoted')?.id,
				)
				const text = optionalNonemptyString(tweet.text)
				return {
					...(text != null && { text }),
					...(Number.isFinite(createdAt) && { createdAt }),
					...(conversationId != null && { conversationId }),
					...(tweet.public_metrics?.like_count != null && {
						likeCount: tweet.public_metrics.like_count,
					}),
					...(tweet.public_metrics?.retweet_count != null && {
						retweetCount: tweet.public_metrics.retweet_count,
					}),
					...(tweet.public_metrics?.reply_count != null && {
						replyCount: tweet.public_metrics.reply_count,
					}),
					...(tweet.public_metrics?.quote_count != null && {
						quoteCount: tweet.public_metrics.quote_count,
					}),
					...(replyToId != null && {
						$replyToPost: { [EntityMetaKey.Id]: { id: replyToId } },
					}),
					...(quotedId != null && {
						$quotedPost: { [EntityMetaKey.Id]: { id: quotedId } },
					}),
					postUrl: UrlString.assert(`https://x.com/i/web/status/${entityId.id}`),
					$$media: (
						tweet.attachments?.media_keys ?? []
					).flatMap((mediaKey) => {
						const wireMedia = mediaByKey.get(mediaKey)
						const media = mediaFromUrl(
							wireMedia?.preview_image_url ?? wireMedia?.url,
							wireMedia?.type === 'video' ?
								MediaType.Video
							:
								MediaType.Image,
						)
						return media == null ? [] : [media]
					}),
					$author: (
						tweet.author_id == null ?
							undefined
						:
							{
								[EntityMetaKey.Id]: { id: tweet.author_id },
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
				likeCount: (post) => post.likeCount,
				retweetCount: (post) => post.retweetCount,
				replyCount: (post) => post.replyCount,
				quoteCount: (post) => post.quoteCount,
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
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getUser } = await import('$/sources/X/Rest/queries.ts')
				if (!('id' in entityId.$user))
					throw new Error('X_Rest: XUser_Timestamp username lookup is unsupported')

				const user = (await singleFlight(getUser)(context.publicEnv, entityId.$user.id)).data
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
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getTweet } = await import('$/sources/X/Rest/queries.ts')
				const tweet = (await singleFlight(getTweet)(context.publicEnv, entityId.$post.id)).data
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
			entityType: EntityType.XNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (_entityId, context) => {
				const { searchRecentTweets } = await import('$/sources/X/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const tweetSearchResponse = await singleFlight(searchRecentTweets)(context.publicEnv, limit)
				return [
					...(tweetSearchResponse.includes?.users ?? [])
						.flatMap((user) => {
							const userId = optionalNonemptyString(user.id)
							if (userId == null) return []
							return [{
								[EntityMetaKey.Id]: { id: userId },
							}]
						}),
					...(tweetSearchResponse.data ?? [])
						.flatMap((tweet) => {
							const authorId = optionalNonemptyString(tweet.author_id)
							if (authorId == null) return []
							return [{
								[EntityMetaKey.Id]: { id: authorId },
							}]
					}),
				]
			}
			},
		})({
				fields: {
				$$xUsers: (users) => users,
			},
			}),

		defineResolver(Source.X_Rest, {
			entityType: EntityType.XNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (_entityId, context) => {
				const { searchRecentTweets } = await import('$/sources/X/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(searchRecentTweets)(context.publicEnv, limit)).data ?? [])
						.flatMap((wirePost) => (
							wirePost.id == null ?
								[]
							:
								[{
									[EntityMetaKey.Id]: { id: wirePost.id },
								}]
						))
				)
			}
			},
		})({
				fields: {
				$$xPosts: (posts) => posts,
			},
			}),

		defineResolver(Source.X_Rest, {
			entityType: EntityType.XPost,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getTweet } = await import('$/sources/X/Rest/queries.ts')
				const tweet = (await singleFlight(getTweet)(context.publicEnv, entityId.id)).data
				if (tweet == null) throw new Error('X_Rest: post not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$post: entityId,
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
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getUser } = await import('$/sources/X/Rest/queries.ts')
				if (!('id' in entityId))
					throw new Error('X_Rest: XUser.$$timestamps username lookup is unsupported')

				const user = (await singleFlight(getUser)(context.publicEnv, entityId.id)).data
				if (user == null) throw new Error('X_Rest: user not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$user: entityId,
							timestampMs: Date.now(),
						},
						followerCount: user.public_metrics?.followers_count,
						followingCount: user.public_metrics?.following_count,
						tweetCount: user.public_metrics?.tweet_count,
						listedCount: user.public_metrics?.listed_count,
					},
				]
			},
				['id']: async (entityId, context) => {
				const { getUser } = await import('$/sources/X/Rest/queries.ts')
				if (!('id' in entityId))
					throw new Error('X_Rest: XUser.$$timestamps username lookup is unsupported')

				const user = (await singleFlight(getUser)(context.publicEnv, entityId.id)).data
				if (user == null) throw new Error('X_Rest: user not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$user: entityId,
							timestampMs: Date.now(),
						},
						followerCount: user.public_metrics?.followers_count,
						followingCount: user.public_metrics?.following_count,
						tweetCount: user.public_metrics?.tweet_count,
						listedCount: user.public_metrics?.listed_count,
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
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { listUserTweets } = await import('$/sources/X/Rest/queries.ts')
				if (!('id' in entityId))
					throw new Error('X_Rest: XUser.$$posts username lookup is unsupported')

				const limit = resolverContextRowLimit(context)
				const { data = [] } = await singleFlight(listUserTweets)(context.publicEnv, entityId.id, limit)
				return (
					data
						.flatMap((wirePost) => (
							wirePost.id == null ?
								[]
							:
								[{
									[EntityMetaKey.Id]: { id: wirePost.id },
								}]
						))
				)
			},
				['id']: async (entityId, context) => {
				const { listUserTweets } = await import('$/sources/X/Rest/queries.ts')
				if (!('id' in entityId))
					throw new Error('X_Rest: XUser.$$posts username lookup is unsupported')

				const limit = resolverContextRowLimit(context)
				const { data = [] } = await singleFlight(listUserTweets)(context.publicEnv, entityId.id, limit)
				return (
					data
						.flatMap((wirePost) => (
							wirePost.id == null ?
								[]
							:
								[{
									[EntityMetaKey.Id]: { id: wirePost.id },
								}]
						))
				)
			}
			},
		})({
				fields: {
				$$posts: (posts) => posts,
			},
			}),
	],
}

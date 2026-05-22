import { type } from 'arktype'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { UrlString } from '$/schema/$Url.ts'
import { Source } from '$/sources/$Source.ts'

const optionalTrimmedString = (value: string | undefined) => (
	value?.trim() ? value.trim() : undefined
)

const optionalUrlString = (value: string | undefined) => {
	const trimmed = optionalTrimmedString(value)
	if (trimmed == null) return undefined
	const parsed = UrlString(trimmed)
	return parsed instanceof type.errors ? undefined : parsed
}

export default {
	source: Source.X_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.XUser,
			resolve: async (entityId, context) => {
				const { xGetUser } = await import('$/sources/X/Rest/queries.ts')
				const d = (await singleFlight(xGetUser)(sourcePublicEnv(context, Source.X_Rest), entityId.id)).data
				if (d == null) throw new Error('X_Rest: user not found')
				const createdAt = Date.parse(d.created_at ?? '')
				const profileUrl = optionalUrlString(d.url)
				return {
					username: optionalTrimmedString(d.username),
					name: optionalTrimmedString(d.name),
					description: optionalTrimmedString(d.description),
					location: optionalTrimmedString(d.location),
					...(d.verified != null && { verified: d.verified }),
					...(Number.isFinite(createdAt) && { createdAt }),
					...(profileUrl != null && { profileUrl }),
					...(d.public_metrics?.followers_count != null && {
						followerCount: d.public_metrics.followers_count,
					}),
					...(d.public_metrics?.following_count != null && {
						followingCount: d.public_metrics.following_count,
					}),
					...(d.public_metrics?.tweet_count != null && {
						tweetCount: d.public_metrics.tweet_count,
					}),
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(d.profile_image_url, MediaType.Image)),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.XPost,
			resolve: async (entityId, context) => {
				const { xGetTweet } = await import('$/sources/X/Rest/queries.ts')
				const t = (await singleFlight(xGetTweet)(sourcePublicEnv(context, Source.X_Rest), entityId.id)).data
				if (t == null) throw new Error('X_Rest: post not found')
				const createdAt = Date.parse(t.created_at ?? '')
				const conversationId = optionalTrimmedString(t.conversation_id)
				const replyToId = optionalTrimmedString(
					t.referenced_tweets?.find((ref) => ref.type === 'replied_to')?.id,
				)
				const quotedId = optionalTrimmedString(
					t.referenced_tweets?.find((ref) => ref.type === 'quoted')?.id,
				)
				return {
					text: optionalTrimmedString(t.text),
					...(Number.isFinite(createdAt) && { createdAt }),
					...(conversationId != null && { conversationId }),
					...(t.public_metrics?.like_count != null && {
						likeCount: t.public_metrics.like_count,
					}),
					...(t.public_metrics?.retweet_count != null && {
						retweetCount: t.public_metrics.retweet_count,
					}),
					...(t.public_metrics?.reply_count != null && {
						replyCount: t.public_metrics.reply_count,
					}),
					...(t.public_metrics?.quote_count != null && {
						quoteCount: t.public_metrics.quote_count,
					}),
					...(replyToId != null && {
						$replyToPost: { [EntityMetaKey.Id]: { id: replyToId } },
					}),
					...(quotedId != null && {
						$quotedPost: { [EntityMetaKey.Id]: { id: quotedId } },
					}),
					$author: (
						t.author_id == null ?
							undefined
						:	{
								[EntityMetaKey.Id]: { id: t.author_id },
							}
					),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.XNetwork,
			fieldName: '$$xUsers',
			resolve: async (_entityId, context) => {
				const { xSearchRecentTweets } = await import('$/sources/X/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.X_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				const result = await singleFlight(xSearchRecentTweets)(publicEnv, limit)
				const byId = new Map<string, { [EntityMetaKey.Id]: { id: string } }>()
				for (const user of result.includes?.users ?? []) {
					const userId = optionalTrimmedString(user.id)
					if (userId != null) {
						byId.set(userId, {
							[EntityMetaKey.Id]: { id: userId },
						})
					}
				}
				for (const tweet of result.data ?? []) {
					const authorId = optionalTrimmedString(tweet.author_id)
					if (authorId != null) {
						byId.set(authorId, {
							[EntityMetaKey.Id]: { id: authorId },
						})
					}
				}
				return [...byId.values()]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.XNetwork,
			fieldName: '$$xPosts',
			resolve: async (_entityId, context) => {
				const { xSearchRecentTweets } = await import('$/sources/X/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.X_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(xSearchRecentTweets)(publicEnv, limit)).data ?? [])
						.flatMap((row) => (
							row.id == null ?
								[]
							:	[{
									[EntityMetaKey.Id]: { id: row.id },
								}]
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.XUser,
			fieldName: '$$posts',
			resolve: async (entityId, context) => {
				const { xListUserTweets } = await import('$/sources/X/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				const { data = [] } = await singleFlight(xListUserTweets)(sourcePublicEnv(context, Source.X_Rest), entityId.id, limit)
				return (
					data
						.flatMap((row) => (
							row.id == null ?
								[]
							:	[{
									[EntityMetaKey.Id]: { id: row.id },
								}]
						))
				)
			},
		}),
	],
}

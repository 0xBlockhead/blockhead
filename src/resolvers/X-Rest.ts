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
import type { XApiV2Media } from '$/sources/X/Rest/types.ts'

const optionalTrimmedString = (value: string | undefined) => (
	value?.trim() || undefined
)

const optionalUrlString = (value: string | undefined) => {
	const trimmed = optionalTrimmedString(value)
	if (trimmed == null) return undefined
	const parsed = UrlString(trimmed)
	return parsed instanceof type.errors ? undefined : parsed
}

const xPostUrl = (postId: string) => (
	optionalUrlString(`https://x.com/i/web/status/${postId.trim()}`)
)

const mediaTypeFromWire = (wireType: string | undefined) => (
	wireType === 'video' ?
		MediaType.Video
	:
		MediaType.Image
)

const mediaByKeyFromIncludes = (includes?: {
	media?: XApiV2Media[]
}) => (
	new Map(
		(includes?.media ?? []).flatMap((row) => (
			row.media_key == null ?
				[]
			:	[[row.media_key, row] as const]
		)),
	)
)

const mediaEntitiesFromTweet = (
	attachments: {
		media_keys?: string[]
	} | undefined,
	mediaByKey: Map<string, XApiV2Media>,
) => (
	(attachments?.media_keys ?? []).flatMap((mediaKey) => {
		const wire = mediaByKey.get(mediaKey)
		if (wire == null) return []
		const previewUrl = wire.preview_image_url ?? wire.url
		const media = mediaFromUrl(previewUrl, mediaTypeFromWire(wire.type))
		return media == null ? [] : [media]
	})
)

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
				const websiteUrl = optionalUrlString(d.url)
				return {
					username: optionalTrimmedString(d.username),
					name: optionalTrimmedString(d.name),
					description: optionalTrimmedString(d.description),
					location: optionalTrimmedString(d.location),
					...(d.verified != null && { verified: d.verified }),
					...(Number.isFinite(createdAt) && { createdAt }),
					...(websiteUrl != null && { websiteUrl }),
					...(d.public_metrics?.followers_count != null && {
						followerCount: d.public_metrics.followers_count,
					}),
					...(d.public_metrics?.following_count != null && {
						followingCount: d.public_metrics.following_count,
					}),
					...(d.public_metrics?.tweet_count != null && {
						tweetCount: d.public_metrics.tweet_count,
					}),
					...(d.public_metrics?.listed_count != null && {
						listedCount: d.public_metrics.listed_count,
					}),
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(d.profile_image_url, MediaType.Image)),
					...((
						bannerMedia,
					) => (
						bannerMedia != null && {
							$profileBanner: bannerMedia,
						}
					))(mediaFromUrl(d.profile_banner_url, MediaType.Image)),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.XPost,
			resolve: async (entityId, context) => {
				const { xGetTweet } = await import('$/sources/X/Rest/queries.ts')
				const response = await singleFlight(xGetTweet)(sourcePublicEnv(context, Source.X_Rest), entityId.id)
				const t = response.data
				if (t == null) throw new Error('X_Rest: post not found')
				const mediaByKey = mediaByKeyFromIncludes(response.includes)
				const createdAt = Date.parse(t.created_at ?? '')
				const conversationId = optionalTrimmedString(t.conversation_id)
				const replyToId = optionalTrimmedString(
					t.referenced_tweets?.find((ref) => ref.type === 'replied_to')?.id,
				)
				const quotedId = optionalTrimmedString(
					t.referenced_tweets?.find((ref) => ref.type === 'quoted')?.id,
				)
				const postUrl = xPostUrl(entityId.id)
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
					...(postUrl != null && { postUrl }),
					$$media: mediaEntitiesFromTweet(t.attachments, mediaByKey),
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
				return [
					...(result.includes?.users ?? [])
						.flatMap((user) => {
							const userId = optionalTrimmedString(user.id)
							if (userId == null) return []
							return [{
								[EntityMetaKey.Id]: { id: userId },
							}]
						}),
					...(result.data ?? [])
						.flatMap((tweet) => {
							const authorId = optionalTrimmedString(tweet.author_id)
							if (authorId == null) return []
							return [{
								[EntityMetaKey.Id]: { id: authorId },
							}]
						}),
				]
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

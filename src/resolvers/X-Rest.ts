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
import type {
	XApiV2Media,
	XApiV2Tweet,
	XApiV2User,
} from '$/sources/X/Rest/types.ts'

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

const xUserTimestampFieldsFromUser = (
	user: XApiV2User,
) => ({
	followerCount: user.public_metrics?.followers_count,
	followingCount: user.public_metrics?.following_count,
	tweetCount: user.public_metrics?.tweet_count,
	listedCount: user.public_metrics?.listed_count,
})

const xPostTimestampFieldsFromTweet = (
	tweet: XApiV2Tweet,
) => ({
	likeCount: tweet.public_metrics?.like_count,
	retweetCount: tweet.public_metrics?.retweet_count,
	replyCount: tweet.public_metrics?.reply_count,
	quoteCount: tweet.public_metrics?.quote_count,
})

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
					...xUserTimestampFieldsFromUser(d),
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
					...xPostTimestampFieldsFromTweet(t),
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

		defineEntityResolver({
			entityType: EntityType.XUser_Timestamp,
			resolve: async (entityId, context) => {
				const { xGetUser } = await import('$/sources/X/Rest/queries.ts')
				const user = (await singleFlight(xGetUser)(sourcePublicEnv(context, Source.X_Rest), entityId.$user.id)).data
				if (user == null) throw new Error('X_Rest: user not found')
				return xUserTimestampFieldsFromUser(user)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.XPost_Timestamp,
			resolve: async (entityId, context) => {
				const { xGetTweet } = await import('$/sources/X/Rest/queries.ts')
				const tweet = (await singleFlight(xGetTweet)(sourcePublicEnv(context, Source.X_Rest), entityId.$post.id)).data
				if (tweet == null) throw new Error('X_Rest: post not found')
				return xPostTimestampFieldsFromTweet(tweet)
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
			entityType: EntityType.XPost,
			fieldName: '$$timestamps',
			resolve: async (entityId, context) => {
				const { xGetTweet } = await import('$/sources/X/Rest/queries.ts')
				const tweet = (await singleFlight(xGetTweet)(sourcePublicEnv(context, Source.X_Rest), entityId.id)).data
				if (tweet == null) throw new Error('X_Rest: post not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$post: entityId,
							timestampMs: Date.now(),
						},
						...xPostTimestampFieldsFromTweet(tweet),
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.XUser,
			fieldName: '$$timestamps',
			resolve: async (entityId, context) => {
				const { xGetUser } = await import('$/sources/X/Rest/queries.ts')
				const user = (await singleFlight(xGetUser)(sourcePublicEnv(context, Source.X_Rest), entityId.id)).data
				if (user == null) throw new Error('X_Rest: user not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$user: entityId,
							timestampMs: Date.now(),
						},
						...xUserTimestampFieldsFromUser(user),
					},
				]
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

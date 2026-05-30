import { type } from 'arktype'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { UrlString } from '$/schema/$Url.ts'
import { Source } from '$/sources/$Source.ts'
import type {
	FxEmbedTwitterStatus,
	FxEmbedUser,
} from '$/sources/FxEmbed/Rest/types.ts'

const optionalTrimmedString = (value: string | undefined) => (
	value?.trim() || undefined
)

const optionalUrlString = (value: string | undefined) => {
	const trimmed = optionalTrimmedString(value)
	if (trimmed == null) return undefined
	const parsed = UrlString(trimmed)
	return parsed instanceof type.errors ? undefined : parsed
}

const xUserTimestampFieldsFromUser = (
	user: FxEmbedUser,
) => ({
	followerCount: user.followers,
	followingCount: user.following,
	tweetCount: user.statuses,
})

const xPostTimestampFieldsFromStatus = (
	status: FxEmbedTwitterStatus,
) => ({
	likeCount: status.likes,
	retweetCount: status.reposts,
	replyCount: status.replies,
	quoteCount: status.quotes,
})

export default {
	source: Source.X_FxEmbed_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.XUser,
			resolve: async (entityId) => {
				const { fxEmbedGetUser } = await import('$/sources/FxEmbed/Rest/queries.ts')
				const response = await singleFlight(fxEmbedGetUser)(entityId.id)
				const user = response.user
				if (user?.id == null) throw new Error('X_FxEmbed_Rest: user not found')
				const createdAt = Date.parse(user.joined ?? '')
				const websiteUrl = optionalUrlString(user.url)
				return {
					username: optionalTrimmedString(user.screen_name),
					name: optionalTrimmedString(user.name),
					description: optionalTrimmedString(user.description),
					location: optionalTrimmedString(user.location),
					...(user.verification?.verified != null && {
						verified: user.verification.verified,
					}),
					...(Number.isFinite(createdAt) && { createdAt }),
					...(websiteUrl != null && { websiteUrl }),
					...xUserTimestampFieldsFromUser(user),
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(user.avatar_url ?? undefined, MediaType.Image)),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.XPost,
			resolve: async (entityId) => {
				const { fxEmbedGetStatus } = await import('$/sources/FxEmbed/Rest/queries.ts')
				const response = await singleFlight(fxEmbedGetStatus)(entityId.id)
				const status = response.status
				if (status?.type !== 'status' || status.id == null) {
					throw new Error('X_FxEmbed_Rest: post not found')
				}
				const createdAt = (
					status.created_timestamp != null ?
						status.created_timestamp * 1000
					: Date.parse(status.created_at ?? '')
				)
				const replyToId = optionalTrimmedString(status.replying_to?.status)
				const quotedId = optionalTrimmedString(status.quote?.id)
				const postId = optionalTrimmedString(status.id)
				return {
					text: optionalTrimmedString(status.text),
					...(Number.isFinite(createdAt) && { createdAt }),
					...(postId != null && {
						postUrl: `https://x.com/i/web/status/${postId}`,
					}),
					...xPostTimestampFieldsFromStatus(status),
					...(replyToId != null && {
						$replyToPost: {
							[EntityMetaKey.Id]: { id: replyToId },
						},
					}),
					...(quotedId != null && {
						$quotedPost: {
							[EntityMetaKey.Id]: { id: quotedId },
						},
					}),
					$author: (
						status.author?.id == null ?
							undefined
						:	{
								[EntityMetaKey.Id]: { id: status.author.id },
							}
					),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.XUser_Timestamp,
			resolve: async (entityId) => {
				const { fxEmbedGetUser } = await import('$/sources/FxEmbed/Rest/queries.ts')
				const user = (await singleFlight(fxEmbedGetUser)(entityId.$user.id)).user
				if (user?.id == null) throw new Error('X_FxEmbed_Rest: user not found')
				return xUserTimestampFieldsFromUser(user)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.XPost_Timestamp,
			resolve: async (entityId) => {
				const { fxEmbedGetStatus } = await import('$/sources/FxEmbed/Rest/queries.ts')
				const status = (await singleFlight(fxEmbedGetStatus)(entityId.$post.id)).status
				if (status?.type !== 'status' || status.id == null) {
					throw new Error('X_FxEmbed_Rest: post not found')
				}
				return xPostTimestampFieldsFromStatus(status)
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.XNetwork,
			fieldName: '$$xUsers',
			resolve: async (_entityId, context) => {
				const { fxEmbedSearchStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				const result = await singleFlight(fxEmbedSearchStatuses)(limit)
				return (
					(result.results ?? [])
						.flatMap((status) => {
							const authorId = optionalTrimmedString(status.author?.id)
							if (authorId == null) return []
							return [{
								[EntityMetaKey.Id]: { id: authorId },
							}]
						})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.XNetwork,
			fieldName: '$$xPosts',
			resolve: async (_entityId, context) => {
				const { fxEmbedSearchStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(fxEmbedSearchStatuses)(limit)).results ?? [])
						.flatMap((row) => (
							row.type === 'status' && row.id != null ?
								[{
									[EntityMetaKey.Id]: { id: row.id },
								}]
							:	[]
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.XPost,
			fieldName: '$$timestamps',
			resolve: async (entityId) => {
				const { fxEmbedGetStatus } = await import('$/sources/FxEmbed/Rest/queries.ts')
				const status = (await singleFlight(fxEmbedGetStatus)(entityId.id)).status
				if (status?.type !== 'status' || status.id == null) {
					throw new Error('X_FxEmbed_Rest: post not found')
				}
				return [
					{
						[EntityMetaKey.Id]: {
							$post: entityId,
							timestampMs: Date.now(),
						},
						...xPostTimestampFieldsFromStatus(status),
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.XUser,
			fieldName: '$$timestamps',
			resolve: async (entityId) => {
				const { fxEmbedGetUser } = await import('$/sources/FxEmbed/Rest/queries.ts')
				const user = (await singleFlight(fxEmbedGetUser)(entityId.id)).user
				if (user?.id == null) throw new Error('X_FxEmbed_Rest: user not found')
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
				const { fxEmbedGetUserStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(fxEmbedGetUserStatuses)(entityId.id, limit)).results ?? [])
						.flatMap((row) => (
							row.type === 'status' && row.id != null ?
								[{
									[EntityMetaKey.Id]: { id: row.id },
								}]
							:	[]
						))
				)
			},
		}),
	],
}

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
	FxEmbedTwitterStatusWire,
	FxEmbedUserWire,
} from '$/sources/FxEmbed/Rest/types.ts'

const optionalTrimmedString = (value: string | undefined) => (
	value?.trim() ? value.trim() : undefined
)

const optionalUrlString = (value: string | undefined) => {
	const trimmed = optionalTrimmedString(value)
	if (trimmed == null) return undefined
	const parsed = UrlString(trimmed)
	return parsed instanceof type.errors ? undefined : parsed
}

const userFieldsFromWire = (user: FxEmbedUserWire) => {
	const createdAt = Date.parse(user.joined ?? '')
	const profileUrl = optionalUrlString(user.url)
	return {
		username: optionalTrimmedString(user.screen_name),
		name: optionalTrimmedString(user.name),
		description: optionalTrimmedString(user.description),
		location: optionalTrimmedString(user.location),
		...(user.verification?.verified != null && {
			verified: user.verification.verified,
		}),
		...(Number.isFinite(createdAt) && { createdAt }),
		...(profileUrl != null && { profileUrl }),
		...(user.followers != null && { followerCount: user.followers }),
		...(user.following != null && { followingCount: user.following }),
		...(user.statuses != null && { tweetCount: user.statuses }),
		...((
			iconMedia,
		) => (
			iconMedia != null && {
				$icon: iconMedia,
			}
		))(mediaFromUrl(user.avatar_url ?? undefined, MediaType.Image)),
	}
}

const postFieldsFromWire = (status: FxEmbedTwitterStatusWire) => {
	const createdAt = (
		status.created_timestamp != null ?
			status.created_timestamp * 1000
		: Date.parse(status.created_at ?? '')
	)
	const replyToId = optionalTrimmedString(status.replying_to?.status)
	const quotedId = optionalTrimmedString(status.quote?.id)
	return {
		text: optionalTrimmedString(status.text),
		...(Number.isFinite(createdAt) && { createdAt }),
		...(replyToId != null && { conversationId: replyToId }),
		...(status.likes != null && { likeCount: status.likes }),
		...(status.reposts != null && { retweetCount: status.reposts }),
		...(status.replies != null && { replyCount: status.replies }),
		...(status.quotes != null && { quoteCount: status.quotes }),
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
}

const statusEntityRefs = (results: FxEmbedTwitterStatusWire[] | undefined) => (
	(results ?? [])
		.flatMap((row) => (
			row.type === 'status' && row.id != null ?
				[{
					[EntityMetaKey.Id]: { id: row.id },
				}]
			:	[]
		))
)

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
				return userFieldsFromWire(user)
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
				return postFieldsFromWire(status)
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
				const byId = new Map<string, { [EntityMetaKey.Id]: { id: string } }>()
				for (const status of result.results ?? []) {
					const authorId = optionalTrimmedString(status.author?.id)
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
				const { fxEmbedSearchStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				return statusEntityRefs((await singleFlight(fxEmbedSearchStatuses)(limit)).results)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.XUser,
			fieldName: '$$posts',
			resolve: async (entityId, context) => {
				const { fxEmbedGetUserStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				return statusEntityRefs((
					await singleFlight(fxEmbedGetUserStatuses)(entityId.id, limit)
				).results)
			},
		}),
	],
}

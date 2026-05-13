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
import { Source } from '$/sources/$Source.ts'

const optionalTrimmedString = (value: string | undefined) => (
	value?.trim() ? value.trim() : undefined
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
				return {
					username: optionalTrimmedString(d.username),
					name: optionalTrimmedString(d.name),
					description: optionalTrimmedString(d.description),
					...((
						t,
					) => (
						t == null ?
							{}
						:	{
								$icon: t,
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
				return {
					text: optionalTrimmedString(t.text),
					...(Number.isFinite(createdAt) ? { createdAt } : {}),
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
					byId.set(user.id, {
						[EntityMetaKey.Id]: { id: user.id },
					})
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
						.map((row) => ({
							[EntityMetaKey.Id]: { id: row.id },
						}))
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
						.map((row) => ({
							[EntityMetaKey.Id]: { id: row.id },
						}))
				)
			},
		}),
	],
}

import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const optionalTrimmedString = (value: string | undefined) => (
	value?.trim() ? value.trim() : undefined
)

export default {
	source: Source.Reddit_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.RedditSubreddit,
			resolve: async (entityId, context) => {
				const { redditGetSubredditAbout } = await import('$/sources/Reddit/Rest/queries.ts')
				const d = (await singleFlight(redditGetSubredditAbout)(sourcePublicEnv(context, Source.Reddit_Rest), entityId.name)).data
				if (d == null) throw new Error('Reddit_Rest: subreddit not found')
				return {
					title: optionalTrimmedString(d.title),
					publicDescription: optionalTrimmedString(d.public_description),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.RedditLink,
			resolve: async (entityId, context) => {
				const { redditGetInfo } = await import('$/sources/Reddit/Rest/queries.ts')
				const t = (await singleFlight(redditGetInfo)(sourcePublicEnv(context, Source.Reddit_Rest), entityId.fullname))
					.data
					.children[0]
				if (t == null || t.kind !== 't3') throw new Error('Reddit_Rest: link not found')
				const sub = optionalTrimmedString(t.data.subreddit)
				return {
					title: optionalTrimmedString(t.data.title),
					selftext: optionalTrimmedString(t.data.selftext),
					url: optionalTrimmedString(t.data.url),
					author: optionalTrimmedString(t.data.author),
					$subreddit: (
						sub == null ?
							undefined
						:	{
								[EntityMetaKey.Id]: { name: sub.toLowerCase() },
							}
					),
					permalink: optionalTrimmedString(t.data.permalink),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.RedditComment,
			resolve: async (entityId, context) => {
				const { redditGetInfo } = await import('$/sources/Reddit/Rest/queries.ts')
				const t = (await singleFlight(redditGetInfo)(sourcePublicEnv(context, Source.Reddit_Rest), entityId.fullname))
					.data
					.children[0]
				if (t == null || t.kind !== 't1') throw new Error('Reddit_Rest: comment not found')
				const linkId = optionalTrimmedString(t.data.link_id)
				return {
					body: optionalTrimmedString(t.data.body),
					author: optionalTrimmedString(t.data.author),
					$link: (
						linkId == null ?
							undefined
						:	{
								[EntityMetaKey.Id]: { fullname: linkId },
							}
					),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.RedditNetwork,
			fieldName: '$$redditSubreddits',
			resolve: async (_entityId, context) => {
				const { redditListPopularLinks } = await import('$/sources/Reddit/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Reddit_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				const byName = new Map<string, { [EntityMetaKey.Id]: { name: string } }>()
				for (const child of ((await singleFlight(redditListPopularLinks)(publicEnv, limit)).data.children ?? [])) {
					if (child.kind !== 't3') continue
					const name = optionalTrimmedString(child.data.subreddit)
					if (name == null) continue
					const ref = {
						[EntityMetaKey.Id]: { name: name.toLowerCase() },
					}
					byName.set(ref[EntityMetaKey.Id].name, ref)
				}
				return [...byName.values()]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.RedditNetwork,
			fieldName: '$$redditLinks',
			resolve: async (_entityId, context) => {
				const { redditListPopularLinks } = await import('$/sources/Reddit/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Reddit_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(redditListPopularLinks)(publicEnv, limit)).data.children ?? [])
						.flatMap((child) => (
							child.kind !== 't3' || typeof child.data.name !== 'string' ?
								[]
							:	[
								{
									[EntityMetaKey.Id]: { fullname: child.data.name },
								},
							]
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.RedditSubreddit,
			fieldName: '$$links',
			resolve: async (entityId, context) => {
				const { redditListSubredditLinks } = await import('$/sources/Reddit/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Reddit_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(redditListSubredditLinks)(publicEnv, entityId.name, limit)).data.children ?? [])
						.flatMap((child) => (
							child.kind !== 't3' || typeof child.data.name !== 'string' ?
								[]
							:	[
								{
									[EntityMetaKey.Id]: { fullname: child.data.name },
								},
							]
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.RedditLink,
			fieldName: '$$comments',
			resolve: async (entityId, context) => {
				const { redditGetInfo, redditGetLinkComments } = await import('$/sources/Reddit/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Reddit_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				const info = (await singleFlight(redditGetInfo)(publicEnv, entityId.fullname)).data.children[0]
				const permalink = (
					info != null
					&& info.kind === 't3'
					&& typeof info.data.permalink === 'string'
					&& info.data.permalink.optionalTrimmedString() !== ''
				) ?
					info.data.permalink.optionalTrimmedString()
				:	undefined
				if (permalink == null) {
					throw new Error('Reddit_Rest: link permalink missing for comments')
				}
				return (
					((await singleFlight(redditGetLinkComments)(publicEnv, permalink, limit))[1]?.data.children ?? [])
						.flatMap((child) => (
							child.kind !== 't1' || typeof child.data.name !== 'string' ?
								[]
							:	[{ [EntityMetaKey.Id]: { fullname: child.data.name } }]
						))
				)
			},
		}),
	],
}

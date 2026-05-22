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
import { Source } from '$/sources/$Source.ts'

const optionalTrimmedString = (value: string | undefined) => (
	value?.trim() ? value.trim() : undefined
)

const optionalFiniteNumber = (value: number | undefined) => (
	value != null && Number.isFinite(value) ?
		value
	:
		undefined
)

const redditCreatedAtMs = (createdUtc: number | undefined) => (
	createdUtc != null && Number.isFinite(createdUtc) ?
		createdUtc * 1000
	:
		undefined
)

export default {
	source: Source.Reddit_PublicJson,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.RedditSubreddit,
			resolve: async (entityId) => {
				const { redditJsonGetSubredditAbout } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const d = (await singleFlight(redditJsonGetSubredditAbout)(entityId.name)).data
				if (d == null) throw new Error('Reddit_PublicJson: subreddit not found')
				return {
					title: optionalTrimmedString(d.title),
					publicDescription: optionalTrimmedString(d.public_description),
					...(optionalFiniteNumber(d.subscribers) != null && {
						subscriberCount: optionalFiniteNumber(d.subscribers),
					}),
					...(optionalFiniteNumber(d.active_user_count) != null && {
						activeUserCount: optionalFiniteNumber(d.active_user_count),
					}),
					...(redditCreatedAtMs(d.created_utc) != null && {
						createdAt: redditCreatedAtMs(d.created_utc),
					}),
					...(d.over18 === true && { over18: true }),
					...(d.over18 === false && { over18: false }),
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(optionalTrimmedString(d.icon_img), MediaType.Image)),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.RedditLink,
			resolve: async (entityId) => {
				const { redditJsonGetInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const t = (await singleFlight(redditJsonGetInfo)(entityId.fullname))
					.data
					.children[0]
				if (t == null || t.kind !== 't3') throw new Error('Reddit_PublicJson: link not found')
				const sub = optionalTrimmedString(t.data.subreddit)
				return {
					title: optionalTrimmedString(t.data.title),
					selftext: optionalTrimmedString(t.data.selftext),
					url: optionalTrimmedString(t.data.url),
					author: optionalTrimmedString(t.data.author),
					...(optionalFiniteNumber(t.data.score) != null && {
						score: optionalFiniteNumber(t.data.score),
					}),
					...(optionalFiniteNumber(t.data.num_comments) != null && {
						commentCount: optionalFiniteNumber(t.data.num_comments),
					}),
					...(redditCreatedAtMs(t.data.created_utc) != null && {
						createdAt: redditCreatedAtMs(t.data.created_utc),
					}),
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
			resolve: async (entityId) => {
				const { redditJsonGetInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const t = (await singleFlight(redditJsonGetInfo)(entityId.fullname))
					.data
					.children[0]
				if (t == null || t.kind !== 't1') throw new Error('Reddit_PublicJson: comment not found')
				const linkId = optionalTrimmedString(t.data.link_id)
				return {
					body: optionalTrimmedString(t.data.body),
					author: optionalTrimmedString(t.data.author),
					...(optionalFiniteNumber(t.data.score) != null && {
						score: optionalFiniteNumber(t.data.score),
					}),
					...(redditCreatedAtMs(t.data.created_utc) != null && {
						createdAt: redditCreatedAtMs(t.data.created_utc),
					}),
					...(optionalFiniteNumber(t.data.depth) != null && {
						depth: optionalFiniteNumber(t.data.depth),
					}),
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
				const { redditJsonListSubredditHot } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				const byName = new Map<string, { [EntityMetaKey.Id]: { name: string } }>()
				for (const child of ((await singleFlight(redditJsonListSubredditHot)('popular', limit)).data.children ?? [])) {
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
				const { redditJsonListSubredditHot } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(redditJsonListSubredditHot)('popular', limit)).data.children ?? [])
						.flatMap((child) => (
							child.kind !== 't3' || child.data.name == null ?
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
				const { redditJsonListSubredditHot } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(redditJsonListSubredditHot)(entityId.name, limit)).data.children ?? [])
						.flatMap((child) => (
							child.kind !== 't3' || child.data.name == null ?
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
				const { redditJsonGetInfo, redditJsonGetComments } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				const info = (await singleFlight(redditJsonGetInfo)(entityId.fullname)).data.children[0]
				const permalink = (
					info != null
					&& info.kind === 't3' ?
						optionalTrimmedString(info.data.permalink)
					:	undefined
				)
				if (permalink == null) {
					throw new Error('Reddit_PublicJson: link permalink missing for comments')
				}
				return (
					((await singleFlight(redditJsonGetComments)(permalink, limit))[1]?.data.children ?? [])
						.flatMap((child) => (
							child.kind !== 't1' || child.data.name == null ?
								[]
							:	[{ [EntityMetaKey.Id]: { fullname: child.data.name } }]
						))
				)
			},
		}),
	],
}

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
import { mediaFromUrl } from '$/lib/media.ts'
import { MediaType } from '$/schema/Media.ts'
import type {
	RedditApiListing,
	RedditApiThing,
} from '$/sources/Reddit/Rest/types.ts'


const optionalTrimmedString = (value: string | undefined) => (
	value?.trim() || undefined
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

const redditSubredditIconUrl = (
	iconImg: string | undefined,
	communityIcon: string | undefined,
) => {
	const community = optionalTrimmedString(communityIcon?.replaceAll('&amp;', '&'))
	const icon = optionalTrimmedString(iconImg?.replaceAll('&amp;', '&'))
	return community ?? icon
}

const redditLinkArticleIdFromFullname = (fullname: string) => {
	if (!fullname.startsWith('t3_')) {
		throw new Error('Reddit: link fullname must start with t3_')
	}
	const articleId = fullname.slice(3)
	if (!articleId) {
		throw new Error('Reddit: link article id missing')
	}
	return articleId
}

const redditRepliesListingFromThing = (
	replies: RedditApiListing | '' | undefined,
): RedditApiListing | undefined => (
	replies != null && replies !== '' ?
		replies
	:
		undefined
)

const redditDirectReplyRefsByParentFromCommentForest = (
	children: readonly RedditApiThing[] | undefined,
): Map<string, { [EntityMetaKey.Id]: { fullname: string } }[]> => {
	const byParent = new Map<string, { [EntityMetaKey.Id]: { fullname: string } }[]>()

	const visit = (thing: RedditApiThing) => {
		if (thing.kind !== 't1' || thing.data.name == null) return
		const ref = { [EntityMetaKey.Id]: { fullname: thing.data.name } }
		const listing = redditRepliesListingFromThing(thing.data.replies)
		const directReplies = (listing?.data.children ?? []).flatMap((child) => (
			child.kind === 't1' && child.data.name != null ?
				[{ [EntityMetaKey.Id]: { fullname: child.data.name } }]
			:
				[]
		))
		if (directReplies.length > 0) {
			byParent.set(ref[EntityMetaKey.Id].fullname, directReplies)
		}
		for (const child of listing?.data.children ?? []) {
			visit(child)
		}
	}

	for (const child of children ?? []) {
		visit(child)
	}

	return byParent
}


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
				))(mediaFromUrl(redditSubredditIconUrl(d.icon_img, d.community_icon), MediaType.Image)),
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
			resolve: async (entityId, context) => {
				const { redditGetInfo } = await import('$/sources/Reddit/Rest/queries.ts')
				const t = (await singleFlight(redditGetInfo)(sourcePublicEnv(context, Source.Reddit_Rest), entityId.fullname))
					.data
					.children[0]
				if (t == null || t.kind !== 't1') throw new Error('Reddit_Rest: comment not found')
				const linkId = optionalTrimmedString(t.data.link_id)
				const parentId = optionalTrimmedString(t.data.parent_id)
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
					...(parentId?.startsWith('t1_') === true && {
						$parentComment: { [EntityMetaKey.Id]: { fullname: parentId } },
					}),
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
				return (
					((await singleFlight(redditListPopularLinks)(publicEnv, limit)).data.children ?? [])
						.flatMap((child) => {
							if (child.kind !== 't3') return []
							const name = optionalTrimmedString(child.data.subreddit)
							if (name == null) return []
							return [{
								[EntityMetaKey.Id]: { name: name.toLowerCase() },
							}]
						})
				)
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
				const { redditListSubredditLinks } = await import('$/sources/Reddit/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Reddit_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(redditListSubredditLinks)(publicEnv, entityId.name, limit)).data.children ?? [])
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
				const { redditGetLinkCommentsByArticleId } = await import('$/sources/Reddit/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Reddit_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				const articleId = redditLinkArticleIdFromFullname(entityId.fullname)
				return (
					((await singleFlight(redditGetLinkCommentsByArticleId)(publicEnv, articleId, limit))[1]?.data.children ?? [])
						.flatMap((child) => (
							child.kind === 't1' && child.data.name != null ?
								[{ [EntityMetaKey.Id]: { fullname: child.data.name } }]
							:
								[]
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.RedditComment,
			fieldName: '$$replies',
			resolve: async (entityId, context) => {
				const { redditGetInfo, redditGetLinkCommentsByArticleId } = await import('$/sources/Reddit/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Reddit_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				const t = (await singleFlight(redditGetInfo)(publicEnv, entityId.fullname))
					.data
					.children[0]
				if (t == null || t.kind !== 't1') {
					throw new Error('Reddit_Rest: comment not found for replies')
				}
				const linkId = optionalTrimmedString(t.data.link_id)
				if (linkId == null) {
					throw new Error('Reddit_Rest: comment link_id missing')
				}
				const articleId = redditLinkArticleIdFromFullname(linkId)
				const byParent = redditDirectReplyRefsByParentFromCommentForest(
					((await singleFlight(redditGetLinkCommentsByArticleId)(publicEnv, articleId, limit))[1]?.data.children ?? []),
				)
				return byParent.get(entityId.fullname) ?? []
			},
		}),
	],
}

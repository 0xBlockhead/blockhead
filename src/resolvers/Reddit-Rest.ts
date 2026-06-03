import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { timestampMsFromUnixSeconds } from '$/lib/time.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import { MediaType } from '$/schema/Media.ts'
import type {
	RedditApiListing,
	RedditApiSubredditAbout,
	RedditApiThing,
} from '$/sources/Reddit/Rest/types.ts'


const redditSubredditIconUrl = (
	iconImg: string | undefined,
	communityIcon: string | undefined,
) => {
	const community = optionalNonemptyString(communityIcon?.replaceAll('&amp;', '&'))
	const icon = optionalNonemptyString(iconImg?.replaceAll('&amp;', '&'))
	return community ?? icon
}

const redditLinkArticleIdFromFullname = (fullname: string) => {
	if (!fullname.startsWith('t3_')) {
		throw new Error('Reddit_Rest: link fullname must start with t3_')
	}
	const articleId = fullname.slice(3)
	if (!articleId) {
		throw new Error('Reddit_Rest: link article id missing')
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
		const redditReplyListing = redditRepliesListingFromThing(thing.data.replies)
		const directReplies = (redditReplyListing?.data.children ?? []).flatMap((child) => (
			child.kind === 't1' && child.data.name != null ?
				[{ [EntityMetaKey.Id]: { fullname: child.data.name } }]
			:
				[]
		))
		if (directReplies.length > 0) {
			byParent.set(ref[EntityMetaKey.Id].fullname, directReplies)
		}
		for (const child of redditReplyListing?.data.children ?? []) {
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
				const { getSubredditAbout } = await import('$/sources/Reddit/Rest/queries.ts')
				const subredditAbout = (await singleFlight(getSubredditAbout)(sourcePublicEnv(context, Source.Reddit_Rest), entityId.name)).data
				return {
					title: optionalNonemptyString(subredditAbout.title),
					publicDescription: optionalNonemptyString(subredditAbout.public_description),
					...(subredditAbout.subscribers != null && { subscriberCount: subredditAbout.subscribers }),
					...(subredditAbout.active_user_count != null && {
						activeUserCount: subredditAbout.active_user_count,
					}),
					...(timestampMsFromUnixSeconds(subredditAbout.created_utc) != null && {
						createdAt: timestampMsFromUnixSeconds(subredditAbout.created_utc),
					}),
				...(subredditAbout.over18 === true && { over18: true }),
				...(subredditAbout.over18 === false && { over18: false }),
				...((
					iconMedia,
				) => (
					iconMedia != null && {
						$icon: iconMedia,
					}
				))(mediaFromUrl(redditSubredditIconUrl(subredditAbout.icon_img, subredditAbout.community_icon), MediaType.Image)),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.RedditLink,
			resolve: async (entityId, context) => {
				const { getInfo } = await import('$/sources/Reddit/Rest/queries.ts')
				const redditThing = (await singleFlight(getInfo)(sourcePublicEnv(context, Source.Reddit_Rest), entityId.fullname))
					.data
					.children[0]
				if (redditThing.kind !== 't3') throw new Error('Reddit_Rest: link not found')
				const sub = optionalNonemptyString(redditThing.data.subreddit)
				return {
					title: optionalNonemptyString(redditThing.data.title),
					selftext: optionalNonemptyString(redditThing.data.selftext),
					url: optionalNonemptyString(redditThing.data.url),
					author: optionalNonemptyString(redditThing.data.author),
					...(redditThing.data.score != null && { score: redditThing.data.score }),
					...(redditThing.data.num_comments != null && {
						commentCount: redditThing.data.num_comments,
					}),
					...(timestampMsFromUnixSeconds(redditThing.data.created_utc) != null && {
						createdAt: timestampMsFromUnixSeconds(redditThing.data.created_utc),
					}),
				$subreddit: (
					sub == null ?
						undefined
					:
						{
							[EntityMetaKey.Id]: { name: sub.toLowerCase() },
						}
				),
					permalink: optionalNonemptyString(redditThing.data.permalink),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.RedditComment,
			resolve: async (entityId, context) => {
				const { getInfo } = await import('$/sources/Reddit/Rest/queries.ts')
				const redditThing = (await singleFlight(getInfo)(sourcePublicEnv(context, Source.Reddit_Rest), entityId.fullname))
					.data
					.children[0]
				if (redditThing.kind !== 't1') throw new Error('Reddit_Rest: comment not found')
				const linkId = optionalNonemptyString(redditThing.data.link_id)
				const parentId = optionalNonemptyString(redditThing.data.parent_id)
				return {
					body: optionalNonemptyString(redditThing.data.body),
					author: optionalNonemptyString(redditThing.data.author),
					...(redditThing.data.score != null && { score: redditThing.data.score }),
					...(timestampMsFromUnixSeconds(redditThing.data.created_utc) != null && {
						createdAt: timestampMsFromUnixSeconds(redditThing.data.created_utc),
					}),
					...(redditThing.data.depth != null && { depth: redditThing.data.depth }),
				$link: (
					linkId == null ?
						undefined
					:
						{
							[EntityMetaKey.Id]: { fullname: linkId },
						}
				),
					...(parentId?.startsWith('t1_') === true && {
						$parentComment: { [EntityMetaKey.Id]: { fullname: parentId } },
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.RedditSubreddit_Timestamp,
			resolve: async (entityId, context) => {
				const { getSubredditAbout } = await import('$/sources/Reddit/Rest/queries.ts')
				const subredditAbout = (await singleFlight(getSubredditAbout)(sourcePublicEnv(context, Source.Reddit_Rest), entityId.$subreddit.name)).data
				return {
					...(subredditAbout.subscribers != null && { subscriberCount: subredditAbout.subscribers }),
					...(subredditAbout.active_user_count != null && {
						activeUserCount: subredditAbout.active_user_count,
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.RedditLink_Timestamp,
			resolve: async (entityId, context) => {
				const { getInfo } = await import('$/sources/Reddit/Rest/queries.ts')
				const redditThing = (await singleFlight(getInfo)(sourcePublicEnv(context, Source.Reddit_Rest), entityId.$link.fullname))
					.data
					.children[0]
				if (redditThing.kind !== 't3') throw new Error('Reddit_Rest: link not found')
				return {
					...(redditThing.data.score != null && { score: redditThing.data.score }),
					...(redditThing.data.num_comments != null && {
						commentCount: redditThing.data.num_comments,
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.RedditComment_Timestamp,
			resolve: async (entityId, context) => {
				const { getInfo } = await import('$/sources/Reddit/Rest/queries.ts')
				const redditThing = (await singleFlight(getInfo)(sourcePublicEnv(context, Source.Reddit_Rest), entityId.$comment.fullname))
					.data
					.children[0]
				if (redditThing.kind !== 't1') throw new Error('Reddit_Rest: comment not found')
				return {
					...(redditThing.data.score != null && { score: redditThing.data.score }),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.RedditNetwork,
			fieldName: '$$redditSubreddits',
			resolve: async (_entityId, context) => {
				const { listPopularLinks } = await import('$/sources/Reddit/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Reddit_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(listPopularLinks)(publicEnv, limit)).data.children ?? [])
						.flatMap((child) => {
							if (child.kind !== 't3') return []
							const name = optionalNonemptyString(child.data.subreddit)
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
				const { listPopularLinks } = await import('$/sources/Reddit/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Reddit_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(listPopularLinks)(publicEnv, limit)).data.children ?? [])
						.flatMap((child) => (
							child.kind !== 't3' || child.data.name == null ?
								[]
							:
								[
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
			fieldName: '$$timestamps',
			resolve: async (entityId, context) => {
				const { getSubredditAbout } = await import('$/sources/Reddit/Rest/queries.ts')
				const data = (await singleFlight(getSubredditAbout)(sourcePublicEnv(context, Source.Reddit_Rest), entityId.name)).data
				return [
					{
						[EntityMetaKey.Id]: {
							$subreddit: entityId,
							timestampMs: Date.now(),
						},
						...(data.subscribers != null && { subscriberCount: data.subscribers }),
						...(data.active_user_count != null && { activeUserCount: data.active_user_count }),
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.RedditSubreddit,
			fieldName: '$$links',
			resolve: async (entityId, context) => {
				const { listSubredditLinks } = await import('$/sources/Reddit/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Reddit_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(listSubredditLinks)(publicEnv, entityId.name, limit)).data.children ?? [])
						.flatMap((child) => (
							child.kind !== 't3' || child.data.name == null ?
								[]
							:
								[
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
			fieldName: '$$timestamps',
			resolve: async (entityId, context) => {
				const { getInfo } = await import('$/sources/Reddit/Rest/queries.ts')
				const redditThing = (await singleFlight(getInfo)(sourcePublicEnv(context, Source.Reddit_Rest), entityId.fullname))
					.data
					.children[0]
				if (redditThing.kind !== 't3') throw new Error('Reddit_Rest: link not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$link: entityId,
							timestampMs: Date.now(),
						},
						...(redditThing.data.score != null && { score: redditThing.data.score }),
					...(redditThing.data.num_comments != null && {
						commentCount: redditThing.data.num_comments,
					}),
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.RedditLink,
			fieldName: '$$comments',
			resolve: async (entityId, context) => {
				const { getLinkCommentsByArticleId } = await import('$/sources/Reddit/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Reddit_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				const articleId = redditLinkArticleIdFromFullname(entityId.fullname)
				return (
					((await singleFlight(getLinkCommentsByArticleId)(publicEnv, articleId, limit))[1]?.data.children ?? [])
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
			fieldName: '$$timestamps',
			resolve: async (entityId, context) => {
				const { getInfo } = await import('$/sources/Reddit/Rest/queries.ts')
				const redditThing = (await singleFlight(getInfo)(sourcePublicEnv(context, Source.Reddit_Rest), entityId.fullname))
					.data
					.children[0]
				if (redditThing.kind !== 't1') throw new Error('Reddit_Rest: comment not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$comment: entityId,
							timestampMs: Date.now(),
						},
						...(redditThing.data.score != null && { score: redditThing.data.score }),
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.RedditComment,
			fieldName: '$$replies',
			resolve: async (entityId, context) => {
				const { getInfo, getLinkCommentsByArticleId } = await import('$/sources/Reddit/Rest/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Reddit_Rest)
				const limit = resolverLoadSubsetRowLimit(context)
				const redditThing = (await singleFlight(getInfo)(publicEnv, entityId.fullname))
					.data
					.children[0]
				if (redditThing.kind !== 't1') {
					throw new Error('Reddit_Rest: comment not found for replies')
				}
				const linkId = optionalNonemptyString(redditThing.data.link_id)
				if (linkId == null) {
					throw new Error('Reddit_Rest: comment link_id missing')
				}
				const articleId = redditLinkArticleIdFromFullname(linkId)
				const byParent = redditDirectReplyRefsByParentFromCommentForest(
					((await singleFlight(getLinkCommentsByArticleId)(publicEnv, articleId, limit))[1]?.data.children ?? []),
				)
				return byParent.get(entityId.fullname) ?? []
			},
		}),
	],
}

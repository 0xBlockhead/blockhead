import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { timestampMsFromUnixSeconds } from '$/lib/time.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { MediaType } from '$/schema/Media.ts'
import type {
	RedditPublicApiListing,
	RedditPublicApiSubredditAbout,
	RedditPublicApiThing,
} from '$/sources/RedditPublic/Rest/types.ts'


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
		throw new Error('Reddit_PublicJson: link fullname must start with t3_')
	}
	const articleId = fullname.slice(3)
	if (!articleId) {
		throw new Error('Reddit_PublicJson: link article id missing')
	}
	return articleId
}

const redditRepliesListingFromThing = (
	replies: RedditPublicApiListing | '' | undefined,
): RedditPublicApiListing | undefined => (
	replies != null && replies !== '' ?
		replies
	:
		undefined
)

const redditDirectReplyRefsByParentFromCommentForest = (
	children: readonly RedditPublicApiThing[] | undefined,
): Map<string, { [EntityMetaKey.Id]: { fullname: string } }[]> => {
	const byParent = new Map<string, { [EntityMetaKey.Id]: { fullname: string } }[]>()

	const visit = (thing: RedditPublicApiThing) => {
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
	source: Source.Reddit_PublicJson,

	resolvers: [
		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType.RedditSubreddit,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getSubredditAbout } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const subredditAbout = (await singleFlight(getSubredditAbout)(entityId.name)).data
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
			}
			},
		})({
				fields: {
				title: (subreddit) => subreddit.title,
				publicDescription: (subreddit) => subreddit.publicDescription,
				subscriberCount: (subreddit) => subreddit.subscriberCount,
				activeUserCount: (subreddit) => subreddit.activeUserCount,
				createdAt: (subreddit) => subreddit.createdAt,
				over18: (subreddit) => subreddit.over18,
				$icon: (subreddit) => subreddit.$icon,
			},
			}),

		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType.RedditLink,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const redditThing = (await singleFlight(getInfo)(entityId.fullname))
					.data
					.children[0]
				if (redditThing.kind !== 't3') throw new Error('Reddit_PublicJson: link not found')
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
			}
			},
		})({
				fields: {
				title: (link) => link.title,
				selftext: (link) => link.selftext,
				url: (link) => link.url,
				author: (link) => link.author,
				score: (link) => link.score,
				commentCount: (link) => link.commentCount,
				createdAt: (link) => link.createdAt,
				$subreddit: (link) => link.$subreddit,
				permalink: (link) => link.permalink,
			},
			}),

		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType.RedditComment,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const redditThing = (await singleFlight(getInfo)(entityId.fullname))
					.data
					.children[0]
				if (redditThing.kind !== 't1') throw new Error('Reddit_PublicJson: comment not found')
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
			}
			},
		})({
				fields: {
				body: (comment) => comment.body,
				author: (comment) => comment.author,
				score: (comment) => comment.score,
				createdAt: (comment) => comment.createdAt,
				depth: (comment) => comment.depth,
				$link: (comment) => comment.$link,
				$parentComment: (comment) => comment.$parentComment,
			},
			}),

		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType.RedditSubreddit_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getSubredditAbout } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const subredditAbout = (await singleFlight(getSubredditAbout)(entityId.$subreddit.name)).data
				return {
					...(subredditAbout.subscribers != null && { subscriberCount: subredditAbout.subscribers }),
					...(subredditAbout.active_user_count != null && {
						activeUserCount: subredditAbout.active_user_count,
					}),
				}
			}
			},
		})({
				fields: {
				subscriberCount: (timestamp) => timestamp.subscriberCount,
				activeUserCount: (timestamp) => timestamp.activeUserCount,
			},
			}),

		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType.RedditLink_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const redditThing = (await singleFlight(getInfo)(entityId.$link.fullname))
					.data
					.children[0]
				if (redditThing.kind !== 't3') throw new Error('Reddit_PublicJson: link not found')
				return {
					...(redditThing.data.score != null && { score: redditThing.data.score }),
					...(redditThing.data.num_comments != null && {
						commentCount: redditThing.data.num_comments,
					}),
				}
			}
			},
		})({
				fields: {
				score: (timestamp) => timestamp.score,
				commentCount: (timestamp) => timestamp.commentCount,
			},
			}),

		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType.RedditComment_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const redditThing = (await singleFlight(getInfo)(entityId.$comment.fullname))
					.data
					.children[0]
				if (redditThing.kind !== 't1') throw new Error('Reddit_PublicJson: comment not found')
				return {
					...(redditThing.data.score != null && { score: redditThing.data.score }),
				}
			}
			},
		})({
				fields: {
				score: (timestamp) => timestamp.score,
			},
			}),

		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType.RedditNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (_entityId, context) => {
				const { listSubredditHot } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(listSubredditHot)('popular', limit)).data.children ?? [])
						.flatMap((child) => {
							if (child.kind !== 't3') return []
							const name = optionalNonemptyString(child.data.subreddit)
							if (name == null) return []
							return [{
								[EntityMetaKey.Id]: { name: name.toLowerCase() },
							}]
						})
				)
			}
			},
		})({
				fields: {
				$$redditSubreddits: (subreddits) => subreddits,
			},
			}),

		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType.RedditNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (_entityId, context) => {
				const { listSubredditHot } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(listSubredditHot)('popular', limit)).data.children ?? [])
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
			}
			},
		})({
				fields: {
				$$redditLinks: (links) => links,
			},
			}),

		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType.RedditSubreddit,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getSubredditAbout } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const data = (await singleFlight(getSubredditAbout)(entityId.name)).data
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
			}
			},
		})({
				fields: {
				$$timestamps: (timestamps) => timestamps,
			},
			}),

		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType.RedditSubreddit,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { listSubredditHot } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(listSubredditHot)(entityId.name, limit)).data.children ?? [])
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
			}
			},
		})({
				fields: {
				$$links: (links) => links,
			},
			}),

		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType.RedditLink,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const redditThing = (await singleFlight(getInfo)(entityId.fullname))
					.data
					.children[0]
				if (redditThing.kind !== 't3') throw new Error('Reddit_PublicJson: link not found')
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
			}
			},
		})({
				fields: {
				$$timestamps: (timestamps) => timestamps,
			},
			}),

		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType.RedditLink,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getCommentsByArticleId } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const articleId = redditLinkArticleIdFromFullname(entityId.fullname)
				return (
					((await singleFlight(getCommentsByArticleId)(articleId, limit))[1]?.data.children ?? [])
						.flatMap((child) => (
							child.kind === 't1' && child.data.name != null ?
								[{ [EntityMetaKey.Id]: { fullname: child.data.name } }]
							:
								[]
						))
				)
			}
			},
		})({
				fields: {
				$$comments: (comments) => comments,
			},
			}),

		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType.RedditLink,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const redditThing = (await singleFlight(getInfo)(entityId.fullname))
					.data
					.children[0]
				if (redditThing.kind !== 't3') throw new Error('Reddit_PublicJson: link not found')
				if (redditThing.data.num_comments == null || redditThing.data.num_comments < 0)
					throw new Error('Reddit_PublicJson: link comment count not found')
				return redditThing.data.num_comments
			}
			},
		})({
				fields: {
				$$comments: {
					resolveCount: (count) => count,
				},
			},
			}),

		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType.RedditComment,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const redditThing = (await singleFlight(getInfo)(entityId.fullname))
					.data
					.children[0]
				if (redditThing.kind !== 't1') throw new Error('Reddit_PublicJson: comment not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$comment: entityId,
							timestampMs: Date.now(),
						},
						...(redditThing.data.score != null && { score: redditThing.data.score }),
					},
				]
			}
			},
		})({
				fields: {
				$$timestamps: (timestamps) => timestamps,
			},
			}),

		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType.RedditComment,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getInfo, getCommentsByArticleId } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const redditThing = (await singleFlight(getInfo)(entityId.fullname))
					.data
					.children[0]
				if (redditThing.kind !== 't1') {
					throw new Error('Reddit_PublicJson: comment not found for replies')
				}
				const linkId = optionalNonemptyString(redditThing.data.link_id)
				if (linkId == null) {
					throw new Error('Reddit_PublicJson: comment link_id missing')
				}
				const articleId = redditLinkArticleIdFromFullname(linkId)
				const byParent = redditDirectReplyRefsByParentFromCommentForest(
					((await singleFlight(getCommentsByArticleId)(articleId, limit))[1]?.data.children ?? []),
				)
				return byParent.get(entityId.fullname) ?? []
			}
			},
		})({
				fields: {
				$$replies: (replies) => replies,
			},
			}),
	],
}

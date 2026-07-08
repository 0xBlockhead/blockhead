import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { timestampMsFromUnixSeconds } from '$/lib/time.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import { MediaType } from '$/schema/Media.ts'
import type {
	RedditApiListing,
	RedditApiSubredditAbout,
	RedditApiThing,
} from '$/sources/Reddit/Rest/types.ts'
import { RedditSubredditSelector } from '$/schema/RedditSubreddit.ts'
import { RedditLinkSelector } from '$/schema/RedditLink.ts'
import { RedditCommentSelector } from '$/schema/RedditComment.ts'
import { RedditSubreddit_TimestampSelector } from '$/schema/RedditSubreddit_Timestamp.ts'
import { RedditLink_TimestampSelector } from '$/schema/RedditLink_Timestamp.ts'
import { RedditComment_TimestampSelector } from '$/schema/RedditComment_Timestamp.ts'
import { _GlobalRedditNetworkSelector } from '$/schema/_GlobalRedditNetwork.ts'


const redditSubredditIconUrl = (
	iconImg: string | undefined,
	communityIcon: string | undefined
) => {
	const community = optionalNonemptyString(communityIcon?.replaceAll('&amp;', '&'))
	const icon = optionalNonemptyString(iconImg?.replaceAll('&amp;', '&'))
	return community ?? icon
}

const redditLinkArticleIdFromFullname = (fullname: string) => {
	if (!fullname.startsWith('t3_'))
		throw new Error('Reddit_Rest: link fullname must start with t3_')
	const articleId = fullname.slice(3)
	if (!articleId)
		throw new Error('Reddit_Rest: link article id missing')
	return articleId
}

const redditRepliesListingFromThing = (
	replies: RedditApiListing | '' | undefined
): RedditApiListing | undefined => (
	replies != null && replies !== '' ?
		replies
	:
		undefined
)

const redditDirectReplyRefsByParentFromCommentForest = (
	children: readonly RedditApiThing[] | undefined
): Map<string, { [EntityMetaKey.Selector]: { fullname: string } }[]> => {
	const byParent = new Map<string, { [EntityMetaKey.Selector]: { fullname: string } }[]>()

	const visit = (thing: RedditApiThing) => {
		if (thing.kind !== 't1' || thing.data.name == null) return
		const ref = { [EntityMetaKey.Selector]: { fullname: thing.data.name } }
		const redditReplyListing = redditRepliesListingFromThing(thing.data.replies)
		const directReplies = (redditReplyListing?.data.children ?? []).flatMap((child) => (
			child.kind === 't1' && child.data.name != null ?
				[{ [EntityMetaKey.Selector]: { fullname: child.data.name } }]
			:
				[]
		))
		if (directReplies.length > 0)
			byParent.set(ref[EntityMetaKey.Selector].fullname, directReplies)
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

	resolvers: [
		defineResolver(Source.Reddit_Rest, {
			entityType: EntityType.RedditSubreddit,
			resolve: {
				[RedditSubredditSelector.Name]: async ({ name }, context) => {
					const { getSubredditAbout } = await import('$/sources/Reddit/Rest/queries.ts')
					const subredditAbout = (await getSubredditAbout(context.publicEnv, name)).data
					const iconMedia = mediaFromUrl(redditSubredditIconUrl(subredditAbout.icon_img, subredditAbout.community_icon), MediaType.Image)
					return {
						title: optionalNonemptyString(subredditAbout.title),
						publicDescription: optionalNonemptyString(subredditAbout.public_description),
						...(timestampMsFromUnixSeconds(subredditAbout.created_utc) != null && {
							createdAt: timestampMsFromUnixSeconds(subredditAbout.created_utc),
						}),
						...(subredditAbout.over18 === true && { over18: true }),
						...(subredditAbout.over18 === false && { over18: false }),
						...(iconMedia != null && {
							$icon: iconMedia,
						}),
					}
				}
			},
		})({
				title: (subreddit) => subreddit.title,
				publicDescription: (subreddit) => subreddit.publicDescription,
				createdAt: (subreddit) => subreddit.createdAt,
				over18: (subreddit) => subreddit.over18,
				$icon: (subreddit) => subreddit.$icon,
			}),

		defineResolver(Source.Reddit_Rest, {
			entityType: EntityType.RedditLink,
			resolve: {
				[RedditLinkSelector.Fullname]: async ({ fullname }, context) => {
					const { getInfo } = await import('$/sources/Reddit/Rest/queries.ts')
					const redditThing = (await getInfo(context.publicEnv, fullname))
						.data
						.children[0]
					if (redditThing.kind !== 't3') throw new Error('Reddit_Rest: link not found')
					const sub = optionalNonemptyString(redditThing.data.subreddit)
					return {
						title: optionalNonemptyString(redditThing.data.title),
						selftext: optionalNonemptyString(redditThing.data.selftext),
						url: optionalNonemptyString(redditThing.data.url),
						author: optionalNonemptyString(redditThing.data.author),
						...(timestampMsFromUnixSeconds(redditThing.data.created_utc) != null && {
							createdAt: timestampMsFromUnixSeconds(redditThing.data.created_utc),
						}),
						$subreddit: (
							sub == null ?
								undefined
							:
								{
									[EntityMetaKey.Selector]: { name: sub.toLowerCase() },
								}
						),
						permalink: optionalNonemptyString(redditThing.data.permalink),
					}
				}
			},
		})({
				title: (link) => link.title,
				selftext: (link) => link.selftext,
				url: (link) => link.url,
				author: (link) => link.author,
				createdAt: (link) => link.createdAt,
				$subreddit: (link) => link.$subreddit,
				permalink: (link) => link.permalink,
			}),

		defineResolver(Source.Reddit_Rest, {
			entityType: EntityType.RedditComment,
			resolve: {
				[RedditCommentSelector.Fullname]: async ({ fullname }, context) => {
					const { getInfo } = await import('$/sources/Reddit/Rest/queries.ts')
					const redditThing = (await getInfo(context.publicEnv, fullname))
						.data
						.children[0]
					if (redditThing.kind !== 't1') throw new Error('Reddit_Rest: comment not found')
					const linkId = optionalNonemptyString(redditThing.data.link_id)
					const parentId = optionalNonemptyString(redditThing.data.parent_id)
					return {
						body: optionalNonemptyString(redditThing.data.body),
						author: optionalNonemptyString(redditThing.data.author),
						...(timestampMsFromUnixSeconds(redditThing.data.created_utc) != null && {
							createdAt: timestampMsFromUnixSeconds(redditThing.data.created_utc),
						}),
						...(redditThing.data.depth != null && { depth: redditThing.data.depth }),
						$link: (
							linkId == null ?
								undefined
							:
								{
									[EntityMetaKey.Selector]: { fullname: linkId },
								}
						),
						...(parentId?.startsWith('t1_') === true && {
							$parentComment: { [EntityMetaKey.Selector]: { fullname: parentId } },
						}),
					}
				}
			},
		})({
				body: (comment) => comment.body,
				author: (comment) => comment.author,
				createdAt: (comment) => comment.createdAt,
				depth: (comment) => comment.depth,
				$link: (comment) => comment.$link,
				$parentComment: (comment) => comment.$parentComment,
			}),

		defineResolver(Source.Reddit_Rest, {
			entityType: EntityType.RedditSubreddit_Timestamp,
			resolve: {
				[RedditSubreddit_TimestampSelector.SubredditTimestampMsSource]: async ({ $subreddit }, context) => {
					const { getSubredditAbout } = await import('$/sources/Reddit/Rest/queries.ts')
					const subredditAbout = (await getSubredditAbout(context.publicEnv, $subreddit.name)).data
					return {
						...(subredditAbout.subscribers != null && { subscriberCount: subredditAbout.subscribers }),
						...(subredditAbout.active_user_count != null && {
							activeUserCount: subredditAbout.active_user_count,
						}),
					}
				}
			},
		})({
				subscriberCount: (timestamp) => timestamp.subscriberCount,
				activeUserCount: (timestamp) => timestamp.activeUserCount,
			}),

		defineResolver(Source.Reddit_Rest, {
			entityType: EntityType.RedditLink_Timestamp,
			resolve: {
				[RedditLink_TimestampSelector.LinkTimestampMsSource]: async ({ $link }, context) => {
					const { getInfo } = await import('$/sources/Reddit/Rest/queries.ts')
					const redditThing = (await getInfo(context.publicEnv, $link.fullname))
						.data
						.children[0]
					if (redditThing.kind !== 't3') throw new Error('Reddit_Rest: link not found')
					return {
						...(redditThing.data.score != null && { score: redditThing.data.score }),
						...(redditThing.data.num_comments != null && {
							commentCount: redditThing.data.num_comments,
						}),
					}
				}
			},
		})({
				score: (timestamp) => timestamp.score,
				commentCount: (timestamp) => timestamp.commentCount,
			}),

		defineResolver(Source.Reddit_Rest, {
			entityType: EntityType.RedditComment_Timestamp,
			resolve: {
				[RedditComment_TimestampSelector.CommentTimestampMsSource]: async ({ $comment }, context) => {
					const { getInfo } = await import('$/sources/Reddit/Rest/queries.ts')
					const redditThing = (await getInfo(context.publicEnv, $comment.fullname))
						.data
						.children[0]
					if (redditThing.kind !== 't1') throw new Error('Reddit_Rest: comment not found')
					return {
						...(redditThing.data.score != null && { score: redditThing.data.score }),
					}
				}
			},
		})({
				score: (timestamp) => timestamp.score,
			}),
			defineResolver(Source.Reddit_Rest, {
				entityType: EntityType._GlobalRedditNetwork,
				resolve: {
					[_GlobalRedditNetworkSelector.Scope]: async (_entitySelector, context) => {
					const { listPopularLinks } = await import('$/sources/Reddit/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						((await listPopularLinks(publicEnv, limit)).data.children ?? [])
							.flatMap((child) => {
								if (child.kind !== 't3') return []
								const name = optionalNonemptyString(child.data.subreddit)
								if (name == null) return []
								return [{
									[EntityMetaKey.Selector]: { name: name.toLowerCase() },
								}]
							})
					)
				}
			},
			})({
					$$observedSubreddits: (network) => network,
				}),

			defineResolver(Source.Reddit_Rest, {
				entityType: EntityType._GlobalRedditNetwork,
				resolve: {
					[_GlobalRedditNetworkSelector.Scope]: async (_entitySelector, context) => {
					const { listPopularLinks } = await import('$/sources/Reddit/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						((await listPopularLinks(publicEnv, limit)).data.children ?? [])
							.flatMap((child) => (
								child.kind !== 't3' || child.data.name == null ?
									[]
								:
									[
										{
											[EntityMetaKey.Selector]: { fullname: child.data.name },
										},
									]
							))
					)
				}
			},
			})({
					$$observedLinks: (network) => network,
				}),

		defineResolver(Source.Reddit_Rest, {
			entityType: EntityType.RedditSubreddit,
			resolve: {
				[RedditSubredditSelector.Name]: async ({ name }, context) => {
					const { getSubredditAbout } = await import('$/sources/Reddit/Rest/queries.ts')
					const data = (await getSubredditAbout(context.publicEnv, name)).data
					return [
						{
							[EntityMetaKey.Selector]: {
								$subreddit: { name },
								timestampMs: Date.now(),
								source: Source.Reddit_Rest,
							},
							...(data.subscribers != null && { subscriberCount: data.subscribers }),
							...(data.active_user_count != null && { activeUserCount: data.active_user_count }),
						},
					]
				}
			},
		})({
				$$timestamps: (subreddit) => subreddit,
			}),

		defineResolver(Source.Reddit_Rest, {
			entityType: EntityType.RedditSubreddit,
			resolve: {
				[RedditSubredditSelector.Name]: async ({ name }, context) => {
					const { listSubredditLinks } = await import('$/sources/Reddit/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					return (
						((await listSubredditLinks(publicEnv, name, limit)).data.children ?? [])
							.flatMap((child) => (
								child.kind !== 't3' || child.data.name == null ?
									[]
								:
									[
										{
											[EntityMetaKey.Selector]: { fullname: child.data.name },
										},
									]
							))
					)
				}
			},
		})({
				$$links: (subreddit) => subreddit,
			}),

		defineResolver(Source.Reddit_Rest, {
			entityType: EntityType.RedditLink,
			resolve: {
				[RedditLinkSelector.Fullname]: async ({ fullname }, context) => {
					const { getInfo } = await import('$/sources/Reddit/Rest/queries.ts')
					const redditThing = (await getInfo(context.publicEnv, fullname))
						.data
						.children[0]
					if (redditThing.kind !== 't3') throw new Error('Reddit_Rest: link not found')
					return [
						{
							[EntityMetaKey.Selector]: {
								$link: { fullname },
								timestampMs: Date.now(),
								source: Source.Reddit_Rest,
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
				$$timestamps: (link) => link,
			}),

		defineResolver(Source.Reddit_Rest, {
			entityType: EntityType.RedditLink,
			resolve: {
				[RedditLinkSelector.Fullname]: async ({ fullname }, context) => {
					const { getLinkCommentsByArticleId } = await import('$/sources/Reddit/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					const articleId = redditLinkArticleIdFromFullname(fullname)
					return (
						((await getLinkCommentsByArticleId(publicEnv, articleId, limit))[1]?.data.children ?? [])
							.flatMap((child) => (
								child.kind === 't1' && child.data.name != null ?
									[{ [EntityMetaKey.Selector]: { fullname: child.data.name } }]
								:
									[]
							))
					)
				}
			},
		})({
				$$comments: (link) => link,
			}),

		defineResolver(Source.Reddit_Rest, {
			entityType: EntityType.RedditLink,
			resolve: {
				[RedditLinkSelector.Fullname]: async ({ fullname }, context) => {
					const { getInfo } = await import('$/sources/Reddit/Rest/queries.ts')
					const redditThing = (await getInfo(context.publicEnv, fullname))
						.data
						.children[0]
					if (redditThing.kind !== 't3') throw new Error('Reddit_Rest: link not found')
					if (redditThing.data.num_comments == null || redditThing.data.num_comments < 0)
						throw new Error('Reddit_Rest: link comment count not found')
					return redditThing.data.num_comments
				}
			},
		})({
				$$comments: {
					resolveCount: (count) => count,
				},
			}),

		defineResolver(Source.Reddit_Rest, {
			entityType: EntityType.RedditComment,
			resolve: {
				[RedditCommentSelector.Fullname]: async ({ fullname }, context) => {
					const { getInfo } = await import('$/sources/Reddit/Rest/queries.ts')
					const redditThing = (await getInfo(context.publicEnv, fullname))
						.data
						.children[0]
					if (redditThing.kind !== 't1') throw new Error('Reddit_Rest: comment not found')
					return [
						{
							[EntityMetaKey.Selector]: {
								$comment: { fullname },
								timestampMs: Date.now(),
								source: Source.Reddit_Rest,
							},
							...(redditThing.data.score != null && { score: redditThing.data.score }),
						},
					]
				}
			},
		})({
				$$timestamps: (comment) => comment,
			}),

		defineResolver(Source.Reddit_Rest, {
			entityType: EntityType.RedditComment,
			resolve: {
				[RedditCommentSelector.Fullname]: async ({ fullname }, context) => {
					const { getInfo, getLinkCommentsByArticleId } = await import('$/sources/Reddit/Rest/queries.ts')
					const publicEnv = context.publicEnv
					const limit = resolverContextRowLimit(context)
					const redditThing = (await getInfo(publicEnv, fullname))
						.data
						.children[0]
					if (redditThing.kind !== 't1')
						throw new Error('Reddit_Rest: comment not found for replies')
					const linkId = optionalNonemptyString(redditThing.data.link_id)
					if (linkId == null)
						throw new Error('Reddit_Rest: comment link_id missing')
					const articleId = redditLinkArticleIdFromFullname(linkId)
					const byParent = redditDirectReplyRefsByParentFromCommentForest(
						((await getLinkCommentsByArticleId(publicEnv, articleId, limit))[1]?.data.children ?? [])
					)
					return byParent.get(fullname) ?? []
				}
			},
		})({
				$$replies: (comment) => comment,
			}),
	],
}

import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	redditNetworkSeedComments,
	redditNetworkSeedLinks,
	redditNetworkSeedSubreddits,
} from '$/constants/Social/Reddit.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { timestampMsFromUnixSeconds } from '$/lib/time.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { MediaType } from '$/schema/Media.ts'
import type {
	RedditPublicApiListing,
	RedditPublicApiSubredditAbout,
	RedditPublicApiThing,
} from '$/sources/RedditPublic/Rest/types.ts'
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
		throw new Error('Reddit_PublicJson: link fullname must start with t3_')
	const articleId = fullname.slice(3)
	if (!articleId)
		throw new Error('Reddit_PublicJson: link article id missing')
	return articleId
}

const redditRepliesListingFromThing = (
	replies: RedditPublicApiListing | '' | undefined
): RedditPublicApiListing | undefined => (
	replies != null && replies !== '' ?
		replies
	:
		undefined
)

const redditDirectReplyRefsByParentFromCommentForest = (
	children: readonly RedditPublicApiThing[] | undefined
): Map<string, { [EntityMetaKey.Selector]: { fullname: string } }[]> => {
	const byParent = new Map<string, { [EntityMetaKey.Selector]: { fullname: string } }[]>()

	const visit = (thing: RedditPublicApiThing) => {
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
	source: Source.Reddit_PublicJson,

	resolvers: [
		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType.RedditSubreddit,
			resolve: {
				[RedditSubredditSelector.Name]: async ({ name }) => {
					if (redditNetworkSeedSubreddits.some((subreddit) => subreddit.name === name))
						return {
							title: `r/${name}`,
							publicDescription: undefined,
							createdAt: undefined,
							over18: undefined,
							$icon: undefined,
						}

					const { getSubredditAbout } = await import('$/sources/RedditPublic/Rest/queries.ts')
					const subredditAbout = (await getSubredditAbout(name)).data
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
			fields: {
				title: (subreddit) => subreddit.title,
				publicDescription: (subreddit) => subreddit.publicDescription,
				createdAt: (subreddit) => subreddit.createdAt,
				over18: (subreddit) => subreddit.over18,
				$icon: (subreddit) => subreddit.$icon,
			},
		}),

		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType.RedditLink,
			resolve: {
				[RedditLinkSelector.Fullname]: async ({ fullname }) => {
					const seedLink = redditNetworkSeedLinks.find((link) => link.fullname === fullname)
					if (seedLink != null)
						return {
							title: seedLink.title,
							selftext: undefined,
							url: undefined,
							author: seedLink.author,
							createdAt: seedLink.createdAt,
							$subreddit: {
								[EntityMetaKey.Selector]: { name: seedLink.subredditName },
							},
							permalink: seedLink.permalink,
						}

					const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
					const redditThing = (await getInfo(fullname))
						.data
						.children[0]
					if (redditThing.kind !== 't3') throw new Error('Reddit_PublicJson: link not found')
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
			fields: {
				title: (link) => link.title,
				selftext: (link) => link.selftext,
				url: (link) => link.url,
				author: (link) => link.author,
				createdAt: (link) => link.createdAt,
				$subreddit: (link) => link.$subreddit,
				permalink: (link) => link.permalink,
			},
		}),

		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType.RedditComment,
			resolve: {
				[RedditCommentSelector.Fullname]: async ({ fullname }) => {
					const seedComment = redditNetworkSeedComments.find((comment) => comment.fullname === fullname)
					if (seedComment != null)
						return {
							body: seedComment.body,
							author: seedComment.author,
							createdAt: seedComment.createdAt,
							depth: undefined,
							$link: {
								[EntityMetaKey.Selector]: {
									fullname: seedComment.linkFullname,
								},
							},
							$parentComment: undefined,
						}

					const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
					const redditThing = (await getInfo(fullname))
						.data
						.children[0]
					if (redditThing.kind !== 't1') throw new Error('Reddit_PublicJson: comment not found')
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
			fields: {
				body: (comment) => comment.body,
				author: (comment) => comment.author,
				createdAt: (comment) => comment.createdAt,
				depth: (comment) => comment.depth,
				$link: (comment) => comment.$link,
				$parentComment: (comment) => comment.$parentComment,
			},
		}),

		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType.RedditSubreddit_Timestamp,
			resolve: {
				[RedditSubreddit_TimestampSelector.SubredditTimestampMsSource]: async ({ $subreddit }) => {
					const { getSubredditAbout } = await import('$/sources/RedditPublic/Rest/queries.ts')
					const subredditAbout = (await getSubredditAbout($subreddit.name)).data
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
				[RedditLink_TimestampSelector.LinkTimestampMsSource]: async ({ $link }) => {
					const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
					const redditThing = (await getInfo($link.fullname))
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
				[RedditComment_TimestampSelector.CommentTimestampMsSource]: async ({ $comment }) => {
					if (redditNetworkSeedComments.some((comment) => comment.fullname === $comment.fullname))
						return {
							score: undefined,
						}

					const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
					const redditThing = (await getInfo($comment.fullname))
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
			entityType: EntityType._GlobalRedditNetwork,
			resolve: {
				[_GlobalRedditNetworkSelector.Scope]: async (_entitySelector, context) => {
					const { listSubredditHot } = await import('$/sources/RedditPublic/Rest/queries.ts')
					const limit = resolverContextRowLimit(context)
					return (
						((await listSubredditHot('popular', limit)).data.children ?? [])
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
			fields: {
				$$sourceWindowSubreddits: (subreddits) => subreddits,
			},
		}),

		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType._GlobalRedditNetwork,
			resolve: {
				[_GlobalRedditNetworkSelector.Scope]: async (_entitySelector, context) => {
					const { listSubredditHot } = await import('$/sources/RedditPublic/Rest/queries.ts')
					const limit = resolverContextRowLimit(context)
					return (
						((await listSubredditHot('popular', limit)).data.children ?? [])
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
			fields: {
				$$sourceWindowLinks: (links) => links,
			},
		}),

		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType.RedditSubreddit,
			resolve: {
				[RedditSubredditSelector.Name]: async ({ name }) => {
					const { getSubredditAbout } = await import('$/sources/RedditPublic/Rest/queries.ts')
					const data = (await getSubredditAbout(name)).data
					return [
						{
							[EntityMetaKey.Selector]: {
								$subreddit: { name },
								timestampMs: Date.now(),
								source: Source.Reddit_PublicJson,
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
				[RedditSubredditSelector.Name]: async ({ name }, context) => {
					const { listSubredditHot } = await import('$/sources/RedditPublic/Rest/queries.ts')
					const limit = resolverContextRowLimit(context)
					return (
						((await listSubredditHot(name, limit)).data.children ?? [])
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
			fields: {
				$$links: (links) => links,
			},
		}),

		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType.RedditLink,
			resolve: {
				[RedditLinkSelector.Fullname]: async ({ fullname }) => {
					const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
					const redditThing = (await getInfo(fullname))
						.data
						.children[0]
					if (redditThing.kind !== 't3') throw new Error('Reddit_PublicJson: link not found')
					return [
						{
							[EntityMetaKey.Selector]: {
								$link: { fullname },
								timestampMs: Date.now(),
								source: Source.Reddit_PublicJson,
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
				[RedditLinkSelector.Fullname]: async ({ fullname }, context) => {
					const { getCommentsByArticleId } = await import('$/sources/RedditPublic/Rest/queries.ts')
					const limit = resolverContextRowLimit(context)
					const articleId = redditLinkArticleIdFromFullname(fullname)
					return (
						((await getCommentsByArticleId(articleId, limit))[1]?.data.children ?? [])
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
			fields: {
				$$comments: (comments) => comments,
			},
		}),

		defineResolver(Source.Reddit_PublicJson, {
			entityType: EntityType.RedditLink,
			resolve: {
				[RedditLinkSelector.Fullname]: async ({ fullname }) => {
					const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
					const redditThing = (await getInfo(fullname))
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
				[RedditCommentSelector.Fullname]: async ({ fullname }) => {
					if (redditNetworkSeedComments.some((comment) => comment.fullname === fullname))
						return []

					const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
					const redditThing = (await getInfo(fullname))
						.data
						.children[0]
					if (redditThing.kind !== 't1') throw new Error('Reddit_PublicJson: comment not found')
					return [
						{
							[EntityMetaKey.Selector]: {
								$comment: { fullname },
								timestampMs: Date.now(),
								source: Source.Reddit_PublicJson,
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
				[RedditCommentSelector.Fullname]: async ({ fullname }, context) => {
					if (redditNetworkSeedComments.some((comment) => comment.fullname === fullname))
						return []

					const { getInfo, getCommentsByArticleId } = await import('$/sources/RedditPublic/Rest/queries.ts')
					const limit = resolverContextRowLimit(context)
					const redditThing = (await getInfo(fullname))
						.data
						.children[0]
					if (redditThing.kind !== 't1')
						throw new Error('Reddit_PublicJson: comment not found for replies')
					const linkId = optionalNonemptyString(redditThing.data.link_id)
					if (linkId == null)
						throw new Error('Reddit_PublicJson: comment link_id missing')
					const articleId = redditLinkArticleIdFromFullname(linkId)
					const byParent = redditDirectReplyRefsByParentFromCommentForest(
						((await getCommentsByArticleId(articleId, limit))[1]?.data.children ?? [])
					)
					return byParent.get(fullname) ?? []
				}
			},
		})({
			fields: {
				$$replies: (replies) => replies,
			},
		}),
	],
}

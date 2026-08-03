import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { timestampMsFromUnixSeconds } from '$/lib/time.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import { MediaType } from '$/schema/MediaType.ts'
import type {
	RedditApiListing,
	RedditApiSubredditAbout,
	RedditApiThing,
} from '$/sources/Reddit/Rest/types.ts'

const loadRedditQueries = () => import('$/sources/Reddit/Rest/queries.ts')


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
		defineResolver({
			entityType: EntityType.RedditSubreddit,
			resolve: {
				Name: {
					resolve: async ({ name }, context) => {
						const { getSubredditAbout } = await loadRedditQueries()
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
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$subreddit: { name },
									timestampMs: Date.now(),
									source: Source.Reddit_Rest,
								},
								[EntityMetaKey.Fields]: {
									...(subredditAbout.subscribers != null && {
										[entityFieldAddressKey(EntityType.RedditSubreddit_Timestamp, [], 'subscriberCount')]: subredditAbout.subscribers,
									}),
									...(subredditAbout.active_user_count != null && {
										[entityFieldAddressKey(EntityType.RedditSubreddit_Timestamp, [], 'activeUserCount')]: subredditAbout.active_user_count,
									}),
								},
							}],
						}
					},
				}
			},
		})({
				title: (subreddit) => subreddit.title,
				publicDescription: (subreddit) => subreddit.publicDescription,
				createdAt: (subreddit) => subreddit.createdAt,
				over18: (subreddit) => subreddit.over18,
				$icon: (subreddit) => subreddit.$icon,
				$$timestamps: (subreddit) => subreddit.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.RedditLink,
			resolve: {
				Fullname: {
					resolve: async ({ fullname }, context) => {
						const { getInfo } = await loadRedditQueries()
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
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$link: { fullname },
									timestampMs: Date.now(),
									source: Source.Reddit_Rest,
								},
								[EntityMetaKey.Fields]: {
									...(redditThing.data.score != null && {
										[entityFieldAddressKey(EntityType.RedditLink_Timestamp, [], 'score')]: redditThing.data.score,
									}),
									...(redditThing.data.num_comments != null && {
										[entityFieldAddressKey(EntityType.RedditLink_Timestamp, [], 'commentCount')]: redditThing.data.num_comments,
									}),
								},
							}],
							commentCount: redditThing.data.num_comments,
						}
					},
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
				$$timestamps: (link) => link.$$timestamps,
				$$comments: {
					resolveCount: (link) => {
						if (link.commentCount == null || link.commentCount < 0)
							throw new Error('Reddit_Rest: link comment count not found')
						return link.commentCount
					},
				},
			}),

		defineResolver({
			entityType: EntityType.RedditComment,
			resolve: {
				Fullname: {
					resolve: async ({ fullname }, context) => {
						const { getInfo } = await loadRedditQueries()
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
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$comment: { fullname },
									timestampMs: Date.now(),
									source: Source.Reddit_Rest,
								},
								[EntityMetaKey.Fields]: {
									...(redditThing.data.score != null && {
										[entityFieldAddressKey(EntityType.RedditComment_Timestamp, [], 'score')]: redditThing.data.score,
									}),
								},
							}],
						}
					},
				}
			},
		})({
				body: (comment) => comment.body,
				author: (comment) => comment.author,
				createdAt: (comment) => comment.createdAt,
				depth: (comment) => comment.depth,
				$link: (comment) => comment.$link,
				$parentComment: (comment) => comment.$parentComment,
				$$timestamps: (comment) => comment.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.RedditSubreddit_Timestamp,
			resolve: {
				SubredditTimestampMsSource: {
					resolve: async ({ $subreddit }, context) => {
						const { getSubredditAbout } = await loadRedditQueries()
						const subredditAbout = (await getSubredditAbout(context.publicEnv, $subreddit.name)).data
						return {
							...(subredditAbout.subscribers != null && { subscriberCount: subredditAbout.subscribers }),
							...(subredditAbout.active_user_count != null && {
								activeUserCount: subredditAbout.active_user_count,
							}),
						}
					},
				}
			},
		})({
				subscriberCount: (timestamp) => timestamp.subscriberCount,
				activeUserCount: (timestamp) => timestamp.activeUserCount,
			}),

		defineResolver({
			entityType: EntityType.RedditLink_Timestamp,
			resolve: {
				LinkTimestampMsSource: {
					resolve: async ({ $link }, context) => {
						const { getInfo } = await loadRedditQueries()
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
					},
				}
			},
		})({
				score: (timestamp) => timestamp.score,
				commentCount: (timestamp) => timestamp.commentCount,
			}),

		defineResolver({
			entityType: EntityType.RedditComment_Timestamp,
			resolve: {
				CommentTimestampMsSource: {
					resolve: async ({ $comment }, context) => {
						const { getInfo } = await loadRedditQueries()
						const redditThing = (await getInfo(context.publicEnv, $comment.fullname))
							.data
							.children[0]
						if (redditThing.kind !== 't1') throw new Error('Reddit_Rest: comment not found')
						return {
							...(redditThing.data.score != null && { score: redditThing.data.score }),
						}
					},
				}
			},
		})({
				score: (timestamp) => timestamp.score,
			}),
		defineResolver({
			entityType: EntityType._GlobalRedditNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { listSubredditLinks } = await loadRedditQueries()
						const children = (
							(await listSubredditLinks(
								context.publicEnv,
								'popular',
								resolverContextRowLimit(context),
								undefined,
								'hot'
							)).data.children
							?? []
						)
						return {
							subreddits: children.flatMap((child) => {
								if (child.kind !== 't3') return []
								const name = optionalNonemptyString(child.data.subreddit)
								return name == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: { name: name.toLowerCase() },
									}]
							}),
							links: children.flatMap((child) => (
								child.kind !== 't3' || child.data.name == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: { fullname: child.data.name },
									}]
							)),
						}
					},
				}
			},
		})({
				$$observedSubreddits: (network) => network.subreddits,
				$$observedLinks: (network) => network.links,
			}),

		defineResolver({
			entityType: EntityType.RedditSubreddit,
			resolve: {
				Name: {
					resolve: async ({ name }, context) => {
						const { listSubredditLinks } = await loadRedditQueries()
						return listSubredditLinks(
							context.publicEnv,
							name,
							resolverContextRowLimit(context),
							context.providerContinuationToken,
							'hot'
						)
					},
				}
			},
		})({
				$$links: {
					select: (page) => (
						(page.data.children ?? [])
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
					),
					continuation: (page) => (
						page.data.after == null || page.data.after === '' ?
							{
								operation: 'subreddit-links:hot',
								target: 'oauth-api',
								terminal: true,
							}
						:
							{
								operation: 'subreddit-links:hot',
								target: 'oauth-api',
								terminal: false,
								token: page.data.after,
							}
					),
				},
			}),

		defineResolver({
			entityType: EntityType.RedditLink,
			resolve: {
				Fullname: {
					resolve: async ({ fullname }, context) => {
						const { getLinkCommentsByArticleId } = await loadRedditQueries()
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
					},
				}
			},
		})({
				$$comments: (link) => link,
			}),

		defineResolver({
			entityType: EntityType.RedditComment,
			resolve: {
				Fullname: {
					resolve: async ({ fullname }, context) => {
						const { getInfo, getLinkCommentsByArticleId } = await loadRedditQueries()
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
					},
				}
			},
		})({
				$$replies: (comment) => comment,
			}),
	],
} satisfies RegisteredSourceResolverModule

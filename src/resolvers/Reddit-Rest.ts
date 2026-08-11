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

const canonicalRedditPermalink = (permalink: string | undefined) => {
	const value = optionalNonemptyString(permalink)
	if (value == null) return undefined

	const url = URL.parse(value, 'https://www.reddit.com')
	if (
		url == null
		|| url.origin !== 'https://www.reddit.com'
		|| (!url.pathname.startsWith('/r/') && !url.pathname.startsWith('/comments/'))
	) return undefined

	return `${url.origin}${url.pathname}`
}

const redditCommentCardReference = (
	thing: RedditApiThing
) => {
	if (
		thing.kind !== 't1'
		|| thing.data.name?.startsWith('t1_') !== true
		|| thing.data.name.length === 3
	)
		return undefined
	const linkId = optionalNonemptyString(thing.data.link_id)
	const parentId = optionalNonemptyString(thing.data.parent_id)
	return {
		[EntityMetaKey.Selector]: { fullname: thing.data.name },
		[EntityMetaKey.Fields]: {
			...(optionalNonemptyString(thing.data.body) != null && {
				[entityFieldAddressKey(EntityType.RedditComment, [], 'body')]: optionalNonemptyString(thing.data.body),
			}),
			...(optionalNonemptyString(thing.data.author) != null && {
				[entityFieldAddressKey(EntityType.RedditComment, [], 'author')]: optionalNonemptyString(thing.data.author),
			}),
			...(timestampMsFromUnixSeconds(thing.data.created_utc) != null && {
				[entityFieldAddressKey(EntityType.RedditComment, [], 'createdAt')]: timestampMsFromUnixSeconds(thing.data.created_utc),
			}),
			...(thing.data.depth != null && {
				[entityFieldAddressKey(EntityType.RedditComment, [], 'depth')]: thing.data.depth,
			}),
			...(linkId?.startsWith('t3_') === true && linkId.length > 3 && { [entityFieldAddressKey(EntityType.RedditComment, [], '$link')]: {
				[EntityMetaKey.Selector]: { fullname: linkId },
			} }),
			...(parentId?.startsWith('t1_') === true && parentId.length > 3 && { [entityFieldAddressKey(EntityType.RedditComment, [], '$parentComment')]: {
				[EntityMetaKey.Selector]: { fullname: parentId },
			} }),
		},
	}
}

const redditLinkCardReference = (
	thing: RedditApiThing
) => {
	if (
		thing.kind !== 't3'
		|| thing.data.name?.startsWith('t3_') !== true
		|| thing.data.name.length === 3
	)
		return undefined
	const subreddit = optionalNonemptyString(thing.data.subreddit?.trim())?.toLowerCase()
	return {
		[EntityMetaKey.Selector]: { fullname: thing.data.name },
		[EntityMetaKey.Fields]: {
			...Object.fromEntries([
				['title', optionalNonemptyString(thing.data.title)],
				['selftext', optionalNonemptyString(thing.data.selftext)],
				['url', optionalNonemptyString(thing.data.url)],
				['permalink', canonicalRedditPermalink(thing.data.permalink)],
				['author', optionalNonemptyString(thing.data.author)],
				['createdAt', timestampMsFromUnixSeconds(thing.data.created_utc)],
			].flatMap(([fieldName, value]) => value == null ? [] : [[
				entityFieldAddressKey(EntityType.RedditLink, [], fieldName),
				value,
			]])),
			...(subreddit != null && { [entityFieldAddressKey(EntityType.RedditLink, [], '$subreddit')]: {
				[EntityMetaKey.Selector]: { name: subreddit },
			} }),
		},
	}
}

const redditLinkCardReferences = (
	children: readonly RedditApiThing[] | undefined,
	limit: number
) => {
	if (limit === 0)
		return []

	const referenceByFullname = new Map<string, NonNullable<ReturnType<typeof redditLinkCardReference>>>()
	for (const child of children ?? []) {
		const reference = redditLinkCardReference(child)
		if (reference != null && !referenceByFullname.has(reference[EntityMetaKey.Selector].fullname))
			referenceByFullname.set(reference[EntityMetaKey.Selector].fullname, reference)
		if (referenceByFullname.size === limit)
			break
	}

	return [...referenceByFullname.values()]
}

const redditDirectReplyRefsByParentFromCommentForest = (
	children: readonly RedditApiThing[] | undefined
): Map<string, NonNullable<ReturnType<typeof redditCommentCardReference>>[]> => {
	const byParent = new Map<string, NonNullable<ReturnType<typeof redditCommentCardReference>>[]>()

	const visit = (thing: RedditApiThing) => {
		if (thing.kind !== 't1' || thing.data.name == null) return
		const ref = redditCommentCardReference(thing)
		if (ref == null) return
		const redditReplyListing = redditRepliesListingFromThing(thing.data.replies)
		const directReplies = (redditReplyListing?.data.children ?? []).flatMap((child) => {
			const reference = redditCommentCardReference(child)
			return reference == null ? [] : [reference]
		})
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
					resolve: async ({ name }) => {
						const { getSubredditAbout } = await import('$/sources/Reddit/Rest/queries.ts')
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
					resolve: async ({ fullname }) => {
						const { getInfo } = await import('$/sources/Reddit/Rest/queries.ts')
						const redditThing = (await getInfo(fullname))
							.data
							.children.find((child) => child.data.name === fullname)
						if (redditThing == null || redditThing.kind !== 't3')
							throw new Error('Reddit_Rest: link not found')
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
							permalink: canonicalRedditPermalink(redditThing.data.permalink),
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
					resolve: async ({ fullname }) => {
						const { getInfo } = await import('$/sources/Reddit/Rest/queries.ts')
						const redditThing = (await getInfo(fullname))
							.data
							.children.find((child) => child.data.name === fullname)
						if (redditThing == null || redditThing.kind !== 't1')
							throw new Error('Reddit_Rest: comment not found')
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
			entityType: EntityType._GlobalRedditNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { listSubredditLinks } = await import('$/sources/Reddit/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						const children = (
							(await listSubredditLinks(
								'popular',
								limit,
								undefined,
								'hot'
							)).data.children
							?? []
						)
						return {
							subreddits: [...new Map(
								children.flatMap((child) => {
									if (redditLinkCardReference(child) == null) return []
									const name = optionalNonemptyString(child.data.subreddit?.trim())?.toLowerCase()
									return name == null ? [] : [[name, {
										[EntityMetaKey.Selector]: { name },
									}] as const]
								})
							).values()],
							links: redditLinkCardReferences(children, limit),
						}
					},
				}
			},
		})({
				$$observedSubreddits: (network) => network.subreddits,
				$$observedLinks: (network) => network.links,
			}),

		defineResolver({
			entityType: EntityType._GlobalRedditNetwork,
			resolve: {
				Scope: {
					resolve: async ({ scope }, context) => {
						const { listSubredditLinks } = await import('$/sources/Reddit/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						const children = (
							(await listSubredditLinks(
								'popular',
								limit,
								undefined,
								'hot'
							)).data.children
							?? []
						)
						const subreddits = new Set(
							children.flatMap((child) => {
								if (redditLinkCardReference(child) == null) return []
								const name = optionalNonemptyString(child.data.subreddit?.trim())?.toLowerCase()
								return name == null ? [] : [name]
							})
						)
						const links = redditLinkCardReferences(children, limit)
						const timestampMs = Date.now()
						return {
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$hub: { scope },
									timestampMs,
									source: Source.Reddit_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType._GlobalRedditNetwork_Timestamp, [], 'source')]: Source.Reddit_Rest,
									[entityFieldAddressKey(EntityType._GlobalRedditNetwork_Timestamp, [], 'observedSubredditCount')]: subreddits.size,
									[entityFieldAddressKey(EntityType._GlobalRedditNetwork_Timestamp, [], 'observedLinkCount')]: links.length,
									[entityFieldAddressKey(EntityType._GlobalRedditNetwork_Timestamp, [], 'reachable')]: true,
									[entityFieldAddressKey(EntityType._GlobalRedditNetwork_Timestamp, [], 'listingWindowKind')]: 'popular:hot',
								},
							}],
						}
					},
				},
			},
		})({
				$$timestamps: {
					select: (hub) => hub.$$timestamps,
					resolveCount: (hub) => hub.$$timestamps.length,
				},
			}),
		defineResolver({
			entityType: EntityType.RedditSubreddit,
			resolve: {
				Name: {
					resolve: async ({ name }, context) => {
						const { listSubredditLinks } = await import('$/sources/Reddit/Rest/queries.ts')
						return listSubredditLinks(
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
					select: (page, _selector, context) => (
						redditLinkCardReferences(
							page.data.children,
							resolverContextRowLimit(context)
						)
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
						const { getLinkCommentsByArticleId } = await import('$/sources/Reddit/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						const articleId = redditLinkArticleIdFromFullname(fullname)
						return (
							((await getLinkCommentsByArticleId(articleId, limit))[1]?.data.children ?? [])
								.flatMap((child) => {
									const reference = (
										child.data.parent_id === fullname
										&& child.data.link_id === fullname
									) ?
										redditCommentCardReference(child)
									:
										undefined
									return reference == null ? [] : [reference]
								})
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
						const { getInfo, getLinkCommentsByArticleId } = await import('$/sources/Reddit/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						const redditThing = (await getInfo(fullname))
							.data
							.children.find((child) => child.data.name === fullname)
						if (redditThing == null || redditThing.kind !== 't1')
							throw new Error('Reddit_Rest: comment not found for replies')
						const linkId = optionalNonemptyString(redditThing.data.link_id)
						if (linkId == null)
							throw new Error('Reddit_Rest: comment link_id missing')
						const articleId = redditLinkArticleIdFromFullname(linkId)
						const byParent = redditDirectReplyRefsByParentFromCommentForest(
							((await getLinkCommentsByArticleId(articleId, limit))[1]?.data.children ?? [])
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

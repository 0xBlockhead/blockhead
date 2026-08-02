import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { timestampMsFromUnixSeconds } from '$/lib/time.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { MediaType } from '$/schema/MediaType.ts'
import type {
	RedditPublicApiListing,
	RedditPublicApiSubredditAbout,
	RedditPublicApiThing,
} from '$/sources/RedditPublic/Rest/types.ts'

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

const redditThingFromInfo = (
	info: { data: { children: RedditPublicApiThing[] } },
	fullname: string,
	kind: 't1' | 't3'
) => {
	if (!fullname.startsWith(`${kind}_`) || fullname.length === 3)
		throw new Error(`Reddit_PublicJson: invalid ${kind === 't3' ? 'link' : 'comment'} fullname`)

	const things = info.data.children.filter((thing) => thing.data.name === fullname)
	if (things.length > 1)
		throw new Error(`Reddit_PublicJson: ambiguous ${kind === 't3' ? 'link' : 'comment'} response`)
	const thing = things.at(0)
	if (thing == null)
		throw new Error(`Reddit_PublicJson: ${kind === 't3' ? 'link' : 'comment'} response does not match request`)
	if (thing.kind !== kind)
		throw new Error(`Reddit_PublicJson: ${kind === 't3' ? 'link' : 'comment'} not found`)
	return thing
}

const redditCommentCardReference = (
	thing: RedditPublicApiThing
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
	thing: RedditPublicApiThing
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
	children: readonly RedditPublicApiThing[] | undefined,
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

const redditRepliesListingFromThing = (
	replies: RedditPublicApiListing | '' | undefined
): RedditPublicApiListing | undefined => (
	replies != null && replies !== '' ?
		replies
	:
		undefined
)

const redditCommentRefsFromForest = (
	children: readonly RedditPublicApiThing[] | undefined,
	linkFullname: string
) => {
	const roots: NonNullable<ReturnType<typeof redditCommentCardReference>>[] = []
	const byParent = new Map<string, NonNullable<ReturnType<typeof redditCommentCardReference>>[]>()
	const visitedFullnames = new Set<string>()

	const visit = (thing: RedditPublicApiThing) => {
		if (
			thing.kind !== 't1'
			|| thing.data.name == null
			|| thing.data.link_id !== linkFullname
			|| visitedFullnames.has(thing.data.name)
		) return
		const ref = redditCommentCardReference(thing)
		if (ref == null) return
		visitedFullnames.add(thing.data.name)
		const redditReplyListing = redditRepliesListingFromThing(thing.data.replies)
		const directReplies = (redditReplyListing?.data.children ?? []).flatMap((child) => {
			const reference = child.data.parent_id === thing.data.name && child.data.link_id === linkFullname ?
				redditCommentCardReference(child)
			:
				undefined
			return reference == null ? [] : [reference]
		})
		if (directReplies.length > 0)
			byParent.set(ref[EntityMetaKey.Selector].fullname, directReplies)
		for (const child of redditReplyListing?.data.children ?? []) {
			visit(child)
		}
	}

	for (const child of children ?? []) {
		const reference = child.data.parent_id === linkFullname && child.data.link_id === linkFullname ?
			redditCommentCardReference(child)
		:
			undefined
		if (reference != null && !visitedFullnames.has(reference[EntityMetaKey.Selector].fullname))
			roots.push(reference)
		visit(child)
	}

	return {
		roots,
		byParent,
	}
}


export default {
	source: Source.Reddit_PublicJson,

	resolvers: [
		defineResolver({
			entityType: EntityType.RedditSubreddit,
			resolve: {
				Name: {
					resolve: async ({ name }) => {
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
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$subreddit: { name },
									timestampMs: Date.now(),
									source: Source.Reddit_PublicJson,
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
						const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
						const redditThing = redditThingFromInfo(await getInfo(fullname), fullname, 't3')
						const sub = optionalNonemptyString(redditThing.data.subreddit?.trim())?.toLowerCase()
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
									[EntityMetaKey.Selector]: { name: sub },
									}
							),
							permalink: canonicalRedditPermalink(redditThing.data.permalink),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$link: { fullname },
									timestampMs: Date.now(),
									source: Source.Reddit_PublicJson,
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
							throw new Error('Reddit_PublicJson: link comment count not found')
						return link.commentCount
					},
				},
			}),

		defineResolver({
			entityType: EntityType.RedditComment,
			resolve: {
				Fullname: {
					resolve: async ({ fullname }) => {
						const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
						const redditThing = redditThingFromInfo(await getInfo(fullname), fullname, 't1')
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
								linkId?.startsWith('t3_') !== true || linkId.length === 3 ?
									undefined
								:
									{
										[EntityMetaKey.Selector]: { fullname: linkId },
									}
							),
							...(parentId?.startsWith('t1_') === true && parentId.length > 3 && {
								$parentComment: { [EntityMetaKey.Selector]: { fullname: parentId } },
							}),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$comment: { fullname },
									timestampMs: Date.now(),
									source: Source.Reddit_PublicJson,
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
					resolve: async ({ $subreddit }) => {
						const { getSubredditAbout } = await import('$/sources/RedditPublic/Rest/queries.ts')
						const subredditAbout = (await getSubredditAbout($subreddit.name)).data
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
					resolve: async ({ $link }) => {
						const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
						const redditThing = redditThingFromInfo(await getInfo($link.fullname), $link.fullname, 't3')
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
					resolve: async ({ $comment }) => {
						const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
						const redditThing = redditThingFromInfo(await getInfo($comment.fullname), $comment.fullname, 't1')
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
						const { listSubredditLinks } = await import('$/sources/RedditPublic/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						const children = (await listSubredditLinks('popular', {
							limit,
							sort: 'hot',
						})).data.children ?? []
						return {
							subreddits: [...new Map(
								children
								.flatMap((child) => {
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
			entityType: EntityType.RedditSubreddit,
			resolve: {
				Name: {
					resolve: async ({ name }, context) => {
						const { listSubredditLinks } = await import('$/sources/RedditPublic/Rest/queries.ts')
						return listSubredditLinks(name, {
							after: context.providerContinuationToken,
							limit: resolverContextRowLimit(context),
							sort: 'hot',
						})
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
					continuation: (page, { name }) => (
						page.data.after == null || page.data.after === '' ?
							{
								operation: 'subreddit-links:hot',
								target: 'reddit-public-json',
							viewerScope: `subreddit:${name.trim().toLowerCase()}:hot`,
								terminal: true,
							}
						:
							{
								operation: 'subreddit-links:hot',
								target: 'reddit-public-json',
							viewerScope: `subreddit:${name.trim().toLowerCase()}:hot`,
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
						const limit = resolverContextRowLimit(context)
						if (limit === 0)
							return []

						const { getCommentsByArticleId } = await import('$/sources/RedditPublic/Rest/queries.ts')
						const articleId = redditLinkArticleIdFromFullname(fullname)
						return redditCommentRefsFromForest(
							(await getCommentsByArticleId(articleId, limit))[1]?.data.children,
							fullname
						).roots.slice(0, limit)
					},
				}
			},
		})({
				$$comments: (comments) => comments,
			}),

		defineResolver({
			entityType: EntityType.RedditComment,
			resolve: {
				Fullname: {
					resolve: async ({ fullname }, context) => {
						const limit = resolverContextRowLimit(context)
						if (limit === 0)
							return []

						const { getInfo, getCommentsByArticleId } = await import('$/sources/RedditPublic/Rest/queries.ts')
						const redditThing = redditThingFromInfo(await getInfo(fullname), fullname, 't1')
						const linkId = optionalNonemptyString(redditThing.data.link_id)
						if (linkId == null)
							throw new Error('Reddit_PublicJson: comment link_id missing')
						const articleId = redditLinkArticleIdFromFullname(linkId)
						const { byParent } = redditCommentRefsFromForest(
							((await getCommentsByArticleId(articleId, limit))[1]?.data.children ?? []),
							linkId
						)
						return (byParent.get(fullname) ?? []).slice(0, limit)
					},
				}
			},
		})({
				$$replies: (replies) => replies,
			}),
	],
} satisfies RegisteredSourceResolverModule

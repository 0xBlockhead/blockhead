import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { MediaType } from '$/schema/Media.ts'
import type {
	RedditPublicApiListing,
	RedditPublicApiSubredditAbout,
	RedditPublicApiThing,
} from '$/sources/RedditPublic/Rest/types.ts'


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

const redditSubredditTimestampFieldsFromData = (
	data: RedditPublicApiSubredditAbout['data'],
) => ({
	subscriberCount: optionalFiniteNumber(data.subscribers),
	activeUserCount: optionalFiniteNumber(data.active_user_count),
})

const redditLinkTimestampFieldsFromThing = (
	thing: RedditPublicApiThing,
) => ({
	score: optionalFiniteNumber(thing.data.score),
	commentCount: optionalFiniteNumber(thing.data.num_comments),
})

const redditCommentTimestampFieldsFromThing = (
	thing: RedditPublicApiThing,
) => ({
	score: optionalFiniteNumber(thing.data.score),
})

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
	source: Source.Reddit_PublicJson,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.RedditSubreddit,
			resolve: async (entityId) => {
				const { getSubredditAbout } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const d = (await singleFlight(getSubredditAbout)(entityId.name)).data
				if (d == null) throw new Error('Reddit_PublicJson: subreddit not found')
				return {
					title: optionalTrimmedString(d.title),
					publicDescription: optionalTrimmedString(d.public_description),
					...redditSubredditTimestampFieldsFromData(d),
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
			resolve: async (entityId) => {
				const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const t = (await singleFlight(getInfo)(entityId.fullname))
					.data
					.children[0]
				if (t == null || t.kind !== 't3') throw new Error('Reddit_PublicJson: link not found')
				const sub = optionalTrimmedString(t.data.subreddit)
				return {
					title: optionalTrimmedString(t.data.title),
					selftext: optionalTrimmedString(t.data.selftext),
					url: optionalTrimmedString(t.data.url),
					author: optionalTrimmedString(t.data.author),
					...redditLinkTimestampFieldsFromThing(t),
					...(redditCreatedAtMs(t.data.created_utc) != null && {
						createdAt: redditCreatedAtMs(t.data.created_utc),
					}),
					$subreddit: (
						sub == null ?
							undefined
						:
							{
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
				const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const t = (await singleFlight(getInfo)(entityId.fullname))
					.data
					.children[0]
				if (t == null || t.kind !== 't1') throw new Error('Reddit_PublicJson: comment not found')
				const linkId = optionalTrimmedString(t.data.link_id)
				const parentId = optionalTrimmedString(t.data.parent_id)
				return {
					body: optionalTrimmedString(t.data.body),
					author: optionalTrimmedString(t.data.author),
					...redditCommentTimestampFieldsFromThing(t),
					...(redditCreatedAtMs(t.data.created_utc) != null && {
						createdAt: redditCreatedAtMs(t.data.created_utc),
					}),
					...(optionalFiniteNumber(t.data.depth) != null && {
						depth: optionalFiniteNumber(t.data.depth),
					}),
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
			resolve: async (entityId) => {
				const { getSubredditAbout } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const data = (await singleFlight(getSubredditAbout)(entityId.$subreddit.name)).data
				if (data == null) throw new Error('Reddit_PublicJson: subreddit not found')
				return redditSubredditTimestampFieldsFromData(data)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.RedditLink_Timestamp,
			resolve: async (entityId) => {
				const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const thing = (await singleFlight(getInfo)(entityId.$link.fullname))
					.data
					.children[0]
				if (thing == null || thing.kind !== 't3') throw new Error('Reddit_PublicJson: link not found')
				return redditLinkTimestampFieldsFromThing(thing)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.RedditComment_Timestamp,
			resolve: async (entityId) => {
				const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const thing = (await singleFlight(getInfo)(entityId.$comment.fullname))
					.data
					.children[0]
				if (thing == null || thing.kind !== 't1') throw new Error('Reddit_PublicJson: comment not found')
				return redditCommentTimestampFieldsFromThing(thing)
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.RedditNetwork,
			fieldName: '$$redditSubreddits',
			resolve: async (_entityId, context) => {
				const { listSubredditHot } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					((await singleFlight(listSubredditHot)('popular', limit)).data.children ?? [])
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
				const { listSubredditHot } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.RedditSubreddit,
			fieldName: '$$timestamps',
			resolve: async (entityId) => {
				const { getSubredditAbout } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const data = (await singleFlight(getSubredditAbout)(entityId.name)).data
				if (data == null) throw new Error('Reddit_PublicJson: subreddit not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$subreddit: entityId,
							timestampMs: Date.now(),
						},
						...redditSubredditTimestampFieldsFromData(data),
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.RedditSubreddit,
			fieldName: '$$links',
			resolve: async (entityId, context) => {
				const { listSubredditHot } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.RedditLink,
			fieldName: '$$timestamps',
			resolve: async (entityId) => {
				const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const thing = (await singleFlight(getInfo)(entityId.fullname))
					.data
					.children[0]
				if (thing == null || thing.kind !== 't3') throw new Error('Reddit_PublicJson: link not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$link: entityId,
							timestampMs: Date.now(),
						},
						...redditLinkTimestampFieldsFromThing(thing),
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.RedditLink,
			fieldName: '$$comments',
			resolve: async (entityId, context) => {
				const { getCommentsByArticleId } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
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
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.RedditComment,
			fieldName: '$$timestamps',
			resolve: async (entityId) => {
				const { getInfo } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const thing = (await singleFlight(getInfo)(entityId.fullname))
					.data
					.children[0]
				if (thing == null || thing.kind !== 't1') throw new Error('Reddit_PublicJson: comment not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$comment: entityId,
							timestampMs: Date.now(),
						},
						...redditCommentTimestampFieldsFromThing(thing),
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.RedditComment,
			fieldName: '$$replies',
			resolve: async (entityId, context) => {
				const { getInfo, getCommentsByArticleId } = await import('$/sources/RedditPublic/Rest/queries.ts')
				const limit = resolverLoadSubsetRowLimit(context)
				const t = (await singleFlight(getInfo)(entityId.fullname))
					.data
					.children[0]
				if (t == null || t.kind !== 't1') {
					throw new Error('Reddit_PublicJson: comment not found for replies')
				}
				const linkId = optionalTrimmedString(t.data.link_id)
				if (linkId == null) {
					throw new Error('Reddit_PublicJson: comment link_id missing')
				}
				const articleId = redditLinkArticleIdFromFullname(linkId)
				const byParent = redditDirectReplyRefsByParentFromCommentForest(
					((await singleFlight(getCommentsByArticleId)(articleId, limit))[1]?.data.children ?? []),
				)
				return byParent.get(entityId.fullname) ?? []
			},
		}),
	],
}

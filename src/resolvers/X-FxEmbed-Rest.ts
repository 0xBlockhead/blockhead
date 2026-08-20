import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { type } from 'arktype'
import { optionalNonemptyString } from '$/lib/string.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type {
	FxEmbedTwitterStatus,
	FxEmbedUser,
} from '$/sources/FxEmbed/Rest/queries.ts'
const xUserFieldsFromFxEmbedUser = (
	user: FxEmbedUser,
	id: string
) => {
	const createdAt = Date.parse(user.joined)
	const websiteUrl = (
		((urlString) => (
			urlString == null ?
				undefined
			:
				(
					(parsed) => (
						parsed instanceof type.errors ?
							undefined
						:
							parsed
					)
				)(UrlString(urlString))
		))(optionalNonemptyString(user.website?.url))
	)
	const username = optionalNonemptyString(user.screen_name)
	const name = optionalNonemptyString(user.name)
	const description = optionalNonemptyString(user.description)
	const location = optionalNonemptyString(user.location)
	const iconMedia = mediaFromUrl(user.avatar_url ?? undefined, MediaType.Image)
	const bannerMedia = mediaFromUrl(user.banner_url ?? undefined, MediaType.Image)
	return {
		id,
		...(username != null && { username }),
		...(name != null && { name }),
		...(description != null && { description }),
		...(location != null && { location }),
		...(user.verification?.verified != null && {
			verified: user.verification.verified,
		}),
		...(Number.isFinite(createdAt) && { createdAt }),
		...(websiteUrl != null && { websiteUrl }),
		...(iconMedia != null && { $icon: iconMedia }),
		...(bannerMedia != null && { $profileBanner: bannerMedia }),
	}
}

const xUserReferenceFromFxEmbedUser = (
	user: FxEmbedUser,
	id: string
) => {
	const fields = Object.fromEntries(Object.entries(xUserFieldsFromFxEmbedUser(user, id)).flatMap(([field, value]) => (
		field === 'id' ?
			[]
		:
			[[entityFieldAddressKey(EntityType.XUser, [], field), value]]
	)))
	return {
		[EntityMetaKey.Selector]: { id },
		...(Object.keys(fields).length > 0 && {
			[EntityMetaKey.Fields]: {
				...fields,
			},
		}),
	}
}

const xPostMediaFromFxEmbedStatus = (
	status: FxEmbedTwitterStatus
) => (
	[
		...(status.media?.photos ?? []).flatMap((photo) => {
			const media = mediaFromUrl(photo.url, MediaType.Image)
			if (media == null) return []
			const hash = optionalNonemptyString(photo.id)
			return [{
				...media,
				[EntityMetaKey.Fields]: {
					...media[EntityMetaKey.Fields],
					...(hash != null && {
						[entityFieldAddressKey(EntityType.Media, [], 'hash')]: hash,
					}),
				},
			}]
		}),
		...(status.media?.videos ?? []).flatMap((video) => {
			const media = mediaFromUrl(
				video.transcode_url ?? video.url,
				MediaType.Video
			)
			if (media == null) return []
			const hash = optionalNonemptyString(video.id)
			return [{
				...media,
				[EntityMetaKey.Fields]: {
					...media[EntityMetaKey.Fields],
					...(hash != null && {
						[entityFieldAddressKey(EntityType.Media, [], 'hash')]: hash,
					}),
				},
			}]
		}),
	]
)

const xPostReferenceFromFxEmbedStatus = (
	status: FxEmbedTwitterStatus,
	id: string
) => {
	const text = optionalNonemptyString(status.text)
	const authorId = optionalNonemptyString(status.author.id)
	return {
		[EntityMetaKey.Selector]: { id },
		[EntityMetaKey.Fields]: {
			...(text != null && {
				[entityFieldAddressKey(EntityType.XPost, [], 'text')]: text,
			}),
			[entityFieldAddressKey(EntityType.XPost, [], 'createdAt')]:
				status.created_timestamp * 1_000,
			...(authorId != null && {
				[entityFieldAddressKey(EntityType.XPost, [], '$author')]:
					xUserReferenceFromFxEmbedUser(status.author, authorId),
			}),
		},
	}
}

const uniqueFxEmbedStatuses = (
	statuses: readonly FxEmbedTwitterStatus[]
) => (
	[...new Map(statuses.map((status) => [status.id, status])).values()]
)

const fxEmbedContinuation = (
	page: { cursor: { bottom: string | null } },
	viewerScope: string
) => (
	page.cursor.bottom == null || page.cursor.bottom === '' ?
		{
			operation: 'timeline',
			target: 'fxembed-api',
			viewerScope,
			terminal: true,
		}
	:
		{
			operation: 'timeline',
			target: 'fxembed-api',
			viewerScope,
			terminal: false,
			token: page.cursor.bottom,
		}
)

const fxEmbedSearchViewerScope = 'search:latest:lang:en -is:retweet'

const xUserSnapshotFromFxEmbedUser = (
	user: FxEmbedUser,
	id: string,
	username: string
) => {
	return {
		...xUserFieldsFromFxEmbedUser(user, id),
		username,
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$user: { id },
				timestampMs: Date.now(),
				source: Source.X_FxEmbed_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.XUser_Timestamp, [], 'followerCount')]:
					user.followers,
				[entityFieldAddressKey(EntityType.XUser_Timestamp, [], 'followingCount')]:
					user.following,
				[entityFieldAddressKey(EntityType.XUser_Timestamp, [], 'tweetCount')]:
					user.statuses,
			},
		}],
	}
}

export default {
	source: Source.X_FxEmbed_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.XUser,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
						const { getUser } = await import('$/sources/FxEmbed/Rest/queries.ts')
						const response = await getUser(id)
						const user = response.user
						if (user?.id == null) throw new Error('X_FxEmbed_Rest: user not found')
						const username = optionalNonemptyString(user.screen_name)
						if (user.id !== id) throw new Error('X_FxEmbed_Rest: user id mismatch')
						if (username == null) throw new Error('X_FxEmbed_Rest: user username not found')

						return xUserSnapshotFromFxEmbedUser(user, id, username)
					},
				},
				Username: {
					resolve: async ({ username }) => {
						const { getUser } = await import('$/sources/FxEmbed/Rest/queries.ts')
						const response = await getUser(username)
						const user = response.user
						if (user?.id == null) throw new Error('X_FxEmbed_Rest: user not found')
						const resolvedUsername = optionalNonemptyString(user.screen_name)
						if (resolvedUsername == null) throw new Error('X_FxEmbed_Rest: user username not found')
						return xUserSnapshotFromFxEmbedUser(user, user.id, resolvedUsername)
					},
				},
			},
		})({
			id: (snapshot) => snapshot.id,
			username: (snapshot) => snapshot.username,
			name: (snapshot) => snapshot.name,
			description: (snapshot) => snapshot.description,
			location: (snapshot) => snapshot.location,
			verified: (snapshot) => snapshot.verified,
			createdAt: (snapshot) => snapshot.createdAt,
			websiteUrl: (snapshot) => snapshot.websiteUrl,
			$icon: (snapshot) => snapshot.$icon,
			$profileBanner: (snapshot) => snapshot.$profileBanner,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.XPost,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
						const { getStatus } = await import('$/sources/FxEmbed/Rest/queries.ts')
						const response = await getStatus(id)
						const status = response.status
						if (status == null || status.type !== 'status')
							throw new Error('X_FxEmbed_Rest: post not found')
						if (status.id !== id) throw new Error('X_FxEmbed_Rest: post id mismatch')
						const replyToId = optionalNonemptyString(status.replying_to?.status)
						const quotedId = (
							status.quote?.type === 'status' ?
								optionalNonemptyString(status.quote.id)
							:
								undefined
						)
						const authorId = optionalNonemptyString(status.author.id)
						const text = optionalNonemptyString(status.text)
						const $$media = xPostMediaFromFxEmbedStatus(status)
						return {
							id,
							...(text != null && { text }),
							createdAt: status.created_timestamp * 1_000,
							...(replyToId != null && {
								$replyToPost: {
									[EntityMetaKey.Selector]: { id: replyToId },
								},
							}),
							...(quotedId != null && status.quote != null && {
								$quotedPost: xPostReferenceFromFxEmbedStatus(status.quote, quotedId),
							}),
							...(authorId != null && {
								$author: xUserReferenceFromFxEmbedUser(
									status.author,
									authorId
								),
							}),
							$$media,
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$post: { id },
									timestampMs: Date.now(),
									source: Source.X_FxEmbed_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.XPost_Timestamp, [], 'likeCount')]:
										status.likes,
									[entityFieldAddressKey(EntityType.XPost_Timestamp, [], 'retweetCount')]:
										status.reposts,
									[entityFieldAddressKey(EntityType.XPost_Timestamp, [], 'replyCount')]:
										status.replies,
									[entityFieldAddressKey(EntityType.XPost_Timestamp, [], 'quoteCount')]:
										status.quotes,
								},
							}],
						}
					},
				}
			},
		})({
			id: (snapshot) => snapshot.id,
			text: (snapshot) => snapshot.text,
			createdAt: (snapshot) => snapshot.createdAt,
			$replyToPost: (snapshot) => snapshot.$replyToPost,
			$quotedPost: (snapshot) => snapshot.$quotedPost,
			$author: (snapshot) => snapshot.$author,
			$$media: {
				select: (snapshot) => snapshot.$$media,
				resolveCount: (snapshot) => snapshot.$$media.length,
			},
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.XNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { searchStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
						return searchStatuses(
							resolverContextRowLimit(context),
							context.providerContinuationToken
						)
					},
				},
			},
		})({
			$$xUsers: {
				select: (page) => uniqueFxEmbedStatuses(page.results).flatMap((status) => {
					const authorId = optionalNonemptyString(status.author.id)
					if (authorId == null) return []
					return [xUserReferenceFromFxEmbedUser(status.author, authorId)]
				}),
				continuation: (page) => fxEmbedContinuation(page, fxEmbedSearchViewerScope),
			},
			$$xPosts: {
				select: (page) => uniqueFxEmbedStatuses(page.results)
					.map((status) => xPostReferenceFromFxEmbedStatus(status, status.id)),
				continuation: (page) => fxEmbedContinuation(page, fxEmbedSearchViewerScope),
			},
		}),

		defineResolver({
			entityType: EntityType.XUser,
			resolve: {
				Id: {
					resolve: async ({ id }, context) => {
						const { getUserStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return {
							page: await getUserStatuses(
								id,
								limit,
								context.providerContinuationToken
							),
							profileIdentity: { id },
							continuationScope: `id:${id}`,
						}
					},
				},
				Username: {
					resolve: async ({ username }, context) => {
						const { getUserStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return {
							page: await getUserStatuses(
								username,
								limit,
								context.providerContinuationToken
							),
							profileIdentity: { username: username.toLowerCase() },
							continuationScope: `username:${username.toLowerCase()}`,
						}
					},
				},
			},
		})({
			$$posts: {
				select: ({ page, profileIdentity }) => uniqueFxEmbedStatuses(page.results)
					.flatMap((status) => (
						(
							'id' in profileIdentity ?
								status.author.id === profileIdentity.id
							:
								status.author.screen_name.toLowerCase() === profileIdentity.username
						) ?
							[xPostReferenceFromFxEmbedStatus(status, status.id)]
						:
							[]
					)),
				continuation: ({ page, continuationScope }) => fxEmbedContinuation(page, continuationScope),
			},
		}),

		defineResolver({
			entityType: EntityType._GlobalXNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { searchStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
						return searchStatuses(
							resolverContextRowLimit(context),
							context.providerContinuationToken
						)
					},
				},
			},
		})({
			$$observedUsers: {
				select: (page) => uniqueFxEmbedStatuses(page.results).flatMap((status) => (
					optionalNonemptyString(status.author.screen_name) != null ?
						[xUserReferenceFromFxEmbedUser(status.author, status.author.id)]
					:
						[]
				)),
				continuation: (page) => fxEmbedContinuation(page, fxEmbedSearchViewerScope),
			},
			$$observedPosts: {
				select: (page) => uniqueFxEmbedStatuses(page.results)
					.map((status) => xPostReferenceFromFxEmbedStatus(status, status.id)),
				continuation: (page) => fxEmbedContinuation(page, fxEmbedSearchViewerScope),
			},
		}),
	],
} satisfies RegisteredSourceResolverModule

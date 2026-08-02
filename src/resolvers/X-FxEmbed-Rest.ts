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
} from '$/sources/FxEmbed/Rest/types.ts'

const xUserReferenceFromFxEmbedUser = (
	user: FxEmbedUser | undefined,
	id: string
) => {
	const username = optionalNonemptyString(user?.screen_name)
	const name = optionalNonemptyString(user?.name)
	return {
		[EntityMetaKey.Selector]: { id },
		...((username != null || name != null) && {
			[EntityMetaKey.Fields]: {
				...(username != null && {
					[entityFieldAddressKey(EntityType.XUser, [], 'username')]: username,
				}),
				...(name != null && {
					[entityFieldAddressKey(EntityType.XUser, [], 'name')]: name,
				}),
			},
		}),
	}
}

const xPostReferenceFromFxEmbedStatus = (
	status: FxEmbedTwitterStatus,
	id: string
) => {
	const text = optionalNonemptyString(status.text)
	const authorId = optionalNonemptyString(status.author?.id)
	return {
		[EntityMetaKey.Selector]: { id },
		...((text != null || status.created_timestamp != null || authorId != null) && {
			[EntityMetaKey.Fields]: {
				...(text != null && {
					[entityFieldAddressKey(EntityType.XPost, [], 'text')]: text,
				}),
				...(status.created_timestamp != null && {
					[entityFieldAddressKey(EntityType.XPost, [], 'createdAt')]:
						status.created_timestamp * 1_000,
				}),
				...(authorId != null && {
					[entityFieldAddressKey(EntityType.XPost, [], '$author')]:
						xUserReferenceFromFxEmbedUser(status.author, authorId),
				}),
			},
		}),
	}
}

const xUserSnapshotFromFxEmbedUser = (
	user: FxEmbedUser,
	id: string,
	username: string
) => {
	const createdAt = Date.parse(user.joined ?? '')
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
		))(optionalNonemptyString(user.url))
	)
	const name = optionalNonemptyString(user.name)
	const description = optionalNonemptyString(user.description)
	const location = optionalNonemptyString(user.location)
	const iconMedia = mediaFromUrl(user.avatar_url ?? undefined, MediaType.Image)
	return {
		id,
		username,
		...(name != null && { name }),
		...(description != null && { description }),
		...(location != null && { location }),
		...(user.verification?.verified != null && {
			verified: user.verification.verified,
		}),
		...(Number.isFinite(createdAt) && { createdAt }),
		...(websiteUrl != null && { websiteUrl }),
		...(iconMedia != null && { $icon: iconMedia }),
		$$timestamps: [{
			[EntityMetaKey.Selector]: {
				$user: { id },
				timestampMs: Date.now(),
				source: Source.X_FxEmbed_Rest,
			},
			[EntityMetaKey.Fields]: {
				...(user.followers != null && {
					[entityFieldAddressKey(EntityType.XUser_Timestamp, [], 'followerCount')]:
						user.followers,
				}),
				...(user.following != null && {
					[entityFieldAddressKey(EntityType.XUser_Timestamp, [], 'followingCount')]:
						user.following,
				}),
				...(user.statuses != null && {
					[entityFieldAddressKey(EntityType.XUser_Timestamp, [], 'tweetCount')]:
						user.statuses,
				}),
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
						if (status?.type !== 'status' || status.id == null)
							throw new Error('X_FxEmbed_Rest: post not found')
						if (status.id !== id) throw new Error('X_FxEmbed_Rest: post id mismatch')
						const createdAt = (
							status.created_timestamp != null ?
								status.created_timestamp * 1000
							:
								Date.parse(status.created_at ?? '')
						)
						const replyToId = optionalNonemptyString(status.replying_to?.status)
						const quotedId = (
							status.quote?.type === 'status' ?
								optionalNonemptyString(status.quote.id)
							:
								undefined
						)
						const authorId = optionalNonemptyString(status.author?.id)
						const text = optionalNonemptyString(status.text)
						return {
							id,
							...(text != null && { text }),
							...(Number.isFinite(createdAt) && { createdAt }),
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
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$post: { id },
									timestampMs: Date.now(),
									source: Source.X_FxEmbed_Rest,
								},
								[EntityMetaKey.Fields]: {
									...(status.likes != null && {
										[entityFieldAddressKey(EntityType.XPost_Timestamp, [], 'likeCount')]:
											status.likes,
									}),
									...(status.reposts != null && {
										[entityFieldAddressKey(EntityType.XPost_Timestamp, [], 'retweetCount')]:
											status.reposts,
									}),
									...(status.replies != null && {
										[entityFieldAddressKey(EntityType.XPost_Timestamp, [], 'replyCount')]:
											status.replies,
									}),
									...(status.quotes != null && {
										[entityFieldAddressKey(EntityType.XPost_Timestamp, [], 'quoteCount')]:
											status.quotes,
									}),
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
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.XNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { searchStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
						return (await searchStatuses(resolverContextRowLimit(context))).results ?? []
					},
				},
			},
		})({
			$$xUsers: (statuses) => (
				statuses.flatMap((status) => {
					if (status.type !== 'status' || status.author == null) return []
					const authorId = optionalNonemptyString(status.author.id)
					if (authorId == null) return []
					return [xUserReferenceFromFxEmbedUser(status.author, authorId)]
				})
			),
			$$xPosts: (statuses) => (
				statuses.flatMap((status) => (
					status.type === 'status' && status.id != null ?
						[xPostReferenceFromFxEmbedStatus(status, status.id)]
					:
						[]
				))
			),
		}),

		defineResolver({
			entityType: EntityType.XUser,
			resolve: {
				Id: {
					resolve: async ({ id }, context) => {
						const { getUserStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return ((await getUserStatuses(id, limit)).results ?? [])
							.flatMap((status) => (
								status.type === 'status'
								&& status.id != null
								&& status.author?.id === id ?
									[xPostReferenceFromFxEmbedStatus(status, status.id)]
								:
									[]
							))
					},
				},
				Username: {
					resolve: async ({ username }, context) => {
						const { getUserStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return ((await getUserStatuses(username, limit)).results ?? [])
							.flatMap((status) => (
								status.type === 'status'
								&& status.id != null
								&& status.author?.id != null
								&& status.author.screen_name?.toLowerCase() === username.toLowerCase() ?
									[xPostReferenceFromFxEmbedStatus(status, status.id)]
								:
									[]
							))
					},
				},
			},
		})({
			$$posts: (snapshot) => snapshot,
		}),

		defineResolver({
			entityType: EntityType._GlobalXNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const { searchStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
						return (
							await searchStatuses(
								resolverContextRowLimit(context)
							)
						).results ?? []
					},
				},
			},
		})({
			$$observedUsers: (statuses) => (
				statuses.flatMap((status) => (
					status.type === 'status'
					&& status.author?.id != null
					&& optionalNonemptyString(status.author.screen_name) != null ?
						[xUserReferenceFromFxEmbedUser(status.author, status.author.id)]
					:
						[]
				))
			),
			$$observedPosts: (statuses) => (
				statuses.flatMap((status) => (
					status.type === 'status' && status.id != null ?
						[xPostReferenceFromFxEmbedStatus(status, status.id)]
					:
						[]
				))
			),
		}),
	],
} satisfies RegisteredSourceResolverModule

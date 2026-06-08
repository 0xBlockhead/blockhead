import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { type } from 'arktype'
import { optionalNonemptyString } from '$/lib/string.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { MediaType } from '$/schema/Media.ts'
import { UrlString } from '$/schema/$Url.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	source: Source.X_FxEmbed_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.XUser,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getUser } = await import('$/sources/FxEmbed/Rest/queries.ts')
				const response = await singleFlight(getUser)('id' in entityId ? entityId.id : entityId.username)
				const user = response.user
				if (user?.id == null) throw new Error('X_FxEmbed_Rest: user not found')
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
				const username = optionalNonemptyString(user.screen_name)
				const name = optionalNonemptyString(user.name)
				const description = optionalNonemptyString(user.description)
				const location = optionalNonemptyString(user.location)
				return {
					id: user.id,
					...(username != null && { username }),
					...(name != null && { name }),
					...(description != null && { description }),
					...(location != null && { location }),
					...(user.verification?.verified != null && {
						verified: user.verification.verified,
					}),
					...(Number.isFinite(createdAt) && { createdAt }),
					...(websiteUrl != null && { websiteUrl }),
					...(user.followers != null && { followerCount: user.followers }),
					...(user.following != null && { followingCount: user.following }),
					...(user.statuses != null && { tweetCount: user.statuses }),
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(user.avatar_url ?? undefined, MediaType.Image)),
				}
			},
				['id']: async (entityId) => {
				const { getUser } = await import('$/sources/FxEmbed/Rest/queries.ts')
				const response = await singleFlight(getUser)('id' in entityId ? entityId.id : entityId.username)
				const user = response.user
				if (user?.id == null) throw new Error('X_FxEmbed_Rest: user not found')
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
				const username = optionalNonemptyString(user.screen_name)
				const name = optionalNonemptyString(user.name)
				const description = optionalNonemptyString(user.description)
				const location = optionalNonemptyString(user.location)
				return {
					id: user.id,
					...(username != null && { username }),
					...(name != null && { name }),
					...(description != null && { description }),
					...(location != null && { location }),
					...(user.verification?.verified != null && {
						verified: user.verification.verified,
					}),
					...(Number.isFinite(createdAt) && { createdAt }),
					...(websiteUrl != null && { websiteUrl }),
					...(user.followers != null && { followerCount: user.followers }),
					...(user.following != null && { followingCount: user.following }),
					...(user.statuses != null && { tweetCount: user.statuses }),
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(user.avatar_url ?? undefined, MediaType.Image)),
				}
			}
			},
			fields: {
			id: (snapshot) => snapshot.id,
			username: (snapshot) => snapshot.username,
			name: (snapshot) => snapshot.name,
			description: (snapshot) => snapshot.description,
			location: (snapshot) => snapshot.location,
			verified: (snapshot) => snapshot.verified,
			createdAt: (snapshot) => snapshot.createdAt,
			websiteUrl: (snapshot) => snapshot.websiteUrl,
			followerCount: (snapshot) => snapshot.followerCount,
			followingCount: (snapshot) => snapshot.followingCount,
			tweetCount: (snapshot) => snapshot.tweetCount,
			$icon: (snapshot) => snapshot.$icon,
		}
		}),

		defineResolver({
			entityType: EntityType.XPost,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getStatus } = await import('$/sources/FxEmbed/Rest/queries.ts')
				const response = await singleFlight(getStatus)(entityId.id)
				const status = response.status
				if (status?.type !== 'status' || status.id == null) {
					throw new Error('X_FxEmbed_Rest: post not found')
				}
				const createdAt = (
					status.created_timestamp != null ?
						status.created_timestamp * 1000
					:
						Date.parse(status.created_at ?? '')
				)
				const replyToId = optionalNonemptyString(status.replying_to?.status)
				const quotedId = optionalNonemptyString(status.quote?.id)
				const postId = optionalNonemptyString(status.id)
				const text = optionalNonemptyString(status.text)
				return {
					...(text != null && { text }),
					...(Number.isFinite(createdAt) && { createdAt }),
					...(postId != null && {
						postUrl: `https://x.com/i/web/status/${postId}`,
					}),
					...(status.likes != null && { likeCount: status.likes }),
					...(status.reposts != null && { retweetCount: status.reposts }),
					...(status.replies != null && { replyCount: status.replies }),
					...(status.quotes != null && { quoteCount: status.quotes }),
					...(replyToId != null && {
						$replyToPost: {
							[EntityMetaKey.Id]: { id: replyToId },
						},
					}),
					...(quotedId != null && {
						$quotedPost: {
							[EntityMetaKey.Id]: { id: quotedId },
						},
					}),
					$author: (
						status.author?.id == null ?
							undefined
						:
							{
								[EntityMetaKey.Id]: { id: status.author.id },
							}
					),
				}
			}
			},
			fields: {
			text: (snapshot) => snapshot.text,
			createdAt: (snapshot) => snapshot.createdAt,
			postUrl: (snapshot) => snapshot.postUrl,
			likeCount: (snapshot) => snapshot.likeCount,
			retweetCount: (snapshot) => snapshot.retweetCount,
			replyCount: (snapshot) => snapshot.replyCount,
			quoteCount: (snapshot) => snapshot.quoteCount,
			$replyToPost: (snapshot) => snapshot.$replyToPost,
			$quotedPost: (snapshot) => snapshot.$quotedPost,
			$author: (snapshot) => snapshot.$author,
		}
		}),

		defineResolver({
			entityType: EntityType.XUser_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getUser } = await import('$/sources/FxEmbed/Rest/queries.ts')
				if (!('id' in entityId.$user))
					throw new Error('X_FxEmbed_Rest: XUser_Timestamp username lookup is unsupported')

				const user = (await singleFlight(getUser)(entityId.$user.id)).user
				if (user?.id == null) throw new Error('X_FxEmbed_Rest: user not found')
				return {
					followerCount: user.followers,
					followingCount: user.following,
					tweetCount: user.statuses,
				}
			}
			},
			fields: {
			followerCount: (snapshot) => snapshot.followerCount,
			followingCount: (snapshot) => snapshot.followingCount,
			tweetCount: (snapshot) => snapshot.tweetCount,
		}
		}),

		defineResolver({
			entityType: EntityType.XPost_Timestamp,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getStatus } = await import('$/sources/FxEmbed/Rest/queries.ts')
				const status = (await singleFlight(getStatus)(entityId.$post.id)).status
				if (status?.type !== 'status' || status.id == null) {
					throw new Error('X_FxEmbed_Rest: post not found')
				}
				return {
					likeCount: status.likes,
					retweetCount: status.reposts,
					replyCount: status.replies,
					quoteCount: status.quotes,
				}
			}
			},
			fields: {
			likeCount: (snapshot) => snapshot.likeCount,
			retweetCount: (snapshot) => snapshot.retweetCount,
			replyCount: (snapshot) => snapshot.replyCount,
			quoteCount: (snapshot) => snapshot.quoteCount,
		}
		}),

		defineResolver({
			entityType: EntityType.XNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (_entityId, context) => {
				const { searchStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				const statusSearchResponse = await singleFlight(searchStatuses)(limit)
				return (
					(statusSearchResponse.results ?? [])
						.flatMap((status) => {
							const authorId = optionalNonemptyString(status.author?.id)
							if (authorId == null) return []
							return [{
								[EntityMetaKey.Id]: { id: authorId },
							}]
						})
				)
			}
			},
			fields: {
			$$xUsers: (snapshot) => snapshot,
		}
		}),

		defineResolver({
			entityType: EntityType.XNetwork,
			resolve: {
				[EntityIdProjection.Identity]: async (_entityId, context) => {
				const { searchStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(searchStatuses)(limit)).results ?? [])
						.flatMap((wirePost) => (
							wirePost.type === 'status' && wirePost.id != null ?
								[{
									[EntityMetaKey.Id]: { id: wirePost.id },
								}]
							:
								[]
						))
				)
			}
			},
			fields: {
			$$xPosts: (snapshot) => snapshot,
		}
		}),

		defineResolver({
			entityType: EntityType.XPost,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getStatus } = await import('$/sources/FxEmbed/Rest/queries.ts')
				const status = (await singleFlight(getStatus)(entityId.id)).status
				if (status?.type !== 'status' || status.id == null) {
					throw new Error('X_FxEmbed_Rest: post not found')
				}
				return [
					{
						[EntityMetaKey.Id]: {
							$post: entityId,
							timestampMs: Date.now(),
						},
						likeCount: status.likes,
						retweetCount: status.reposts,
						replyCount: status.replies,
						quoteCount: status.quotes,
					},
				]
			}
			},
			fields: {
			$$timestamps: (snapshot) => snapshot,
		}
		}),

		defineResolver({
			entityType: EntityType.XUser,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const { getUser } = await import('$/sources/FxEmbed/Rest/queries.ts')
				const user = (await singleFlight(getUser)('id' in entityId ? entityId.id : entityId.username)).user
				if (user?.id == null) throw new Error('X_FxEmbed_Rest: user not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$user: {
								id: user.id,
							},
							timestampMs: Date.now(),
						},
						followerCount: user.followers,
						followingCount: user.following,
						tweetCount: user.statuses,
					},
				]
			},
				['id']: async (entityId) => {
				const { getUser } = await import('$/sources/FxEmbed/Rest/queries.ts')
				const user = (await singleFlight(getUser)('id' in entityId ? entityId.id : entityId.username)).user
				if (user?.id == null) throw new Error('X_FxEmbed_Rest: user not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$user: {
								id: user.id,
							},
							timestampMs: Date.now(),
						},
						followerCount: user.followers,
						followingCount: user.following,
						tweetCount: user.statuses,
					},
				]
			}
			},
			fields: {
			$$timestamps: (snapshot) => snapshot,
		}
		}),

		defineResolver({
			entityType: EntityType.XUser,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { getUserStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(getUserStatuses)('id' in entityId ? entityId.id : entityId.username, limit)).results ?? [])
						.flatMap((wirePost) => (
							wirePost.type === 'status' && wirePost.id != null ?
								[{
									[EntityMetaKey.Id]: { id: wirePost.id },
								}]
							:
								[]
						))
				)
			},
				['id']: async (entityId, context) => {
				const { getUserStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
				const limit = resolverContextRowLimit(context)
				return (
					((await singleFlight(getUserStatuses)('id' in entityId ? entityId.id : entityId.username, limit)).results ?? [])
						.flatMap((wirePost) => (
							wirePost.type === 'status' && wirePost.id != null ?
								[{
									[EntityMetaKey.Id]: { id: wirePost.id },
								}]
							:
								[]
						))
				)
			}
			},
			fields: {
			$$posts: (snapshot) => snapshot,
		}
		}),
	],
}

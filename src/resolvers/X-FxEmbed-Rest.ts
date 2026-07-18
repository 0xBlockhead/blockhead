import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { type } from 'arktype'
import { optionalNonemptyString } from '$/lib/string.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { MediaType } from '$/schema/Media.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { XUserSelector } from '$/schema/XUser.ts'
import { XPostSelector } from '$/schema/XPost.ts'
import { XUser_TimestampSelector } from '$/schema/XUser_Timestamp.ts'
import { XPost_TimestampSelector } from '$/schema/XPost_Timestamp.ts'
import { _GlobalXNetworkSelector } from '$/schema/_GlobalXNetwork.ts'
import { XNetworkSelector } from '$/schema/XNetwork.ts'

export default {
	source: Source.X_FxEmbed_Rest,

	resolvers: [
		defineResolver(Source.X_FxEmbed_Rest, {
			entityType: EntityType.XUser,
			resolve: {
				[XUserSelector.Id]: {
					resolve: async ({ id }) => {
						const { getUser } = await import('$/sources/FxEmbed/Rest/queries.ts')
						const response = await getUser(id)
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
						if (username == null) throw new Error('X_FxEmbed_Rest: user username not found')

						return {
							id: user.id,
							username,
							...(name != null && { name }),
							...(description != null && { description }),
							...(location != null && { location }),
							...(user.verification?.verified != null && {
								verified: user.verification.verified,
							}),
							...(Number.isFinite(createdAt) && { createdAt }),
							...(websiteUrl != null && { websiteUrl }),
							...((
									iconMedia
								) => (
									iconMedia != null && {
										$icon: iconMedia,
									}
								))(mediaFromUrl(user.avatar_url ?? undefined, MediaType.Image)),
						}
					},
				},
				[XUserSelector.Username]: {
					resolve: async ({ username }) => {
						const { getUser } = await import('$/sources/FxEmbed/Rest/queries.ts')
						const response = await getUser(username)
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
						const name = optionalNonemptyString(user.name)
						const description = optionalNonemptyString(user.description)
						const location = optionalNonemptyString(user.location)
						return {
							id: user.id,
							username,
							...(name != null && { name }),
							...(description != null && { description }),
							...(location != null && { location }),
							...(user.verification?.verified != null && {
								verified: user.verification.verified,
							}),
							...(Number.isFinite(createdAt) && { createdAt }),
							...(websiteUrl != null && { websiteUrl }),
							...((
								iconMedia
						) => (
							iconMedia != null && {
								$icon: iconMedia,
							}
						))(mediaFromUrl(user.avatar_url ?? undefined, MediaType.Image)),
						}
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
			}),

		defineResolver(Source.X_FxEmbed_Rest, {
			entityType: EntityType.XPost,
			resolve: {
				[XPostSelector.Id]: {
					resolve: async ({ id }) => {
						const { getStatus } = await import('$/sources/FxEmbed/Rest/queries.ts')
						const response = await getStatus(id)
						const status = response.status
						if (status?.type !== 'status' || status.id == null)
							throw new Error('X_FxEmbed_Rest: post not found')
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
							...(replyToId != null && {
								$replyToPost: {
									[EntityMetaKey.Selector]: { id: replyToId },
								},
							}),
							...(quotedId != null && {
								$quotedPost: {
									[EntityMetaKey.Selector]: { id: quotedId },
								},
							}),
							$author: (
								status.author?.id == null ?
									undefined
								:
									{
										[EntityMetaKey.Selector]: { id: status.author.id },
									}
							),
						}
					},
				}
			},
		})({
				text: (snapshot) => snapshot.text,
				createdAt: (snapshot) => snapshot.createdAt,
				postUrl: (snapshot) => snapshot.postUrl,
				$replyToPost: (snapshot) => snapshot.$replyToPost,
				$quotedPost: (snapshot) => snapshot.$quotedPost,
				$author: (snapshot) => snapshot.$author,
			}),

		defineResolver(Source.X_FxEmbed_Rest, {
			entityType: EntityType.XUser_Timestamp,
			resolve: {
				[XUser_TimestampSelector.XUserTimestampMs]: {
					resolve: async ({ $user }) => {
						const { getUser } = await import('$/sources/FxEmbed/Rest/queries.ts')
						const user = (await getUser('id' in $user ? $user.id : $user.username)).user
						if (user?.id == null) throw new Error('X_FxEmbed_Rest: user not found')
						return {
							followerCount: user.followers,
							followingCount: user.following,
							tweetCount: user.statuses,
						}
					},
				}
			},
		})({
				followerCount: (snapshot) => snapshot.followerCount,
				followingCount: (snapshot) => snapshot.followingCount,
				tweetCount: (snapshot) => snapshot.tweetCount,
			}),

		defineResolver(Source.X_FxEmbed_Rest, {
			entityType: EntityType.XPost_Timestamp,
			resolve: {
				[XPost_TimestampSelector.XPostTimestampMs]: {
					resolve: async ({ $post }) => {
						const { getStatus } = await import('$/sources/FxEmbed/Rest/queries.ts')
						const status = (await getStatus($post.id)).status
						if (status?.type !== 'status' || status.id == null)
							throw new Error('X_FxEmbed_Rest: post not found')
						return {
							likeCount: status.likes,
							retweetCount: status.reposts,
							replyCount: status.replies,
							quoteCount: status.quotes,
						}
					},
				}
			},
		})({
				likeCount: (snapshot) => snapshot.likeCount,
				retweetCount: (snapshot) => snapshot.retweetCount,
				replyCount: (snapshot) => snapshot.replyCount,
				quoteCount: (snapshot) => snapshot.quoteCount,
			}),

			defineResolver(Source.X_FxEmbed_Rest, {
				entityType: EntityType.XNetwork,
				resolve: {
					[XNetworkSelector.Scope]: {
						resolve: async (_entitySelector, context) => {
						const { searchStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						const statusSearchResponse = await searchStatuses(limit)
						return (
							(statusSearchResponse.results ?? [])
								.flatMap((status) => {
								const authorId = optionalNonemptyString(status.author?.id)
								if (authorId == null) return []
								return [{
									[EntityMetaKey.Selector]: { id: authorId },
									[EntityMetaKey.Fields]: {
										...(optionalNonemptyString(status.author?.screen_name) != null && {
											[entityFieldAddressKey(EntityType.XUser, [], 'username')]:
												optionalNonemptyString(status.author?.screen_name),
										}),
										...(optionalNonemptyString(status.author?.name) != null && {
											[entityFieldAddressKey(EntityType.XUser, [], 'name')]:
												optionalNonemptyString(status.author?.name),
										}),
									},
								}]
								})
						)
					},
					}
			},
			})({
					$$xUsers: (snapshot) => snapshot,
				}),

			defineResolver(Source.X_FxEmbed_Rest, {
				entityType: EntityType.XNetwork,
				resolve: {
					[XNetworkSelector.Scope]: {
						resolve: async (_entitySelector, context) => {
						const { searchStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							((await searchStatuses(limit)).results ?? [])
								.flatMap((wirePost) => (
								wirePost.type === 'status' && wirePost.id != null ?
									[{
										[EntityMetaKey.Selector]: { id: wirePost.id },
										[EntityMetaKey.Fields]: {
											...(optionalNonemptyString(wirePost.text) != null && {
												[entityFieldAddressKey(EntityType.XPost, [], 'text')]:
													optionalNonemptyString(wirePost.text),
											}),
											...(wirePost.created_timestamp != null && {
												[entityFieldAddressKey(EntityType.XPost, [], 'createdAt')]:
													wirePost.created_timestamp * 1000,
											}),
											[entityFieldAddressKey(EntityType.XPost, [], 'postUrl')]:
												`https://x.com/i/web/status/${wirePost.id}`,
											...(wirePost.author?.id != null && {
												[entityFieldAddressKey(EntityType.XPost, [], '$author')]: {
													[EntityMetaKey.Selector]: { id: wirePost.author.id },
												},
											}),
										},
									}]
								:
									[]
								))
						)
					},
					}
			},
			})({
					$$xPosts: (snapshot) => snapshot,
				}),

		defineResolver(Source.X_FxEmbed_Rest, {
			entityType: EntityType.XPost,
			resolve: {
				[XPostSelector.Id]: {
					resolve: async ({ id }) => {
						const { getStatus } = await import('$/sources/FxEmbed/Rest/queries.ts')
						const status = (await getStatus(id)).status
						if (status?.type !== 'status' || status.id == null)
							throw new Error('X_FxEmbed_Rest: post not found')
						return [
							{
								[EntityMetaKey.Selector]: {
									$post: { id },
									timestampMs: Date.now(),
								},
								likeCount: status.likes,
								retweetCount: status.reposts,
								replyCount: status.replies,
								quoteCount: status.quotes,
							},
						]
					},
				}
			},
		})({
				$$timestamps: (snapshot) => snapshot,
			}),

		defineResolver(Source.X_FxEmbed_Rest, {
			entityType: EntityType.XUser,
			resolve: {
				[XUserSelector.Id]: {
					resolve: async ({ id }) => {
						const { getUser } = await import('$/sources/FxEmbed/Rest/queries.ts')
						const user = (await getUser(id)).user
						if (user?.id == null) throw new Error('X_FxEmbed_Rest: user not found')
						return [
							{
								[EntityMetaKey.Selector]: {
									$user: {
										id: user.id,
									},
									timestampMs: Date.now(),
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.XUser_Timestamp, [], 'followerCount')]: user.followers,
									[entityFieldAddressKey(EntityType.XUser_Timestamp, [], 'followingCount')]: user.following,
									[entityFieldAddressKey(EntityType.XUser_Timestamp, [], 'tweetCount')]: user.statuses,
								},
							},
						]
					},
				},
				[XUserSelector.Username]: {
					resolve: async ({ username }) => {
						const { getUser } = await import('$/sources/FxEmbed/Rest/queries.ts')
						const user = (await getUser(username)).user
						if (user?.id == null) throw new Error('X_FxEmbed_Rest: user not found')
						return [
							{
								[EntityMetaKey.Selector]: {
									$user: {
										username,
									},
									timestampMs: Date.now(),
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.XUser_Timestamp, [], 'followerCount')]: user.followers,
									[entityFieldAddressKey(EntityType.XUser_Timestamp, [], 'followingCount')]: user.following,
									[entityFieldAddressKey(EntityType.XUser_Timestamp, [], 'tweetCount')]: user.statuses,
								},
							},
						]
					},
				},
			},
		})({
				$$timestamps: (snapshot) => snapshot,
			}),

		defineResolver(Source.X_FxEmbed_Rest, {
			entityType: EntityType.XUser,
			resolve: {
				[XUserSelector.Id]: {
					resolve: async ({ id }, context) => {
						const { getUserStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							((await getUserStatuses(id, limit)).results ?? [])
								.flatMap((wirePost) => (
								wirePost.type === 'status' && wirePost.id != null ?
									[{
										[EntityMetaKey.Selector]: { id: wirePost.id },
										[EntityMetaKey.Fields]: {
											...(optionalNonemptyString(wirePost.text) != null && {
												[entityFieldAddressKey(EntityType.XPost, [], 'text')]:
													optionalNonemptyString(wirePost.text),
											}),
											...(wirePost.created_timestamp != null && {
												[entityFieldAddressKey(EntityType.XPost, [], 'createdAt')]:
													wirePost.created_timestamp * 1000,
											}),
											[entityFieldAddressKey(EntityType.XPost, [], 'postUrl')]:
												`https://x.com/i/web/status/${wirePost.id}`,
										},
									}]
								:
									[]
								))
						)
					},
				},
				[XUserSelector.Username]: {
					resolve: async ({ username }, context) => {
						const { getUserStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							((await getUserStatuses(username, limit)).results ?? [])
								.flatMap((wirePost) => (
								wirePost.type === 'status' && wirePost.id != null ?
									[{
										[EntityMetaKey.Selector]: { id: wirePost.id },
										[EntityMetaKey.Fields]: {
											...(optionalNonemptyString(wirePost.text) != null && {
												[entityFieldAddressKey(EntityType.XPost, [], 'text')]:
													optionalNonemptyString(wirePost.text),
											}),
											...(wirePost.created_timestamp != null && {
												[entityFieldAddressKey(EntityType.XPost, [], 'createdAt')]:
													wirePost.created_timestamp * 1000,
											}),
											[entityFieldAddressKey(EntityType.XPost, [], 'postUrl')]:
												`https://x.com/i/web/status/${wirePost.id}`,
										},
									}]
								:
									[]
								))
						)
					},
				},
			},
		})({
				$$posts: (snapshot) => snapshot,
			}),

		defineResolver(Source.X_FxEmbed_Rest, {
			entityType: EntityType._GlobalXNetwork,
			resolve: {
				[_GlobalXNetworkSelector.Scope]: {
					resolve: async ({ scope }, context) => {
						if (scope !== EntityType._GlobalXNetwork)
							throw new Error(`X_FxEmbed_Rest: unsupported global X scope ${scope}`)

						const { searchStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
						return ((await searchStatuses(resolverContextRowLimit(context))).results ?? [])
							.flatMap((status) => (
								status.type === 'status'
								&& status.author?.id != null
								&& optionalNonemptyString(status.author.screen_name) != null ?
									[{
										[EntityMetaKey.Selector]: { id: status.author.id },
										[EntityMetaKey.Fields]: {
											[entityFieldAddressKey(EntityType.XUser, [], 'username')]:
												optionalNonemptyString(status.author.screen_name),
											...(optionalNonemptyString(status.author.name) != null && {
												[entityFieldAddressKey(EntityType.XUser, [], 'name')]:
													optionalNonemptyString(status.author.name),
											}),
										},
									}]
								:
									[]
							))
					},
				},
			},
		})({
			$$observedUsers: (users) => users,
		}),

		defineResolver(Source.X_FxEmbed_Rest, {
			entityType: EntityType._GlobalXNetwork,
			resolve: {
				[_GlobalXNetworkSelector.Scope]: {
					resolve: async ({ scope }, context) => {
						if (scope !== EntityType._GlobalXNetwork)
							throw new Error(`X_FxEmbed_Rest: unsupported global X scope ${scope}`)

						const { searchStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
						return ((await searchStatuses(resolverContextRowLimit(context))).results ?? [])
							.flatMap((status) => (
								status.type === 'status' && status.id != null ?
									[{
										[EntityMetaKey.Selector]: { id: status.id },
										[EntityMetaKey.Fields]: {
											...(optionalNonemptyString(status.text) != null && {
												[entityFieldAddressKey(EntityType.XPost, [], 'text')]:
													optionalNonemptyString(status.text),
											}),
											...(status.created_timestamp != null && {
												[entityFieldAddressKey(EntityType.XPost, [], 'createdAt')]:
													status.created_timestamp * 1_000,
											}),
											[entityFieldAddressKey(EntityType.XPost, [], 'postUrl')]:
												`https://x.com/i/web/status/${status.id}`,
											...(status.author?.id != null && {
												[entityFieldAddressKey(EntityType.XPost, [], '$author')]: {
													[EntityMetaKey.Selector]: { id: status.author.id },
												},
											}),
										},
									}]
								:
									[]
							))
					},
				},
			},
		})({
			$$observedPosts: (posts) => posts,
		}),
	],
}

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
						if (user.id !== id) throw new Error('X_FxEmbed_Rest: user id mismatch')
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
								$$timestamps: [{
									[EntityMetaKey.Selector]: {
										$user: { id: user.id },
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
					},
				},
				Username: {
					resolve: async ({ username }) => {
						const { getUser } = await import('$/sources/FxEmbed/Rest/queries.ts')
						const response = await getUser(username)
						const user = response.user
						if (user?.id == null) throw new Error('X_FxEmbed_Rest: user not found')
						const resolvedUsername = optionalNonemptyString(user.screen_name)
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
						if (resolvedUsername == null) throw new Error('X_FxEmbed_Rest: user username not found')
						return {
							id: user.id,
							username: resolvedUsername,
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
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$user: { id: user.id },
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
						const postId = optionalNonemptyString(status.id)
						const text = optionalNonemptyString(status.text)
						return {
							id,
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
									[EntityMetaKey.Fields]: {
										...(optionalNonemptyString(status.quote?.text) != null && {
											[entityFieldAddressKey(EntityType.XPost, [], 'text')]:
												optionalNonemptyString(status.quote?.text),
										}),
										...(status.quote?.created_timestamp != null && {
											[entityFieldAddressKey(EntityType.XPost, [], 'createdAt')]:
												status.quote.created_timestamp * 1_000,
										}),
										[entityFieldAddressKey(EntityType.XPost, [], 'postUrl')]:
											`https://x.com/i/web/status/${quotedId}`,
										...(status.quote?.author?.id != null && {
											[entityFieldAddressKey(EntityType.XPost, [], '$author')]: {
												[EntityMetaKey.Selector]: { id: status.quote.author.id },
												[EntityMetaKey.Fields]: {
													...(optionalNonemptyString(status.quote.author.screen_name) != null && {
														[entityFieldAddressKey(EntityType.XUser, [], 'username')]:
															optionalNonemptyString(status.quote.author.screen_name),
													}),
													...(optionalNonemptyString(status.quote.author.name) != null && {
														[entityFieldAddressKey(EntityType.XUser, [], 'name')]:
															optionalNonemptyString(status.quote.author.name),
													}),
												},
											},
										}),
									},
								},
							}),
							$author: (
								status.author?.id == null ?
									undefined
								:
									{
										[EntityMetaKey.Selector]: { id: status.author.id },
										[EntityMetaKey.Fields]: {
											...(optionalNonemptyString(status.author.screen_name) != null && {
												[entityFieldAddressKey(EntityType.XUser, [], 'username')]:
													optionalNonemptyString(status.author.screen_name),
											}),
											...(optionalNonemptyString(status.author.name) != null && {
												[entityFieldAddressKey(EntityType.XUser, [], 'name')]:
													optionalNonemptyString(status.author.name),
											}),
										},
									}
								),
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
				postUrl: (snapshot) => snapshot.postUrl,
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
					if (status.type !== 'status') return []
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
			),
			$$xPosts: (statuses) => (
				statuses.flatMap((wirePost) => (
									wirePost.type === 'status'
									&& wirePost.id != null ?
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
													...(
														optionalNonemptyString(wirePost.author.screen_name) != null
														|| optionalNonemptyString(wirePost.author.name) != null ?
															{
																[EntityMetaKey.Fields]: {
																	...(optionalNonemptyString(wirePost.author.screen_name) != null && {
																		[entityFieldAddressKey(EntityType.XUser, [], 'username')]:
																			optionalNonemptyString(wirePost.author.screen_name),
																	}),
																	...(optionalNonemptyString(wirePost.author.name) != null && {
																		[entityFieldAddressKey(EntityType.XUser, [], 'name')]:
																			optionalNonemptyString(wirePost.author.name),
																	}),
																},
															}
														:
															{}
													),
												},
											}),
										},
									}]
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
						return (
							((await getUserStatuses(id, limit)).results ?? [])
								.flatMap((wirePost) => (
								wirePost.type === 'status'
								&& wirePost.id != null
								&& wirePost.author?.id === id ?
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
												[entityFieldAddressKey(EntityType.XPost, [], '$author')]: {
													[EntityMetaKey.Selector]: { id },
													[EntityMetaKey.Fields]: {
														...(optionalNonemptyString(wirePost.author.screen_name) != null && {
															[entityFieldAddressKey(EntityType.XUser, [], 'username')]:
																optionalNonemptyString(wirePost.author.screen_name),
														}),
														...(optionalNonemptyString(wirePost.author.name) != null && {
															[entityFieldAddressKey(EntityType.XUser, [], 'name')]:
																optionalNonemptyString(wirePost.author.name),
														}),
													},
												},
											},
										}]
								:
									[]
								))
						)
					},
				},
				Username: {
					resolve: async ({ username }, context) => {
						const { getUserStatuses } = await import('$/sources/FxEmbed/Rest/queries.ts')
						const limit = resolverContextRowLimit(context)
						return (
							((await getUserStatuses(username, limit)).results ?? [])
								.flatMap((wirePost) => (
								wirePost.type === 'status'
								&& wirePost.id != null
								&& wirePost.author?.id != null
								&& wirePost.author.screen_name?.toLowerCase() === username.toLowerCase() ?
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
											[entityFieldAddressKey(EntityType.XPost, [], '$author')]: {
												[EntityMetaKey.Selector]: { id: wirePost.author.id },
												[EntityMetaKey.Fields]: {
													[entityFieldAddressKey(EntityType.XUser, [], 'username')]:
														wirePost.author.screen_name,
													...(optionalNonemptyString(wirePost.author.name) != null && {
														[entityFieldAddressKey(EntityType.XUser, [], 'name')]:
															optionalNonemptyString(wirePost.author.name),
													}),
												},
											},
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
			),
			$$observedPosts: (statuses) => (
				statuses.flatMap((status) => (
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
													...(
														optionalNonemptyString(status.author.screen_name) != null
														|| optionalNonemptyString(status.author.name) != null ?
															{
																[EntityMetaKey.Fields]: {
																	...(optionalNonemptyString(status.author.screen_name) != null && {
																		[entityFieldAddressKey(EntityType.XUser, [], 'username')]:
																			optionalNonemptyString(status.author.screen_name),
																	}),
																	...(optionalNonemptyString(status.author.name) != null && {
																		[entityFieldAddressKey(EntityType.XUser, [], 'name')]:
																			optionalNonemptyString(status.author.name),
																	}),
																},
															}
														:
															{}
													),
												},
											}),
										},
									}]
								:
									[]
				))
			),
		}),
	],
} satisfies RegisteredSourceResolverModule<Source.X_FxEmbed_Rest>

import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { with0xHex, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { optionalTimestampMs } from '$/lib/time.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { lensQueries } from '$/sources/Lens/Graphql/queries.ts'
import type {
	LensFeedRules,
	LensUsernameNamespaceRules,
} from '$/sources/Lens/Graphql/types.ts'

const {
	queryAccount,
	queryAccounts,
	queryAccountStats,
	queryFeed,
	queryFeedPosts,
	queryFeeds,
	queryLatestPosts,
	queryNamespace,
	queryNamespaces,
	queryPost,
	queryPostComments,
	queryPostsByAuthor,
	queryUsername,
	queryUsernames,
} = lensQueries

/** Lens / subgraph wire — may omit `0x` or use mixed case. */
const lensEvmAddressFromWire = (address: string): `0x${string}` => {
	if (address === '') throw new Error('Lens_Graphql: invalid EVM address')
	const n = with0xHex(address)
	if (!/^0x[0-9a-f]{40}$/.test(n)) throw new Error('Lens_Graphql: invalid EVM address')
	return n
}

const lensMetadataTextFromWire = (
	metadata:
		| {
			__typename: string
			content?: string | null
		}
		| null
		| undefined
) => (
	metadata?.__typename === 'UnknownPostMetadata' ?
		undefined
	:
		optionalNonemptyString(metadata?.content != null ? String(metadata.content) : null)
)

const lensAnyPostSlugFromWire = (
	lensPost:
		| {
			__typename: string
			slug?: string | null
		}
		| null
		| undefined
) => (
	lensPost?.__typename === 'Post' || lensPost?.__typename === 'Repost' ?
		optionalNonemptyString(lensPost.slug)
	:
		undefined
)

const lensPostTimestampFieldsFromWire = (
	post: {
		stats: {
			comments?: number | null
			reposts?: number | null
			quotes?: number | null
			bookmarks?: number | null
			collects?: number | null
			reactions?: number | null
		}
	}
) => ({
	...(post.stats.comments != null && { commentCount: post.stats.comments }),
	...(post.stats.reposts != null && { repostCount: post.stats.reposts }),
	...(post.stats.quotes != null && { quoteCount: post.stats.quotes }),
	...(post.stats.bookmarks != null && { bookmarkCount: post.stats.bookmarks }),
	...(post.stats.collects != null && { collectCount: post.stats.collects }),
	...(post.stats.reactions != null && { reactionCount: post.stats.reactions }),
})

const lensPostTipTimestampReferenceFromWire = (
	id: string,
	post: {
		stats?: {
			comments?: number | null
			reposts?: number | null
			quotes?: number | null
			bookmarks?: number | null
			collects?: number | null
			reactions?: number | null
		} | null
	}
) => {
	const engagement = (
		post.stats == null ?
			{}
		:
			lensPostTimestampFieldsFromWire({
				stats: post.stats,
			})
	)
	return {
		[EntityMetaKey.Selector]: {
			$post: { id },
			timestampMs: Date.now(),
		},
		[EntityMetaKey.Fields]: {
			...(engagement.commentCount != null && {
				[entityFieldAddressKey(EntityType.LensPost_Timestamp, [], 'commentCount')]: engagement.commentCount,
			}),
			...(engagement.repostCount != null && {
				[entityFieldAddressKey(EntityType.LensPost_Timestamp, [], 'repostCount')]: engagement.repostCount,
			}),
			...(engagement.quoteCount != null && {
				[entityFieldAddressKey(EntityType.LensPost_Timestamp, [], 'quoteCount')]: engagement.quoteCount,
			}),
			...(engagement.bookmarkCount != null && {
				[entityFieldAddressKey(EntityType.LensPost_Timestamp, [], 'bookmarkCount')]: engagement.bookmarkCount,
			}),
			...(engagement.collectCount != null && {
				[entityFieldAddressKey(EntityType.LensPost_Timestamp, [], 'collectCount')]: engagement.collectCount,
			}),
			...(engagement.reactionCount != null && {
				[entityFieldAddressKey(EntityType.LensPost_Timestamp, [], 'reactionCount')]: engagement.reactionCount,
			}),
		},
	}
}

const lensAccountTipTimestampReferenceFromWire = (
	address: `0x${string}`,
	stats: {
		followerCount: number
		followingCount: number
	}
) => ({
	[EntityMetaKey.Selector]: {
		$account: { address },
		timestampMs: Date.now(),
	},
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.LensAccount_Timestamp, [], 'followerCount')]: stats.followerCount,
		[entityFieldAddressKey(EntityType.LensAccount_Timestamp, [], 'followingCount')]: stats.followingCount,
	},
})

const lensPostCardReferenceFromWire = (
	lensPost:
		| {
			__typename: string
			slug?: string | null
			timestamp?: string | null
			isEdited?: boolean | null
			isDeleted?: boolean | null
			author?: {
				address: string
				createdAt?: string | null
				username?: {
					localName?: string | null
				} | null
				metadata?: {
					name?: string | null
				} | null
			} | null
			metadata?: {
				__typename: string
				content?: string | null
			} | null
			contentUri?: string | null
			stats?: {
				comments?: number | null
				reposts?: number | null
				quotes?: number | null
				bookmarks?: number | null
				collects?: number | null
				reactions?: number | null
			} | null
			commentOn?: {
				slug?: string | null
			} | null
			feed?: {
				address?: string | null
			} | null
			repostOf?: {
				slug?: string | null
			} | null
		}
		| null
		| undefined
) => {
	const id = lensAnyPostSlugFromWire(lensPost)
	if (id == null || lensPost?.isDeleted === true || lensPost?.author == null)
		return undefined

	const timestamp = optionalTimestampMs(lensPost.timestamp)
	const text = lensPost.__typename === 'Post' ? lensMetadataTextFromWire(lensPost.metadata) : undefined
	const localName = optionalNonemptyString(lensPost.author.username?.localName)
	const displayName = optionalNonemptyString(lensPost.author.metadata?.name)
	const createdAt = optionalTimestampMs(lensPost.author.createdAt)
	const contentUri = lensPost.__typename === 'Post' ? optionalNonemptyString(lensPost.contentUri) : undefined
	const repostOfSlug = lensPost.__typename === 'Repost' ? optionalNonemptyString(lensPost.repostOf?.slug) : undefined
	const commentOnSlug = lensPost.__typename === 'Post' ? optionalNonemptyString(lensPost.commentOn?.slug) : undefined
	return {
		[EntityMetaKey.Selector]: { id },
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.LensPost, [], 'text')]: text,
			[entityFieldAddressKey(EntityType.LensPost, [], 'timestamp')]: timestamp,
			...(lensPost.__typename === 'Post' && lensPost.isEdited != null && {
				[entityFieldAddressKey(EntityType.LensPost, [], 'isEdited')]: lensPost.isEdited,
			}),
			...(lensPost.isDeleted != null && {
				[entityFieldAddressKey(EntityType.LensPost, [], 'isDeleted')]: lensPost.isDeleted,
			}),
			...(contentUri != null && {
				[entityFieldAddressKey(EntityType.LensPost, [], 'contentUri')]: contentUri,
			}),
			...(commentOnSlug != null && {
				[entityFieldAddressKey(EntityType.LensPost, [], '$commentOn')]: {
					[EntityMetaKey.Selector]: {
						id: commentOnSlug,
					},
				},
			}),
			...(repostOfSlug != null && {
				[entityFieldAddressKey(EntityType.LensPost, [], '$repostOf')]: {
					[EntityMetaKey.Selector]: {
						id: repostOfSlug,
					},
				},
			}),
			[entityFieldAddressKey(EntityType.LensPost, [], '$author')]: {
				[EntityMetaKey.Selector]: {
					address: lensEvmAddressFromWire(lensPost.author.address),
				},
				[EntityMetaKey.Fields]: {
					...(localName != null && {
						[entityFieldAddressKey(EntityType.LensAccount, [], 'localName')]: localName,
					}),
					...(displayName != null && {
						[entityFieldAddressKey(EntityType.LensAccount, [], 'displayName')]: displayName,
					}),
					...(createdAt != null && {
						[entityFieldAddressKey(EntityType.LensAccount, [], 'createdAt')]: createdAt,
					}),
				},
			},
			...(lensPost.__typename === 'Post' && {
				[entityFieldAddressKey(EntityType.LensPost, [], '$$timestamps')]: [
					lensPostTipTimestampReferenceFromWire(id, lensPost),
				],
			}),
		},
	}
}

const lensUsernameFromWire = (
	username: NonNullable<Awaited<ReturnType<
		typeof queryUsername
	>>['username']>
) => {
	const namespace = lensEvmAddressFromWire(username.namespace)
	const ownedBy = lensEvmAddressFromWire(username.ownedBy)
	const linkedTo = (
		username.linkedTo != null ?
			lensEvmAddressFromWire(username.linkedTo)
		:
			undefined
	)
	return {
		id: username.id,
		namespace,
		localName: username.localName,
		...((value) => value != null && { value })(optionalNonemptyString(username.value)),
		ownedBy,
		...(linkedTo != null && { linkedTo }),
		...((timestamp) => timestamp != null && { timestamp })(optionalTimestampMs(username.timestamp)),
		$namespace: {
			[EntityMetaKey.Selector]: {
				address: namespace,
			},
		},
		...(linkedTo != null && {
			$account: {
				[EntityMetaKey.Selector]: {
					address: linkedTo,
				},
			},
		}),
		$owner: {
			[EntityMetaKey.Selector]: {
				address: ownedBy,
			},
		},
	}
}

const lensUsernameReferenceFromWire = (
	username: NonNullable<Awaited<ReturnType<
		typeof queryUsername
	>>['username']>
) => {
	const resolved = lensUsernameFromWire(username)
	return {
		[EntityMetaKey.Selector]: {
			id: resolved.id,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.LensUsername, [], 'namespace')]: resolved.namespace,
			[entityFieldAddressKey(EntityType.LensUsername, [], 'localName')]: resolved.localName,
			[entityFieldAddressKey(EntityType.LensUsername, [], 'value')]: resolved.value,
			[entityFieldAddressKey(EntityType.LensUsername, [], 'ownedBy')]: resolved.ownedBy,
			[entityFieldAddressKey(EntityType.LensUsername, [], 'linkedTo')]: resolved.linkedTo,
			[entityFieldAddressKey(EntityType.LensUsername, [], 'timestamp')]: resolved.timestamp,
			[entityFieldAddressKey(EntityType.LensUsername, [], '$namespace')]: resolved.$namespace,
			[entityFieldAddressKey(EntityType.LensUsername, [], '$account')]: resolved.$account,
			[entityFieldAddressKey(EntityType.LensUsername, [], '$owner')]: resolved.$owner,
		},
	}
}

const lensRulesWithoutConfigurationFromWire = (
	rules: LensFeedRules | LensUsernameNamespaceRules | null | undefined
) => (
	rules == null ? undefined : {
		required: rules.required.map((rule) => ({
			id: rule.id,
			type: rule.type,
			address: rule.address,
			executesOn: rule.executesOn,
		})),
		anyOf: rules.anyOf.map((rule) => ({
			id: rule.id,
			type: rule.type,
			address: rule.address,
			executesOn: rule.executesOn,
		})),
	}
)

const lensUsernameNamespaceFromWire = (
	namespace: NonNullable<Awaited<ReturnType<
		typeof queryNamespace
	>>['namespace']>
) => {
	const owner = lensEvmAddressFromWire(namespace.owner)
	return {
		address: lensEvmAddressFromWire(namespace.address),
		namespace: namespace.namespace,
		owner,
		$owner: {
			[EntityMetaKey.Selector]: {
				address: owner,
			},
		},
		...((tokenName) => tokenName != null && { tokenName })(optionalNonemptyString(namespace.tokenName)),
		...((tokenSymbol) => tokenSymbol != null && { tokenSymbol })(optionalNonemptyString(namespace.tokenSymbol)),
		...((createdAt) => createdAt != null && { createdAt })(optionalTimestampMs(namespace.createdAt)),
		...((description) => description != null && { description })(optionalNonemptyString(namespace.metadata?.description)),
		totalUsernames: namespace.stats.totalUsernames,
		...((rules) => rules != null && { rules })(lensRulesWithoutConfigurationFromWire(namespace.rules)),
	}
}

const lensAccountTimestampFieldsFromWire = (
	wire: Awaited<ReturnType<
		typeof queryAccountStats
	>>
) => ({
	followerCount: wire.accountStats.graphFollowStats.followers,
	followingCount: wire.accountStats.graphFollowStats.following,
})

const lensAccountFromWire = (
	account: Awaited<ReturnType<
		typeof queryAccount
	>>['account'],
	selectedLocalName?: string,
	legacyProfileId?: string,
	tipStats?: {
		followerCount: number
		followingCount: number
	}
) => {
	if (account == null) throw new Error('Lens_Graphql: account not found')

	const address = lensEvmAddressFromWire(account.address)
	const localName = optionalNonemptyString(account.username?.localName)
	const pictureUrl = optionalNonemptyString(
		account.metadata?.picture != null ?
			String(account.metadata.picture)
		:
			null
	)
	return {
		address,
		localName: localName ?? selectedLocalName,
		legacyProfileId,
		...((displayName) => displayName != null && { displayName })(
			optionalNonemptyString(account.metadata?.name)
		),
		...((bio) => bio != null && { bio })(
			optionalNonemptyString(account.metadata?.bio)
		),
		owner: lensEvmAddressFromWire(account.owner),
		score: account.score,
		...((createdAt) => createdAt != null && { createdAt })(
			optionalTimestampMs(String(account.createdAt))
		),
		...(pictureUrl != null && { iconUrl: pictureUrl }),
		...((iconMedia) => iconMedia != null && { $icon: iconMedia })(
			mediaFromUrl(pictureUrl, MediaType.Image)
		),
		$$timestamps: [
			tipStats != null ?
				lensAccountTipTimestampReferenceFromWire(address, tipStats)
			:
				{
					[EntityMetaKey.Selector]: {
						$account: { address },
						timestampMs: Date.now(),
					},
				},
		],
	}
}

const lensGraphqlResolvers = {
	source: Source.Lens_Graphql,

	resolvers: [
		defineResolver({
			entityType: EntityType.LensNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const limit = resolverContextRowLimit(context)
						return (await queryLatestPosts(limit)).posts.items.flatMap((lensPost) => {
							const reference = lensPostCardReferenceFromWire(lensPost)
							return reference == null ? [] : [reference]
						}).slice(0, limit)
					},
				},
			},
		})({
				$$lensPosts: (posts) => posts,
			}),

		defineResolver({
			entityType: EntityType.LensAccount,
			resolve: {
				Address: {
					resolve: async ({ address }) => {
						const requestedAddress = zeroExLowerCase(address)
						const account = (await queryAccount({ address: requestedAddress })).account
						if (
							account != null
							&& lensEvmAddressFromWire(account.address) !== requestedAddress
						)
							throw new Error('Lens_Graphql: account response does not match request')

						return lensAccountFromWire(
							account,
							undefined,
							undefined,
							lensAccountTimestampFieldsFromWire(
								await queryAccountStats(requestedAddress)
							)
						)
					},
				},
				LocalName: {
					resolve: async ({ localName }) => {
						if (localName.trim() === '')
							throw new Error('Lens_Graphql: account identity must not be empty')

						const account = (await queryAccount({
							username: { localName },
						})).account
						if (account != null && account.username?.localName !== localName)
							throw new Error('Lens_Graphql: account response does not match request')

						const tipStats = (
							account == null ?
								undefined
							:
								lensAccountTimestampFieldsFromWire(
									await queryAccountStats(lensEvmAddressFromWire(account.address))
								)
						)
						return lensAccountFromWire(
							account,
							localName,
							undefined,
							tipStats
						)
					},
				},
				LegacyProfileId: {
					resolve: async ({ legacyProfileId }) => {
						if (legacyProfileId.trim() === '')
							throw new Error('Lens_Graphql: account identity must not be empty')

						const account = (await queryAccount({ legacyProfileId })).account
						const tipStats = (
							account == null ?
								undefined
							:
								lensAccountTimestampFieldsFromWire(
									await queryAccountStats(lensEvmAddressFromWire(account.address))
								)
						)
						return lensAccountFromWire(
							account,
							undefined,
							legacyProfileId,
							tipStats
						)
					},
				},
			},
		})({
				address: (account) => account.address,
				localName: (account) => account.localName,
				legacyProfileId: (account) => account.legacyProfileId,
				displayName: (account) => account.displayName,
				bio: (account) => account.bio,
				owner: (account) => account.owner,
				score: (account) => account.score,
				createdAt: (account) => account.createdAt,
				iconUrl: (account) => account.iconUrl,
				$icon: (account) => account.$icon,
				$$timestamps: (account) => account.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.LensPost,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
						const p = (await queryPost(id)).post
						if (p == null) throw new Error('Lens_Graphql: post not found')

						if (p.__typename === 'Repost') {
							const timestamp = optionalTimestampMs(String(p.timestamp))
							return {
								text: undefined,
								...(timestamp != null && { timestamp }),
								isEdited: undefined,
								isDeleted: p.isDeleted,
								contentUri: undefined,
								$commentOn: undefined,
								$quoteOf: undefined,
								$root: undefined,
								$author: {
									[EntityMetaKey.Selector]: {
										address: lensEvmAddressFromWire(p.author.address),
									},
								},
								$$timestamps: [
									{
										[EntityMetaKey.Selector]: {
											$post: { id },
											timestampMs: Date.now(),
										},
									},
								],
								...((postSlug) => (
									postSlug != null && {
										$repostOf: { [EntityMetaKey.Selector]: { id: postSlug } },
									}
								))(optionalNonemptyString(String(p.repostOf.slug))),
							}
						}

						const text = lensMetadataTextFromWire(p.metadata)
						const timestamp = optionalTimestampMs(String(p.timestamp))
						return {
							...(text != null && { text }),
							...(timestamp != null && { timestamp }),
							isEdited: p.isEdited,
							isDeleted: p.isDeleted,
							...((contentUri) => contentUri != null && { contentUri })(optionalNonemptyString(p.contentUri)),
							...((postSlug) => (
								postSlug != null && {
									$commentOn: { [EntityMetaKey.Selector]: { id: postSlug } },
								}
							))(optionalNonemptyString(p.commentOn?.slug != null ?
								String(p.commentOn.slug)
							:
								null)),
							...((postSlug) => (
								postSlug != null && {
									$quoteOf: { [EntityMetaKey.Selector]: { id: postSlug } },
								}
							))(optionalNonemptyString(
									p.quoteOf?.slug != null ?
								String(p.quoteOf.slug)
							:
								null
						)),
							...((postSlug) => (
								postSlug != null && {
									$root: { [EntityMetaKey.Selector]: { id: postSlug } },
								}
							))(optionalNonemptyString(
									p.root?.slug != null ?
								String(p.root.slug)
							:
								null
						)),
							$repostOf: undefined,
							$author: {
								[EntityMetaKey.Selector]: {
									address: lensEvmAddressFromWire(p.author.address),
								},
							},
							$$timestamps: [
								lensPostTipTimestampReferenceFromWire(id, p),
							],
						}
					},
				}
			},
		})({
				text: (post) => post.text,
				timestamp: (post) => post.timestamp,
				isEdited: (post) => post.isEdited,
				isDeleted: (post) => post.isDeleted,
				contentUri: (post) => post.contentUri,
				$commentOn: (post) => post.$commentOn,
				$quoteOf: (post) => post.$quoteOf,
				$repostOf: (post) => post.$repostOf,
				$root: (post) => post.$root,
				$author: (post) => post.$author,
				$$timestamps: (post) => post.$$timestamps,
			}),

		defineResolver({
			entityType: EntityType.LensAccount_Timestamp,
			resolve: {
				LensAccountTimestampMs: {
					resolve: async ({ $account }) => {
						if ('address' in $account)
							return lensAccountTimestampFieldsFromWire(
								await queryAccountStats(zeroExLowerCase($account.address))
							)

						const account = (
							'localName' in $account ?
								await queryAccount({
									username: { localName: $account.localName },
								})
							:
								await queryAccount({
									legacyProfileId: $account.legacyProfileId,
								})
						).account
						if (account == null) throw new Error('Lens_Graphql: account not found')
						return lensAccountTimestampFieldsFromWire(
							await queryAccountStats(lensEvmAddressFromWire(account.address))
						)
					},
				}
			},
		})({
				followerCount: (timestamp) => timestamp.followerCount,
				followingCount: (timestamp) => timestamp.followingCount,
			}),

		defineResolver({
			entityType: EntityType.LensPost_Timestamp,
			resolve: {
				LensPostTimestampMs: {
					resolve: async ({ $post }) => {
						const p = (await queryPost($post.id)).post
						if (p == null) throw new Error('Lens_Graphql: post not found')
						if (p.__typename !== 'Post') return {}
						return lensPostTimestampFieldsFromWire(p)
					},
				}
			},
		})({
				commentCount: (timestamp) => timestamp.commentCount,
				repostCount: (timestamp) => timestamp.repostCount,
				quoteCount: (timestamp) => timestamp.quoteCount,
				bookmarkCount: (timestamp) => timestamp.bookmarkCount,
				collectCount: (timestamp) => timestamp.collectCount,
				reactionCount: (timestamp) => timestamp.reactionCount,
			}),

		defineResolver({
			entityType: EntityType.LensPost,
			resolve: {
				Id: {
					resolve: async ({ id }, context) => {
						const limit = resolverContextRowLimit(context)
						return (await queryPostComments(id, limit)).postReferences.items.flatMap((lensPost) => {
							if (
								lensPost.__typename !== 'Post'
								|| lensPost.commentOn?.slug !== id
							)
								return []
							const reference = lensPostCardReferenceFromWire(lensPost)
							return reference == null ? [] : [reference]
						}).slice(0, limit)
					},
				}
			},
		})({
				$$comments: (comments) => comments,
			}),

		defineResolver({
			entityType: EntityType.LensAccount,
			resolve: {
				Address: {
					resolve: async ({ address }, context) => {
						const limit = resolverContextRowLimit(context)
						const requestedAddress = zeroExLowerCase(address)
						return (await queryPostsByAuthor(requestedAddress, limit)).posts.items.flatMap((lensPost) => {
							const reference = lensPostCardReferenceFromWire(lensPost)
							return (
								reference != null
								&& lensEvmAddressFromWire(lensPost.author.address) === requestedAddress ?
									[reference]
								:
									[]
							)
						}).slice(0, limit)
					},
				},
				LocalName: {
					resolve: async ({ localName }, context) => {
						if (localName.trim() === '')
							throw new Error('Lens_Graphql: account identity must not be empty')

						const account = (await queryAccount({
							username: { localName },
						})).account
						if (account == null) throw new Error('Lens_Graphql: account not found')
						if (account.username?.localName !== localName)
							throw new Error('Lens_Graphql: account response does not match request')

						const limit = resolverContextRowLimit(context)
						const authorAddress = lensEvmAddressFromWire(account.address)
						return (await queryPostsByAuthor(authorAddress, limit)).posts.items.flatMap((lensPost) => {
							const reference = lensPostCardReferenceFromWire(lensPost)
							return (
								reference != null
								&& lensEvmAddressFromWire(lensPost.author.address) === authorAddress ?
									[reference]
								:
									[]
							)
						}).slice(0, limit)
					},
				},
				LegacyProfileId: {
					resolve: async ({ legacyProfileId }, context) => {
						if (legacyProfileId.trim() === '')
							throw new Error('Lens_Graphql: account identity must not be empty')

						const account = (await queryAccount({ legacyProfileId })).account
						if (account == null) throw new Error('Lens_Graphql: account not found')

						const limit = resolverContextRowLimit(context)
						const authorAddress = lensEvmAddressFromWire(account.address)
						return (await queryPostsByAuthor(authorAddress, limit)).posts.items.flatMap((lensPost) => {
							const reference = lensPostCardReferenceFromWire(lensPost)
							return (
								reference != null
								&& lensEvmAddressFromWire(lensPost.author.address) === authorAddress ?
									[reference]
								:
									[]
							)
						}).slice(0, limit)
					},
				},
			},
		})({
				$$posts: (posts) => posts,
			}),

		defineResolver({
			entityType: EntityType.LensNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						return (await queryAccounts(resolverContextRowLimit(context))).accounts.items.map((account) => {
							const lensAccount = lensAccountFromWire(account)

							return {
								[EntityMetaKey.Selector]: {
									address: lensAccount.address,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.LensAccount, [], '$icon')]: lensAccount.$icon,
									[entityFieldAddressKey(EntityType.LensAccount, [], 'bio')]: lensAccount.bio,
									[entityFieldAddressKey(EntityType.LensAccount, [], 'createdAt')]: lensAccount.createdAt,
									[entityFieldAddressKey(EntityType.LensAccount, [], 'displayName')]: lensAccount.displayName,
									[entityFieldAddressKey(EntityType.LensAccount, [], 'legacyProfileId')]: lensAccount.legacyProfileId,
									[entityFieldAddressKey(EntityType.LensAccount, [], 'localName')]: lensAccount.localName,
								},
							}
						})
					},
				},
			},
		})({
				$$lensAccounts: (accounts) => accounts,
			}),

		defineResolver({
			entityType: EntityType.LensNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const limit = resolverContextRowLimit(context)
						return (await queryFeeds(limit)).feeds.items.flatMap((feed) => {
							const address = lensEvmAddressFromWire(feed.address)
							const owner = lensEvmAddressFromWire(feed.owner)
							const name = optionalNonemptyString(feed.metadata?.name)
							const description = optionalNonemptyString(feed.metadata?.description)
							const createdAt = optionalTimestampMs(feed.createdAt)
							const rules = lensRulesWithoutConfigurationFromWire(feed.rules)
							return [{
								[EntityMetaKey.Selector]: { address },
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.LensFeed, [], 'address')]: address,
									[entityFieldAddressKey(EntityType.LensFeed, [], 'owner')]: owner,
									[entityFieldAddressKey(EntityType.LensFeed, [], '$owner')]: {
										[EntityMetaKey.Selector]: { address: owner },
									},
									...(name != null && {
										[entityFieldAddressKey(EntityType.LensFeed, [], 'name')]: name,
									}),
									...(description != null && {
										[entityFieldAddressKey(EntityType.LensFeed, [], 'description')]: description,
									}),
									...(createdAt != null && {
										[entityFieldAddressKey(EntityType.LensFeed, [], 'createdAt')]: createdAt,
									}),
									...(rules != null && {
										[entityFieldAddressKey(EntityType.LensFeed, [], 'rules')]: rules,
									}),
								},
							}]
						}).slice(0, limit)
					},
				},
			},
		})({
				$$feeds: (feeds) => feeds,
			}),

		defineResolver({
			entityType: EntityType.LensNetwork,
			resolve: {
				Scope: {
					resolve: async (_entitySelector, context) => {
						const limit = resolverContextRowLimit(context)
						return (await queryNamespaces(limit)).namespaces.items.flatMap((namespace) => {
							const resolved = lensUsernameNamespaceFromWire(namespace)
							return [{
								[EntityMetaKey.Selector]: { address: resolved.address },
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.LensUsernameNamespace, [], 'address')]: resolved.address,
										[entityFieldAddressKey(EntityType.LensUsernameNamespace, [], 'namespace')]: resolved.namespace,
										[entityFieldAddressKey(EntityType.LensUsernameNamespace, [], 'owner')]: resolved.owner,
										[entityFieldAddressKey(EntityType.LensUsernameNamespace, [], '$owner')]: resolved.$owner,
									...(resolved.tokenName != null && {
										[entityFieldAddressKey(EntityType.LensUsernameNamespace, [], 'tokenName')]: resolved.tokenName,
									}),
									...(resolved.tokenSymbol != null && {
										[entityFieldAddressKey(EntityType.LensUsernameNamespace, [], 'tokenSymbol')]: resolved.tokenSymbol,
									}),
									...(resolved.createdAt != null && {
										[entityFieldAddressKey(EntityType.LensUsernameNamespace, [], 'createdAt')]: resolved.createdAt,
									}),
									...(resolved.description != null && {
										[entityFieldAddressKey(EntityType.LensUsernameNamespace, [], 'description')]: resolved.description,
									}),
										[entityFieldAddressKey(EntityType.LensUsernameNamespace, [], 'totalUsernames')]: resolved.totalUsernames,
									...(resolved.rules != null && {
										[entityFieldAddressKey(EntityType.LensUsernameNamespace, [], 'rules')]: resolved.rules,
									}),
								},
							}]
						}).slice(0, limit)
					},
				},
			},
		})({
				$$usernameNamespaces: (namespaces) => namespaces,
			}),

		defineResolver({
			entityType: EntityType.LensFeed,
			resolve: {
				Address: {
					resolve: async ({ address }) => {
						const feed = (await queryFeed(zeroExLowerCase(address))).feed
						if (feed == null) throw new Error('Lens_Graphql: feed not found')
						if (lensEvmAddressFromWire(feed.address) !== zeroExLowerCase(address))
							throw new Error('Lens_Graphql: feed response does not match request')
						const owner = lensEvmAddressFromWire(feed.owner)
						return {
							address: lensEvmAddressFromWire(feed.address),
							owner,
							$owner: {
								[EntityMetaKey.Selector]: {
									address: owner,
								},
							},
							...((name) => name != null && { name })(optionalNonemptyString(feed.metadata?.name)),
							...((description) => description != null && { description })(optionalNonemptyString(feed.metadata?.description)),
							...((createdAt) => createdAt != null && { createdAt })(optionalTimestampMs(feed.createdAt)),
							...((rules) => rules != null && { rules })(lensRulesWithoutConfigurationFromWire(feed.rules)),
						}
					},
				},
			},
		})({
				address: (feed) => feed.address,
				owner: (feed) => feed.owner,
				$owner: (feed) => feed.$owner,
				name: (feed) => feed.name,
				description: (feed) => feed.description,
				createdAt: (feed) => feed.createdAt,
				rules: (feed) => feed.rules,
			}),

		defineResolver({
			entityType: EntityType.LensFeed,
			resolve: {
				Address: {
					resolve: async ({ address }, context) => {
						return (await queryFeedPosts(
							zeroExLowerCase(address),
							resolverContextRowLimit(context)
						)).posts.items.flatMap((lensPost) => {
							if (
								lensPost.__typename !== 'Post'
								|| lensEvmAddressFromWire(lensPost.feed.address) !== zeroExLowerCase(address)
							)
								return []
							const reference = lensPostCardReferenceFromWire(lensPost)
							return reference == null ? [] : [reference]
						})
					},
				},
			},
		})({
			$$posts: (posts) => posts,
		}),

		defineResolver({
			entityType: EntityType.LensUsername,
			resolve: {
				Id: {
					resolve: async ({ id }) => {
						if (id.trim() === '')
							throw new Error('Lens_Graphql: username identity must not be empty')

						const username = (await queryUsername({ id })).username
						if (username == null) throw new Error('Lens_Graphql: username not found')
						if (username.id !== id)
							throw new Error('Lens_Graphql: username response does not match request')
						return lensUsernameFromWire(username)
					},
				},
				NamespaceLocalName: {
					resolve: async ({ namespace, localName }) => {
						if (localName.trim() === '')
							throw new Error('Lens_Graphql: username identity must not be empty')

						const requestedNamespace = zeroExLowerCase(namespace)
						const username = (await queryUsername({
							username: {
								namespace: requestedNamespace,
								localName,
							},
						})).username
						if (username == null) throw new Error('Lens_Graphql: username not found')
						if (
							lensEvmAddressFromWire(username.namespace) !== requestedNamespace
							|| username.localName !== localName
						)
							throw new Error('Lens_Graphql: username response does not match request')
						return lensUsernameFromWire(username)
					},
				},
			},
		})({
				id: (username) => username.id,
				namespace: (username) => username.namespace,
				localName: (username) => username.localName,
				value: (username) => username.value,
				ownedBy: (username) => username.ownedBy,
				linkedTo: (username) => username.linkedTo,
				timestamp: (username) => username.timestamp,
				$namespace: (username) => username.$namespace,
				$account: (username) => username.$account,
				$owner: (username) => username.$owner,
			}),

		defineResolver({
			entityType: EntityType.LensUsernameNamespace,
			resolve: {
				Address: {
					resolve: async ({ address }) => {
						const namespace = (await queryNamespace(zeroExLowerCase(address))).namespace
						if (namespace == null) throw new Error('Lens_Graphql: namespace not found')
						if (lensEvmAddressFromWire(namespace.address) !== zeroExLowerCase(address))
							throw new Error('Lens_Graphql: namespace response does not match request')
						return lensUsernameNamespaceFromWire(namespace)
					},
				},
			},
		})({
				address: (namespace) => namespace.address,
				namespace: (namespace) => namespace.namespace,
				owner: (namespace) => namespace.owner,
				$owner: (namespace) => namespace.$owner,
				tokenName: (namespace) => namespace.tokenName,
				tokenSymbol: (namespace) => namespace.tokenSymbol,
				createdAt: (namespace) => namespace.createdAt,
				description: (namespace) => namespace.description,
				totalUsernames: (namespace) => namespace.totalUsernames,
				rules: (namespace) => namespace.rules,
			}),

		defineResolver({
			entityType: EntityType.LensUsernameNamespace,
			resolve: {
				Address: {
					resolve: async ({ address }, context) => {
						const limit = resolverContextRowLimit(context)
						const requestedNamespace = zeroExLowerCase(address)
						return (await queryUsernames(limit, {
							namespace: requestedNamespace,
						})).usernames.items.flatMap((username) => {
							if (lensEvmAddressFromWire(username.namespace) !== requestedNamespace)
								return []
							return [lensUsernameReferenceFromWire(username)]
						}).slice(0, limit)
					},
				},
			},
		})({
				$$usernames: (usernames) => usernames,
			}),
	] as const,
} satisfies RegisteredSourceResolverModule

export default lensGraphqlResolvers

import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { with0xHex, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { optionalTimestampMs } from '$/lib/time.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { LensAccountSelector } from '$/schema/LensAccount.ts'
import { LensPostSelector } from '$/schema/LensPost.ts'
import { LensAccount_TimestampSelector } from '$/schema/LensAccount_Timestamp.ts'
import { LensPost_TimestampSelector } from '$/schema/LensPost_Timestamp.ts'


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

const lensAccountTimestampFieldsFromWire = (
	wire: {
		accountStats?: {
			graphFollowStats: {
				followers?: number | null
				following?: number | null
			}
		}
	}
) => ({
	...(wire.accountStats?.graphFollowStats.followers != null && {
		followerCount: wire.accountStats.graphFollowStats.followers,
	}),
	...(wire.accountStats?.graphFollowStats.following != null && {
		followingCount: wire.accountStats.graphFollowStats.following,
	}),
})

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

const lensGraphqlResolvers = {
	source: Source.Lens_Graphql,

	resolvers: [
		defineResolver(Source.Lens_Graphql, {
			entityType: EntityType.LensAccount,
			resolve: {
				[LensAccountSelector.Address]: async ({ address }, context) => {
					const { queryAccount } = await import('$/sources/Lens/Graphql/queries.ts')
					const wire = await queryAccount(
						context.publicEnv,
						{
							address: zeroExLowerCase(address),
						}
					)
					const a = wire.account
					if (a == null) throw new Error('Lens_Graphql: account not found')
					const createdAt = optionalTimestampMs(String(a.createdAt))
					const localName = optionalNonemptyString(a.username?.localName)
					const displayName = optionalNonemptyString(a.metadata?.name)
					const bio = optionalNonemptyString(a.metadata?.bio)
					const pictureUrl = optionalNonemptyString(a.metadata?.picture != null ? String(a.metadata.picture) : null)
					const iconMedia = mediaFromUrl(pictureUrl, MediaType.Image)
					return {
						address: lensEvmAddressFromWire(a.address),
						...(localName != null && { localName }),
						...(displayName != null && { displayName }),
						...(bio != null && { bio }),
						...(createdAt != null && { createdAt }),
						...(pictureUrl != null && { iconUrl: pictureUrl }),
						...(iconMedia != null && { $icon: iconMedia }),
					}
				},
				[LensAccountSelector.LocalName]: async ({ localName: selectedLocalName }, context) => {
					const { queryAccount } = await import('$/sources/Lens/Graphql/queries.ts')
					const wire = await queryAccount(
						context.publicEnv,
						{
							localName: selectedLocalName,
						}
					)
					const a = wire.account
					if (a == null) throw new Error('Lens_Graphql: account not found')
					const createdAt = optionalTimestampMs(String(a.createdAt))
					const localName = optionalNonemptyString(a.username?.localName)
					const displayName = optionalNonemptyString(a.metadata?.name)
					const bio = optionalNonemptyString(a.metadata?.bio)
					const pictureUrl = optionalNonemptyString(a.metadata?.picture != null ? String(a.metadata.picture) : null)
					const iconMedia = mediaFromUrl(pictureUrl, MediaType.Image)
					return {
						address: lensEvmAddressFromWire(a.address),
						localName: localName ?? selectedLocalName,
						...(displayName != null && { displayName }),
						...(bio != null && { bio }),
						...(createdAt != null && { createdAt }),
						...(pictureUrl != null && { iconUrl: pictureUrl }),
						...(iconMedia != null && { $icon: iconMedia }),
					}
				},
				[LensAccountSelector.LegacyProfileId]: async ({ legacyProfileId }, context) => {
					const { queryAccount } = await import('$/sources/Lens/Graphql/queries.ts')
					const wire = await queryAccount(
						context.publicEnv,
						{
							legacyProfileId,
						}
					)
					const a = wire.account
					if (a == null) throw new Error('Lens_Graphql: account not found')
					const createdAt = optionalTimestampMs(String(a.createdAt))
					const localName = optionalNonemptyString(a.username?.localName)
					const displayName = optionalNonemptyString(a.metadata?.name)
					const bio = optionalNonemptyString(a.metadata?.bio)
					const pictureUrl = optionalNonemptyString(a.metadata?.picture != null ? String(a.metadata.picture) : null)
					const iconMedia = mediaFromUrl(pictureUrl, MediaType.Image)
					return {
						address: lensEvmAddressFromWire(a.address),
						legacyProfileId,
						...(localName != null && { localName }),
						...(displayName != null && { displayName }),
						...(bio != null && { bio }),
						...(createdAt != null && { createdAt }),
						...(pictureUrl != null && { iconUrl: pictureUrl }),
						...(iconMedia != null && { $icon: iconMedia }),
					}
				},
			},
		})({
			fields: {
				address: (account) => account.address,
				displayName: (account) => account.displayName,
				bio: (account) => account.bio,
				createdAt: (account) => account.createdAt,
				iconUrl: (account) => account.iconUrl,
				$icon: (account) => account.$icon,
			},
		}),

		defineResolver(Source.Lens_Graphql, {
			entityType: EntityType.LensPost,
			resolve: {
				[LensPostSelector.Id]: async ({ id }, context) => {
					const { queryPost } = await import('$/sources/Lens/Graphql/queries.ts')
					const p = (await queryPost(context.publicEnv, id)).post
					if (p == null) throw new Error('Lens_Graphql: post not found')

					if (p.__typename === 'Repost') {
						const timestamp = optionalTimestampMs(String(p.timestamp))
						return {
							text: undefined,
							...(timestamp != null && { timestamp }),
							isEdited: undefined,
							isDeleted: p.isDeleted,
							$commentOn: undefined,
							$quoteOf: undefined,
							$root: undefined,
							$author: {
								[EntityMetaKey.Selector]: {
									address: lensEvmAddressFromWire(p.author.address),
								},
							},
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
					}
				}
			},
		})({
			fields: {
				text: (post) => post.text,
				timestamp: (post) => post.timestamp,
				isEdited: (post) => post.isEdited,
				isDeleted: (post) => post.isDeleted,
				$commentOn: (post) => post.$commentOn,
				$quoteOf: (post) => post.$quoteOf,
				$repostOf: (post) => post.$repostOf,
				$root: (post) => post.$root,
				$author: (post) => post.$author,
			},
		}),

		defineResolver(Source.Lens_Graphql, {
			entityType: EntityType.LensAccount_Timestamp,
			resolve: {
				[LensAccount_TimestampSelector.LensAccountTimestampMs]: async ({ $account }, context) => {
					const { queryAccount } = await import('$/sources/Lens/Graphql/queries.ts')
					const wire = await queryAccount(context.publicEnv, $account)
					if (wire.account == null) throw new Error('Lens_Graphql: account not found')
					return lensAccountTimestampFieldsFromWire(wire)
				}
			},
		})({
			fields: {
				followerCount: (timestamp) => timestamp.followerCount,
				followingCount: (timestamp) => timestamp.followingCount,
			},
		}),

		defineResolver(Source.Lens_Graphql, {
			entityType: EntityType.LensPost_Timestamp,
			resolve: {
				[LensPost_TimestampSelector.LensPostTimestampMs]: async ({ $post }, context) => {
					const { queryPost } = await import('$/sources/Lens/Graphql/queries.ts')
					const p = (await queryPost(context.publicEnv, $post.id)).post
					if (p == null) throw new Error('Lens_Graphql: post not found')
					if (p.__typename !== 'Post') return {}
					return lensPostTimestampFieldsFromWire(p)
				}
			},
		})({
			fields: {
				commentCount: (timestamp) => timestamp.commentCount,
				repostCount: (timestamp) => timestamp.repostCount,
				quoteCount: (timestamp) => timestamp.quoteCount,
				bookmarkCount: (timestamp) => timestamp.bookmarkCount,
				collectCount: (timestamp) => timestamp.collectCount,
				reactionCount: (timestamp) => timestamp.reactionCount,
			},
		}),

		defineResolver(Source.Lens_Graphql, {
			entityType: EntityType.LensPost,
			resolve: {
				[LensPostSelector.Id]: async (entitySelector, context) => {
					const { queryPost } = await import('$/sources/Lens/Graphql/queries.ts')
					const p = (await queryPost(context.publicEnv, entitySelector.id)).post
					if (p == null) throw new Error('Lens_Graphql: post not found')
					return [
						{
							[EntityMetaKey.Selector]: {
								$post: entitySelector,
								timestampMs: Date.now(),
							},
							...(p.__typename === 'Post' && lensPostTimestampFieldsFromWire(p)),
						},
					]
				}
			},
		})({
			fields: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver(Source.Lens_Graphql, {
			entityType: EntityType.LensPost,
			resolve: {
				[LensPostSelector.Id]: async ({ id }, context) => {
					const { queryPostComments } = await import('$/sources/Lens/Graphql/queries.ts')
					const limit = resolverContextRowLimit(context)
					const pageSize: 'TEN' | 'FIFTY' = limit > 10 ? 'FIFTY' : 'TEN'
					return (
						((await queryPostComments(context.publicEnv, id, pageSize)).postReferences.items )
							.flatMap((lensPost) => (
							((postSlug) => (
								postSlug != null ?
									[
										{
											[EntityMetaKey.Selector]: { id: postSlug },
										},
									]
								:
									[]
							))(lensAnyPostSlugFromWire(lensPost))
							))
					)
				}
			},
		})({
			fields: {
				$$comments: (comments) => comments,
			},
		}),

		defineResolver(Source.Lens_Graphql, {
			entityType: EntityType.LensAccount,
			resolve: {
				[LensAccountSelector.Address]: async ({ address }, context) => {
					const { queryAccount } = await import('$/sources/Lens/Graphql/queries.ts')
					const wire = await queryAccount(
						context.publicEnv,
						{
							address: zeroExLowerCase(address),
						}
					)
					if (wire.account == null) throw new Error('Lens_Graphql: account not found')
					return [
						{
							[EntityMetaKey.Selector]: {
								$account: {
									address: lensEvmAddressFromWire(wire.account.address),
								},
								timestampMs: Date.now(),
							},
							...lensAccountTimestampFieldsFromWire(wire),
						},
					]
				},
				[LensAccountSelector.LocalName]: async ({ localName: selectedLocalName }, context) => {
					const { queryAccount } = await import('$/sources/Lens/Graphql/queries.ts')
					const wire = await queryAccount(
						context.publicEnv,
						{
							localName: selectedLocalName,
						}
					)
					if (wire.account == null) throw new Error('Lens_Graphql: account not found')
					return [
						{
							[EntityMetaKey.Selector]: {
								$account: {
									address: lensEvmAddressFromWire(wire.account.address),
								},
								timestampMs: Date.now(),
							},
							...lensAccountTimestampFieldsFromWire(wire),
						},
					]
				},
				[LensAccountSelector.LegacyProfileId]: async ({ legacyProfileId }, context) => {
					const { queryAccount } = await import('$/sources/Lens/Graphql/queries.ts')
					const wire = await queryAccount(
						context.publicEnv,
						{
							legacyProfileId,
						}
					)
					if (wire.account == null) throw new Error('Lens_Graphql: account not found')
					return [
						{
							[EntityMetaKey.Selector]: {
								$account: {
									address: lensEvmAddressFromWire(wire.account.address),
								},
								timestampMs: Date.now(),
							},
							...lensAccountTimestampFieldsFromWire(wire),
						},
					]
				},
			},
		})({
			fields: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver(Source.Lens_Graphql, {
			entityType: EntityType.LensAccount,
			resolve: {
				[LensAccountSelector.Address]: async ({ address }, context) => {
					const { queryPostsByAuthor } = await import('$/sources/Lens/Graphql/queries.ts')
					const limit = resolverContextRowLimit(context)
					const pageSize: 'TEN' | 'FIFTY' = limit > 10 ? 'FIFTY' : 'TEN'
					return (
						((await queryPostsByAuthor(context.publicEnv, zeroExLowerCase(address), pageSize)).posts.items )
							.flatMap((lensPost) => (
							((postSlug) => (
								postSlug != null ?
									[
										{
											[EntityMetaKey.Selector]: { id: postSlug },
										},
									]
								:
									[]
							))(lensAnyPostSlugFromWire(lensPost))
							))
					)
				}
			},
		})({
			fields: {
				$$posts: (posts) => posts,
			},
		}),
	],
}

export default lensGraphqlResolvers

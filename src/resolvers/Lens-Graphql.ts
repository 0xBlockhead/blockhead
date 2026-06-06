import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { with0xHex, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import { optionalNonemptyString } from '$/lib/string.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { optionalTimestampMs } from '$/lib/time.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'


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
		| undefined,
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
		| undefined,
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
	},
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
	},
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

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.LensAccount,
			resolve: async (entityId, context) => {
				const { queryAccount } = await import('$/sources/Lens/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_Graphql)
				const wire = await singleFlight(queryAccount)(
					publicEnv,
					'address' in entityId ?
						{
							address: zeroExLowerCase(entityId.address),
						}
					:
						entityId,
				)
				const a = wire.account
				if (a == null) throw new Error('Lens_Graphql: account not found')
				const createdAt = optionalTimestampMs(String(a.createdAt))
				const localName = optionalNonemptyString(a.username?.localName)
				const displayName = optionalNonemptyString(a.metadata?.name)
				const bio = optionalNonemptyString(a.metadata?.bio)
				const pictureUrl = optionalNonemptyString(a.metadata?.picture != null ? String(a.metadata.picture) : null)
				return {
					address: lensEvmAddressFromWire(a.address),
					...(localName != null && { localName }),
					...(displayName != null && { displayName }),
					...(bio != null && { bio }),
					...(createdAt != null && { createdAt }),
					...lensAccountTimestampFieldsFromWire(wire),
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(pictureUrl, MediaType.Image)),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.LensPost,
			resolve: async (entityId, context) => {
				const { queryPost } = await import('$/sources/Lens/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_Graphql)
				const p = (await singleFlight(queryPost)(publicEnv, entityId.id)).post
				if (p == null) throw new Error('Lens_Graphql: post not found')

				if (p.__typename === 'Repost') {
					const timestamp = optionalTimestampMs(String(p.timestamp))
					return {
						...(timestamp != null && { timestamp }),
						isDeleted: p.isDeleted,
						$author: {
							[EntityMetaKey.Id]: {
								address: lensEvmAddressFromWire(p.author.address),
							},
						},
						...((postSlug) => (
							postSlug != null && {
								$repostOf: { [EntityMetaKey.Id]: { id: postSlug } },
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
					...lensPostTimestampFieldsFromWire(p),
					...((postSlug) => (
						postSlug != null && {
							$commentOn: { [EntityMetaKey.Id]: { id: postSlug } },
						}
					))(optionalNonemptyString(p.commentOn?.slug != null ?
							String(p.commentOn.slug)
						:
							null)),
					...((postSlug) => (
						postSlug != null && {
							$quoteOf: { [EntityMetaKey.Id]: { id: postSlug } },
						}
					))(optionalNonemptyString(
						p.quoteOf?.slug != null ?
							String(p.quoteOf.slug)
						:
							null,
					)),
					...((postSlug) => (
						postSlug != null && {
							$root: { [EntityMetaKey.Id]: { id: postSlug } },
						}
					))(optionalNonemptyString(
						p.root?.slug != null ?
							String(p.root.slug)
						:
							null,
					)),
					$author: {
						[EntityMetaKey.Id]: {
							address: lensEvmAddressFromWire(p.author.address),
							},
					},
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.LensAccount_Timestamp,
			resolve: async (entityId, context) => {
				const { queryAccount } = await import('$/sources/Lens/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_Graphql)
				if (!('address' in entityId.$account))
					throw new Error('Lens_Graphql: LensAccount_Timestamp lookup id is unsupported')

				const wire = await singleFlight(queryAccount)(publicEnv, { address: zeroExLowerCase(entityId.$account.address) })
				if (wire.account == null) throw new Error('Lens_Graphql: account not found')
				return lensAccountTimestampFieldsFromWire(wire)
			},
		}),

		defineEntityResolver({
			entityType: EntityType.LensPost_Timestamp,
			resolve: async (entityId, context) => {
				const { queryPost } = await import('$/sources/Lens/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_Graphql)
				const p = (await singleFlight(queryPost)(publicEnv, entityId.$post.id)).post
				if (p == null) throw new Error('Lens_Graphql: post not found')
				if (p.__typename !== 'Post') return {}
				return lensPostTimestampFieldsFromWire(p)
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.LensNetwork,
			fieldName: '$$lensAccounts',
			resolve: async (_entityId, context) => {
				const { queryLatestPosts } = await import('$/sources/Lens/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_Graphql)
				const limit = resolverLoadSubsetRowLimit(context)
				const pageSize: 'TEN' | 'FIFTY' = limit > 10 ? 'FIFTY' : 'TEN'
				return (
					((await singleFlight(queryLatestPosts)(publicEnv, pageSize)).posts.items )
						.flatMap((lensPost) => {
							const address = lensPost.author.address
							if (!/^0x[a-fA-F0-9]{40}$/.test(String(address))) return []
							const normalizedAddress = lensEvmAddressFromWire(address)
							return [{
								[EntityMetaKey.Id]: { address: normalizedAddress },
							}]
						})
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.LensNetwork,
			fieldName: '$$lensPosts',
			resolve: async (_entityId, context) => {
				const { queryLatestPosts } = await import('$/sources/Lens/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_Graphql)
				const limit = resolverLoadSubsetRowLimit(context)
				const pageSize: 'TEN' | 'FIFTY' = limit > 10 ? 'FIFTY' : 'TEN'
				return (
					((await singleFlight(queryLatestPosts)(publicEnv, pageSize)).posts.items )
						.flatMap((lensPost) => (
							((postSlug) => (
								postSlug != null ?
									[
										{
											[EntityMetaKey.Id]: { id: postSlug },
										},
									]
								:
									[]
							))(lensAnyPostSlugFromWire(lensPost))
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.LensPost,
			fieldName: '$$timestamps',
			resolve: async (entityId, context) => {
				const { queryPost } = await import('$/sources/Lens/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_Graphql)
				const p = (await singleFlight(queryPost)(publicEnv, entityId.id)).post
				if (p == null) throw new Error('Lens_Graphql: post not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$post: entityId,
							timestampMs: Date.now(),
						},
						...(p.__typename === 'Post' && lensPostTimestampFieldsFromWire(p)),
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.LensPost,
			fieldName: '$$comments',
			resolve: async (entityId, context) => {
				const { queryPostComments } = await import('$/sources/Lens/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_Graphql)
				const limit = resolverLoadSubsetRowLimit(context)
				const pageSize: 'TEN' | 'FIFTY' = limit > 10 ? 'FIFTY' : 'TEN'
				return (
					((await singleFlight(queryPostComments)(publicEnv, entityId.id, pageSize)).postReferences.items )
						.flatMap((lensPost) => (
							((postSlug) => (
								postSlug != null ?
									[
										{
											[EntityMetaKey.Id]: { id: postSlug },
										},
									]
								:
									[]
							))(lensAnyPostSlugFromWire(lensPost))
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.LensAccount,
			fieldName: '$$timestamps',
			resolve: async (entityId, context) => {
				const { queryAccount } = await import('$/sources/Lens/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_Graphql)
				const wire = await singleFlight(queryAccount)(
					publicEnv,
					'address' in entityId ?
						{
							address: zeroExLowerCase(entityId.address),
						}
					:
						entityId,
				)
				if (wire.account == null) throw new Error('Lens_Graphql: account not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$account: {
								address: lensEvmAddressFromWire(wire.account.address),
							},
							timestampMs: Date.now(),
						},
						...lensAccountTimestampFieldsFromWire(wire),
					},
				]
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.LensAccount,
			fieldName: '$$posts',
			resolve: async (entityId, context) => {
				const { queryPostsByAuthor } = await import('$/sources/Lens/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_Graphql)
				if (!('address' in entityId))
					throw new Error('Lens_Graphql: LensAccount.$$posts lookup id is unsupported')

				const limit = resolverLoadSubsetRowLimit(context)
				const pageSize: 'TEN' | 'FIFTY' = limit > 10 ? 'FIFTY' : 'TEN'
				return (
					((await singleFlight(queryPostsByAuthor)(publicEnv, zeroExLowerCase(entityId.address), pageSize)).posts.items )
						.flatMap((lensPost) => (
							((postSlug) => (
								postSlug != null ?
									[
										{
											[EntityMetaKey.Id]: { id: postSlug },
										},
									]
								:
									[]
							))(lensAnyPostSlugFromWire(lensPost))
						))
				)
			},
		}),
	],
}

export default lensGraphqlResolvers

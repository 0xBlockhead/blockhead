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

const lensGraphqlResolvers = {
	source: Source.Lens_Graphql,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.LensAccount,
			resolve: async (entityId, context) => {
				const { queryAccount } = await import('$/sources/Lens/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_Graphql)
				const wire = await singleFlight(queryAccount)(publicEnv, zeroExLowerCase(entityId.address))
				const a = wire.account
				if (a == null) throw new Error('Lens_Graphql: account not found')
				const createdAt = optionalTimestampMs(String(a.createdAt))
				const localName = optionalNonemptyString(a.username?.localName)
				const displayName = optionalNonemptyString(a.metadata?.name)
				const bio = optionalNonemptyString(a.metadata?.bio)
				const pictureUrl = optionalNonemptyString(a.metadata?.picture != null ? String(a.metadata.picture) : null)
				return {
					...(localName != null && { localName }),
					...(displayName != null && { displayName }),
					...(bio != null && { bio }),
					...(createdAt != null && { createdAt }),
					...(wire.accountStats?.graphFollowStats?.followers != null && {
						followerCount: wire.accountStats.graphFollowStats.followers,
					}),
					...(wire.accountStats?.graphFollowStats?.following != null && {
						followingCount: wire.accountStats.graphFollowStats.following,
					}),
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
					if (p.author.address == null) throw new Error('Lens_Graphql: post author address missing')
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

				if (p.author.address == null) throw new Error('Lens_Graphql: post author address missing')
				const text = lensMetadataTextFromWire(p.metadata)
				const timestamp = optionalTimestampMs(String(p.timestamp))
				return {
					...(text != null && { text }),
					...(timestamp != null && { timestamp }),
					isEdited: p.isEdited,
					isDeleted: p.isDeleted,
					...(p.__typename === 'Post' && p.stats?.comments != null && {
						commentCount: p.stats.comments,
					}),
					...(p.__typename === 'Post' && p.stats?.reposts != null && {
						repostCount: p.stats.reposts,
					}),
					...(p.__typename === 'Post' && p.stats?.quotes != null && {
						quoteCount: p.stats.quotes,
					}),
					...(p.__typename === 'Post' && p.stats?.bookmarks != null && {
						bookmarkCount: p.stats.bookmarks,
					}),
					...(p.__typename === 'Post' && p.stats?.collects != null && {
						collectCount: p.stats.collects,
					}),
					...(p.__typename === 'Post' && p.stats?.reactions != null && {
						reactionCount: p.stats.reactions,
					}),
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
				const wire = await singleFlight(queryAccount)(publicEnv, zeroExLowerCase(entityId.$account.address))
				if (wire.account == null) throw new Error('Lens_Graphql: account not found')
				return {
					...(wire.accountStats?.graphFollowStats?.followers != null && {
						followerCount: wire.accountStats.graphFollowStats.followers,
					}),
					...(wire.accountStats?.graphFollowStats?.following != null && {
						followingCount: wire.accountStats.graphFollowStats.following,
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.LensPost_Timestamp,
			resolve: async (entityId, context) => {
				const { queryPost } = await import('$/sources/Lens/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_Graphql)
				const p = (await singleFlight(queryPost)(publicEnv, entityId.$post.id)).post
				if (p == null) throw new Error('Lens_Graphql: post not found')
				return {
					...(p.__typename === 'Post' && p.stats?.comments != null && {
						commentCount: p.stats.comments,
					}),
					...(p.__typename === 'Post' && p.stats?.reposts != null && {
						repostCount: p.stats.reposts,
					}),
					...(p.__typename === 'Post' && p.stats?.quotes != null && {
						quoteCount: p.stats.quotes,
					}),
					...(p.__typename === 'Post' && p.stats?.bookmarks != null && {
						bookmarkCount: p.stats.bookmarks,
					}),
					...(p.__typename === 'Post' && p.stats?.collects != null && {
						collectCount: p.stats.collects,
					}),
					...(p.__typename === 'Post' && p.stats?.reactions != null && {
						reactionCount: p.stats.reactions,
					}),
				}
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
						...(p.__typename === 'Post' && p.stats?.comments != null && {
							commentCount: p.stats.comments,
						}),
						...(p.__typename === 'Post' && p.stats?.reposts != null && {
							repostCount: p.stats.reposts,
						}),
						...(p.__typename === 'Post' && p.stats?.quotes != null && {
							quoteCount: p.stats.quotes,
						}),
						...(p.__typename === 'Post' && p.stats?.bookmarks != null && {
							bookmarkCount: p.stats.bookmarks,
						}),
						...(p.__typename === 'Post' && p.stats?.collects != null && {
							collectCount: p.stats.collects,
						}),
						...(p.__typename === 'Post' && p.stats?.reactions != null && {
							reactionCount: p.stats.reactions,
						}),
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
				const wire = await singleFlight(queryAccount)(publicEnv, zeroExLowerCase(entityId.address))
				if (wire.account == null) throw new Error('Lens_Graphql: account not found')
				return [
					{
						[EntityMetaKey.Id]: {
							$account: entityId,
							timestampMs: Date.now(),
						},
						...(wire.accountStats?.graphFollowStats?.followers != null && {
							followerCount: wire.accountStats.graphFollowStats.followers,
						}),
						...(wire.accountStats?.graphFollowStats?.following != null && {
							followingCount: wire.accountStats.graphFollowStats.following,
						}),
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

export const lensHeyGraphqlResolvers = lensGraphqlResolvers

export default lensGraphqlResolvers

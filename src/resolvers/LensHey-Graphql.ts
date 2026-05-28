import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { with0xHex, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'


const optionalTrimmedString = (value: string | undefined | null) => (
	value?.trim() || undefined
)

const optionalFiniteNumber = (value: number | undefined) => (
	value != null && Number.isFinite(value) ? value : undefined
)

const lensTimestampMsFromWire = (timestamp: string | null | undefined) => (
	((parsedTimestampMs) => (
		Number.isFinite(parsedTimestampMs) ? parsedTimestampMs : undefined
	))(timestamp != null ? Date.parse(String(timestamp)) : NaN)
)


/** Lens / subgraph wire — may omit `0x` or use mixed case. */
const lensEvmAddressFromWire = (a: string): `0x${string}` => {
	const t = optionalTrimmedString(a)
	if (t == null) throw new Error('Lens_HeyGraphql: invalid EVM address')
	const n = with0xHex(t)
	if (!/^0x[0-9a-f]{40}$/.test(n)) throw new Error('Lens_HeyGraphql: invalid EVM address')
	return n
}

const lensAuthorRefFromWire = (
	address: unknown,
) => {
	if (address == null) throw new Error('Lens_HeyGraphql: post author address missing')
	return {
		[EntityMetaKey.Id]: {
			address: lensEvmAddressFromWire(String(address)),
		},
	}
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
		optionalTrimmedString(metadata?.content != null ? String(metadata.content) : null)
)

const lensAnyPostSlugFromWire = (
	item:
		| {
			__typename: string
			slug?: unknown
		}
		| null
		| undefined,
) => (
	item?.__typename === 'Post' || item?.__typename === 'Repost' ?
		optionalTrimmedString(item.slug != null ? String(item.slug) : null)
	:
		undefined
)

export default {
	source: Source.Lens_HeyGraphql,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.LensAccount,
			resolve: async (entityId, context) => {
				const { lensHeyQueryAccount } = await import('$/sources/LensHey/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_HeyGraphql)
				const wire = await singleFlight(lensHeyQueryAccount)(publicEnv, zeroExLowerCase(entityId.address))
				const a = wire.account
				if (a == null) throw new Error('Lens_HeyGraphql: account not found')
				return {
					localName: optionalTrimmedString(a.username?.localName),
					displayName: optionalTrimmedString(a.metadata?.name),
					bio: optionalTrimmedString(a.metadata?.bio),
					createdAt: lensTimestampMsFromWire(a.createdAt != null ? String(a.createdAt) : null),
					followerCount: optionalFiniteNumber(wire.accountStats?.graphFollowStats?.followers),
					followingCount: optionalFiniteNumber(wire.accountStats?.graphFollowStats?.following),
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(mediaFromUrl(optionalTrimmedString(a.metadata?.picture != null ? String(a.metadata.picture) : null), MediaType.Image)),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.LensPost,
			resolve: async (entityId, context) => {
				const { lensHeyQueryPost } = await import('$/sources/LensHey/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_HeyGraphql)
				const p = (await singleFlight(lensHeyQueryPost)(publicEnv, entityId.id)).post
				if (p == null) throw new Error('Lens_HeyGraphql: post not found')

				if (p.__typename === 'Repost') {
					return {
						timestamp: lensTimestampMsFromWire(p.timestamp != null ? String(p.timestamp) : null),
						isDeleted: p.isDeleted,
						$author: lensAuthorRefFromWire(p.author?.address),
						...((postSlug) => (
							postSlug != null && {
								$repostOf: { [EntityMetaKey.Id]: { id: postSlug } },
							}
						))(optionalTrimmedString(p.repostOf?.slug != null ? String(p.repostOf.slug) : null)),
					}
				}

				if (p.__typename !== 'Post') throw new Error('Lens_HeyGraphql: unsupported post type')

				return {
					text: lensMetadataTextFromWire(p.metadata),
					timestamp: lensTimestampMsFromWire(p.timestamp != null ? String(p.timestamp) : null),
					isEdited: p.isEdited,
					isDeleted: p.isDeleted,
					commentCount: optionalFiniteNumber(p.stats?.comments),
					repostCount: optionalFiniteNumber(p.stats?.reposts),
					quoteCount: optionalFiniteNumber(p.stats?.quotes),
					bookmarkCount: optionalFiniteNumber(p.stats?.bookmarks),
					collectCount: optionalFiniteNumber(p.stats?.collects),
					reactionCount: optionalFiniteNumber(p.stats?.reactions),
					...((postSlug) => (
						postSlug != null && {
							$commentOn: { [EntityMetaKey.Id]: { id: postSlug } },
						}
					))(optionalTrimmedString(p.commentOn?.slug != null ? String(p.commentOn.slug) : null)),
					...((postSlug) => (
						postSlug != null && {
							$quoteOf: { [EntityMetaKey.Id]: { id: postSlug } },
						}
					))(optionalTrimmedString(p.quoteOf?.slug != null ? String(p.quoteOf.slug) : null)),
					...((postSlug) => (
						postSlug != null && {
							$root: { [EntityMetaKey.Id]: { id: postSlug } },
						}
					))(optionalTrimmedString(p.root?.slug != null ? String(p.root.slug) : null)),
					$author: lensAuthorRefFromWire(p.author?.address),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.LensNetwork,
			fieldName: '$$lensAccounts',
			resolve: async (_entityId, context) => {
				const { lensHeyQueryLatestPosts } = await import('$/sources/LensHey/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_HeyGraphql)
				const limit = resolverLoadSubsetRowLimit(context)
				const pageSize: 'TEN' | 'FIFTY' = limit > 10 ? 'FIFTY' : 'TEN'
				return (
					((await singleFlight(lensHeyQueryLatestPosts)(publicEnv, pageSize)).posts?.items ?? [])
						.flatMap((item) => {
							const address = item.author?.address
							if (address == null || !/^0x[a-fA-F0-9]{40}$/.test(String(address))) return []
							const normalizedAddress = lensEvmAddressFromWire(String(address))
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
				const { lensHeyQueryLatestPosts } = await import('$/sources/LensHey/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_HeyGraphql)
				const limit = resolverLoadSubsetRowLimit(context)
				const pageSize: 'TEN' | 'FIFTY' = limit > 10 ? 'FIFTY' : 'TEN'
				return (
					((await singleFlight(lensHeyQueryLatestPosts)(publicEnv, pageSize)).posts?.items ?? [])
						.flatMap((item) => (
							((postSlug) => (
								postSlug != null ?
									[
										{
											[EntityMetaKey.Id]: { id: postSlug },
										},
									]
								:
									[]
							))(lensAnyPostSlugFromWire(item))
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.LensPost,
			fieldName: '$$comments',
			resolve: async (entityId, context) => {
				const { lensHeyQueryPostComments } = await import('$/sources/LensHey/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_HeyGraphql)
				const limit = resolverLoadSubsetRowLimit(context)
				const pageSize: 'TEN' | 'FIFTY' = limit > 10 ? 'FIFTY' : 'TEN'
				return (
					((await singleFlight(lensHeyQueryPostComments)(publicEnv, entityId.id, pageSize)).postReferences?.items ?? [])
						.flatMap((item) => (
							((postSlug) => (
								postSlug != null ?
									[
										{
											[EntityMetaKey.Id]: { id: postSlug },
										},
									]
								:
									[]
							))(lensAnyPostSlugFromWire(item))
						))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.LensAccount,
			fieldName: '$$posts',
			resolve: async (entityId, context) => {
				const { lensHeyQueryPostsByAuthor } = await import('$/sources/LensHey/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_HeyGraphql)
				const limit = resolverLoadSubsetRowLimit(context)
				const pageSize: 'TEN' | 'FIFTY' = limit > 10 ? 'FIFTY' : 'TEN'
				return (
					((await singleFlight(lensHeyQueryPostsByAuthor)(publicEnv, zeroExLowerCase(entityId.address), pageSize)).posts?.items ?? [])
						.flatMap((item) => (
							((postSlug) => (
								postSlug != null ?
									[
										{
											[EntityMetaKey.Id]: { id: postSlug },
										},
									]
								:
									[]
							))(lensAnyPostSlugFromWire(item))
						))
				)
			},
		}),
	],
}

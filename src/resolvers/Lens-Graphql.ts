import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { type Entity } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const trim = (value: string | undefined) => (
	value?.trim() ? value.trim() : undefined
)

const normalizeAddress = (a: string): `0x${string}` => {
	const t = trim(a)
	if (t == null || !/^0x[a-fA-F0-9]{40}$/.test(t)) throw new Error('Lens_Graphql: invalid EVM address')
	return `0x${t.slice(2).toLowerCase()}` as `0x${string}`
}

export default {
	source: Source.Lens_Graphql,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.LensAccount,
			resolve: async (entityId, context) => {
				const { lensQueryAccount } = await import('$/sources/Lens/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_Graphql)
				const a = (await singleFlight(lensQueryAccount)(publicEnv, normalizeAddress(entityId.address))).account
				if (a == null) throw new Error('Lens_Graphql: account not found')
				return {
					localName: trim(a.username?.localName),
				}
			},
		}),
		defineEntityResolver({
			entityType: EntityType.LensPost,
			resolve: async (entityId, context) => {
				const { lensQueryPost } = await import('$/sources/Lens/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_Graphql)
				const p = (await singleFlight(lensQueryPost)(publicEnv, entityId.id)).post
				if (p == null) throw new Error('Lens_Graphql: post not found')
				const addr = p.author?.address
				const ts = trim(p.timestamp)
				return {
					text: trim(p.metadata?.content),
					timestamp: ((parsedTimestampMs) => (
						Number.isFinite(parsedTimestampMs) ? parsedTimestampMs : undefined
					))(ts != null ? Date.parse(ts) : NaN),
					$author: (
						addr != null && /^0x[a-fA-F0-9]{40}$/.test(addr) ?
							(({
								[EntityMetaKey.Id]: { address: normalizeAddress(addr) },
							}) satisfies Entity<typeof schema, EntityType.LensAccount>)
						:	undefined
					),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.LensNetwork,
			fieldName: '$$lensAccounts',
			resolve: async (_entityId, context) => {
				const { lensQueryLatestPosts } = await import('$/sources/Lens/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_Graphql)
				const limit = resolverLoadSubsetRowLimit(context) ?? 25
				const pageSize: 'TEN' | 'FIFTY' = limit > 10 ? 'FIFTY' : 'TEN'
				const byAddress = new Map<string, Entity<typeof schema, EntityType.LensAccount>>()
				for (const item of ((await singleFlight(lensQueryLatestPosts)(publicEnv, pageSize)).posts?.items ?? [])) {
					const address = item.author?.address
					if (item.__typename !== 'Post' || address == null || !/^0x[a-fA-F0-9]{40}$/.test(address)) continue
					const normalizedAddress = normalizeAddress(address)
					byAddress.set(normalizedAddress, (({
						[EntityMetaKey.Id]: { address: normalizedAddress },
					}) satisfies Entity<typeof schema, EntityType.LensAccount>))
				}
				return [...byAddress.values()]
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.LensNetwork,
			fieldName: '$$lensPosts',
			resolve: async (_entityId, context) => {
				const { lensQueryLatestPosts } = await import('$/sources/Lens/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_Graphql)
				const limit = resolverLoadSubsetRowLimit(context) ?? 25
				const pageSize: 'TEN' | 'FIFTY' = limit > 10 ? 'FIFTY' : 'TEN'
				return (
					((await singleFlight(lensQueryLatestPosts)(publicEnv, pageSize)).posts?.items ?? [])
						.flatMap((item) => (
							item.__typename === 'Post' && item.slug != null ?
								[(({
										[EntityMetaKey.Id]: { id: item.slug },
									}) satisfies Entity<typeof schema, EntityType.LensPost>)]
							:	[]
						))
				)
			},
		}),
		defineEntityFieldResolver({
			entityType: EntityType.LensAccount,
			fieldName: '$$posts',
			resolve: async (entityId, context) => {
				const { lensQueryPostsByAuthor } = await import('$/sources/Lens/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_Graphql)
				const limit = resolverLoadSubsetRowLimit(context) ?? 10
				const pageSize: 'TEN' | 'FIFTY' = limit > 10 ? 'FIFTY' : 'TEN'
				const { posts } = await singleFlight(lensQueryPostsByAuthor)(publicEnv, normalizeAddress(entityId.address), pageSize)
				return (
					(posts?.items ?? [])
						.flatMap((item) => (
							item.__typename === 'Post' && item.slug != null ?
								[(({
										[EntityMetaKey.Id]: { id: item.slug },
									}) satisfies Entity<typeof schema, EntityType.LensPost>)]
							:	[]
						))
				)
			},
		}),
	],
}

import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
	sourcePublicEnv,
} from '$/resolvers/$resolvers.ts'
import { with0xHex, zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'


const optionalTrimmedString = (value: string | undefined) => (
	value?.trim() ? value.trim() : undefined
)

/** Lens / subgraph wire — may omit `0x` or use mixed case. */
const lensEvmAddressFromWire = (a: string): `0x${string}` => {
	const t = optionalTrimmedString(a)
	if (t == null) throw new Error('Lens_Graphql: invalid EVM address')
	const n = with0xHex(t)
	if (!/^0x[0-9a-f]{40}$/.test(n)) throw new Error('Lens_Graphql: invalid EVM address')
	return n
}

export default {
	source: Source.Lens_Graphql,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.LensAccount,
			resolve: async (entityId, context) => {
				const { lensQueryAccount } = await import('$/sources/Lens/Graphql/queries.ts')
				const publicEnv = sourcePublicEnv(context, Source.Lens_Graphql)
				const a = (await singleFlight(lensQueryAccount)(publicEnv, zeroExLowerCase(entityId.address))).account
				if (a == null) throw new Error('Lens_Graphql: account not found')
				return {
					localName: optionalTrimmedString(a.username?.localName),
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
				return {
					text: optionalTrimmedString(p.metadata?.content),
					timestamp: ((ts) => (
						((_parsedTimestampMs) => (
							Number.isFinite(_parsedTimestampMs) ? _parsedTimestampMs : undefined
						))(ts != null ? Date.parse(ts) : NaN)
					))(optionalTrimmedString(p.timestamp)),
					$author: (
						((addr) => (
							addr != null && /^0x[a-fA-F0-9]{40}$/.test(addr) ?
								{
									[EntityMetaKey.Id]: { address: lensEvmAddressFromWire(addr) },
								}
							:	undefined
						))(p.author?.address)
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
				const limit = resolverLoadSubsetRowLimit(context)
				const pageSize: 'TEN' | 'FIFTY' = limit > 10 ? 'FIFTY' : 'TEN'
				const byAddress = new Map<string, { [EntityMetaKey.Id]: { address: `0x${string}` } }>()
				for (const item of ((await singleFlight(lensQueryLatestPosts)(publicEnv, pageSize)).posts?.items ?? [])) {
					const address = item.author?.address
					if (item.__typename !== 'Post' || address == null || !/^0x[a-fA-F0-9]{40}$/.test(address)) continue
					const normalizedAddress = lensEvmAddressFromWire(address)
					byAddress.set(normalizedAddress, {
						[EntityMetaKey.Id]: { address: normalizedAddress },
					})
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
				const limit = resolverLoadSubsetRowLimit(context)
				const pageSize: 'TEN' | 'FIFTY' = limit > 10 ? 'FIFTY' : 'TEN'
				return (
					((await singleFlight(lensQueryLatestPosts)(publicEnv, pageSize)).posts?.items ?? [])
						.flatMap((item) => (
							item.__typename === 'Post' && item.slug != null ?
								[
									{
										[EntityMetaKey.Id]: { id: item.slug },
									},
								]
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
				const limit = resolverLoadSubsetRowLimit(context)
				const pageSize: 'TEN' | 'FIFTY' = limit > 10 ? 'FIFTY' : 'TEN'
				return (
					((await singleFlight(lensQueryPostsByAuthor)(publicEnv, zeroExLowerCase(entityId.address), pageSize)).posts?.items ?? [])
						.flatMap((item) => (
							item.__typename === 'Post' && item.slug != null ?
								[
									{
										[EntityMetaKey.Id]: { id: item.slug },
									},
								]
							:	[]
						))
				)
			},
		}),
	],
}

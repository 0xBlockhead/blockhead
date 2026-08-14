import { networkBySlug } from '$/constants/Network.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const dydxNetworkApplicability = [
	{
		$network: {
			caip2: networkBySlug.dydx.caip2,
		},
	},
	{
		$network: {
			slug: networkBySlug.dydx.slug,
		},
	},
] as const

const assertDydxMainnet = (network: NetworkId) => {
	if (
		(
			'slug' in network
			&& network.slug === networkBySlug.dydx.slug
		)
		|| (
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.dydx.caip2.namespace
			&& network.caip2.reference === networkBySlug.dydx.caip2.reference
		)
	)
		return

	throw new Error('KingnodesDydxNode: unsupported network')
}

const parseBlockTimeMs = (value: string) => {
	const timestampMs = Date.parse(value)
	if (!Number.isFinite(timestampMs))
		throw new Error('KingnodesDydxNode: invalid block header time')
	return timestampMs
}

export default {
	source: Source.KingnodesDydxNode,

	resolvers: [
		defineResolver({
			entityType: EntityType.DydxChainNetwork,
			resolve: {
				Network: {
					appliesTo: dydxNetworkApplicability,
					resolve: async (entitySelector) => {
						assertDydxMainnet(entitySelector.$network)
						const { getDydxLatestBlock } = await import('$/sources/Kingnodes/Rest/queries.ts')
						const latestBlock = await getDydxLatestBlock()
						return {
							blockHeight: BigInt(latestBlock.block.header.height),
							observedAtMs: parseBlockTimeMs(latestBlock.block.header.time),
						}
					},
				},
			},
		})({
			$$timestamps: (snapshot, network) => [{
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: snapshot.observedAtMs,
					source: Source.KingnodesDydxNode,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.DydxChainNetwork_Timestamp, [], 'blockHeight')]: snapshot.blockHeight,
				},
			}],
		}),
	],
} satisfies RegisteredSourceResolverModule

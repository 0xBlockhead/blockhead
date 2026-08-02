import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertLightningNetwork = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== 'lightning')
		throw new Error('Amboss_Graphql: unsupported Lightning network')
}

export default {
	source: Source.Amboss_Graphql,

	resolvers: [
		defineResolver({
			entityType: EntityType.LightningChannel,
			resolve: {
				NetworkChannelId: {
					resolve: async ({ $network, channelId }) => {
						assertLightningNetwork($network)
						const { getEdge } = await import('$/sources/Amboss/Graphql/queries.ts')
						const edge = await getEdge({
							channelId,
						})
						const edgeInfo = edge.graph?.info

						return {
							[EntityMetaKey.Selector]: {
								$network,
								channelId: edge.long_channel_id,
							},
							shortChannelId: edge.short_channel_id,
							...(edgeInfo?.node2_pub != null && {
								$node1: {
									[EntityMetaKey.Selector]: {
										$network,
										publicKey: edgeInfo.node2_pub,
									},
								},
							}),
						}
					},
				}
			},
		})({
				shortChannelId: (snapshot) => snapshot.shortChannelId,
				$node1: (snapshot) => snapshot.$node1,
			}),

		defineResolver({
			entityType: EntityType.LightningNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertLightningNetwork($network)
						const { getPopularNodePubkeys } = await import('$/sources/Amboss/Graphql/queries.ts')
						const pubkeys = await getPopularNodePubkeys()
						return pubkeys
							.slice(0, resolverContextRowLimit(context))
							.map((publicKey) => ({
								[EntityMetaKey.Selector]: {
									$network,
									publicKey,
								},
							}))
					},
				}
			},
		})({
				$$nodes: (snapshot) => snapshot,
			}),
	],
} satisfies RegisteredSourceResolverModule<Source.Amboss_Graphql>

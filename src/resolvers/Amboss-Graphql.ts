import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { LightningChannelSelector } from '$/schema/LightningChannel.ts'
import { LightningNetworkSelector } from '$/schema/LightningNetwork.ts'

type NetworkId = { caip2: {
	namespace: string
	reference: string
} } | { slug: string }

const assertLightningNetwork = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== 'lightning')
		throw new Error('Amboss_Graphql: unsupported Lightning network')
}

export default {
	source: Source.Amboss_Graphql,

	resolvers: [
		defineResolver(Source.Amboss_Graphql, {
			entityType: EntityType.LightningChannel,
			resolve: {
				[LightningChannelSelector.NetworkChannelId]: {
					resolve: async ({ $network, channelId }) => {
						assertLightningNetwork($network)
						const { getEdge } = await import('$/sources/Amboss/Graphql/queries.ts')
						const edge = await getEdge({ channelId: channelId })
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

		defineResolver(Source.Amboss_Graphql, {
			entityType: EntityType.LightningNetwork,
			resolve: {
				[LightningNetworkSelector.Network]: {
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
}

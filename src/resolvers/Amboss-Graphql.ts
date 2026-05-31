import {
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { LightningChannelStatus } from '$/schema/LightningChannel.ts'
import { Source } from '$/sources/$Source.ts'

const lightningNetwork = {
	networkSlug: 'lightning',
} as const

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertLightningNetwork = (network: NetworkId) => {
	if (!('networkSlug' in network) || network.networkSlug !== lightningNetwork.networkSlug) {
		throw new Error('Amboss_Graphql: unsupported Lightning network')
	}
}

export default {
	source: Source.Amboss_Graphql,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.LightningNode,
			resolve: async (entityId) => {
				assertLightningNetwork(entityId.$network)
				const { getAmbossNode } = await import('$/sources/Amboss/Graphql/queries.ts')
				const node = await getAmbossNode({ publicKey: entityId.publicKey })
				const graphNode = node.graph_info.node
				const channels = node.graph_info.channels
				const primaryAddress = graphNode?.addresses?.[0]

				return {
					alias: graphNode?.alias ?? undefined,
					color: graphNode?.color ?? undefined,
					capacitySats: (
						channels?.total_capacity != null
							? BigInt(channels.total_capacity)
							: undefined
					),
					channelCount: (
						channels?.num_channels != null
							? Math.round(channels.num_channels)
							: undefined
					),
					updatedAtMs: (
						graphNode?.last_update != null
							? Math.round(graphNode.last_update) * 1000
							: undefined
					),
					countryCode: primaryAddress?.ip_info?.country_code ?? undefined,
					city: primaryAddress?.ip_info?.city ?? undefined,
					networkAddresses: (
						graphNode?.addresses?.map((address) => address.addr) ?? []
					),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.LightningChannel,
			resolve: async (entityId) => {
				assertLightningNetwork(entityId.$network)
				const { getAmbossEdge } = await import('$/sources/Amboss/Graphql/queries.ts')
				const edge = await getAmbossEdge({ channelId: entityId.channelId })
				const edgeInfo = edge.graph?.info

				return {
					[EntityMetaKey.Id]: {
						$network: lightningNetwork,
						channelId: edge.long_channel_id,
					},
					shortChannelId: edge.short_channel_id,
					status: (
						edgeInfo?.is_closed === true
							? LightningChannelStatus.Closed
							: edgeInfo?.is_closed === false
								? LightningChannelStatus.Open
								: LightningChannelStatus.Unknown
					),
					capacitySats: (
						edgeInfo?.capacity != null
							? BigInt(edgeInfo.capacity)
							: undefined
					),
					...(edgeInfo?.node1_pub != null && {
						$node0: {
							[EntityMetaKey.Id]: {
								$network: lightningNetwork,
								publicKey: edgeInfo.node1_pub,
							},
						},
					}),
					...(edgeInfo?.node2_pub != null && {
						$node1: {
							[EntityMetaKey.Id]: {
								$network: lightningNetwork,
								publicKey: edgeInfo.node2_pub,
							},
						},
					}),
					...(edgeInfo?.node1_policy?.fee_rate_milli_msat != null && {
						feeRatePpm: Number(edgeInfo.node1_policy.fee_rate_milli_msat),
					}),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.LightningNetwork,
			fieldName: '$$nodes',
			resolve: async (entityId, context) => {
				assertLightningNetwork(entityId.$network)
				const { getAmbossPopularNodePubkeys } = await import('$/sources/Amboss/Graphql/queries.ts')
				const pubkeys = await getAmbossPopularNodePubkeys()
				return pubkeys
					.slice(0, resolverLoadSubsetRowLimit(context))
					.map((publicKey) => ({
						[EntityMetaKey.Id]: {
							$network: lightningNetwork,
							publicKey,
						},
					}))
			},
		}),
	],
}

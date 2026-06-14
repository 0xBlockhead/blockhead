import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { lightningNetworkId } from '$/constants/LightningNetwork.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { LightningChannelStatus } from '$/schema/LightningChannel.ts'
import { Source } from '$/sources/Source.ts'
import { LightningNodeSelector } from '$/schema/LightningNode.ts'
import { LightningChannelSelector } from '$/schema/LightningChannel.ts'
import { LightningNetworkSelector } from '$/schema/LightningNetwork.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertLightningNetwork = (network: NetworkId) => {
	if (!('networkSlug' in network) || network.networkSlug !== lightningNetworkId.networkSlug) {
		throw new Error('Amboss_Graphql: unsupported Lightning network')
	}
}

export default {
	source: Source.Amboss_Graphql,

	resolvers: [
		defineResolver(Source.Amboss_Graphql, {
			entityType: EntityType.LightningNode,
			resolve: {
				[LightningNodeSelector.NetworkPublicKey]: async ({ $network, publicKey }) => {
				assertLightningNetwork($network)
				const { getNode } = await import('$/sources/Amboss/Graphql/queries.ts')
				const node = await getNode({ publicKey: publicKey })
				const graphNode = node.graph_info.node
				const channels = node.graph_info.channels
				const primaryAddress = graphNode?.addresses[0]

				return {
					alias: graphNode?.alias ?? undefined,
					color: graphNode?.color ?? undefined,
					capacitySats: (
						channels?.total_capacity != null
							? BigInt(channels.total_capacity)
							:
								undefined
					),
					channelCount: (
						channels?.num_channels != null
							? Math.round(channels.num_channels)
							:
								undefined
					),
					updatedAtMs: (
						graphNode?.last_update != null
							? Math.round(graphNode.last_update) * 1000
							:
								undefined
					),
					countryCode: primaryAddress?.ip_info?.country_code ?? undefined,
					city: primaryAddress?.ip_info?.city ?? undefined,
					networkAddresses: (
						graphNode?.addresses.map((address) => address.addr) ?? []
					),
				}
			}
			}
		})({
				fields: {
			alias: (snapshot) => snapshot.alias,
			color: (snapshot) => snapshot.color,
			capacitySats: (snapshot) => snapshot.capacitySats,
			channelCount: (snapshot) => snapshot.channelCount,
			updatedAtMs: (snapshot) => snapshot.updatedAtMs,
			countryCode: (snapshot) => snapshot.countryCode,
			city: (snapshot) => snapshot.city,
			networkAddresses: (snapshot) => snapshot.networkAddresses,
		},
			}),

		defineResolver(Source.Amboss_Graphql, {
			entityType: EntityType.LightningChannel,
			resolve: {
				[LightningChannelSelector.NetworkChannelId]: async ({ $network, channelId }) => {
				assertLightningNetwork($network)
				const { getEdge } = await import('$/sources/Amboss/Graphql/queries.ts')
				const edge = await getEdge({ channelId: channelId })
				const edgeInfo = edge.graph?.info

				return {
					[EntityMetaKey.Selector]: {
						$network: lightningNetworkId,
						channelId: edge.long_channel_id,
					},
					shortChannelId: edge.short_channel_id,
					status: (
						edgeInfo?.is_closed === true
							? LightningChannelStatus.Closed
							:
								edgeInfo?.is_closed === false
								? LightningChannelStatus.Open
								:
									LightningChannelStatus.Unknown
					),
					capacitySats: (
						edgeInfo?.capacity != null
							? BigInt(edgeInfo.capacity)
							:
								undefined
					),
					...(edgeInfo?.node1_pub != null && {
						$node0: {
							[EntityMetaKey.Selector]: {
								$network: lightningNetworkId,
								publicKey: edgeInfo.node1_pub,
							},
						},
					}),
					...(edgeInfo?.node2_pub != null && {
						$node1: {
							[EntityMetaKey.Selector]: {
								$network: lightningNetworkId,
								publicKey: edgeInfo.node2_pub,
							},
						},
					}),
					...(edgeInfo?.node1_policy?.fee_rate_milli_msat != null && {
						feeRatePpm: Number(edgeInfo.node1_policy.fee_rate_milli_msat),
					}),
				}
			}
			}
		})({
				fields: {
			shortChannelId: (snapshot) => snapshot.shortChannelId,
			status: (snapshot) => snapshot.status,
			capacitySats: (snapshot) => snapshot.capacitySats,
			$node0: (snapshot) => snapshot.$node0,
			$node1: (snapshot) => snapshot.$node1,
			feeRatePpm: (snapshot) => snapshot.feeRatePpm,
		},
			}),

		defineResolver(Source.Amboss_Graphql, {
			entityType: EntityType.LightningNetwork,
			resolve: {
				[LightningNetworkSelector.Network]: async ({ $network }, context) => {
				assertLightningNetwork($network)
				const { getPopularNodePubkeys } = await import('$/sources/Amboss/Graphql/queries.ts')
				const pubkeys = await getPopularNodePubkeys()
				return pubkeys
					.slice(0, resolverContextRowLimit(context))
					.map((publicKey) => ({
						[EntityMetaKey.Selector]: {
							$network: lightningNetworkId,
							publicKey,
						},
					}))
			}
			}
		})({
				fields: {
			$$nodes: (snapshot) => snapshot,
		},
			}),
	],
}

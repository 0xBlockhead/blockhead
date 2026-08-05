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
import { LightningChannelStatus } from '$/schema/LightningChannelStatus.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertLightningNetwork = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== 'lightning')
		throw new Error('Amboss_Graphql: unsupported Lightning network')
}

const assertAmbossSource = (source: string) => {
	if (source !== Source.Amboss_Graphql)
		throw new Error(`Amboss_Graphql: unsupported source ${source}`)
}

const timestampMsFromNodeSeconds = (seconds: number) => (
	Math.round(seconds) * 1000
)

const timestampMsFromChannelWire = (value: string) => {
	if (/^(0|[1-9][0-9]*)$/.test(value))
		return Number(value) * 1000

	const timestampMs = Date.parse(value)
	if (!Number.isFinite(timestampMs))
		throw new Error('Amboss_Graphql: invalid channel last_update')
	return timestampMs
}

const statusFromAmboss = (isClosed: boolean) => (
	isClosed ?
		LightningChannelStatus.Closed
	:
		LightningChannelStatus.Open
)

const nodeSnapshotFromAmbossNode = (
	node: Awaited<ReturnType<typeof import('$/sources/Amboss/Graphql/queries.ts').getNode>>
) => {
	const graphNode = node.graph_info.node
	const channels = node.graph_info.channels
	const primaryAddress = graphNode.addresses[0]
	const countryCode = primaryAddress?.ip_info?.country_code
	const city = primaryAddress?.ip_info?.city

	return {
		alias: graphNode.alias,
		color: graphNode.color,
		...(channels != null && {
			capacitySats: BigInt(channels.total_capacity),
			channelCount: channels.num_channels,
		}),
		updatedAtMs: timestampMsFromNodeSeconds(graphNode.last_update),
		...(countryCode != null && {
			countryCode,
		}),
		...(city != null && {
			city,
		}),
		networkAddresses: graphNode.addresses.map((address) => address.addr),
	}
}

const channelTimestampSnapshotFromAmbossEdge = (
	edge: Awaited<ReturnType<typeof import('$/sources/Amboss/Graphql/queries.ts').getEdge>>
) => {
	const edgeInfo = edge.graph.info

	return {
		status: statusFromAmboss(edgeInfo.is_closed),
		capacitySats: BigInt(edgeInfo.capacity),
		updatedAtMs: timestampMsFromChannelWire(edgeInfo.last_update),
		...(edgeInfo.node1_policy != null && {
			feeRatePpm: Number(edgeInfo.node1_policy.fee_rate_milli_msat),
		}),
	}
}

export default {
	source: Source.Amboss_Graphql,

	resolvers: [
		defineResolver({
			entityType: EntityType.LightningNode,
			resolve: {
				NetworkPublicKey: {
					resolve: async ({ $network, publicKey }) => {
						assertLightningNetwork($network)
						const { getNode } = await import('$/sources/Amboss/Graphql/queries.ts')
						const node = await getNode({
							publicKey,
						})
						return {
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$node: {
											$network,
											publicKey,
										},
										timestampMs: timestampMsFromNodeSeconds(node.graph_info.node.last_update),
										source: Source.Amboss_Graphql,
									},
								},
							],
						}
					},
				}
			},
		})({
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.LightningNode_Timestamp,
			resolve: {
				NodeTimestampMsSource: {
					resolve: async ({ $node, source }) => {
						assertAmbossSource(source)
						assertLightningNetwork($node.$network)
						const { getNode } = await import('$/sources/Amboss/Graphql/queries.ts')
						return nodeSnapshotFromAmbossNode(
							await getNode({
								publicKey: $node.publicKey,
							})
						)
					},
				}
			},
		})({
			alias: (snapshot) => snapshot.alias,
			color: (snapshot) => snapshot.color,
			capacitySats: (snapshot) => snapshot.capacitySats,
			channelCount: (snapshot) => snapshot.channelCount,
			updatedAtMs: (snapshot) => snapshot.updatedAtMs,
			countryCode: (snapshot) => snapshot.countryCode,
			city: (snapshot) => snapshot.city,
			networkAddresses: (snapshot) => snapshot.networkAddresses,
		}),

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
						const edgeInfo = edge.graph.info

						return {
							[EntityMetaKey.Selector]: {
								$network,
								channelId: edge.long_channel_id,
							},
							shortChannelId: edge.short_channel_id,
							$node1: {
								[EntityMetaKey.Selector]: {
									$network,
									publicKey: edgeInfo.node2_pub,
								},
							},
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$channel: {
											$network,
											channelId: edge.long_channel_id,
										},
										timestampMs: timestampMsFromChannelWire(edgeInfo.last_update),
										source: Source.Amboss_Graphql,
									},
								},
							],
						}
					},
				}
			},
		})({
			shortChannelId: (snapshot) => snapshot.shortChannelId,
			$node1: (snapshot) => snapshot.$node1,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.LightningChannel_Timestamp,
			resolve: {
				ChannelTimestampMsSource: {
					resolve: async ({ $channel, source }) => {
						assertAmbossSource(source)
						assertLightningNetwork($channel.$network)
						const { getEdge } = await import('$/sources/Amboss/Graphql/queries.ts')
						return channelTimestampSnapshotFromAmbossEdge(
							await getEdge({
								channelId: $channel.channelId,
							})
						)
					},
				}
			},
		})({
			status: (snapshot) => snapshot.status,
			capacitySats: (snapshot) => snapshot.capacitySats,
			feeRatePpm: (snapshot) => snapshot.feeRatePpm,
			updatedAtMs: (snapshot) => snapshot.updatedAtMs,
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
} satisfies RegisteredSourceResolverModule

/**
 * Public Lightning graph indexer (mempool.space).
 *
 * Owns `LightningNetwork` / `LightningNode` / `LightningChannel` (+ timestamps)
 * only — never `BlockheadLightning*` connected-node session rows, and never a
 * browser wallet / `WalletConnection` surface. Local LND session state lives on
 * `LightningLnd_Rest`.
 */
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { LightningChannelStatus } from '$/schema/LightningChannelStatus.ts'
import { Source } from '$/sources/Source.ts'
import type {
	MempoolSpaceLightningChannel,
	MempoolSpaceLightningChannelNode,
	MempoolSpaceLightningNode,
	MempoolSpaceLightningRankedNode,
	MempoolSpaceLightningStatistics,
} from '$/sources/LightningMempoolSpace/Rest/types.ts'

const bitcoinMainnet = {
	caip2: networkBySlug.bitcoin.caip2,
} as const

const lightningNetwork = {
	slug: 'lightning',
} as const

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertLightningNetwork = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== 'lightning')
		throw new Error('LightningMempoolSpace_Rest: unsupported Lightning network')
}

const bigintFromWire = (value: number | string | null | undefined) => (
	value == null ?
		undefined
	:
		BigInt(value)
)

const timestampMsFromSeconds = (seconds: number | null | undefined) => (
	seconds == null ?
		undefined
	:
		seconds * 1000
)

const timestampMsFromIso = (iso: string | null | undefined) => {
	if (iso == null)
		return

	const timestampMs = Date.parse(iso)
	return Number.isNaN(timestampMs) ? undefined : timestampMs
}

const statusFromMempoolSpace = (status: number | null | undefined) => (
	status === 1 ?
		LightningChannelStatus.Open
	:
		status === 0 ?
			LightningChannelStatus.Closed
		:
			LightningChannelStatus.Unknown
)

const nodeSnapshotFromMempoolSpaceNode = (
	node: MempoolSpaceLightningNode
) => ({
	alias: node.alias ?? undefined,
	color: node.color ?? undefined,
	capacitySats: bigintFromWire(node.capacity),
	channelCount: node.active_channel_count ?? node.channels ?? undefined,
	firstSeenMs: timestampMsFromSeconds(node.first_seen),
	updatedAtMs: timestampMsFromSeconds(node.updated_at),
	countryCode: node.iso_code ?? undefined,
	city: node.city?.en,
	networkAddresses: (
		node.sockets == null || node.sockets === '' ?
			[]
		:
			node.sockets.split(',')
	),
})

const nodeReferenceFromMempoolSpaceChannelNode = (
	node: MempoolSpaceLightningChannelNode
) => ({
	[EntityMetaKey.Selector]: {
		$network: lightningNetwork,
		publicKey: node.public_key,
	},
})

const nodeReferenceFromMempoolSpaceRankedNode = (
	node: MempoolSpaceLightningRankedNode
) => ({
	[EntityMetaKey.Selector]: {
		$network: lightningNetwork,
		publicKey: node.publicKey,
	},
})

const channelSnapshotFromMempoolSpaceChannel = (
	channel: MempoolSpaceLightningChannel
) => ({
	shortChannelId: channel.short_id ?? undefined,
	fundingTransactionId: channel.transaction_id ?? undefined,
	fundingOutputIndex: channel.transaction_vout ?? undefined,
	openedAtMs: timestampMsFromIso(channel.created),
	...(channel.node_right != null && {
		$node1: nodeReferenceFromMempoolSpaceChannelNode(channel.node_right),
	}),
})

const channelTimestampSnapshotFromMempoolSpaceChannel = (
	channel: MempoolSpaceLightningChannel
) => ({
	status: statusFromMempoolSpace(channel.status),
	capacitySats: bigintFromWire(channel.capacity),
	closingTransactionId: channel.closing_transaction_id ?? undefined,
	closingFeeSats: bigintFromWire(channel.closing_fee),
	closingReason: channel.closing_reason == null ? undefined : String(channel.closing_reason),
	closedAtMs: timestampMsFromIso(channel.closing_date),
	updatedAtMs: timestampMsFromIso(channel.updated_at),
	feeRatePpm: channel.fee_rate ?? undefined,
})

const timestampSnapshotFromMempoolSpaceStatistics = (
	statistics: MempoolSpaceLightningStatistics
) => ({
	nodeCount: statistics.node_count ?? undefined,
	channelCount: statistics.channel_count ?? undefined,
	totalCapacitySats: bigintFromWire(statistics.total_capacity),
	torNodeCount: statistics.tor_nodes ?? undefined,
	clearnetNodeCount: statistics.clearnet_nodes ?? undefined,
	unannouncedNodeCount: statistics.unannounced_nodes ?? undefined,
	averageCapacitySats: bigintFromWire(statistics.avg_capacity),
	medianCapacitySats: bigintFromWire(statistics.med_capacity),
	averageFeeRatePpm: statistics.avg_fee_rate ?? undefined,
	medianFeeRatePpm: statistics.med_fee_rate ?? undefined,
})

const lightningNetworkTimestampReferenceFromStatistics = (
	$network: NetworkId,
	statistics: MempoolSpaceLightningStatistics
) => {
	const timestampMs = timestampMsFromIso(statistics.added)
	if (timestampMs == null)
		throw new Error(`LightningMempoolSpace_Rest: invalid statistics timestamp ${statistics.added}`)

	return {
		[EntityMetaKey.Selector]: {
			$lightningNetwork: {
				$network,
			},
			timestampMs,
			source: Source.LightningMempoolSpace_Rest,
		},
	}
}

export default {
	source: Source.LightningMempoolSpace_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.LightningNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => {
						assertLightningNetwork($network)
						return {
							name: 'Lightning Network',
							$settlementNetwork: {
								[EntityMetaKey.Selector]: bitcoinMainnet,
							},
						}
					},
				}
			},
		})({
			name: (snapshot) => snapshot.name,
			$settlementNetwork: (snapshot) => snapshot.$settlementNetwork,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network) => {
						assertLightningNetwork(network)
						return {
							Lightning: {
								name: 'Lightning Network',
							},
							$lightningSettlementNetwork: {
								[EntityMetaKey.Selector]: bitcoinMainnet,
							},
						}
					},
				}
			},
		})({
			Lightning: {
				name: (snapshot) => snapshot.Lightning.name,
				$settlementNetwork: (snapshot) => snapshot.$lightningSettlementNetwork,
			},
		}),

		defineResolver({
			entityType: EntityType.LightningNetwork_Timestamp,
			resolve: {
				LightningNetworkTimestampMsSource: {
					resolve: async ({
						$lightningNetwork,
						timestampMs,
						source,
					}) => {
						if (source !== Source.LightningMempoolSpace_Rest)
							throw new Error(`LightningMempoolSpace_Rest: unsupported source ${source}`)

						assertLightningNetwork($lightningNetwork.$network)
						const { getLightningStatistics } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
						const statistics = (await getLightningStatistics()).latest
						if (timestampMsFromIso(statistics.added) !== timestampMs)
							throw new Error('LightningMempoolSpace_Rest: statistics observation clock mismatch')

						return timestampSnapshotFromMempoolSpaceStatistics(statistics)
					},
				}
			},
		})({
			nodeCount: (snapshot) => snapshot.nodeCount,
			channelCount: (snapshot) => snapshot.channelCount,
			totalCapacitySats: (snapshot) => snapshot.totalCapacitySats,
			torNodeCount: (snapshot) => snapshot.torNodeCount,
			clearnetNodeCount: (snapshot) => snapshot.clearnetNodeCount,
			unannouncedNodeCount: (snapshot) => snapshot.unannouncedNodeCount,
			averageCapacitySats: (snapshot) => snapshot.averageCapacitySats,
			medianCapacitySats: (snapshot) => snapshot.medianCapacitySats,
			averageFeeRatePpm: (snapshot) => snapshot.averageFeeRatePpm,
			medianFeeRatePpm: (snapshot) => snapshot.medianFeeRatePpm,
		}),

		defineResolver({
			entityType: EntityType.LightningNode,
			resolve: {
				NetworkPublicKey: {
					resolve: async ({ $network, publicKey }) => {
						assertLightningNetwork($network)
						const { getLightningNode } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
						const node = await getLightningNode({
							publicKey,
						})
						return {
							$$timestamps: (
								node.updated_at == null ?
									[]
								:
									[
										{
											[EntityMetaKey.Selector]: {
												$node: {
													$network,
													publicKey,
												},
												timestampMs: timestampMsFromSeconds(node.updated_at),
												source: Source.LightningMempoolSpace_Rest,
											},
										},
									]
							),
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
					resolve: async ({
						$node,
						timestampMs,
						source,
					}) => {
						if (source !== Source.LightningMempoolSpace_Rest)
							throw new Error(`LightningMempoolSpace_Rest: unsupported source ${source}`)

						assertLightningNetwork($node.$network)
						const { getLightningNode } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
						const node = await getLightningNode({
							publicKey: $node.publicKey,
						})
						if (timestampMsFromSeconds(node.updated_at) !== timestampMs)
							throw new Error('LightningMempoolSpace_Rest: node observation clock mismatch')

						return nodeSnapshotFromMempoolSpaceNode(node)
					},
				}
			},
		})({
			alias: (snapshot) => snapshot.alias,
			color: (snapshot) => snapshot.color,
			capacitySats: (snapshot) => snapshot.capacitySats,
			channelCount: (snapshot) => snapshot.channelCount,
			firstSeenMs: (snapshot) => snapshot.firstSeenMs,
			updatedAtMs: (snapshot) => snapshot.updatedAtMs,
			countryCode: (snapshot) => snapshot.countryCode,
			city: (snapshot) => snapshot.city,
			networkAddresses: (snapshot) => snapshot.networkAddresses,
		}),

		defineResolver({
			entityType: EntityType.LightningChannel,
			resolve: {
				NetworkChannelId: {
					resolve: async (channelSelector) => {
						const { $network, channelId } = channelSelector
						assertLightningNetwork($network)
						const { getLightningChannel } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
						const channel = await getLightningChannel({
							channelId,
						})
						return {
							...channelSnapshotFromMempoolSpaceChannel(channel),
							$$timestamps: (
								channel.updated_at == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: {
											$channel: channelSelector,
											timestampMs: timestampMsFromIso(channel.updated_at),
											source: Source.LightningMempoolSpace_Rest,
										},
									}]
							),
						}
					},
				}
			},
		})({
			shortChannelId: (snapshot) => snapshot.shortChannelId,
			fundingTransactionId: (snapshot) => snapshot.fundingTransactionId,
			fundingOutputIndex: (snapshot) => snapshot.fundingOutputIndex,
			openedAtMs: (snapshot) => snapshot.openedAtMs,
			$node1: (snapshot) => snapshot.$node1,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.LightningChannel_Timestamp,
			resolve: {
				ChannelTimestampMsSource: {
					resolve: async ({
						$channel,
						timestampMs,
						source,
					}) => {
						if (source !== Source.LightningMempoolSpace_Rest)
							throw new Error(`LightningMempoolSpace_Rest: unsupported source ${source}`)

						assertLightningNetwork($channel.$network)
						const { getLightningChannel } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
						const channel = await getLightningChannel({
							channelId: $channel.channelId,
						})
						if (timestampMsFromIso(channel.updated_at) !== timestampMs)
							throw new Error('LightningMempoolSpace_Rest: channel observation clock mismatch')

						return channelTimestampSnapshotFromMempoolSpaceChannel(channel)
					},
				}
			},
		})({
			status: (snapshot) => snapshot.status,
			capacitySats: (snapshot) => snapshot.capacitySats,
			feeRatePpm: (snapshot) => snapshot.feeRatePpm,
			updatedAtMs: (snapshot) => snapshot.updatedAtMs,
			closingTransactionId: (snapshot) => snapshot.closingTransactionId,
			closingFeeSats: (snapshot) => snapshot.closingFeeSats,
			closingReason: (snapshot) => snapshot.closingReason,
			closedAtMs: (snapshot) => snapshot.closedAtMs,
		}),

		defineResolver({
			entityType: EntityType.LightningNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => {
						assertLightningNetwork($network)
						const { getLightningStatistics } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
						return [
							lightningNetworkTimestampReferenceFromStatistics(
								$network,
								(await getLightningStatistics()).latest
							),
						]
					},
				}
			},
		})({
			$$timestamps: (snapshot) => snapshot,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network) => {
						assertLightningNetwork(network)
						const { getLightningStatistics } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
						return [
							lightningNetworkTimestampReferenceFromStatistics(
								network,
								(await getLightningStatistics()).latest
							),
						]
					},
				}
			},
		})({
			Lightning: {
				$$timestamps: (snapshot) => snapshot,
			},
		}),

		defineResolver({
			entityType: EntityType.LightningNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertLightningNetwork($network)
						const { getTopLightningNodesByConnectivity } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
						return (
							await getTopLightningNodesByConnectivity()
						).slice(0, resolverContextRowLimit(context)).map(nodeReferenceFromMempoolSpaceRankedNode)
					},
				}
			},
		})({
			$$nodes: (snapshot) => snapshot,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => {
						assertLightningNetwork(network)
						const { getTopLightningNodesByConnectivity } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
						return (
							await getTopLightningNodesByConnectivity()
						).slice(0, resolverContextRowLimit(context)).map(nodeReferenceFromMempoolSpaceRankedNode)
					},
				}
			},
		})({
			Lightning: {
				$$nodes: (snapshot) => snapshot,
			},
		}),

		defineResolver({
			entityType: EntityType.LightningNode,
			resolve: {
				NetworkPublicKey: {
					resolve: async ({ $network, publicKey }, context) => {
						assertLightningNetwork($network)
						const { getLightningNodeChannels } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
						return (
							await getLightningNodeChannels({
								publicKey,
							})
						).slice(0, resolverContextRowLimit(context)).map((channel) => ({
							[EntityMetaKey.Selector]: {
								$network,
								channelId: String(channel.id),
							},
							[EntityMetaKey.Fields]: {
								...(channel.short_id != null && {
									[entityFieldAddressKey(EntityType.LightningChannel, [], 'shortChannelId')]: channel.short_id,
								}),
								...(channel.node != null && {
									[entityFieldAddressKey(EntityType.LightningChannel, [], '$node1')]: nodeReferenceFromMempoolSpaceChannelNode(channel.node),
								}),
							},
						}))
					},
				}
			},
		})({
			$$channels: (snapshot) => snapshot,
		}),
	],
}

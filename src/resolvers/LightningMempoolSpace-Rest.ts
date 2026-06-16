import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { bitcoinNetworkBySlug } from '$/constants/BitcoinNetwork.ts'
import { lightningNetworkBySlug } from '$/constants/LightningNetwork.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { LightningChannelStatus } from '$/schema/LightningChannel.ts'
import { Source } from '$/sources/Source.ts'
import type {
	MempoolSpaceLightningChannel,
	MempoolSpaceLightningChannelNode,
	MempoolSpaceLightningNode,
	MempoolSpaceLightningRankedNode,
	MempoolSpaceLightningStatistics,
} from '$/sources/LightningMempoolSpace/Rest/types.ts'
import { LightningNetworkSelector } from '$/schema/LightningNetwork.ts'
import { LightningNetwork_TimestampSelector } from '$/schema/LightningNetwork_Timestamp.ts'
import { LightningNodeSelector } from '$/schema/LightningNode.ts'
import { LightningChannelSelector } from '$/schema/LightningChannel.ts'

const bitcoinMainnet = {
	caip2: bitcoinNetworkBySlug.bitcoin.caip2,
} as const

type NetworkId = { caip2: {
	namespace: string
	reference: string
} } | { slug: string }

const assertLightningNetwork = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== 'lightning')
		throw new Error('LightningMempoolSpace_Rest: unsupported Lightning network')
}

const bigintFromWire = (value: number | string | null | undefined): bigint | undefined => (
	value == null ?
		undefined
	:
		BigInt(value)
)

const timestampMsFromSeconds = (seconds: number | null | undefined): number | undefined => (
	seconds == null ?
		undefined
	:
		seconds * 1000
)

const timestampMsFromIso = (iso: string | null | undefined): number | undefined => (
	iso == null ?
		undefined
	:
		Date.parse(iso)
)

const statusFromMempoolSpace = (status: number | null | undefined): LightningChannelStatus => (
	status === 1 ?
		LightningChannelStatus.Open
	:
		status === 0 ?
			LightningChannelStatus.Closed
		:
			LightningChannelStatus.Unknown
)

const nodeReferenceFromPublicKey = (publicKey: string) => ({
	[EntityMetaKey.Selector]: {
		$network: {
			slug: 'lightning',
		},
		publicKey,
	},
})

const nodeFieldsFromMempoolSpaceNode = (
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
		$network: {
			slug: 'lightning',
		},
		publicKey: node.public_key,
	},
	alias: node.alias ?? undefined,
	capacitySats: bigintFromWire(node.capacity),
	channelCount: node.channels ?? undefined,
	updatedAtMs: timestampMsFromIso(node.updated_at),
})

const nodeReferenceFromMempoolSpaceRankedNode = (
	node: MempoolSpaceLightningRankedNode
) => ({
	[EntityMetaKey.Selector]: {
		$network: {
			slug: 'lightning',
		},
		publicKey: node.publicKey,
	},
	alias: node.alias ?? undefined,
	capacitySats: bigintFromWire(node.capacity),
	channelCount: node.channels ?? undefined,
	firstSeenMs: timestampMsFromSeconds(node.firstSeen),
	updatedAtMs: timestampMsFromSeconds(node.updatedAt),
	countryCode: node.iso_code ?? undefined,
	city: node.city?.en,
})

const channelFieldsFromMempoolSpaceChannel = (
	channel: MempoolSpaceLightningChannel
) => ({
	[EntityMetaKey.Selector]: {
		$network: {
			slug: 'lightning',
		},
		channelId: channel.id,
	},
	shortChannelId: channel.short_id ?? undefined,
	status: statusFromMempoolSpace(channel.status),
	capacitySats: bigintFromWire(channel.capacity),
	fundingTransactionId: channel.transaction_id ?? undefined,
	fundingOutputIndex: channel.transaction_vout ?? undefined,
	closingTransactionId: channel.closing_transaction_id ?? undefined,
	closingFeeSats: bigintFromWire(channel.closing_fee),
	closingReason: channel.closing_reason == null ? undefined : String(channel.closing_reason),
	closedAtMs: timestampMsFromIso(channel.closing_date),
	openedAtMs: timestampMsFromIso(channel.created),
	updatedAtMs: timestampMsFromIso(channel.updated_at),
	feeRatePpm: channel.fee_rate ?? undefined,
	...(channel.node_left != null && {
		$node0: nodeReferenceFromMempoolSpaceChannelNode(channel.node_left),
	}),
	...(channel.node_right != null && {
		$node1: nodeReferenceFromMempoolSpaceChannelNode(channel.node_right),
	}),
})

const timestampFieldsFromMempoolSpaceStatistics = (
	statistics: MempoolSpaceLightningStatistics
) => ({
	[EntityMetaKey.Selector]: {
		$lightningNetwork: {
			$network: {
				slug: 'lightning',
			},
		},
		timestampMs: Date.parse(statistics.added),
	},
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

export default {
	source: Source.LightningMempoolSpace_Rest,

	resolvers: [
		defineResolver(Source.LightningMempoolSpace_Rest, {
			entityType: EntityType.LightningNetwork,
			resolve: {
				[LightningNetworkSelector.Network]: async ({ $network }) => {
					assertLightningNetwork($network)
					return {
						name: 'Lightning Network',
						$settlementNetwork: {
							[EntityMetaKey.Selector]: bitcoinMainnet,
						},
					}
				}
			},
		})({
			fields: {
				name: (snapshot) => snapshot.name,
				$settlementNetwork: (snapshot) => snapshot.$settlementNetwork,
			},
		}),

		defineResolver(Source.LightningMempoolSpace_Rest, {
			entityType: EntityType.LightningNetwork_Timestamp,
			resolve: {
				[LightningNetwork_TimestampSelector.LightningNetworkTimestampMs]: async ({ $lightningNetwork }) => {
					assertLightningNetwork($lightningNetwork.$network)
					const { getLightningStatistics } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
					return timestampFieldsFromMempoolSpaceStatistics(
						(await getLightningStatistics({
							restBaseUrl: lightningNetworkBySlug.lightning.mempoolSpaceRestBaseUrl,
						})).latest
					)
				}
			},
		})({
			fields: {
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
			},
		}),

		defineResolver(Source.LightningMempoolSpace_Rest, {
			entityType: EntityType.LightningNode,
			resolve: {
				[LightningNodeSelector.NetworkPublicKey]: async ({ $network, publicKey }) => {
					assertLightningNetwork($network)
					const { getLightningNode } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
					return nodeFieldsFromMempoolSpaceNode(
						await getLightningNode({
							restBaseUrl: lightningNetworkBySlug.lightning.mempoolSpaceRestBaseUrl,
							publicKey: publicKey,
						})
					)
				}
			},
		})({
			fields: {
				alias: (snapshot) => snapshot.alias,
				color: (snapshot) => snapshot.color,
				capacitySats: (snapshot) => snapshot.capacitySats,
				channelCount: (snapshot) => snapshot.channelCount,
				firstSeenMs: (snapshot) => snapshot.firstSeenMs,
				updatedAtMs: (snapshot) => snapshot.updatedAtMs,
				countryCode: (snapshot) => snapshot.countryCode,
				city: (snapshot) => snapshot.city,
				networkAddresses: (snapshot) => snapshot.networkAddresses,
			},
		}),

		defineResolver(Source.LightningMempoolSpace_Rest, {
			entityType: EntityType.LightningChannel,
			resolve: {
				[LightningChannelSelector.NetworkChannelId]: async ({ $network, channelId }) => {
					assertLightningNetwork($network)
					const { getLightningChannel } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
					return channelFieldsFromMempoolSpaceChannel(
						await getLightningChannel({
							restBaseUrl: lightningNetworkBySlug.lightning.mempoolSpaceRestBaseUrl,
							channelId: channelId,
						})
					)
				}
			},
		})({
			fields: {
				shortChannelId: (snapshot) => snapshot.shortChannelId,
				status: (snapshot) => snapshot.status,
				capacitySats: (snapshot) => snapshot.capacitySats,
				fundingTransactionId: (snapshot) => snapshot.fundingTransactionId,
				fundingOutputIndex: (snapshot) => snapshot.fundingOutputIndex,
				closingTransactionId: (snapshot) => snapshot.closingTransactionId,
				closingFeeSats: (snapshot) => snapshot.closingFeeSats,
				closingReason: (snapshot) => snapshot.closingReason,
				closedAtMs: (snapshot) => snapshot.closedAtMs,
				openedAtMs: (snapshot) => snapshot.openedAtMs,
				updatedAtMs: (snapshot) => snapshot.updatedAtMs,
				feeRatePpm: (snapshot) => snapshot.feeRatePpm,
				$node0: (snapshot) => snapshot.$node0,
				$node1: (snapshot) => snapshot.$node1,
			},
		}),

		defineResolver(Source.LightningMempoolSpace_Rest, {
			entityType: EntityType.LightningNetwork,
			resolve: {
				[LightningNetworkSelector.Network]: async ({ $network }) => {
					assertLightningNetwork($network)
					const { getLightningStatistics } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
					return [
						timestampFieldsFromMempoolSpaceStatistics(
							(await getLightningStatistics({
								restBaseUrl: lightningNetworkBySlug.lightning.mempoolSpaceRestBaseUrl,
							})).latest
					),
					]
				}
			},
		})({
			fields: {
				$$timestamps: (snapshot) => snapshot,
			},
		}),

		defineResolver(Source.LightningMempoolSpace_Rest, {
			entityType: EntityType.LightningNetwork,
			resolve: {
				[LightningNetworkSelector.Network]: async ({ $network }, context) => {
					assertLightningNetwork($network)
					const { getTopLightningNodesByConnectivity } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
					return (
						await getTopLightningNodesByConnectivity({
							restBaseUrl: lightningNetworkBySlug.lightning.mempoolSpaceRestBaseUrl,
						})
					).slice(0, resolverContextRowLimit(context)).map(nodeReferenceFromMempoolSpaceRankedNode)
				}
			},
		})({
			fields: {
				$$nodes: (snapshot) => snapshot,
			},
		}),

		defineResolver(Source.LightningMempoolSpace_Rest, {
			entityType: EntityType.LightningNetwork,
			resolve: {
				[LightningNetworkSelector.Network]: async ({ $network }, context) => {
					assertLightningNetwork($network)
					const {
						getLightningNodeChannels,
						getTopLightningNodesByConnectivity,
					} = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
					const nodes = await getTopLightningNodesByConnectivity({
						restBaseUrl: lightningNetworkBySlug.lightning.mempoolSpaceRestBaseUrl,
					})
					return (
						await getLightningNodeChannels({
							restBaseUrl: lightningNetworkBySlug.lightning.mempoolSpaceRestBaseUrl,
							publicKey: nodes[0].publicKey,
						})
					).slice(0, resolverContextRowLimit(context)).map((channel) => ({
						[EntityMetaKey.Selector]: {
							$network: {
								slug: 'lightning',
							},
							channelId: channel.id,
						},
						shortChannelId: channel.short_id ?? undefined,
						status: statusFromMempoolSpace(channel.status),
						capacitySats: bigintFromWire(channel.capacity),
						feeRatePpm: channel.fee_rate ?? undefined,
						...(channel.node != null && {
							$node1: nodeReferenceFromMempoolSpaceChannelNode(channel.node),
						}),
					}))
				}
			},
		})({
			fields: {
				$$channels: (snapshot) => snapshot,
			},
		}),

		defineResolver(Source.LightningMempoolSpace_Rest, {
			entityType: EntityType.LightningNode,
			resolve: {
				[LightningNodeSelector.NetworkPublicKey]: async ({ $network, publicKey }, context) => {
					assertLightningNetwork($network)
					const { getLightningNodeChannels } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
					return (
						await getLightningNodeChannels({
							restBaseUrl: lightningNetworkBySlug.lightning.mempoolSpaceRestBaseUrl,
							publicKey: publicKey,
						})
					).slice(0, resolverContextRowLimit(context)).map((channel) => ({
						[EntityMetaKey.Selector]: {
							$network,
							channelId: channel.id,
						},
						shortChannelId: channel.short_id ?? undefined,
						status: statusFromMempoolSpace(channel.status),
						capacitySats: bigintFromWire(channel.capacity),
						feeRatePpm: channel.fee_rate ?? undefined,
						...(channel.node != null && {
							$node1: nodeReferenceFromMempoolSpaceChannelNode(channel.node),
						}),
					}))
				}
			},
		})({
			fields: {
				$$channels: (snapshot) => snapshot,
			},
		}),
	],
}

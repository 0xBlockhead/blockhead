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
import { NetworkSelector } from '$/schema/Network.ts'
import { LightningNodeSelector } from '$/schema/LightningNode.ts'
import { LightningNode_TimestampSelector } from '$/schema/LightningNode_Timestamp.ts'
import { LightningChannelSelector } from '$/schema/LightningChannel.ts'
import { LightningChannel_TimestampSelector } from '$/schema/LightningChannel_Timestamp.ts'

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
	node: MempoolSpaceLightningNode,
	timestampMs = timestampMsFromSeconds(node.updated_at) ?? Date.now()
) => ({
	[EntityMetaKey.Selector]: {
		$node: {
			$network: {
				slug: 'lightning',
			},
			publicKey: node.public_key,
		},
		timestampMs,
		source: Source.LightningMempoolSpace_Rest,
	},
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
})

const channelFieldsFromMempoolSpaceChannel = (
	channel: MempoolSpaceLightningChannel
) => ({
	[EntityMetaKey.Selector]: {
		$network: {
			slug: 'lightning',
		},
		channelId: String(channel.id),
	},
	shortChannelId: channel.short_id ?? undefined,
	fundingTransactionId: channel.transaction_id ?? undefined,
	fundingOutputIndex: channel.transaction_vout ?? undefined,
	openedAtMs: timestampMsFromIso(channel.created),
	...(channel.node_right != null && {
		$node1: nodeReferenceFromMempoolSpaceChannelNode(channel.node_right),
	}),
})

const channelTimestampFieldsFromMempoolSpaceChannel = (
	channel: MempoolSpaceLightningChannel,
	timestampMs = timestampMsFromIso(channel.updated_at) ?? timestampMsFromIso(channel.created) ?? Date.now()
) => ({
	[EntityMetaKey.Selector]: {
		$channel: {
			[EntityMetaKey.Selector]: {
				$network: {
					slug: 'lightning',
				},
				channelId: String(channel.id),
			},
		},
		timestampMs,
		source: Source.LightningMempoolSpace_Rest,
	},
	status: statusFromMempoolSpace(channel.status),
	capacitySats: bigintFromWire(channel.capacity),
	closingTransactionId: channel.closing_transaction_id ?? undefined,
	closingFeeSats: bigintFromWire(channel.closing_fee),
	closingReason: channel.closing_reason == null ? undefined : String(channel.closing_reason),
	closedAtMs: timestampMsFromIso(channel.closing_date),
	updatedAtMs: timestampMsFromIso(channel.updated_at),
	feeRatePpm: channel.fee_rate ?? undefined,
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
		source: Source.LightningMempoolSpace_Rest,
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
				name: (snapshot) => snapshot.name,
				$settlementNetwork: (snapshot) => snapshot.$settlementNetwork,
			}),

		defineResolver(Source.LightningMempoolSpace_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network) => {
					assertLightningNetwork(network)
					return {
						Lightning: {
							name: 'Lightning Network',
						},
						$lightningSettlementNetwork: {
							[EntityMetaKey.Selector]: bitcoinMainnet,
						},
					}
				}
			},
		})({
				Lightning: {
					name: (snapshot) => snapshot.Lightning.name,
					$settlementNetwork: (snapshot) => snapshot.$lightningSettlementNetwork,
				},
			}),

		defineResolver(Source.LightningMempoolSpace_Rest, {
			entityType: EntityType.LightningNetwork_Timestamp,
			resolve: {
				[LightningNetwork_TimestampSelector.LightningNetworkTimestampMsSource]: async ({ $lightningNetwork }) => {
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

		defineResolver(Source.LightningMempoolSpace_Rest, {
			entityType: EntityType.LightningNode,
			resolve: {
				[LightningNodeSelector.NetworkPublicKey]: async ({ $network, publicKey }) => {
					assertLightningNetwork($network)
					const { getLightningNode } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
					const node = await getLightningNode({
							restBaseUrl: lightningNetworkBySlug.lightning.mempoolSpaceRestBaseUrl,
							publicKey: publicKey,
						})
					return {
						$$timestamps: [
							nodeFieldsFromMempoolSpaceNode(node),
						],
					}
				}
			},
		})({
				$$timestamps: (snapshot) => snapshot.$$timestamps.map((timestamp) => ({
					[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
				})),
			}),

		defineResolver(Source.LightningMempoolSpace_Rest, {
			entityType: EntityType.LightningNode_Timestamp,
			resolve: {
				[LightningNode_TimestampSelector.NodeTimestampMsSource]: async ({ $node, timestampMs, source }) => {
					if (source !== Source.LightningMempoolSpace_Rest)
						throw new Error(`LightningMempoolSpace_Rest: unsupported source ${source}`)

					assertLightningNetwork($node.$network)
					const { getLightningNode } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
					return nodeFieldsFromMempoolSpaceNode(
						await getLightningNode({
							restBaseUrl: lightningNetworkBySlug.lightning.mempoolSpaceRestBaseUrl,
							publicKey: $node.publicKey,
						}),
						timestampMs
					)
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
				shortChannelId: (snapshot) => snapshot.shortChannelId,
				fundingTransactionId: (snapshot) => snapshot.fundingTransactionId,
				fundingOutputIndex: (snapshot) => snapshot.fundingOutputIndex,
				openedAtMs: (snapshot) => snapshot.openedAtMs,
				$node1: (snapshot) => snapshot.$node1,
			}),

		defineResolver(Source.LightningMempoolSpace_Rest, {
			entityType: EntityType.LightningChannel_Timestamp,
			resolve: {
				[LightningChannel_TimestampSelector.ChannelTimestampMsSource]: async ({ $channel, timestampMs }) => {
					assertLightningNetwork($channel.$network)
					const { getLightningChannel } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
					return channelTimestampFieldsFromMempoolSpaceChannel(
						await getLightningChannel({
							restBaseUrl: lightningNetworkBySlug.lightning.mempoolSpaceRestBaseUrl,
							channelId: $channel.channelId,
						}),
						timestampMs
					)
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
				$$timestamps: (snapshot) => snapshot,
			}),

		defineResolver(Source.LightningMempoolSpace_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network) => {
					assertLightningNetwork(network)
					const { getLightningStatistics } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
					return [
						{
							[EntityMetaKey.Selector]: {
								$lightningNetwork: {
									$network: network,
								},
								timestampMs: Date.now(),
								source: Source.LightningMempoolSpace_Rest,
							},
							...timestampFieldsFromMempoolSpaceStatistics(
								(await getLightningStatistics({
									restBaseUrl: lightningNetworkBySlug.lightning.mempoolSpaceRestBaseUrl,
								})).latest
							),
						},
					]
				}
			},
		})({
				Lightning: {
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
				$$nodes: (snapshot) => snapshot,
			}),

		defineResolver(Source.LightningMempoolSpace_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network, context) => {
					assertLightningNetwork(network)
					const { getTopLightningNodesByConnectivity } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
					return (
						await getTopLightningNodesByConnectivity({
							restBaseUrl: lightningNetworkBySlug.lightning.mempoolSpaceRestBaseUrl,
						})
					).slice(0, resolverContextRowLimit(context)).map(nodeReferenceFromMempoolSpaceRankedNode)
				}
			},
		})({
				Lightning: {
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
						...(channel.node != null && {
							$node1: nodeReferenceFromMempoolSpaceChannelNode(channel.node),
						}),
					}))
				}
			},
		})({
				$$channels: (snapshot) => snapshot,
			}),

		defineResolver(Source.LightningMempoolSpace_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Slug]: async (network, context) => {
					assertLightningNetwork(network)
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
					).slice(0, resolverContextRowLimit(context)).map(channelReferenceFromMempoolSpaceChannel)
				}
			},
		})({
				Lightning: {
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
							channelId: String(channel.id),
						},
						shortChannelId: channel.short_id ?? undefined,
						...(channel.node != null && {
							$node1: nodeReferenceFromMempoolSpaceChannelNode(channel.node),
						}),
					}))
				}
			},
		})({
				$$channels: (snapshot) => snapshot,
			}),
	],
}

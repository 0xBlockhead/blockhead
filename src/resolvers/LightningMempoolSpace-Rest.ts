import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { bitcoinNetworkBySlug } from '$/constants/BitcoinNetwork.ts'
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
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'alias')]: node.alias ?? undefined,
		[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'color')]: node.color ?? undefined,
		[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'capacitySats')]: bigintFromWire(node.capacity),
		[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'channelCount')]: node.active_channel_count ?? node.channels ?? undefined,
		[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'firstSeenMs')]: timestampMsFromSeconds(node.first_seen),
		[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'updatedAtMs')]: timestampMsFromSeconds(node.updated_at),
		[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'countryCode')]: node.iso_code ?? undefined,
		[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'city')]: node.city?.en,
		[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'networkAddresses')]: (
		node.sockets == null || node.sockets === '' ?
			[]
		:
			node.sockets.split(',')
		),
	},
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
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.LightningChannel, [], 'shortChannelId')]: channel.short_id ?? undefined,
		[entityFieldAddressKey(EntityType.LightningChannel, [], 'fundingTransactionId')]: channel.transaction_id ?? undefined,
		[entityFieldAddressKey(EntityType.LightningChannel, [], 'fundingOutputIndex')]: channel.transaction_vout ?? undefined,
		[entityFieldAddressKey(EntityType.LightningChannel, [], 'openedAtMs')]: timestampMsFromIso(channel.created),
		...(channel.node_right != null && {
			[entityFieldAddressKey(EntityType.LightningChannel, [], '$node1')]: nodeReferenceFromMempoolSpaceChannelNode(channel.node_right),
		}),
	},
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
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'status')]: statusFromMempoolSpace(channel.status),
		[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'capacitySats')]: bigintFromWire(channel.capacity),
		[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'closingTransactionId')]: channel.closing_transaction_id ?? undefined,
		[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'closingFeeSats')]: bigintFromWire(channel.closing_fee),
		[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'closingReason')]: channel.closing_reason == null ? undefined : String(channel.closing_reason),
		[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'closedAtMs')]: timestampMsFromIso(channel.closing_date),
		[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'updatedAtMs')]: timestampMsFromIso(channel.updated_at),
		[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'feeRatePpm')]: channel.fee_rate ?? undefined,
	},
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
	[EntityMetaKey.Fields]: Object.fromEntries(Object.entries({
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
	}).map(([fieldName, value]) => [entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], fieldName), value])),
})

export default {
	source: Source.LightningMempoolSpace_Rest,

	resolvers: [
		defineResolver(Source.LightningMempoolSpace_Rest, {
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

		defineResolver(Source.LightningMempoolSpace_Rest, {
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

		defineResolver(Source.LightningMempoolSpace_Rest, {
			entityType: EntityType.LightningNetwork_Timestamp,
			resolve: {
				LightningNetworkTimestampMsSource: {
					resolve: async ({ $lightningNetwork }) => {
						assertLightningNetwork($lightningNetwork.$network)
						const { getLightningStatistics } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
						return timestampFieldsFromMempoolSpaceStatistics(
							(await getLightningStatistics()).latest
						)
					},
				}
			},
		})({
			nodeCount: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'nodeCount')],
			channelCount: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'channelCount')],
			totalCapacitySats: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'totalCapacitySats')],
			torNodeCount: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'torNodeCount')],
			clearnetNodeCount: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'clearnetNodeCount')],
			unannouncedNodeCount: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'unannouncedNodeCount')],
			averageCapacitySats: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'averageCapacitySats')],
			medianCapacitySats: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'medianCapacitySats')],
			averageFeeRatePpm: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'averageFeeRatePpm')],
			medianFeeRatePpm: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningNetwork_Timestamp, [], 'medianFeeRatePpm')],
			}),

		defineResolver(Source.LightningMempoolSpace_Rest, {
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
							$$timestamps: [
								nodeFieldsFromMempoolSpaceNode(node),
							],
						}
					},
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
				NodeTimestampMsSource: {
					resolve: async ({ $node, timestampMs, source }) => {
						if (source !== Source.LightningMempoolSpace_Rest)
							throw new Error(`LightningMempoolSpace_Rest: unsupported source ${source}`)

						assertLightningNetwork($node.$network)
						const { getLightningNode } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
						return nodeFieldsFromMempoolSpaceNode(
							await getLightningNode({
								publicKey: $node.publicKey,
							}),
							timestampMs
						)
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
				networkAddresses: (snapshot) => snapshot[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'networkAddresses')],
			}),

		defineResolver(Source.LightningMempoolSpace_Rest, {
			entityType: EntityType.LightningChannel,
			resolve: {
				NetworkChannelId: {
					resolve: async ({ $network, channelId }) => {
						assertLightningNetwork($network)
						const { getLightningChannel } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
						return channelFieldsFromMempoolSpaceChannel(
							await getLightningChannel({
								channelId,
							})
						)
					},
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
				ChannelTimestampMsSource: {
					resolve: async ({ $channel, timestampMs }) => {
						assertLightningNetwork($channel.$network)
						const { getLightningChannel } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
						return channelTimestampFieldsFromMempoolSpaceChannel(
							await getLightningChannel({
								channelId: $channel.channelId,
							}),
							timestampMs
						)
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

		defineResolver(Source.LightningMempoolSpace_Rest, {
			entityType: EntityType.LightningNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => {
						assertLightningNetwork($network)
						const { getLightningStatistics } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
						return [
							timestampFieldsFromMempoolSpaceStatistics(
								(await getLightningStatistics()).latest
							),
						]
					},
				}
			},
		})({
				$$timestamps: (snapshot) => snapshot,
			}),

		defineResolver(Source.LightningMempoolSpace_Rest, {
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network) => {
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
								[EntityMetaKey.Fields]: timestampFieldsFromMempoolSpaceStatistics(
									(await getLightningStatistics()).latest
								)[EntityMetaKey.Fields],
							},
						]
					},
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

		defineResolver(Source.LightningMempoolSpace_Rest, {
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

		defineResolver(Source.LightningMempoolSpace_Rest, {
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
								[entityFieldAddressKey(EntityType.LightningChannel, [], 'shortChannelId')]: channel.short_id ?? undefined,
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

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
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
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
) => {
	const node = channel.node ?? channel.node_right ?? channel.node_left

	return {
		shortChannelId: channel.short_id ?? undefined,
		fundingTransactionId: channel.transaction_id ?? undefined,
		fundingOutputIndex: channel.transaction_vout ?? undefined,
		openedAtMs: timestampMsFromIso(channel.created),
		...(node != null && {
			$node1: nodeReferenceFromMempoolSpaceChannelNode(node),
		}),
	}
}

const agreedChannelFeeRatePpm = (
	nodeLeft: MempoolSpaceLightningChannelNode | null | undefined,
	nodeRight: MempoolSpaceLightningChannelNode | null | undefined
) => {
	if (nodeLeft == null || nodeRight == null)
		return

	const leftFeeRate = nodeLeft.fee_rate
	const rightFeeRate = nodeRight.fee_rate
	if (leftFeeRate == null || rightFeeRate == null || leftFeeRate !== rightFeeRate)
		return

	return leftFeeRate
}

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
	feeRatePpm: agreedChannelFeeRatePpm(channel.node_left, channel.node_right),
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

const timestampEntityFields = (
	entityType: (
		| EntityType.LightningNetwork_Timestamp
		| EntityType.LightningNode_Timestamp
		| EntityType.LightningChannel_Timestamp
	),
	snapshot: {
		readonly [fieldName: string]: (
			| bigint
			| number
			| string
			| readonly string[]
			| undefined
		)
	}
) => (
	Object.fromEntries(
		Object.entries(snapshot)
			.filter(([, value]) => value != null)
			.map(([fieldName, value]) => [
				entityFieldAddressKey(entityType, [], fieldName),
				value,
			])
	)
)

const lightningNetworkTimestampRowFromStatistics = (
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
		[EntityMetaKey.Fields]: timestampEntityFields(
			EntityType.LightningNetwork_Timestamp,
			timestampSnapshotFromMempoolSpaceStatistics(statistics)
		),
	}
}

const lightningChannelTimestampRowFromMempoolSpaceChannel = (
	channelSelector: {
		$network: NetworkId
		channelId: string
	},
	channel: MempoolSpaceLightningChannel
) => ({
	[EntityMetaKey.Selector]: {
		$channel: channelSelector,
		timestampMs: timestampMsFromIso(channel.updated_at),
		source: Source.LightningMempoolSpace_Rest,
	},
	[EntityMetaKey.Fields]: timestampEntityFields(
		EntityType.LightningChannel_Timestamp,
		channelTimestampSnapshotFromMempoolSpaceChannel(channel)
	),
})

const lightningMempoolSpaceNodeCountFromStatistics = async () => {
	const { getLightningStatistics } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
	const nodeCount = (await getLightningStatistics()).latest.node_count
	if (nodeCount == null)
		throw new Error('LightningMempoolSpace_Rest: statistics missing node_count')

	return nodeCount
}

const lightningMempoolSpaceChannelCountFromNode = async (publicKey: string) => {
	const { getLightningNode } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
	const node = await getLightningNode({
		publicKey,
	})
	const channelCount = node.active_channel_count ?? node.channels
	if (channelCount == null)
		throw new Error('LightningMempoolSpace_Rest: node detail missing channel count')

	return channelCount
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
											[EntityMetaKey.Fields]: timestampEntityFields(
												EntityType.LightningNode_Timestamp,
												nodeSnapshotFromMempoolSpaceNode(node)
											),
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
									[lightningChannelTimestampRowFromMempoolSpaceChannel(
										channelSelector,
										channel
									)]
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
			entityType: EntityType.LightningNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => {
						assertLightningNetwork($network)
						const { getLightningStatistics } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
						return [
							lightningNetworkTimestampRowFromStatistics(
								$network,
								(await getLightningStatistics()).latest
							),
						]
					},
				}
			},
			resolveLive: {
				networkStats: {
					facetPath: [],
					publishes: {
						'$$timestamps': true,
					},
					start: ({
						fields,
						parentEntitySelector,
						signal,
					}) => {
						assertLightningNetwork(parentEntitySelector.$network)
						let timeout: ReturnType<typeof setTimeout> | undefined
						const poll = async () => {
							try {
								if (signal.aborted)
									return
								const { getLightningStatistics } = await import('$/sources/LightningMempoolSpace/Rest/queries.ts')
								const statistics = (await getLightningStatistics()).latest
								fields.$$timestamps.replaceRows([{
									source: Source.LightningMempoolSpace_Rest,
									value: [lightningNetworkTimestampRowFromStatistics(
										parentEntitySelector.$network,
										statistics
									)],
								}])
							} catch (error) {
								console.error('LightningMempoolSpace_Rest live network stats failed', error)
							}
							if (signal.aborted)
								return
								timeout = setTimeout(() => { void poll() }, 15_000)
						}
						const abort = () => {
							if (timeout != null)
								clearTimeout(timeout)
						}
						signal.addEventListener('abort', abort, { once: true })
						void poll()
						return () => {
							signal.removeEventListener('abort', abort)
							abort()
						}
					},
				},
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
							lightningNetworkTimestampRowFromStatistics(
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
						).slice(0, resolverContextRowLimit(context)).map((channel) => {
							const snapshot = channelSnapshotFromMempoolSpaceChannel(channel)

							return {
								[EntityMetaKey.Selector]: {
									$network,
									channelId: String(channel.id),
								},
								[EntityMetaKey.Fields]: {
									...(snapshot.shortChannelId != null && {
										[entityFieldAddressKey(EntityType.LightningChannel, [], 'shortChannelId')]: snapshot.shortChannelId,
									}),
									...(snapshot.fundingTransactionId != null && {
										[entityFieldAddressKey(EntityType.LightningChannel, [], 'fundingTransactionId')]: snapshot.fundingTransactionId,
									}),
									...(snapshot.fundingOutputIndex != null && {
										[entityFieldAddressKey(EntityType.LightningChannel, [], 'fundingOutputIndex')]: snapshot.fundingOutputIndex,
									}),
									...(snapshot.openedAtMs != null && {
										[entityFieldAddressKey(EntityType.LightningChannel, [], 'openedAtMs')]: snapshot.openedAtMs,
									}),
									...(snapshot.$node1 != null && {
										[entityFieldAddressKey(EntityType.LightningChannel, [], '$node1')]: snapshot.$node1,
									}),
									...(channel.updated_at != null && {
										[entityFieldAddressKey(EntityType.LightningChannel, [], '$$timestamps')]: [
											lightningChannelTimestampRowFromMempoolSpaceChannel(
												{
													$network,
													channelId: String(channel.id),
												},
												channel
											),
										],
									}),
								},
							}
						})
					},
				}
			},
		})({
			$$channels: (snapshot) => snapshot,
		}),

		defineResolver({
			entityType: EntityType.LightningNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => {
						assertLightningNetwork($network)
						return lightningMempoolSpaceNodeCountFromStatistics()
					},
				}
			},
		})({
			$$nodes: {
				resolveCount: (count) => count,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network) => {
						assertLightningNetwork(network)
						return lightningMempoolSpaceNodeCountFromStatistics()
					},
				}
			},
		})({
			Lightning: {
				$$nodes: {
					resolveCount: (count) => count,
				},
			},
		}),

		defineResolver({
			entityType: EntityType.LightningNode,
			resolve: {
				NetworkPublicKey: {
					resolve: async ({ $network, publicKey }) => {
						assertLightningNetwork($network)
						return lightningMempoolSpaceChannelCountFromNode(publicKey)
					},
				}
			},
		})({
			$$channels: {
				resolveCount: (count) => count,
			},
		}),
	],
}

import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { LightningChannelStatus } from '$/schema/LightningChannelStatus.ts'
import { Source } from '$/sources/Source.ts'
import { parseAmbossChannelFundingPoint } from '$/sources/Amboss/Graphql/types.ts'

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

const timestampMsFromChannelWire = (value: string | number) => {
	if (typeof value === 'number')
		return Math.round(value) * 1000
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

const feeRatePpmFromAmbossPolicy = (
	policy: {
		fee_rate_milli_msat: number | string
		disabled: boolean
	} | null | undefined
) => (
	policy == null || policy.disabled ?
		undefined
	:
		Number(policy.fee_rate_milli_msat)
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
		...(countryCode != null && countryCode !== '' && {
			countryCode,
		}),
		...(city != null && city !== '' && {
			city,
		}),
		networkAddresses: graphNode.addresses.map((address) => address.addr),
	}
}

const timestampMsFromAmbossDate = (value: string) => {
	const timestampMs = Date.parse(value)
	if (!Number.isFinite(timestampMs))
		throw new Error('Amboss_Graphql: invalid channel closed_date')
	return timestampMs
}

const channelTimestampSnapshotFromAmbossEdge = (
	edge: Awaited<ReturnType<typeof import('$/sources/Amboss/Graphql/queries.ts').getEdge>>
) => {
	const edgeInfo = edge.graph.info
	const closedInfo = edgeInfo.closed_info
	const closeTransaction = edgeInfo.transactions.close_transaction
	const closingTransactionId = (
		closedInfo?.close_transaction_id
		?? closeTransaction?.id
	)
	const feeRatePpm = (
		feeRatePpmFromAmbossPolicy(edgeInfo.node1_policy)
		?? feeRatePpmFromAmbossPolicy(edgeInfo.node2_policy)
	)

	return {
		status: statusFromAmboss(edgeInfo.is_closed),
		capacitySats: BigInt(edgeInfo.capacity),
		updatedAtMs: timestampMsFromChannelWire(edgeInfo.last_update),
		...(feeRatePpm != null && {
			feeRatePpm,
		}),
		...(closingTransactionId != null && closingTransactionId !== '' && {
			closingTransactionId,
		}),
		...(closeTransaction?.fee != null && {
			closingFeeSats: BigInt(closeTransaction.fee),
		}),
		...(closedInfo?.closure_type != null && {
			closingReason: closedInfo.closure_type,
		}),
		...(closedInfo != null && {
			closedAtMs: timestampMsFromAmbossDate(closedInfo.closed_date),
		}),
	}
}

const ambossChannelListOffset = (
	context: import('$/resolvers/$resolvers.ts').ResolverContext
) => {
	const offset = context.providerContinuationToken == null ?
		context.pagination.offset ?? 0
	:
		Number(context.providerContinuationToken)
	if (!Number.isSafeInteger(offset) || offset < 0)
		throw new Error('Amboss_Graphql: invalid channel list offset')

	return offset
}

const peerPublicKeyFromAmbossChannel = (
	publicKey: string,
	channel: {
		node1_pub: string
		node2_pub: string
	}
) => (
	channel.node1_pub === publicKey ?
		channel.node2_pub
	:
		channel.node1_pub
)

const localPolicyFromAmbossChannel = (
	publicKey: string,
	channel: {
		node1_pub: string
		node2_pub: string
		node1_policy?: {
			fee_rate_milli_msat: number | string
			disabled: boolean
		} | null
		node2_policy?: {
			fee_rate_milli_msat: number | string
			disabled: boolean
		} | null
	}
) => (
	channel.node1_pub === publicKey ?
		channel.node1_policy
	:
		channel.node2_policy
)

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
			entityType: EntityType.LightningNode,
			resolve: {
				NetworkPublicKey: {
					resolve: async ({ $network, publicKey }, context) => {
						assertLightningNetwork($network)
						const offset = ambossChannelListOffset(context)
						const limit = resolverContextRowLimit(context)
						const { getNodeChannels } = await import('$/sources/Amboss/Graphql/queries.ts')
						const channels = await getNodeChannels({
							publicKey,
							limit,
							offset,
						})
						return {
							offset,
							limit,
							channelCount: channels.num_channels,
							rows: channels.channel_list.list.map((channel) => {
								const funding = parseAmbossChannelFundingPoint(channel.chan_point)
								const peerPublicKey = peerPublicKeyFromAmbossChannel(publicKey, channel)
								const feeRatePpm = feeRatePpmFromAmbossPolicy(
									localPolicyFromAmbossChannel(publicKey, channel)
								)
								const timestampMs = timestampMsFromChannelWire(channel.last_update)

								return {
									[EntityMetaKey.Selector]: {
										$network,
										channelId: channel.long_channel_id,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.LightningChannel, [], 'shortChannelId')]:
											channel.short_channel_id,
										[entityFieldAddressKey(EntityType.LightningChannel, [], 'fundingTransactionId')]:
											funding.fundingTransactionId,
										[entityFieldAddressKey(EntityType.LightningChannel, [], 'fundingOutputIndex')]:
											funding.fundingOutputIndex,
										[entityFieldAddressKey(EntityType.LightningChannel, [], '$node1')]: {
											[EntityMetaKey.Selector]: {
												$network,
												publicKey: peerPublicKey,
											},
										},
										[entityFieldAddressKey(EntityType.LightningChannel, [], '$$timestamps')]: [
											{
												[EntityMetaKey.Selector]: {
													$channel: {
														$network,
														channelId: channel.long_channel_id,
													},
													timestampMs,
													source: Source.Amboss_Graphql,
												},
												[EntityMetaKey.Fields]: {
													[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'capacitySats')]:
														BigInt(channel.capacity),
													[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'updatedAtMs')]:
														timestampMs,
													...(feeRatePpm != null && {
														[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'feeRatePpm')]:
															feeRatePpm,
													}),
												},
											},
										],
									},
								}
							}),
						}
					},
				}
			},
		})({
			$$channels: {
				select: (snapshot) => snapshot.rows,
				resolveCount: (snapshot) => snapshot.channelCount,
				continuation: (snapshot) => {
					const nextOffset = snapshot.offset + snapshot.rows.length
					const terminal = (
						snapshot.rows.length < snapshot.limit
						|| nextOffset >= snapshot.channelCount
					)

					return {
						operation: 'node-channels',
						target: 'amboss',
						terminal,
						...(!terminal && {
							token: String(nextOffset),
						}),
					}
				},
			},
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
						const funding = parseAmbossChannelFundingPoint(edgeInfo.chan_point)

						return {
							[EntityMetaKey.Selector]: {
								$network,
								channelId: edge.long_channel_id,
							},
							shortChannelId: edge.short_channel_id,
							fundingTransactionId: funding.fundingTransactionId,
							fundingOutputIndex: funding.fundingOutputIndex,
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
			fundingTransactionId: (snapshot) => snapshot.fundingTransactionId,
			fundingOutputIndex: (snapshot) => snapshot.fundingOutputIndex,
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
			closingTransactionId: (snapshot) => snapshot.closingTransactionId,
			closingFeeSats: (snapshot) => snapshot.closingFeeSats,
			closingReason: (snapshot) => snapshot.closingReason,
			closedAtMs: (snapshot) => snapshot.closedAtMs,
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

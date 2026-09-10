import {
	resolverContextRowLimit,
	type ResolverContext,
} from '$/resolvers/$resolvers.ts'
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

const agreedChannelFeeRatePpm = (
	node1Policy: {
		fee_rate_milli_msat: number | string
		disabled: boolean
	} | null | undefined,
	node2Policy: {
		fee_rate_milli_msat: number | string
		disabled: boolean
	} | null | undefined
) => {
	if (node1Policy == null || node2Policy == null)
		return undefined

	const node1FeeRate = Number(node1Policy.fee_rate_milli_msat)
	const node2FeeRate = Number(node2Policy.fee_rate_milli_msat)
	if (!Number.isFinite(node1FeeRate) || node1FeeRate !== node2FeeRate)
		return undefined

	return node1FeeRate
}

const lightningChannelRoutingPolicyFromAmboss = ({
	$channel,
	timestampMs,
	$network,
	towardPublicKey,
	policy,
}: {
	$channel: {
		$network: NetworkId
		channelId: string
	}
	timestampMs: number
	$network: NetworkId
	towardPublicKey: string
	policy: {
		fee_rate_milli_msat: number | string
		disabled: boolean
	} | null | undefined
}) => {
	if (policy == null)
		return
	const feeRatePpm = Number(policy.fee_rate_milli_msat)
	return {
		[EntityMetaKey.Selector]: {
			$channelTimestamp: {
				$channel,
				timestampMs,
				source: Source.Amboss_Graphql,
			},
			$towardNode: {
				$network,
				publicKey: towardPublicKey,
			},
		},
		[EntityMetaKey.Fields]: {
			...(Number.isFinite(feeRatePpm) && {
				[entityFieldAddressKey(EntityType.LightningChannelRoutingPolicy_Timestamp, [], 'feeRatePpm')]: feeRatePpm,
			}),
			[entityFieldAddressKey(EntityType.LightningChannelRoutingPolicy_Timestamp, [], 'disabled')]: policy.disabled,
		},
	}
}

const lightningChannelRoutingPoliciesFromAmboss = ({
	$channel,
	timestampMs,
	$network,
	node1Pub,
	node2Pub,
	node1Policy,
	node2Policy,
}: {
	$channel: {
		$network: NetworkId
		channelId: string
	}
	timestampMs: number
	$network: NetworkId
	node1Pub: string
	node2Pub: string
	node1Policy: {
		fee_rate_milli_msat: number | string
		disabled: boolean
	} | null | undefined
	node2Policy: {
		fee_rate_milli_msat: number | string
		disabled: boolean
	} | null | undefined
}) => (
	[
		lightningChannelRoutingPolicyFromAmboss({
			$channel,
			timestampMs,
			$network,
			towardPublicKey: node2Pub,
			policy: node1Policy,
		}),
		lightningChannelRoutingPolicyFromAmboss({
			$channel,
			timestampMs,
			$network,
			towardPublicKey: node1Pub,
			policy: node2Policy,
		}),
	].flatMap((policy) => policy == null ? [] : [policy])
)

const nodeSnapshotFromAmbossNode = (
	node: Awaited<ReturnType<typeof import('$/sources/Amboss/Graphql/queries.ts').getNode>>
) => {
	const graphNode = node.graph_info.node
	const channels = node.graph_info.channels
	const primaryAddress = graphNode.addresses[0]
	const countryCode = primaryAddress.ip_info.country_code
	const city = primaryAddress.ip_info.city

	return {
		alias: graphNode.alias,
		color: graphNode.color,
		capacitySats: BigInt(channels.total_capacity),
		channelCount: channels.num_channels,
		updatedAtMs: timestampMsFromNodeSeconds(graphNode.last_update),
		countryCode,
		city,
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
	const feeRatePpm = agreedChannelFeeRatePpm(
		edgeInfo.node1_policy,
		edgeInfo.node2_policy
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

const timestampEntityFields = (
	entityType: (
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

const popularLightningNodeRows = async (
	$network: NetworkId,
	context: ResolverContext,
) => {
	assertLightningNetwork($network)
	const { getPopularNodePubkeys } = await import('$/sources/Amboss/Graphql/queries.ts')
	return (await getPopularNodePubkeys())
		.slice(0, resolverContextRowLimit(context))
		.map((publicKey) => ({
			[EntityMetaKey.Selector]: {
				$network,
				publicKey,
			},
		}))
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
									[EntityMetaKey.Fields]: timestampEntityFields(
										EntityType.LightningNode_Timestamp,
										nodeSnapshotFromAmbossNode(node)
									),
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
								const feeRatePpm = agreedChannelFeeRatePpm(
									channel.node1_policy,
									channel.node2_policy
								)
								const timestampMs = timestampMsFromChannelWire(channel.last_update)
								const $channel = {
									$network,
									channelId: channel.long_channel_id,
								}

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
													$channel,
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
													[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], '$$routingPolicies')]:
														lightningChannelRoutingPoliciesFromAmboss({
															$channel,
															timestampMs,
															$network,
															node1Pub: channel.node1_pub,
															node2Pub: channel.node2_pub,
															node1Policy: channel.node1_policy,
															node2Policy: channel.node2_policy,
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
						const timestampMs = timestampMsFromChannelWire(edgeInfo.last_update)
						const $channel = {
							$network,
							channelId: edge.long_channel_id,
						}

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
										$channel,
										timestampMs,
										source: Source.Amboss_Graphql,
									},
									[EntityMetaKey.Fields]: {
										...timestampEntityFields(
											EntityType.LightningChannel_Timestamp,
											channelTimestampSnapshotFromAmbossEdge(edge)
										),
										[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], '$$routingPolicies')]:
											lightningChannelRoutingPoliciesFromAmboss({
												$channel,
												timestampMs,
												$network,
												node1Pub: edgeInfo.node1_pub,
												node2Pub: edgeInfo.node2_pub,
												node1Policy: edgeInfo.node1_policy,
												node2Policy: edgeInfo.node2_policy,
											}),
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
			entityType: EntityType.LightningNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => (
						popularLightningNodeRows($network, context)
					),
				}
			},
		})({
			$$nodes: (snapshot) => snapshot,
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Slug: {
					resolve: async (network, context) => (
						popularLightningNodeRows(network, context)
					),
				}
			},
		})({
			Lightning: {
				$$nodes: (snapshot) => snapshot,
			},
		}),
	],
} satisfies RegisteredSourceResolverModule

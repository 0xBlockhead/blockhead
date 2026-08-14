/**
 * Connected LND REST — local node / session surface.
 *
 * Owns `BlockheadLightning*` rows (`connectionId` session identity, invoices,
 * payments, channel state). May also project public `Lightning*` graph entities
 * from the connected node. This is not a browser wallet adapter; public-graph
 * indexing without a local node remains `LightningMempoolSpace_Rest`.
 */
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { networkBySlug } from '$/constants/Network.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { LightningChannelStatus } from '$/schema/LightningChannelStatus.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type {
	LndChannel,
	LndChannelBalanceResponse,
	LndChannelEdge,
	LndForwardingEvent,
	LndGetInfoResponse,
	LndInvoice,
	LndNetworkInfoResponse,
	LndNodeInfoResponse,
	LndPayment,
	LndPeer,
	LndWalletBalanceResponse,
} from '$/sources/LightningLnd/Rest/types.ts'
type NetworkId = EntitySelector<typeof schema, EntityType.Network>
type LocalNodeStateId = EntitySelector<typeof schema, EntityType.BlockheadLightningNodeState>

const lightningNetwork = {
	slug: 'lightning',
} as const

const assertLightningNetwork = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== 'lightning')
		throw new Error('LightningLnd_Rest: unsupported Lightning network')
}

const bigintFromWire = (value: string | null | undefined) => (
	value == null || value === '' ?
		undefined
	:
		BigInt(value)
)

const timestampMsFromSeconds = (seconds: string | null | undefined) => (
	seconds == null || seconds === '' ?
		undefined
	:
		Number(seconds) * 1000
)

const timestampMsFromLndUpdate = (seconds: number | null | undefined) => (
	seconds == null ?
		undefined
	:
		seconds * 1000
)

const timestampMsFromNanoseconds = (nanoseconds: string | null | undefined) => (
	nanoseconds == null || nanoseconds === '' ?
		undefined
	:
		Math.floor(Number(nanoseconds) / 1_000_000)
)

const channelPointParts = (channelPoint: string) => {
	const [fundingTransactionId, outputIndex] = channelPoint.split(':')
	return {
		fundingTransactionId,
		fundingOutputIndex: Number(outputIndex),
	}
}

const agreedChannelFeeRatePpm = (
	node1Policy: LndChannelEdge['node1_policy'],
	node2Policy: LndChannelEdge['node2_policy']
) => {
	const node1FeeRate = node1Policy?.fee_rate_milli_msat
	const node2FeeRate = node2Policy?.fee_rate_milli_msat
	if (node1FeeRate == null || node2FeeRate == null || node1FeeRate !== node2FeeRate)
		return undefined

	return Number(node1FeeRate)
}

const channelStatusFromLndChannel = (channel: LndChannel) => (
	channel.active === true ?
		LightningChannelStatus.Active
	:
		channel.active === false ?
			LightningChannelStatus.Inactive
		:
			LightningChannelStatus.Unknown
)

const lightningNodeTimestampFields = (
	publicKey: string,
	info: LndGetInfoResponse,
	channels: LndChannel[]
) => {
	if (publicKey === info.identity_pubkey)
		return {
			alias: info.alias,
			color: info.color,
			capacitySats: undefined,
			channelCount: (info.num_active_channels ?? 0) + (info.num_inactive_channels ?? 0),
			updatedAtMs: undefined,
			networkAddresses: info.uris ?? [],
		}

	const channelsForNode = channels.filter((channel) => channel.remote_pubkey === publicKey)
	if (channelsForNode.length === 0)
		throw new Error(`LightningLnd_Rest: node not found ${publicKey}`)

	return {
		alias: undefined,
		color: undefined,
		capacitySats: undefined,
		channelCount: channelsForNode.length,
		updatedAtMs: undefined,
		networkAddresses: [] as string[],
	}
}

const lightningNodeTimestampFieldsFromGraph = (
	info: LndNodeInfoResponse
) => ({
	alias: info.node.alias,
	color: info.node.color,
	capacitySats: bigintFromWire(info.total_capacity),
	channelCount: info.num_channels,
	updatedAtMs: timestampMsFromLndUpdate(info.node.last_update),
	networkAddresses: (info.node.addresses ?? []).map((address) => address.addr),
})

const channelFieldsFromLndEdge = (
	edge: LndChannelEdge,
	timestampMs = timestampMsFromLndUpdate(edge.last_update) ?? Date.now()
) => {
	const channelPoint = (
		edge.chan_point == null ?
			undefined
		:
			channelPointParts(edge.chan_point)
	)
	const feeRatePpm = agreedChannelFeeRatePpm(edge.node1_policy, edge.node2_policy)
	return {
		$node1: {
			[EntityMetaKey.Selector]: {
				$network: lightningNetwork,
				publicKey: edge.node1_pub,
			},
		},
		...(channelPoint != null && {
			fundingTransactionId: channelPoint.fundingTransactionId,
			fundingOutputIndex: channelPoint.fundingOutputIndex,
		}),
		$$timestamps: [
			{
				[EntityMetaKey.Selector]: {
					$channel: {
						$network: lightningNetwork,
						channelId: edge.channel_id,
					},
					timestampMs,
					source: Source.LightningLnd_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'status')]: (
						edge.node1_policy?.disabled === true && edge.node2_policy?.disabled === true ?
							LightningChannelStatus.Inactive
						:
							LightningChannelStatus.Active
					),
					...(bigintFromWire(edge.capacity) != null && {
						[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'capacitySats')]: bigintFromWire(edge.capacity),
					}),
					...(edge.last_update != null && {
						[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'updatedAtMs')]: edge.last_update * 1000,
					}),
					...(feeRatePpm != null && {
						[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'feeRatePpm')]: feeRatePpm,
					}),
				},
			},
		],
	}
}

const invoiceStateFromLnd = (state: string | null | undefined) => (
	state === 'OPEN' ?
		'Open'
	:
		state === 'SETTLED' ?
			'Settled'
		:
			state === 'CANCELED' ?
				'Canceled'
			:
				state === 'ACCEPTED' ?
					'Accepted'
				:
					'Unknown'
)

const paymentStatusFromLnd = (status: string | null | undefined) => (
	status === 'IN_FLIGHT' ?
		'InFlight'
	:
		status === 'SUCCEEDED' ?
			'Succeeded'
		:
			status === 'FAILED' ?
				'Failed'
			:
				'Unknown'
)

const channelFieldsFromLndChannel = (
	channel: LndChannel,
	timestampMs = Date.now()
) => {
	const channelPoint = channelPointParts(channel.channel_point)
	return {
		$node1: {
			[EntityMetaKey.Selector]: {
				$network: lightningNetwork,
				publicKey: channel.remote_pubkey,
			},
		},
		fundingTransactionId: channelPoint.fundingTransactionId,
		fundingOutputIndex: channelPoint.fundingOutputIndex,
		$$timestamps: [
			{
				[EntityMetaKey.Selector]: {
					$channel: {
						$network: lightningNetwork,
						channelId: channel.chan_id,
					},
					timestampMs,
					source: Source.LightningLnd_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'status')]: channelStatusFromLndChannel(channel),
					...(bigintFromWire(channel.capacity) != null && {
						[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'capacitySats')]: bigintFromWire(channel.capacity),
					}),
				},
			},
		],
	}
}

const channelTimestampFieldsFromLndChannel = (channel: LndChannel) => ({
	status: channelStatusFromLndChannel(channel),
	capacitySats: bigintFromWire(channel.capacity),
	feeRatePpm: undefined,
	updatedAtMs: undefined,
})

const channelTimestampFieldsFromLndEdge = (
	channel: LndChannel | undefined,
	edge: LndChannelEdge
) => ({
	...(
		channel == null ?
			{
				status: (
					edge.node1_policy?.disabled === true && edge.node2_policy?.disabled === true ?
						LightningChannelStatus.Inactive
					:
						LightningChannelStatus.Active
				),
			}
		:
			channelTimestampFieldsFromLndChannel(channel)
	),
	capacitySats: bigintFromWire(edge.capacity ?? channel?.capacity),
	updatedAtMs: edge.last_update == null ? undefined : edge.last_update * 1000,
	feeRatePpm: agreedChannelFeeRatePpm(edge.node1_policy, edge.node2_policy),
})

const channelRowFromLndChannel = (channel: LndChannel) => {
	const fields = channelFieldsFromLndChannel(channel)
	return {
		[EntityMetaKey.Selector]: {
			$network: lightningNetwork,
			channelId: channel.chan_id,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.LightningChannel, [], '$node1')]: fields.$node1,
			[entityFieldAddressKey(EntityType.LightningChannel, [], 'fundingTransactionId')]: fields.fundingTransactionId,
			[entityFieldAddressKey(EntityType.LightningChannel, [], 'fundingOutputIndex')]: fields.fundingOutputIndex,
			[entityFieldAddressKey(EntityType.LightningChannel, [], '$$timestamps')]: fields.$$timestamps,
		},
	}
}

const channelRowFromLndEdge = (edge: LndChannelEdge) => {
	const fields = channelFieldsFromLndEdge(edge)
	return {
		[EntityMetaKey.Selector]: {
			$network: lightningNetwork,
			channelId: edge.channel_id,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.LightningChannel, [], '$node1')]: fields.$node1,
			...(fields.fundingTransactionId != null && {
				[entityFieldAddressKey(EntityType.LightningChannel, [], 'fundingTransactionId')]: fields.fundingTransactionId,
			}),
			...(fields.fundingOutputIndex != null && {
				[entityFieldAddressKey(EntityType.LightningChannel, [], 'fundingOutputIndex')]: fields.fundingOutputIndex,
			}),
			[entityFieldAddressKey(EntityType.LightningChannel, [], '$$timestamps')]: fields.$$timestamps,
		},
	}
}

const invoicePaymentHash = (invoice: LndInvoice) => (
	invoice.r_hash_str ?? invoice.r_hash
)

const invoiceFieldsFromLndInvoice = (
	invoice: LndInvoice,
	paymentHash: string,
	timestampMs = Date.now()
) => ({
	paymentRequest: invoice.payment_request,
	memo: invoice.memo,
	valueMsat: bigintFromWire(invoice.value_msat),
	createdAtMs: timestampMsFromSeconds(invoice.creation_date),
	expirySeconds: invoice.expiry == null ? undefined : Number(invoice.expiry),
	private: invoice.private,
	addIndex: bigintFromWire(invoice.add_index),
	$$timestamps: [
		{
			[EntityMetaKey.Selector]: {
				$invoice: {
					$network: lightningNetwork,
					paymentHash,
				},
				timestampMs,
				source: Source.LightningLnd_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BlockheadLightningInvoice_Timestamp, [], 'state')]: invoiceStateFromLnd(invoice.state),
				...(bigintFromWire(invoice.amt_paid_msat) != null && {
					[entityFieldAddressKey(EntityType.BlockheadLightningInvoice_Timestamp, [], 'amountPaidMsat')]: bigintFromWire(invoice.amt_paid_msat),
				}),
				...(timestampMsFromSeconds(invoice.settle_date) != null && {
					[entityFieldAddressKey(EntityType.BlockheadLightningInvoice_Timestamp, [], 'settledAtMs')]: timestampMsFromSeconds(invoice.settle_date),
				}),
				...(bigintFromWire(invoice.settle_index) != null && {
					[entityFieldAddressKey(EntityType.BlockheadLightningInvoice_Timestamp, [], 'settleIndex')]: bigintFromWire(invoice.settle_index),
				}),
			},
		},
	],
})

const invoiceTimestampFieldsFromLndInvoice = (invoice: LndInvoice) => ({
	amountPaidMsat: bigintFromWire(invoice.amt_paid_msat),
	settledAtMs: timestampMsFromSeconds(invoice.settle_date),
	state: invoiceStateFromLnd(invoice.state),
	settleIndex: bigintFromWire(invoice.settle_index),
})

const paymentFieldsFromLndPayment = (
	payment: LndPayment,
	timestampMs = Date.now()
) => ({
	paymentRequest: payment.payment_request,
	valueMsat: bigintFromWire(payment.value_msat),
	createdAtMs: (
		timestampMsFromNanoseconds(payment.creation_time_ns)
		?? timestampMsFromSeconds(payment.creation_date)
	),
	paymentIndex: bigintFromWire(payment.payment_index),
	$$timestamps: [
		{
			[EntityMetaKey.Selector]: {
				$payment: {
					$network: lightningNetwork,
					paymentHash: payment.payment_hash,
				},
				timestampMs,
				source: Source.LightningLnd_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BlockheadLightningPayment_Timestamp, [], 'status')]: paymentStatusFromLnd(payment.status),
				...(bigintFromWire(payment.fee_msat) != null && {
					[entityFieldAddressKey(EntityType.BlockheadLightningPayment_Timestamp, [], 'feeMsat')]: bigintFromWire(payment.fee_msat),
				}),
				...(payment.failure_reason != null && {
					[entityFieldAddressKey(EntityType.BlockheadLightningPayment_Timestamp, [], 'failureReason')]: payment.failure_reason,
				}),
				...(payment.payment_preimage != null && {
					[entityFieldAddressKey(EntityType.BlockheadLightningPayment_Timestamp, [], 'preimage')]: payment.payment_preimage,
				}),
			},
		},
	],
})

const paymentTimestampFieldsFromLndPayment = (payment: LndPayment) => ({
	feeMsat: bigintFromWire(payment.fee_msat),
	status: paymentStatusFromLnd(payment.status),
	failureReason: payment.failure_reason,
	preimage: payment.payment_preimage,
})

const networkTimestampFieldsFromLndNetworkInfo = (info: LndNetworkInfoResponse) => ({
	nodeCount: info.num_nodes,
	channelCount: info.num_channels,
	...(info.total_network_capacity != null && {
		totalCapacitySats: bigintFromWire(info.total_network_capacity),
	}),
	...(Number.isFinite(info.avg_channel_size) && {
		averageCapacitySats: BigInt(Math.trunc(info.avg_channel_size)),
	}),
	...(info.median_channel_size_sat != null && {
		medianCapacitySats: bigintFromWire(info.median_channel_size_sat),
	}),
})

const lndChannels = async () => {
	const { listChannels } = await import('$/sources/LightningLnd/Rest/queries.ts')
	return ((await listChannels()).channels ?? [])
		.filter((channel) => channel.private === false)
}

const lndLocalChannels = async () => {
	const { listChannels } = await import('$/sources/LightningLnd/Rest/queries.ts')
	return (await listChannels()).channels ?? []
}

const lndInfo = async () => {
	const { getInfo } = await import('$/sources/LightningLnd/Rest/queries.ts')
	return getInfo()
}

const peerFieldsFromLndPeer = (
	peer: LndPeer,
	$localNodeState: LocalNodeStateId,
	timestampMs: number
) => ({
	$$timestamps: [
		{
			[EntityMetaKey.Selector]: {
				$peer: {
					$localNodeState,
					publicKey: peer.pub_key,
				},
				timestampMs,
				source: Source.LightningLnd_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BlockheadLightningPeer_Timestamp, [], 'address')]: peer.address,
				...(bigintFromWire(peer.bytes_sent) != null && {
					[entityFieldAddressKey(EntityType.BlockheadLightningPeer_Timestamp, [], 'bytesSent')]: bigintFromWire(peer.bytes_sent),
				}),
				...(bigintFromWire(peer.bytes_recv) != null && {
					[entityFieldAddressKey(EntityType.BlockheadLightningPeer_Timestamp, [], 'bytesRecv')]: bigintFromWire(peer.bytes_recv),
				}),
				...(bigintFromWire(peer.sat_sent) != null && {
					[entityFieldAddressKey(EntityType.BlockheadLightningPeer_Timestamp, [], 'satsSent')]: bigintFromWire(peer.sat_sent),
				}),
				...(bigintFromWire(peer.sat_recv) != null && {
					[entityFieldAddressKey(EntityType.BlockheadLightningPeer_Timestamp, [], 'satsRecv')]: bigintFromWire(peer.sat_recv),
				}),
				...(peer.inbound != null && {
					[entityFieldAddressKey(EntityType.BlockheadLightningPeer_Timestamp, [], 'inbound')]: peer.inbound,
				}),
				...(bigintFromWire(peer.ping_time) != null && {
					[entityFieldAddressKey(EntityType.BlockheadLightningPeer_Timestamp, [], 'pingTimeMicros')]: bigintFromWire(peer.ping_time),
				}),
			},
		},
	],
})

const forwardFieldsFromLndEvent = (event: LndForwardingEvent) => ({
	$incomingChannel: {
		[EntityMetaKey.Selector]: {
			$network: lightningNetwork,
			channelId: event.chan_id_in,
		},
	},
	incomingHtlcId: BigInt(event.incoming_htlc_id),
	$outgoingChannel: {
		[EntityMetaKey.Selector]: {
			$network: lightningNetwork,
			channelId: event.chan_id_out,
		},
	},
	outgoingHtlcId: BigInt(event.outgoing_htlc_id),
	incomingMsat: BigInt(event.amt_in_msat),
	outgoingMsat: BigInt(event.amt_out_msat),
	feeMsat: BigInt(event.fee_msat),
	completionTimestampNs: BigInt(event.timestamp_ns),
})

const channelStateTimestampFieldsFromLndChannel = (channel: LndChannel) => ({
	localBalanceSats: bigintFromWire(channel.local_balance),
	remoteBalanceSats: bigintFromWire(channel.remote_balance),
	unsettledBalanceSats: bigintFromWire(channel.unsettled_balance),
	active: channel.active,
	commitFeeSats: bigintFromWire(channel.commit_fee),
	commitWeight: bigintFromWire(channel.commit_weight),
	feePerKw: bigintFromWire(channel.fee_per_kw),
	numUpdates: bigintFromWire(channel.num_updates),
	lastSyncedAt: Date.now(),
})

const htlcFieldsFromLndHtlc = (
	channel: LndChannel,
	htlc: NonNullable<LndChannel['pending_htlcs']>[number],
	fallbackIndex: number
) => {
	const htlcIndex = (
		htlc.htlc_index == null || htlc.htlc_index === '' ?
			fallbackIndex
		:
			Number(htlc.htlc_index)
	)
	if (!Number.isSafeInteger(htlcIndex) || htlcIndex < 0)
		throw new Error(`LightningLnd_Rest: invalid HTLC index ${htlc.htlc_index}`)

	const amountSats = bigintFromWire(htlc.amount)

	return {
		htlcIndex,
		$channel: {
			[EntityMetaKey.Selector]: {
				$network: lightningNetwork,
				channelId: channel.chan_id,
			},
		},
		direction: (
			htlc.incoming === true ?
				'Incoming'
			: htlc.incoming === false ?
				'Outgoing'
			:
				undefined
		),
		...(amountSats != null && {
			amountMsat: amountSats * 1000n,
		}),
		...(htlc.expiration_height != null && {
			expiryHeight: BigInt(htlc.expiration_height),
		}),
		hashLock: htlc.hash_lock,
		state: htlc.state,
	}
}

const nodeStateTimestampFieldsFromLndInfo = (
	info: LndGetInfoResponse,
	walletBalance: LndWalletBalanceResponse,
	channelBalance: LndChannelBalanceResponse
) => ({
	nodeVersion: info.version,
	syncedToChain: info.synced_to_chain,
	syncedToGraph: info.synced_to_graph,
	...(info.block_height != null && {
		blockHeight: BigInt(info.block_height),
	}),
	...(info.best_header_timestamp != null && info.best_header_timestamp !== '' && {
		bestHeaderTimestampMs: Number(info.best_header_timestamp) * 1000,
	}),
	walletBalanceSats: bigintFromWire(walletBalance.total_balance),
	channelBalanceSats: bigintFromWire(channelBalance.local_balance?.sat ?? channelBalance.balance),
	pendingChannelBalanceSats: bigintFromWire(channelBalance.pending_open_local_balance?.sat ?? channelBalance.pending_open_balance),
	peerCount: info.num_peers,
	activeChannelCount: info.num_active_channels,
	inactiveChannelCount: info.num_inactive_channels,
	pendingChannelCount: info.num_pending_channels,
})

export default {
	source: Source.LightningLnd_Rest,

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
								[EntityMetaKey.Selector]: {
									caip2: networkBySlug.bitcoin.caip2,
								},
							},
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$lightningNetwork: {
											$network,
										},
										timestampMs: Date.now(),
										source: Source.LightningLnd_Rest,
									},
								},
							],
						}
					},
				},
			},
		})({
			name: (network) => network.name,
			$settlementNetwork: (network) => network.$settlementNetwork,
			$$timestamps: (network) => network.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.LightningNetwork_Timestamp,
			resolve: {
				LightningNetworkTimestampMsSource: {
					resolve: async ({ $lightningNetwork, source }) => {
						if (source !== Source.LightningLnd_Rest) throw new Error(`LightningLnd_Rest: unsupported source ${source}`)
						assertLightningNetwork($lightningNetwork.$network)
						const { getNetworkInfo } = await import('$/sources/LightningLnd/Rest/queries.ts')
						return networkTimestampFieldsFromLndNetworkInfo(await getNetworkInfo())
					},
				},
			},
		})({
			nodeCount: (snapshot) => snapshot.nodeCount,
			channelCount: (snapshot) => snapshot.channelCount,
			totalCapacitySats: (snapshot) => snapshot.totalCapacitySats,
			averageCapacitySats: (snapshot) => snapshot.averageCapacitySats,
			medianCapacitySats: (snapshot) => snapshot.medianCapacitySats,
		}),

		defineResolver({
			entityType: EntityType.BlockheadLightningNodeState,
			resolve: {
				ConnectionIdNetwork: {
					resolve: async ({ connectionId, $network }) => {
						assertLightningNetwork($network.$network)
						const info = await lndInfo()
						const timestampMs = Date.now()
						return {
							connectionId,
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							lndPubkey: info.identity_pubkey,
							alias: info.alias,
							$node: {
								[EntityMetaKey.Selector]: {
									$network: $network.$network,
									publicKey: info.identity_pubkey,
								},
							},
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$localNodeState: {
											connectionId,
											$network,
										},
										timestampMs,
										source: Source.LightningLnd_Rest,
									},
								},
							],
						}
					},
				},
			},
		})({
			connectionId: (state) => state.connectionId,
			$network: (state) => state.$network,
			lndPubkey: (state) => state.lndPubkey,
			alias: (state) => state.alias,
			$node: (state) => state.$node,
			$$timestamps: (state) => state.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.BlockheadLightningNodeState,
			resolve: {
				ConnectionIdNetwork: {
					resolve: async ({ connectionId, $network }) => {
						assertLightningNetwork($network.$network)
						const { listPeers } = await import('$/sources/LightningLnd/Rest/queries.ts')
						const $localNodeState = {
							connectionId,
							$network,
						}
						const timestampMs = Date.now()
						return (await listPeers()).peers?.map((peer) => ({
							[EntityMetaKey.Selector]: {
								$localNodeState,
								publicKey: peer.pub_key,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.BlockheadLightningPeer, [], '$$timestamps')]: peerFieldsFromLndPeer(
									peer,
									$localNodeState,
									timestampMs
								).$$timestamps,
							},
						})) ?? []
					},
				},
			},
		})({
			$$peers: (peers) => peers,
		}),

		defineResolver({
			entityType: EntityType.BlockheadLightningPeer,
			resolve: {
				LocalNodeStatePublicKey: {
					resolve: async ({ $localNodeState, publicKey }) => {
						assertLightningNetwork($localNodeState.$network.$network)
						const { listPeers, lookupGraphNode } = await import('$/sources/LightningLnd/Rest/queries.ts')
						const peer = (await listPeers()).peers?.find((peer) => peer.pub_key === publicKey)
						if (peer == null)
							throw new Error(`LightningLnd_Rest: peer not found ${publicKey}`)

						const graphNode = await lookupGraphNode({
							publicKey,
						})
						return {
							...peerFieldsFromLndPeer(peer, $localNodeState, Date.now()),
							...(graphNode != null && {
								$node: {
									[EntityMetaKey.Selector]: {
										$network: $localNodeState.$network.$network,
										publicKey,
									},
								},
							}),
						}
					},
				},
			},
		})({
			$node: (peer) => peer.$node,
			$$timestamps: (peer) => peer.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.BlockheadLightningNodeState,
			resolve: {
				ConnectionIdNetwork: {
					resolve: async ({ connectionId, $network }, context) => {
						assertLightningNetwork($network.$network)
						const { getForwardingHistory } = await import('$/sources/LightningLnd/Rest/queries.ts')
						const pageSize = Math.min(100, resolverContextRowLimit(context))
						return {
							$localNodeState: {
								connectionId,
								$network,
							},
							page: await getForwardingHistory({
								indexOffset: context.providerContinuationToken,
								numMaxEvents: pageSize,
							}),
							pageSize,
						}
					},
				},
			},
		})({
			$$forwards: {
				select: ({ $localNodeState, page }) => (page.forwarding_events ?? []).map((event) => {
					const fields = forwardFieldsFromLndEvent(event)
					return {
						[EntityMetaKey.Selector]: {
							$localNodeState,
							$incomingChannel: fields.$incomingChannel[EntityMetaKey.Selector],
							incomingHtlcId: fields.incomingHtlcId,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.BlockheadLightningForward, [], '$outgoingChannel')]: fields.$outgoingChannel,
							[entityFieldAddressKey(EntityType.BlockheadLightningForward, [], 'outgoingHtlcId')]: fields.outgoingHtlcId,
							[entityFieldAddressKey(EntityType.BlockheadLightningForward, [], 'incomingMsat')]: fields.incomingMsat,
							[entityFieldAddressKey(EntityType.BlockheadLightningForward, [], 'outgoingMsat')]: fields.outgoingMsat,
							[entityFieldAddressKey(EntityType.BlockheadLightningForward, [], 'feeMsat')]: fields.feeMsat,
							[entityFieldAddressKey(EntityType.BlockheadLightningForward, [], 'completionTimestampNs')]: fields.completionTimestampNs,
						},
					}
				}),
				continuation: ({ $localNodeState, page, pageSize }, _state, context) => (
					page.last_offset_index == null
					|| page.last_offset_index === context.providerContinuationToken
					|| (page.forwarding_events ?? []).length < pageSize ?
						{
							operation: 'forwards',
							target: $localNodeState.connectionId,
							terminal: true,
						}
					:
						{
							operation: 'forwards',
							target: $localNodeState.connectionId,
							terminal: false,
							token: page.last_offset_index,
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.BlockheadLightningForward,
			resolve: {
				LocalNodeStateIncomingChannelIncomingHtlcId: {
					resolve: async ({ $localNodeState, $incomingChannel, incomingHtlcId }) => {
						assertLightningNetwork($localNodeState.$network.$network)
						assertLightningNetwork($incomingChannel.$network)
						const { getForwardingHistory } = await import('$/sources/LightningLnd/Rest/queries.ts')
						const visitedOffsets = new Set<number>()
						let indexOffset: number | undefined
						for (;;) {
							const page = await getForwardingHistory({
								indexOffset,
								numMaxEvents: 100,
							})
							const event = (page.forwarding_events ?? []).find((event) => (
								event.chan_id_in === $incomingChannel.channelId
								&& BigInt(event.incoming_htlc_id) === incomingHtlcId
							))
							if (event != null)
								return forwardFieldsFromLndEvent(event)

							if (
								page.last_offset_index == null
								|| page.last_offset_index === indexOffset
								|| (page.forwarding_events ?? []).length < 100
								|| visitedOffsets.has(page.last_offset_index)
							)
								throw new Error(`LightningLnd_Rest: forward not found ${$incomingChannel.channelId}:${incomingHtlcId}`)

							visitedOffsets.add(page.last_offset_index)
							indexOffset = page.last_offset_index
						}
					},
				},
			},
		})({
			$incomingChannel: (forward) => forward.$incomingChannel,
			incomingHtlcId: (forward) => forward.incomingHtlcId,
			$outgoingChannel: (forward) => forward.$outgoingChannel,
			outgoingHtlcId: (forward) => forward.outgoingHtlcId,
			incomingMsat: (forward) => forward.incomingMsat,
			outgoingMsat: (forward) => forward.outgoingMsat,
			feeMsat: (forward) => forward.feeMsat,
			completionTimestampNs: (forward) => forward.completionTimestampNs,
		}),

		defineResolver({
			entityType: EntityType.BlockheadLightningNodeState_Timestamp,
			resolve: {
				LocalNodeStateTimestampMsSource: {
					resolve: async ({ $localNodeState, source }) => {
						if (source !== Source.LightningLnd_Rest) throw new Error(`LightningLnd_Rest: unsupported source ${source}`)
						assertLightningNetwork($localNodeState.$network.$network)
						const {
							getChannelBalance,
							getInfo,
							getWalletBalance,
						} = await import('$/sources/LightningLnd/Rest/queries.ts')
						const [info, walletBalance, channelBalance] = await Promise.all([
							getInfo(),
							getWalletBalance(),
							getChannelBalance(),
						])
						return nodeStateTimestampFieldsFromLndInfo(info, walletBalance, channelBalance)
					},
				},
			},
		})({
			nodeVersion: (snapshot) => snapshot.nodeVersion,
			syncedToChain: (snapshot) => snapshot.syncedToChain,
			syncedToGraph: (snapshot) => snapshot.syncedToGraph,
			blockHeight: (snapshot) => snapshot.blockHeight,
			bestHeaderTimestampMs: (snapshot) => snapshot.bestHeaderTimestampMs,
			walletBalanceSats: (snapshot) => snapshot.walletBalanceSats,
			channelBalanceSats: (snapshot) => snapshot.channelBalanceSats,
			pendingChannelBalanceSats: (snapshot) => snapshot.pendingChannelBalanceSats,
			peerCount: (snapshot) => snapshot.peerCount,
			activeChannelCount: (snapshot) => snapshot.activeChannelCount,
			inactiveChannelCount: (snapshot) => snapshot.inactiveChannelCount,
			pendingChannelCount: (snapshot) => snapshot.pendingChannelCount,
		}),

		defineResolver({
			entityType: EntityType.BlockheadLightningNodeState,
			resolve: {
				ConnectionIdNetwork: {
					resolve: async ({ connectionId, $network }, context) => {
						assertLightningNetwork($network.$network)
						const timestampMs = Date.now()
						return (await lndLocalChannels())
							.slice(0, resolverContextRowLimit(context))
							.map((channel) => {
								const $channel = {
									$network: $network.$network,
									channelId: channel.chan_id,
								}
								const $channelState = {
									$localNodeState: {
										connectionId,
										$network,
									},
									$channel,
								}
								return {
									[EntityMetaKey.Selector]: $channelState,
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.BlockheadLightningChannelState, [], 'private')]: channel.private,
										[entityFieldAddressKey(EntityType.BlockheadLightningChannelState, [], 'initiator')]: channel.initiator,
										[entityFieldAddressKey(EntityType.BlockheadLightningChannelState, [], '$$timestamps')]: [{
											[EntityMetaKey.Selector]: {
												$channelState,
												timestampMs,
												source: Source.LightningLnd_Rest,
											},
											[EntityMetaKey.Fields]: {
												[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'localBalanceSats')]: bigintFromWire(channel.local_balance),
												[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'remoteBalanceSats')]: bigintFromWire(channel.remote_balance),
												[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'unsettledBalanceSats')]: bigintFromWire(channel.unsettled_balance),
												[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'active')]: channel.active,
												[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'commitFeeSats')]: bigintFromWire(channel.commit_fee),
												[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'commitWeight')]: bigintFromWire(channel.commit_weight),
												[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'feePerKw')]: bigintFromWire(channel.fee_per_kw),
												[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'numUpdates')]: bigintFromWire(channel.num_updates),
												[entityFieldAddressKey(EntityType.BlockheadLightningChannelState_Timestamp, [], 'lastSyncedAt')]: timestampMs,
											},
										}],
										[entityFieldAddressKey(EntityType.BlockheadLightningChannelState, [], '$$htlcs')]: (channel.pending_htlcs ?? []).map((htlc, index) => {
											const fields = htlcFieldsFromLndHtlc(channel, htlc, index)
											return {
												[EntityMetaKey.Selector]: {
													$channelState,
													htlcIndex: fields.htlcIndex,
												},
												[EntityMetaKey.Fields]: {
													[entityFieldAddressKey(EntityType.BlockheadLightningHtlc, [], '$channel')]: fields.$channel,
													[entityFieldAddressKey(EntityType.BlockheadLightningHtlc, [], 'direction')]: fields.direction,
													[entityFieldAddressKey(EntityType.BlockheadLightningHtlc, [], 'amountMsat')]: fields.amountMsat,
													[entityFieldAddressKey(EntityType.BlockheadLightningHtlc, [], 'expiryHeight')]: fields.expiryHeight,
													[entityFieldAddressKey(EntityType.BlockheadLightningHtlc, [], 'hashLock')]: fields.hashLock,
													[entityFieldAddressKey(EntityType.BlockheadLightningHtlc, [], 'state')]: fields.state,
												},
											}
										}),
									},
								}
							})
					},
				},
			},
		})({
			$$channelStates: (channelStates) => channelStates,
		}),

		defineResolver({
			entityType: EntityType.BlockheadLightningChannelState,
			resolve: {
				LocalNodeStateChannel: {
					resolve: async ({ $localNodeState, $channel }) => {
						assertLightningNetwork($localNodeState.$network.$network)
						assertLightningNetwork($channel.$network)
						const channel = (await lndLocalChannels()).find((channel) => channel.chan_id === $channel.channelId)
						if (channel == null)
							throw new Error(`LightningLnd_Rest: channel not found ${$channel.channelId}`)
						const timestampMs = Date.now()
						return {
							private: channel.private,
							initiator: channel.initiator,
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$channelState: {
											$localNodeState,
											$channel,
										},
										timestampMs,
										source: Source.LightningLnd_Rest,
									},
								},
							],
						}
					},
				},
			},
		})({
			private: (state) => state.private,
			initiator: (state) => state.initiator,
			$$timestamps: (state) => state.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.BlockheadLightningChannelState_Timestamp,
			resolve: {
				ChannelStateTimestampMsSource: {
					resolve: async ({ $channelState, source }) => {
						if (source !== Source.LightningLnd_Rest) throw new Error(`LightningLnd_Rest: unsupported source ${source}`)
						assertLightningNetwork($channelState.$localNodeState.$network.$network)
						assertLightningNetwork($channelState.$channel.$network)
						const channel = (await lndLocalChannels()).find((channel) => channel.chan_id === $channelState.$channel.channelId)
						if (channel == null)
							throw new Error(`LightningLnd_Rest: channel not found ${$channelState.$channel.channelId}`)
						return channelStateTimestampFieldsFromLndChannel(channel)
					},
				},
			},
		})({
			localBalanceSats: (snapshot) => snapshot.localBalanceSats,
			remoteBalanceSats: (snapshot) => snapshot.remoteBalanceSats,
			unsettledBalanceSats: (snapshot) => snapshot.unsettledBalanceSats,
			active: (snapshot) => snapshot.active,
			commitFeeSats: (snapshot) => snapshot.commitFeeSats,
			commitWeight: (snapshot) => snapshot.commitWeight,
			feePerKw: (snapshot) => snapshot.feePerKw,
			numUpdates: (snapshot) => snapshot.numUpdates,
			lastSyncedAt: (snapshot) => snapshot.lastSyncedAt,
		}),

		defineResolver({
			entityType: EntityType.BlockheadLightningChannelState,
			resolve: {
				LocalNodeStateChannel: {
					resolve: async ({ $localNodeState, $channel }) => {
						assertLightningNetwork($localNodeState.$network.$network)
						assertLightningNetwork($channel.$network)
						const channel = (await lndLocalChannels()).find((channel) => channel.chan_id === $channel.channelId)
						if (channel == null)
							throw new Error(`LightningLnd_Rest: channel not found ${$channel.channelId}`)
						return (channel.pending_htlcs ?? []).map((htlc, index) => {
							const fields = htlcFieldsFromLndHtlc(channel, htlc, index)
							return {
								[EntityMetaKey.Selector]: {
									$channelState: {
										$localNodeState,
										$channel,
									},
									htlcIndex: fields.htlcIndex,
								},
							}
						})
					},
				},
			},
		})({
			$$htlcs: (htlcs) => htlcs,
		}),

		defineResolver({
			entityType: EntityType.BlockheadLightningHtlc,
			resolve: {
				ChannelStateHtlcIndex: {
					resolve: async ({ $channelState, htlcIndex }) => {
						assertLightningNetwork($channelState.$localNodeState.$network.$network)
						assertLightningNetwork($channelState.$channel.$network)
						const channel = (await lndLocalChannels()).find((channel) => channel.chan_id === $channelState.$channel.channelId)
						if (channel == null)
							throw new Error(`LightningLnd_Rest: channel not found ${$channelState.$channel.channelId}`)
						for (const [index, htlc] of (channel.pending_htlcs ?? []).entries()) {
							const fields = htlcFieldsFromLndHtlc(channel, htlc, index)
							if (fields.htlcIndex === htlcIndex)
								return fields
						}
						throw new Error(`LightningLnd_Rest: HTLC not found ${$channelState.$channel.channelId}:${htlcIndex}`)
					},
				},
			},
		})({
			$channel: (htlc) => htlc.$channel,
			direction: (htlc) => htlc.direction,
			amountMsat: (htlc) => htlc.amountMsat,
			expiryHeight: (htlc) => htlc.expiryHeight,
			hashLock: (htlc) => htlc.hashLock,
			state: (htlc) => htlc.state,
		}),

		defineResolver({
			entityType: EntityType.LightningNode,
			resolve: {
				NetworkPublicKey: {
					resolve: async ({ $network, publicKey }) => {
						assertLightningNetwork($network)
						try {
							const { getNodeInfo } = await import('$/sources/LightningLnd/Rest/queries.ts')
							await getNodeInfo({
								publicKey,
							})
						} catch {
							const info = await lndInfo()
							const channels = await lndChannels()
							lightningNodeTimestampFields(publicKey, info, channels)
						}
						return {
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$node: {
											$network,
											publicKey,
										},
										timestampMs: Date.now(),
										source: Source.LightningLnd_Rest,
									},
								},
							],
						}
					},
				},
			},
		})({
			$$timestamps: (node) => node.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.LightningNode_Timestamp,
			resolve: {
				NodeTimestampMsSource: {
					resolve: async ({ $node, source }) => {
						if (source !== Source.LightningLnd_Rest) throw new Error(`LightningLnd_Rest: unsupported source ${source}`)
						assertLightningNetwork($node.$network)
						try {
							const { getNodeInfo } = await import('$/sources/LightningLnd/Rest/queries.ts')
							return lightningNodeTimestampFieldsFromGraph(
								await getNodeInfo({
									publicKey: $node.publicKey,
								})
							)
						} catch {
							const info = await lndInfo()
							const channels = await lndChannels()
							return lightningNodeTimestampFields($node.publicKey, info, channels)
						}
					},
				},
			},
		})({
			$node: (_timestamp, { $node }) => ({
				[EntityMetaKey.Selector]: $node,
			}),
			timestampMs: (_timestamp, { timestampMs }) => timestampMs,
			source: (_timestamp, { source }) => source,
			alias: (timestamp) => timestamp.alias,
			color: (timestamp) => timestamp.color,
			capacitySats: (timestamp) => timestamp.capacitySats,
			channelCount: (timestamp) => timestamp.channelCount,
			updatedAtMs: (timestamp) => timestamp.updatedAtMs,
			networkAddresses: (timestamp) => timestamp.networkAddresses,
		}),

		defineResolver({
			entityType: EntityType.LightningChannel,
			resolve: {
				NetworkChannelId: {
					resolve: async ({ $network, channelId }) => {
						assertLightningNetwork($network)
						try {
							const { getChannelInfo } = await import('$/sources/LightningLnd/Rest/queries.ts')
							return channelFieldsFromLndEdge(
								await getChannelInfo({
									channelId,
								})
							)
						} catch {
							const channel = (await lndChannels()).find((channel) => channel.chan_id === channelId)
							if (channel == null)
								throw new Error(`LightningLnd_Rest: channel not found ${channelId}`)
							return channelFieldsFromLndChannel(channel)
						}
					},
				},
			},
		})({
			$node1: (channel) => channel.$node1,
			fundingTransactionId: (channel) => channel.fundingTransactionId,
			fundingOutputIndex: (channel) => channel.fundingOutputIndex,
			$$timestamps: (channel) => channel.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.LightningChannel_Timestamp,
			resolve: {
				ChannelTimestampMsSource: {
					resolve: async ({ $channel, source }) => {
						if (source !== Source.LightningLnd_Rest) throw new Error(`LightningLnd_Rest: unsupported source ${source}`)
						assertLightningNetwork($channel.$network)
						const channel = (await lndChannels()).find((channel) => channel.chan_id === $channel.channelId)
						try {
							const { getChannelInfo } = await import('$/sources/LightningLnd/Rest/queries.ts')
							return channelTimestampFieldsFromLndEdge(
								channel,
								await getChannelInfo({
									channelId: $channel.channelId,
								})
							)
						} catch {
							if (channel == null)
								throw new Error(`LightningLnd_Rest: channel not found ${$channel.channelId}`)
							return channelTimestampFieldsFromLndChannel(channel)
						}
					},
				},
			},
		})({
			$channel: (_timestamp, { $channel }) => ({
				[EntityMetaKey.Selector]: $channel,
			}),
			timestampMs: (_timestamp, { timestampMs }) => timestampMs,
			source: (_timestamp, { source }) => source,
			status: (timestamp) => timestamp.status,
			capacitySats: (timestamp) => timestamp.capacitySats,
			feeRatePpm: (timestamp) => timestamp.feeRatePpm,
			updatedAtMs: (timestamp) => timestamp.updatedAtMs,
		}),

		defineResolver({
			entityType: EntityType.BlockheadLightningInvoice,
			resolve: {
				NetworkPaymentHash: {
					resolve: async ({ $network, paymentHash }) => {
						assertLightningNetwork($network)
						const { getInvoice } = await import('$/sources/LightningLnd/Rest/queries.ts')
						return invoiceFieldsFromLndInvoice(
							await getInvoice({
								paymentHash,
							}),
							paymentHash
						)
					},
				},
			},
		})({
			paymentRequest: (invoice) => invoice.paymentRequest,
			memo: (invoice) => invoice.memo,
			valueMsat: (invoice) => invoice.valueMsat,
			createdAtMs: (invoice) => invoice.createdAtMs,
			expirySeconds: (invoice) => invoice.expirySeconds,
			private: (invoice) => invoice.private,
			addIndex: (invoice) => invoice.addIndex,
			$$timestamps: (invoice) => invoice.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.BlockheadLightningInvoice_Timestamp,
			resolve: {
				InvoiceTimestampMsSource: {
					resolve: async ({ $invoice, source }) => {
						if (source !== Source.LightningLnd_Rest) throw new Error(`LightningLnd_Rest: unsupported source ${source}`)
						assertLightningNetwork($invoice.$network)
						const { getInvoice } = await import('$/sources/LightningLnd/Rest/queries.ts')
						return invoiceTimestampFieldsFromLndInvoice(
							await getInvoice({
								paymentHash: $invoice.paymentHash,
							})
						)
					},
				},
			},
		})({
			$invoice: (_timestamp, { $invoice }) => ({
				[EntityMetaKey.Selector]: $invoice,
			}),
			timestampMs: (_timestamp, { timestampMs }) => timestampMs,
			source: (_timestamp, { source }) => source,
			state: (timestamp) => timestamp.state,
			amountPaidMsat: (timestamp) => timestamp.amountPaidMsat,
			settledAtMs: (timestamp) => timestamp.settledAtMs,
			settleIndex: (timestamp) => timestamp.settleIndex,
		}),

		defineResolver({
			entityType: EntityType.BlockheadLightningPayment,
			resolve: {
				NetworkPaymentHash: {
					resolve: async ({ $network, paymentHash }) => {
						assertLightningNetwork($network)
						const { getPayment } = await import('$/sources/LightningLnd/Rest/queries.ts')
						return paymentFieldsFromLndPayment(await getPayment({ paymentHash }))
					},
				},
			},
		})({
			paymentRequest: (payment) => payment.paymentRequest,
			valueMsat: (payment) => payment.valueMsat,
			createdAtMs: (payment) => payment.createdAtMs,
			paymentIndex: (payment) => payment.paymentIndex,
			$$timestamps: (payment) => payment.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.BlockheadLightningPayment_Timestamp,
			resolve: {
				PaymentTimestampMsSource: {
					resolve: async ({ $payment, source }) => {
						if (source !== Source.LightningLnd_Rest) throw new Error(`LightningLnd_Rest: unsupported source ${source}`)
						assertLightningNetwork($payment.$network)
						const { getPayment } = await import('$/sources/LightningLnd/Rest/queries.ts')
						return paymentTimestampFieldsFromLndPayment(await getPayment({
							paymentHash: $payment.paymentHash,
						}))
					},
				},
			},
		})({
			$payment: (_timestamp, { $payment }) => ({
				[EntityMetaKey.Selector]: $payment,
			}),
			timestampMs: (_timestamp, { timestampMs }) => timestampMs,
			source: (_timestamp, { source }) => source,
			status: (timestamp) => timestamp.status,
			feeMsat: (timestamp) => timestamp.feeMsat,
			failureReason: (timestamp) => timestamp.failureReason,
			preimage: (timestamp) => timestamp.preimage,
		}),

		defineResolver({
			entityType: EntityType.LightningNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }) => {
						assertLightningNetwork($network)
						const info = await lndInfo()
						return [
							{
								[EntityMetaKey.Selector]: {
									$network: lightningNetwork,
									publicKey: info.identity_pubkey,
								},
							},
						]
					},
				},
			},
		})({
			$$nodes: (nodes) => nodes,
		}),

		defineResolver({
			entityType: EntityType.LightningNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertLightningNetwork($network)
						return (await lndChannels())
							.slice(0, resolverContextRowLimit(context))
							.map(channelRowFromLndChannel)
					},
				},
			},
		})({
			$$channels: (channels) => channels,
		}),

		defineResolver({
			entityType: EntityType.LightningNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertLightningNetwork($network)
						const { listInvoices } = await import('$/sources/LightningLnd/Rest/queries.ts')
						return {
							page: await listInvoices({
								indexOffset: context.providerContinuationToken,
								numMaxInvoices: resolverContextRowLimit(context),
							}),
							pageSize: resolverContextRowLimit(context),
						}
					},
				},
			},
		})({
			$$invoices: {
				select: ({ page }) => {
					const paymentHashes = (page.invoices ?? []).flatMap((invoice) => {
						const paymentHash = invoicePaymentHash(invoice)
						return paymentHash == null ? [] : [paymentHash]
					})
					if (new Set(paymentHashes).size !== paymentHashes.length)
						throw new Error('LightningLnd_Rest: invoice page contains duplicate identities')

					return (page.invoices ?? []).flatMap((invoice) => {
						const paymentHash = invoicePaymentHash(invoice)
						if (paymentHash == null) return []
						const fields = invoiceFieldsFromLndInvoice(invoice, paymentHash)
						return [{
							[EntityMetaKey.Selector]: {
								$network: lightningNetwork,
								paymentHash,
							},
							[EntityMetaKey.Fields]: {
								...(fields.paymentRequest != null && {
									[entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'paymentRequest')]: fields.paymentRequest,
								}),
								...(fields.memo != null && {
									[entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'memo')]: fields.memo,
								}),
								...(fields.valueMsat != null && {
									[entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'valueMsat')]: fields.valueMsat,
								}),
								...(fields.createdAtMs != null && {
									[entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'createdAtMs')]: fields.createdAtMs,
								}),
								...(fields.expirySeconds != null && {
									[entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'expirySeconds')]: fields.expirySeconds,
								}),
								...(fields.private != null && {
									[entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'private')]: fields.private,
								}),
								...(fields.addIndex != null && {
									[entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'addIndex')]: fields.addIndex,
								}),
								[entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], '$$timestamps')]: fields.$$timestamps,
							},
						}]
					})
				},
				continuation: ({ page, pageSize }, _network, context) => (
					page.last_index_offset == null
					|| page.last_index_offset === context.providerContinuationToken
					|| (page.invoices ?? []).length < pageSize ?
						{
							operation: 'invoices',
							target: 'lightning',
							terminal: true,
						}
					:
						{
							operation: 'invoices',
							target: 'lightning',
							terminal: false,
							token: page.last_index_offset,
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.LightningNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertLightningNetwork($network)
						const { listPayments } = await import('$/sources/LightningLnd/Rest/queries.ts')
						return {
							page: await listPayments({
								indexOffset: context.providerContinuationToken,
								maxPayments: resolverContextRowLimit(context),
							}),
							pageSize: resolverContextRowLimit(context),
						}
					},
				},
			},
		})({
			$$payments: {
				select: ({ page }) => {
					const paymentHashes = (page.payments ?? []).map((payment) => payment.payment_hash)
					if (new Set(paymentHashes).size !== paymentHashes.length)
						throw new Error('LightningLnd_Rest: payment page contains duplicate identities')

					return (page.payments ?? []).map((payment) => {
						const fields = paymentFieldsFromLndPayment(payment)
						return {
							[EntityMetaKey.Selector]: {
								$network: lightningNetwork,
								paymentHash: payment.payment_hash,
							},
							[EntityMetaKey.Fields]: {
								...(fields.paymentRequest != null && {
									[entityFieldAddressKey(EntityType.BlockheadLightningPayment, [], 'paymentRequest')]: fields.paymentRequest,
								}),
								...(fields.valueMsat != null && {
									[entityFieldAddressKey(EntityType.BlockheadLightningPayment, [], 'valueMsat')]: fields.valueMsat,
								}),
								...(fields.createdAtMs != null && {
									[entityFieldAddressKey(EntityType.BlockheadLightningPayment, [], 'createdAtMs')]: fields.createdAtMs,
								}),
								...(fields.paymentIndex != null && {
									[entityFieldAddressKey(EntityType.BlockheadLightningPayment, [], 'paymentIndex')]: fields.paymentIndex,
								}),
								[entityFieldAddressKey(EntityType.BlockheadLightningPayment, [], '$$timestamps')]: fields.$$timestamps,
							},
						}
					})
				},
				continuation: ({ page, pageSize }, _network, context) => (
					page.last_index_offset == null
					|| page.last_index_offset === context.providerContinuationToken
					|| (page.payments ?? []).length < pageSize ?
						{
							operation: 'payments',
							target: 'lightning',
							terminal: true,
						}
					:
						{
							operation: 'payments',
							target: 'lightning',
							terminal: false,
							token: page.last_index_offset,
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.LightningNode,
			resolve: {
				NetworkPublicKey: {
					resolve: async ({ $network, publicKey }, context) => {
						assertLightningNetwork($network)
						try {
							const { getNodeInfo } = await import('$/sources/LightningLnd/Rest/queries.ts')
							return (
								(
									await getNodeInfo({
										publicKey,
										includeChannels: true,
									})
								).channels ?? []
							)
								.slice(
									context.pagination.offset ?? 0,
									(context.pagination.offset ?? 0) + resolverContextRowLimit(context)
								)
								.map(channelRowFromLndEdge)
						} catch {
							const info = await lndInfo()
							return (await lndChannels())
								.filter((channel) => (
									publicKey === info.identity_pubkey
									|| publicKey === channel.remote_pubkey
								))
								.slice(
									context.pagination.offset ?? 0,
									(context.pagination.offset ?? 0) + resolverContextRowLimit(context)
								)
								.map(channelRowFromLndChannel)
						}
					},
				},
			},
		})({
			$$channels: (channels) => channels,
		}),

	],
}

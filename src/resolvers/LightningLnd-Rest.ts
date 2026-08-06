/**
 * Connected LND REST — local node / session surface.
 *
 * Owns `BlockheadLightning*` rows (`connectionId` session identity, invoices,
 * payments, channel state). May also project public `Lightning*` graph entities
 * from the connected node. This is not a browser wallet adapter; public-graph
 * indexing without a local node remains `LightningMempoolSpace_Rest`.
 */
import { resolverContextRowLimit, type ResolverContext } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
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
	LndChannelEdge,
	LndGetInfoResponse,
	LndInvoice,
	LndNetworkInfoResponse,
	LndNodeInfoResponse,
	LndPayment,
} from '$/sources/LightningLnd/Rest/types.ts'
type NetworkId = EntitySelector<typeof schema, EntityType.Network>

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
	...(edge.node1_policy?.fee_rate_milli_msat != null && {
		feeRatePpm: Number(edge.node1_policy.fee_rate_milli_msat),
	}),
})

const channelReferenceFromLndChannel = (channel: LndChannel) => ({
	[EntityMetaKey.Selector]: {
		$network: lightningNetwork,
		channelId: channel.chan_id,
	},
})

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

const lndChannels = async (context: ResolverContext) => {
	const { listChannels } = await import('$/sources/LightningLnd/Rest/queries.ts')
	return ((await listChannels({
		publicEnv: context.publicEnv,
	})).channels ?? [])
		.filter((channel) => channel.private === false)
}

const lndInfo = async (context: ResolverContext) => {
	const { getInfo } = await import('$/sources/LightningLnd/Rest/queries.ts')
	return getInfo({
		publicEnv: context.publicEnv,
	})
}

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
					resolve: async ({ $lightningNetwork, source }, context) => {
						if (source !== Source.LightningLnd_Rest) throw new Error(`LightningLnd_Rest: unsupported source ${source}`)
						assertLightningNetwork($lightningNetwork.$network)
						const { getNetworkInfo } = await import('$/sources/LightningLnd/Rest/queries.ts')
						return networkTimestampFieldsFromLndNetworkInfo(await getNetworkInfo({
							publicEnv: context.publicEnv,
						}))
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
					resolve: async ({ connectionId, $network }, context) => {
						assertLightningNetwork($network.$network)
						const info = await lndInfo(context)
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
		}),

		defineResolver({
			entityType: EntityType.LightningNode,
			resolve: {
				NetworkPublicKey: {
					resolve: async ({ $network, publicKey }, context) => {
						assertLightningNetwork($network)
						try {
							const { getNodeInfo } = await import('$/sources/LightningLnd/Rest/queries.ts')
							await getNodeInfo({
								publicEnv: context.publicEnv,
								publicKey,
							})
						} catch {
							const info = await lndInfo(context)
							const channels = await lndChannels(context)
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
					resolve: async ({ $node, source }, context) => {
						if (source !== Source.LightningLnd_Rest) throw new Error(`LightningLnd_Rest: unsupported source ${source}`)
						assertLightningNetwork($node.$network)
						try {
							const { getNodeInfo } = await import('$/sources/LightningLnd/Rest/queries.ts')
							return lightningNodeTimestampFieldsFromGraph(
								await getNodeInfo({
									publicEnv: context.publicEnv,
									publicKey: $node.publicKey,
								})
							)
						} catch {
							const info = await lndInfo(context)
							const channels = await lndChannels(context)
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
					resolve: async ({ $network, channelId }, context) => {
						assertLightningNetwork($network)
						try {
							const { getChannelInfo } = await import('$/sources/LightningLnd/Rest/queries.ts')
							return channelFieldsFromLndEdge(
								await getChannelInfo({
									publicEnv: context.publicEnv,
									channelId,
								})
							)
						} catch {
							const channel = (await lndChannels(context)).find((channel) => channel.chan_id === channelId)
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
					resolve: async ({ $channel, source }, context) => {
						if (source !== Source.LightningLnd_Rest) throw new Error(`LightningLnd_Rest: unsupported source ${source}`)
						assertLightningNetwork($channel.$network)
						const channel = (await lndChannels(context)).find((channel) => channel.chan_id === $channel.channelId)
						try {
							const { getChannelInfo } = await import('$/sources/LightningLnd/Rest/queries.ts')
							return channelTimestampFieldsFromLndEdge(
								channel,
								await getChannelInfo({
									publicEnv: context.publicEnv,
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
					resolve: async ({ $network, paymentHash }, context) => {
						assertLightningNetwork($network)
						const { listInvoices } = await import('$/sources/LightningLnd/Rest/queries.ts')
						const invoice = (
							(await listInvoices({
								publicEnv: context.publicEnv,
							})).invoices ?? []
						).find((invoice) => invoicePaymentHash(invoice) === paymentHash)
						if (invoice == null)
							throw new Error(`LightningLnd_Rest: invoice not found ${paymentHash}`)
						return invoiceFieldsFromLndInvoice(invoice, paymentHash)
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
					resolve: async ({ $invoice, source }, context) => {
						if (source !== Source.LightningLnd_Rest) throw new Error(`LightningLnd_Rest: unsupported source ${source}`)
						assertLightningNetwork($invoice.$network)
						const { listInvoices } = await import('$/sources/LightningLnd/Rest/queries.ts')
						const invoice = (
							(await listInvoices({
								publicEnv: context.publicEnv,
							})).invoices ?? []
						).find((invoice) => invoicePaymentHash(invoice) === $invoice.paymentHash)
						if (invoice == null)
							throw new Error(`LightningLnd_Rest: invoice not found ${$invoice.paymentHash}`)
						return invoiceTimestampFieldsFromLndInvoice(invoice)
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
					resolve: async ({ $network, paymentHash }, context) => {
						assertLightningNetwork($network)
						const { listPayments } = await import('$/sources/LightningLnd/Rest/queries.ts')
						const payment = (
							(await listPayments({
								publicEnv: context.publicEnv,
							})).payments ?? []
						).find((payment) => payment.payment_hash === paymentHash)
						if (payment == null)
							throw new Error(`LightningLnd_Rest: payment not found ${paymentHash}`)
						return paymentFieldsFromLndPayment(payment)
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
					resolve: async ({ $payment, source }, context) => {
						if (source !== Source.LightningLnd_Rest) throw new Error(`LightningLnd_Rest: unsupported source ${source}`)
						assertLightningNetwork($payment.$network)
						const { listPayments } = await import('$/sources/LightningLnd/Rest/queries.ts')
						const payment = (
							(await listPayments({
								publicEnv: context.publicEnv,
							})).payments ?? []
						).find((payment) => payment.payment_hash === $payment.paymentHash)
						if (payment == null)
							throw new Error(`LightningLnd_Rest: payment not found ${$payment.paymentHash}`)
						return paymentTimestampFieldsFromLndPayment(payment)
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
					resolve: async ({ $network }, context) => {
						assertLightningNetwork($network)
						const info = await lndInfo(context)
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
						return (await lndChannels(context))
							.slice(0, resolverContextRowLimit(context))
							.map(channelReferenceFromLndChannel)
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
						return (
							(await listInvoices({
								publicEnv: context.publicEnv,
								numMaxInvoices: resolverContextRowLimit(context),
							})).invoices ?? []
						).flatMap((invoice) => {
							const paymentHash = invoicePaymentHash(invoice)
							return (
								paymentHash == null ?
									[]
								:
									[{
										[EntityMetaKey.Selector]: {
											$network: lightningNetwork,
											paymentHash,
										},
									}]
							)
						})
					},
				},
			},
		})({
			$$invoices: (invoices) => invoices,
		}),

		defineResolver({
			entityType: EntityType.LightningNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertLightningNetwork($network)
						const { listPayments } = await import('$/sources/LightningLnd/Rest/queries.ts')
						return (
							(await listPayments({
								publicEnv: context.publicEnv,
								maxPayments: resolverContextRowLimit(context),
							})).payments ?? []
						).map((payment) => ({
							[EntityMetaKey.Selector]: {
								$network: lightningNetwork,
								paymentHash: payment.payment_hash,
							},
						}))
					},
				},
			},
		})({
			$$payments: (payments) => payments,
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
										publicEnv: context.publicEnv,
										publicKey,
										includeChannels: true,
									})
								).channels ?? []
							)
								.slice(0, resolverContextRowLimit(context))
								.map((edge) => ({
									[EntityMetaKey.Selector]: {
										$network: lightningNetwork,
										channelId: edge.channel_id,
									},
								}))
						} catch {
							const info = await lndInfo(context)
							return (await lndChannels(context))
								.filter((channel) => (
									publicKey === info.identity_pubkey
									|| publicKey === channel.remote_pubkey
								))
								.slice(0, resolverContextRowLimit(context))
								.map(channelReferenceFromLndChannel)
						}
					},
				},
			},
		})({
			$$channels: (channels) => channels,
		}),

	],
}

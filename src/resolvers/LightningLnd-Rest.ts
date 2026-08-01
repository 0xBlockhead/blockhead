import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type SourceResolverContext,
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
	LndGetInfoResponse,
	LndInvoice,
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
			channelCount: (info.num_active_channels ?? 0) + (info.num_inactive_channels ?? 0),
			networkAddresses: info.uris ?? [],
		}

	const channelsForNode = channels.filter((channel) => channel.remote_pubkey === publicKey)
	if (channelsForNode.length === 0)
		throw new Error(`LightningLnd_Rest: node not found ${publicKey}`)

	return {
		alias: undefined,
		color: undefined,
		channelCount: channelsForNode.length,
		networkAddresses: [],
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

const lndChannels = async (context: SourceResolverContext<Source.LightningLnd_Rest>) => {
	const { listChannels } = await import('$/sources/LightningLnd/Rest/queries.ts')
	return ((await listChannels({
		publicEnv: context.publicEnv,
	})).channels ?? [])
		.filter((channel) => channel.private === false)
}

const lndInfo = async (context: SourceResolverContext<Source.LightningLnd_Rest>) => {
	const { getInfo } = await import('$/sources/LightningLnd/Rest/queries.ts')
	return getInfo({
		publicEnv: context.publicEnv,
	})
}

export default {
	source: Source.LightningLnd_Rest,

	resolvers: [
		defineResolver(Source.LightningLnd_Rest, {
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
						}
					},
				},
			},
		})({
			name: (network) => network.name,
			$settlementNetwork: (network) => network.$settlementNetwork,
		}),

		defineResolver(Source.LightningLnd_Rest, {
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

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.LightningNode,
			resolve: {
				NetworkPublicKey: {
					resolve: async ({ $network, publicKey }, context) => {
						assertLightningNetwork($network)
						const info = await lndInfo(context)
						const channels = await lndChannels(context)
						lightningNodeTimestampFields(publicKey, info, channels)
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

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.LightningNode_Timestamp,
			resolve: {
				NodeTimestampMsSource: {
					resolve: async ({ $node, source }, context) => {
						if (source !== Source.LightningLnd_Rest) throw new Error(`LightningLnd_Rest: unsupported source ${source}`)
						assertLightningNetwork($node.$network)
						const info = await lndInfo(context)
						const channels = await lndChannels(context)
						return lightningNodeTimestampFields($node.publicKey, info, channels)
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
			channelCount: (timestamp) => timestamp.channelCount,
			networkAddresses: (timestamp) => timestamp.networkAddresses,
		}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.LightningChannel,
			resolve: {
				NetworkChannelId: {
					resolve: async ({ $network, channelId }, context) => {
						assertLightningNetwork($network)
						const channel = (await lndChannels(context)).find((channel) => channel.chan_id === channelId)
						if (channel == null)
							throw new Error(`LightningLnd_Rest: channel not found ${channelId}`)
						return channelFieldsFromLndChannel(channel)
					},
				},
			},
		})({
			$node1: (channel) => channel.$node1,
			fundingTransactionId: (channel) => channel.fundingTransactionId,
			fundingOutputIndex: (channel) => channel.fundingOutputIndex,
			$$timestamps: (channel) => channel.$$timestamps,
		}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.LightningChannel_Timestamp,
			resolve: {
				ChannelTimestampMsSource: {
					resolve: async ({ $channel, source }, context) => {
						if (source !== Source.LightningLnd_Rest) throw new Error(`LightningLnd_Rest: unsupported source ${source}`)
						assertLightningNetwork($channel.$network)
						const channel = (await lndChannels(context)).find((channel) => channel.chan_id === $channel.channelId)
						if (channel == null)
							throw new Error(`LightningLnd_Rest: channel not found ${$channel.channelId}`)
						return channelTimestampFieldsFromLndChannel(channel)
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
		}),

		defineResolver(Source.LightningLnd_Rest, {
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

		defineResolver(Source.LightningLnd_Rest, {
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

		defineResolver(Source.LightningLnd_Rest, {
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

		defineResolver(Source.LightningLnd_Rest, {
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

		defineResolver(Source.LightningLnd_Rest, {
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

		defineResolver(Source.LightningLnd_Rest, {
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

		defineResolver(Source.LightningLnd_Rest, {
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

		defineResolver(Source.LightningLnd_Rest, {
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

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.LightningNode,
			resolve: {
				NetworkPublicKey: {
					resolve: async ({ $network, publicKey }, context) => {
						assertLightningNetwork($network)
						const info = await lndInfo(context)
						return (await lndChannels(context))
							.filter((channel) => (
								publicKey === info.identity_pubkey
								|| publicKey === channel.remote_pubkey
							))
							.slice(0, resolverContextRowLimit(context))
							.map(channelReferenceFromLndChannel)
					},
				},
			},
		})({
			$$channels: (channels) => channels,
		}),

	],
}

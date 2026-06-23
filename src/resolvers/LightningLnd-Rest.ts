import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type SourceResolverContext,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { networkBySlug } from '$/constants/Network.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { LightningChannelStatus } from '$/schema/LightningChannel.ts'
import { Source } from '$/sources/Source.ts'
import type {
	LndChannel,
	LndInvoice,
	LndPayment,
} from '$/sources/LightningLnd/Rest/types.ts'
import { LightningNetworkSelector } from '$/schema/LightningNetwork.ts'
import { LightningNodeSelector } from '$/schema/LightningNode.ts'
import { LightningNode_TimestampSelector } from '$/schema/LightningNode_Timestamp.ts'
import { LightningChannelSelector } from '$/schema/LightningChannel.ts'
import { LightningChannel_TimestampSelector } from '$/schema/LightningChannel_Timestamp.ts'
import { BlockheadLightningInvoiceSelector } from '$/schema/BlockheadLightningInvoice.ts'
import { BlockheadLightningInvoice_TimestampSelector } from '$/schema/BlockheadLightningInvoice_Timestamp.ts'
import { BlockheadLightningPaymentSelector } from '$/schema/BlockheadLightningPayment.ts'
import { BlockheadLightningPayment_TimestampSelector } from '$/schema/BlockheadLightningPayment_Timestamp.ts'

type NetworkId = { caip2: {
	namespace: string
	reference: string
} } | { slug: string }

const assertLightningNetwork = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== 'lightning')
		throw new Error('LightningLnd_Rest: unsupported Lightning network')
}

const bigintFromWire = (value: string | null | undefined): bigint | undefined => (
	value == null || value === '' ?
		undefined
	:
		BigInt(value)
)

const timestampMsFromSeconds = (seconds: string | null | undefined): number | undefined => (
	seconds == null || seconds === '' ?
		undefined
	:
		Number(seconds) * 1000
)

const timestampMsFromNanoseconds = (nanoseconds: string | null | undefined): number | undefined => (
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

const channelStatusFromLndChannel = (channel: LndChannel): LightningChannelStatus => (
	channel.active === true ?
		LightningChannelStatus.Active
	:
		channel.active === false ?
			LightningChannelStatus.Inactive
		:
			LightningChannelStatus.Unknown
)

const lightningTimestampMs = () => Date.now()

const lightningNodeTimestampFields = ({
	nodeId,
	timestampMs,
	alias,
	color,
	channelCount,
	networkAddresses,
}: {
	nodeId: {
		$network: NetworkId
		publicKey: string
	}
	timestampMs: number
	alias?: string
	color?: string
	channelCount?: number
	networkAddresses?: string[]
}) => ({
	[EntityMetaKey.Selector]: {
		$node: nodeId,
		timestampMs,
		source: Source.LightningLnd_Rest,
	},
	$node: {
		[EntityMetaKey.Selector]: nodeId,
	},
	timestampMs,
	source: Source.LightningLnd_Rest,
	alias,
	color,
	channelCount,
	networkAddresses: networkAddresses ?? [],
})

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
	timestampMs = lightningTimestampMs()
) => ({
	[EntityMetaKey.Selector]: {
		$network: {
			slug: 'lightning',
		},
		channelId: channel.chan_id,
	},
	$node1: {
		[EntityMetaKey.Selector]: {
			$network: {
				slug: 'lightning',
			},
			publicKey: channel.remote_pubkey,
		},
	},
	...channelPointParts(channel.channel_point),
	$$timestamps: [
		{
			[EntityMetaKey.Selector]: {
				$channel: {
					$network: {
						slug: 'lightning',
					},
					channelId: channel.chan_id,
				},
				timestampMs,
				source: Source.LightningLnd_Rest,
			},
			$channel: {
				[EntityMetaKey.Selector]: {
					$network: {
						slug: 'lightning',
					},
					channelId: channel.chan_id,
				},
			},
			timestampMs,
			source: Source.LightningLnd_Rest,
			status: channelStatusFromLndChannel(channel),
			capacitySats: bigintFromWire(channel.capacity),
		},
	],
})

const invoicePaymentHash = (invoice: LndInvoice): string | undefined => (
	invoice.r_hash_str ?? invoice.r_hash
)

const invoiceFieldsFromLndInvoice = (
	invoice: LndInvoice,
	timestampMs = lightningTimestampMs()
) => ({
	[EntityMetaKey.Selector]: {
		$network: {
			slug: 'lightning',
		},
		paymentHash: invoicePaymentHash(invoice) ?? '',
	},
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
					$network: {
						slug: 'lightning',
					},
					paymentHash: invoicePaymentHash(invoice) ?? '',
				},
				timestampMs,
				source: Source.LightningLnd_Rest,
			},
			$invoice: {
				[EntityMetaKey.Selector]: {
					$network: {
						slug: 'lightning',
					},
					paymentHash: invoicePaymentHash(invoice) ?? '',
				},
			},
			timestampMs,
			source: Source.LightningLnd_Rest,
			amountPaidMsat: bigintFromWire(invoice.amt_paid_msat),
			settledAtMs: timestampMsFromSeconds(invoice.settle_date),
			state: invoiceStateFromLnd(invoice.state),
			settleIndex: bigintFromWire(invoice.settle_index),
		},
	],
})

const paymentFieldsFromLndPayment = (
	payment: LndPayment,
	timestampMs = lightningTimestampMs()
) => ({
	[EntityMetaKey.Selector]: {
		$network: {
			slug: 'lightning',
		},
		paymentHash: payment.payment_hash,
	},
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
					$network: {
						slug: 'lightning',
					},
					paymentHash: payment.payment_hash,
				},
				timestampMs,
				source: Source.LightningLnd_Rest,
			},
			$payment: {
				[EntityMetaKey.Selector]: {
					$network: {
						slug: 'lightning',
					},
					paymentHash: payment.payment_hash,
				},
			},
			timestampMs,
			source: Source.LightningLnd_Rest,
			feeMsat: bigintFromWire(payment.fee_msat),
			status: paymentStatusFromLnd(payment.status),
			failureReason: payment.failure_reason,
			preimage: payment.payment_preimage,
		},
	],
})

const lndChannels = async (context: SourceResolverContext<Source.LightningLnd_Rest>) => {
	const { listChannels } = await import('$/sources/LightningLnd/Rest/queries.ts')
	return (await listChannels(context.publicEnv)).channels ?? []
}

const lndInfo = async (context: SourceResolverContext<Source.LightningLnd_Rest>) => {
	const { getInfo } = await import('$/sources/LightningLnd/Rest/queries.ts')
	return getInfo(context.publicEnv)
}

export default {
	source: Source.LightningLnd_Rest,

	resolvers: [
		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.LightningNetwork,
			resolve: {
				[LightningNetworkSelector.Network]: async ({ $network }) => {
					assertLightningNetwork($network)
					return {
						name: 'Lightning Network',
						$settlementNetwork: {
							[EntityMetaKey.Selector]: {
								caip2: networkBySlug.bitcoin.caip2,
							},
						},
					}
				}
			},
		})({
			fields: {
				name: (network) => network.name,
				$settlementNetwork: (network) => network.$settlementNetwork,
			},
		}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.LightningNode,
			resolve: {
				[LightningNodeSelector.NetworkPublicKey]: async ({ $network, publicKey }, context) => {
					assertLightningNetwork($network)
					const info = await lndInfo(context)
					const channels = await lndChannels(context)
					if (publicKey === info.identity_pubkey)
						return {
							$$timestamps: [
								lightningNodeTimestampFields({
									nodeId: {
										$network,
										publicKey,
									},
									timestampMs: lightningTimestampMs(),
									alias: info.alias,
									color: info.color,
									channelCount: (info.num_active_channels ?? 0) + (info.num_inactive_channels ?? 0),
									networkAddresses: info.uris ?? [],
								}),
							],
						}
					if (!channels.some((channel) => channel.remote_pubkey === publicKey))
						throw new Error(`LightningLnd_Rest: node not found ${publicKey}`)
					return {
						$$timestamps: [
							lightningNodeTimestampFields({
								nodeId: {
									$network,
									publicKey,
								},
								timestampMs: lightningTimestampMs(),
								channelCount: channels.filter((channel) => channel.remote_pubkey === publicKey).length,
							}),
						],
					}
				}
			},
		})({
			fields: {
				$$timestamps: (node) => node.$$timestamps.map((timestamp) => ({
					[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
				})),
			},
		}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.LightningNode_Timestamp,
			resolve: {
				[LightningNode_TimestampSelector.NodeTimestampMsSource]: async ({ $node, timestampMs, source }, context) => {
					if (source !== Source.LightningLnd_Rest) throw new Error(`LightningLnd_Rest: unsupported source ${source}`)
					assertLightningNetwork($node.$network)
					const info = await lndInfo(context)
					const channels = await lndChannels(context)
					if ($node.publicKey === info.identity_pubkey)
						return lightningNodeTimestampFields({
							nodeId: $node,
							timestampMs,
							alias: info.alias,
							color: info.color,
							channelCount: (info.num_active_channels ?? 0) + (info.num_inactive_channels ?? 0),
							networkAddresses: info.uris ?? [],
						})
					if (!channels.some((channel) => channel.remote_pubkey === $node.publicKey))
						throw new Error(`LightningLnd_Rest: node not found ${$node.publicKey}`)
					return lightningNodeTimestampFields({
						nodeId: $node,
						timestampMs,
						channelCount: channels.filter((channel) => channel.remote_pubkey === $node.publicKey).length,
					})
				},
			},
		})({
			fields: {
				$node: (timestamp) => timestamp.$node,
				timestampMs: (timestamp) => timestamp.timestampMs,
				source: (timestamp) => timestamp.source,
				alias: (timestamp) => timestamp.alias,
				color: (timestamp) => timestamp.color,
				channelCount: (timestamp) => timestamp.channelCount,
				networkAddresses: (timestamp) => timestamp.networkAddresses,
			},
		}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.LightningChannel,
			resolve: {
				[LightningChannelSelector.NetworkChannelId]: async ({ $network, channelId }, context) => {
					assertLightningNetwork($network)
					const channel = (await lndChannels(context)).find((channel) => channel.chan_id === channelId)
					if (channel == null)
						throw new Error(`LightningLnd_Rest: channel not found ${channelId}`)
					return channelFieldsFromLndChannel(channel)
				}
			},
		})({
			fields: {
				$node1: (channel) => channel.$node1,
				fundingTransactionId: (channel) => channel.fundingTransactionId,
				fundingOutputIndex: (channel) => channel.fundingOutputIndex,
				$$timestamps: (channel) => channel.$$timestamps.map((timestamp) => ({
					[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
				})),
			},
		}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.LightningChannel_Timestamp,
			resolve: {
				[LightningChannel_TimestampSelector.ChannelTimestampMsSource]: async ({ $channel, timestampMs, source }, context) => {
					if (source !== Source.LightningLnd_Rest) throw new Error(`LightningLnd_Rest: unsupported source ${source}`)
					assertLightningNetwork($channel.$network)
					const channel = (await lndChannels(context)).find((channel) => channel.chan_id === $channel.channelId)
					if (channel == null)
						throw new Error(`LightningLnd_Rest: channel not found ${$channel.channelId}`)
					return channelFieldsFromLndChannel(channel, timestampMs).$$timestamps[0]
				},
			},
		})({
			fields: {
				$channel: (timestamp) => timestamp.$channel,
				timestampMs: (timestamp) => timestamp.timestampMs,
				source: (timestamp) => timestamp.source,
				status: (timestamp) => timestamp.status,
				capacitySats: (timestamp) => timestamp.capacitySats,
			},
		}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.BlockheadLightningInvoice,
			resolve: {
				[BlockheadLightningInvoiceSelector.NetworkPaymentHash]: async ({ $network, paymentHash }, context) => {
					assertLightningNetwork($network)
					const { listInvoices } = await import('$/sources/LightningLnd/Rest/queries.ts')
					const invoice = (
						(await listInvoices({
							publicEnv: context.publicEnv,
						})).invoices ?? []
					).find((invoice) => invoicePaymentHash(invoice) === paymentHash)
					if (invoice == null)
						throw new Error(`LightningLnd_Rest: invoice not found ${paymentHash}`)
					return invoiceFieldsFromLndInvoice(invoice)
				}
			},
		})({
			fields: {
				paymentRequest: (invoice) => invoice.paymentRequest,
				memo: (invoice) => invoice.memo,
				valueMsat: (invoice) => invoice.valueMsat,
				createdAtMs: (invoice) => invoice.createdAtMs,
				expirySeconds: (invoice) => invoice.expirySeconds,
				private: (invoice) => invoice.private,
				addIndex: (invoice) => invoice.addIndex,
				$$timestamps: (invoice) => invoice.$$timestamps.map((timestamp) => ({
					[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
				})),
			},
		}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.BlockheadLightningInvoice_Timestamp,
			resolve: {
				[BlockheadLightningInvoice_TimestampSelector.InvoiceTimestampMsSource]: async ({ $invoice, timestampMs, source }, context) => {
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
					return invoiceFieldsFromLndInvoice(invoice, timestampMs).$$timestamps[0]
				},
			},
		})({
			fields: {
				$invoice: (timestamp) => timestamp.$invoice,
				timestampMs: (timestamp) => timestamp.timestampMs,
				source: (timestamp) => timestamp.source,
				state: (timestamp) => timestamp.state,
				amountPaidMsat: (timestamp) => timestamp.amountPaidMsat,
				settledAtMs: (timestamp) => timestamp.settledAtMs,
				settleIndex: (timestamp) => timestamp.settleIndex,
			},
		}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.BlockheadLightningPayment,
			resolve: {
				[BlockheadLightningPaymentSelector.NetworkPaymentHash]: async ({ $network, paymentHash }, context) => {
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
				}
			},
		})({
			fields: {
				paymentRequest: (payment) => payment.paymentRequest,
				valueMsat: (payment) => payment.valueMsat,
				createdAtMs: (payment) => payment.createdAtMs,
				paymentIndex: (payment) => payment.paymentIndex,
				$$timestamps: (payment) => payment.$$timestamps.map((timestamp) => ({
					[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
				})),
			},
		}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.BlockheadLightningPayment_Timestamp,
			resolve: {
				[BlockheadLightningPayment_TimestampSelector.PaymentTimestampMsSource]: async ({ $payment, timestampMs, source }, context) => {
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
					return paymentFieldsFromLndPayment(payment, timestampMs).$$timestamps[0]
				},
			},
		})({
			fields: {
				$payment: (timestamp) => timestamp.$payment,
				timestampMs: (timestamp) => timestamp.timestampMs,
				source: (timestamp) => timestamp.source,
				status: (timestamp) => timestamp.status,
				feeMsat: (timestamp) => timestamp.feeMsat,
				failureReason: (timestamp) => timestamp.failureReason,
				preimage: (timestamp) => timestamp.preimage,
			},
		}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.LightningNetwork,
			resolve: {
				[LightningNetworkSelector.Network]: async ({ $network }, context) => {
					assertLightningNetwork($network)
					const info = await lndInfo(context)
					return [
						{
							[EntityMetaKey.Selector]: {
								$network: {
									slug: 'lightning',
								},
								publicKey: info.identity_pubkey,
							},
							alias: info.alias,
							color: info.color,
							channelCount: (info.num_active_channels ?? 0) + (info.num_inactive_channels ?? 0),
							networkAddresses: info.uris ?? [],
						},
					]
				}
			},
		})({
			fields: {
				$$nodes: (nodes) => nodes.map((node) => ({
					[EntityMetaKey.Selector]: node[EntityMetaKey.Selector],
				})),
			},
		}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.LightningNetwork,
			resolve: {
				[LightningNetworkSelector.Network]: async ({ $network }, context) => {
					assertLightningNetwork($network)
					const info = await lndInfo(context)
					return (await lndChannels(context))
						.slice(0, resolverContextRowLimit(context))
						.map((channel) => channelFieldsFromLndChannel(channel))
				}
			},
		})({
			fields: {
				$$channels: (channels) => channels.map((channel) => ({
					[EntityMetaKey.Selector]: channel[EntityMetaKey.Selector],
				})),
			},
		}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.LightningNetwork,
			resolve: {
				[LightningNetworkSelector.Network]: async ({ $network }, context) => {
					assertLightningNetwork($network)
					const { listInvoices } = await import('$/sources/LightningLnd/Rest/queries.ts')
					return (
						(await listInvoices({
							publicEnv: context.publicEnv,
							numMaxInvoices: resolverContextRowLimit(context),
						})).invoices ?? []
					).flatMap((invoice) => (
						invoicePaymentHash(invoice) == null ?
							[]
						:
							[invoiceFieldsFromLndInvoice(invoice)]
					))
				}
			},
		})({
			fields: {
				$$invoices: (invoices) => invoices.map((invoice) => ({
					[EntityMetaKey.Selector]: invoice[EntityMetaKey.Selector],
				})),
			},
		}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.LightningNetwork,
			resolve: {
				[LightningNetworkSelector.Network]: async ({ $network }, context) => {
					assertLightningNetwork($network)
					const { listPayments } = await import('$/sources/LightningLnd/Rest/queries.ts')
					return (
						(await listPayments({
							publicEnv: context.publicEnv,
							maxPayments: resolverContextRowLimit(context),
						})).payments ?? []
					).map(paymentFieldsFromLndPayment)
				}
			},
		})({
			fields: {
				$$payments: (payments) => payments.map((payment) => ({
					[EntityMetaKey.Selector]: payment[EntityMetaKey.Selector],
				})),
			},
		}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.LightningNode,
			resolve: {
				[LightningNodeSelector.NetworkPublicKey]: async ({ $network, publicKey }, context) => {
					assertLightningNetwork($network)
					const info = await lndInfo(context)
					return (await lndChannels(context))
						.filter((channel) => (
						publicKey === info.identity_pubkey
						|| publicKey === channel.remote_pubkey
						))
						.slice(0, resolverContextRowLimit(context))
						.map((channel) => channelFieldsFromLndChannel(channel))
				}
			},
		})({
			fields: {
				$$channels: (channels) => channels.map((channel) => ({
					[EntityMetaKey.Selector]: channel[EntityMetaKey.Selector],
				})),
			},
		}),

	],
}

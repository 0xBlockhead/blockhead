import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type SourceResolverContext,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
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
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], '$node')]: {
			[EntityMetaKey.Selector]: nodeId,
		},
		[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'timestampMs')]: timestampMs,
		[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'source')]: Source.LightningLnd_Rest,
		[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'alias')]: alias,
		[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'color')]: color,
		[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'channelCount')]: channelCount,
		[entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'networkAddresses')]: networkAddresses ?? [],
	},
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
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.LightningChannel, [], '$node1')]: {
			[EntityMetaKey.Selector]: {
				$network: {
					slug: 'lightning',
				},
				publicKey: channel.remote_pubkey,
			},
		},
		[entityFieldAddressKey(EntityType.LightningChannel, [], 'fundingTransactionId')]: channelPointParts(channel.channel_point).fundingTransactionId,
		[entityFieldAddressKey(EntityType.LightningChannel, [], 'fundingOutputIndex')]: channelPointParts(channel.channel_point).fundingOutputIndex,
		[entityFieldAddressKey(EntityType.LightningChannel, [], '$$timestamps')]: [
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
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], '$channel')]: {
					[EntityMetaKey.Selector]: {
						$network: {
							slug: 'lightning',
						},
						channelId: channel.chan_id,
					},
				},
				[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'timestampMs')]: timestampMs,
				[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'source')]: Source.LightningLnd_Rest,
				[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'status')]: channelStatusFromLndChannel(channel),
				[entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'capacitySats')]: bigintFromWire(channel.capacity),
			},
		},
		],
	},
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
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'paymentRequest')]: invoice.payment_request,
		[entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'memo')]: invoice.memo,
		[entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'valueMsat')]: bigintFromWire(invoice.value_msat),
		[entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'createdAtMs')]: timestampMsFromSeconds(invoice.creation_date),
		[entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'expirySeconds')]: invoice.expiry == null ? undefined : Number(invoice.expiry),
		[entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'private')]: invoice.private,
		[entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'addIndex')]: bigintFromWire(invoice.add_index),
		[entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], '$$timestamps')]: [
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
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BlockheadLightningInvoice_Timestamp, [], '$invoice')]: {
					[EntityMetaKey.Selector]: {
						$network: {
							slug: 'lightning',
						},
						paymentHash: invoicePaymentHash(invoice) ?? '',
					},
				},
				[entityFieldAddressKey(EntityType.BlockheadLightningInvoice_Timestamp, [], 'timestampMs')]: timestampMs,
				[entityFieldAddressKey(EntityType.BlockheadLightningInvoice_Timestamp, [], 'source')]: Source.LightningLnd_Rest,
				[entityFieldAddressKey(EntityType.BlockheadLightningInvoice_Timestamp, [], 'amountPaidMsat')]: bigintFromWire(invoice.amt_paid_msat),
				[entityFieldAddressKey(EntityType.BlockheadLightningInvoice_Timestamp, [], 'settledAtMs')]: timestampMsFromSeconds(invoice.settle_date),
				[entityFieldAddressKey(EntityType.BlockheadLightningInvoice_Timestamp, [], 'state')]: invoiceStateFromLnd(invoice.state),
				[entityFieldAddressKey(EntityType.BlockheadLightningInvoice_Timestamp, [], 'settleIndex')]: bigintFromWire(invoice.settle_index),
			},
		},
		],
	},
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
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.BlockheadLightningPayment, [], 'paymentRequest')]: payment.payment_request,
		[entityFieldAddressKey(EntityType.BlockheadLightningPayment, [], 'valueMsat')]: bigintFromWire(payment.value_msat),
		[entityFieldAddressKey(EntityType.BlockheadLightningPayment, [], 'createdAtMs')]: (
		timestampMsFromNanoseconds(payment.creation_time_ns)
		?? timestampMsFromSeconds(payment.creation_date)
		),
		[entityFieldAddressKey(EntityType.BlockheadLightningPayment, [], 'paymentIndex')]: bigintFromWire(payment.payment_index),
		[entityFieldAddressKey(EntityType.BlockheadLightningPayment, [], '$$timestamps')]: [
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
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BlockheadLightningPayment_Timestamp, [], '$payment')]: {
					[EntityMetaKey.Selector]: {
						$network: {
							slug: 'lightning',
						},
						paymentHash: payment.payment_hash,
					},
				},
				[entityFieldAddressKey(EntityType.BlockheadLightningPayment_Timestamp, [], 'timestampMs')]: timestampMs,
				[entityFieldAddressKey(EntityType.BlockheadLightningPayment_Timestamp, [], 'source')]: Source.LightningLnd_Rest,
				[entityFieldAddressKey(EntityType.BlockheadLightningPayment_Timestamp, [], 'feeMsat')]: bigintFromWire(payment.fee_msat),
				[entityFieldAddressKey(EntityType.BlockheadLightningPayment_Timestamp, [], 'status')]: paymentStatusFromLnd(payment.status),
				[entityFieldAddressKey(EntityType.BlockheadLightningPayment_Timestamp, [], 'failureReason')]: payment.failure_reason,
				[entityFieldAddressKey(EntityType.BlockheadLightningPayment_Timestamp, [], 'preimage')]: payment.payment_preimage,
			},
		},
		],
	},
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
				}
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
					},
				}
			},
		})({
				$$timestamps: (node) => node.$$timestamps.map((timestamp) => ({
					[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
				})),
			}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.LightningNode_Timestamp,
			resolve: {
				NodeTimestampMsSource: {
					resolve: async ({ $node, timestampMs, source }, context) => {
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
			},
		})({
				$node: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], '$node')],
				timestampMs: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'timestampMs')],
				source: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'source')],
				alias: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'alias')],
				color: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'color')],
				channelCount: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'channelCount')],
				networkAddresses: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningNode_Timestamp, [], 'networkAddresses')],
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
				}
			},
		})({
				$node1: (channel) => channel[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningChannel, [], '$node1')],
				fundingTransactionId: (channel) => channel[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningChannel, [], 'fundingTransactionId')],
				fundingOutputIndex: (channel) => channel[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningChannel, [], 'fundingOutputIndex')],
				$$timestamps: (channel) => channel[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningChannel, [], '$$timestamps')].map((timestamp) => ({
					[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
				})),
			}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.LightningChannel_Timestamp,
			resolve: {
				ChannelTimestampMsSource: {
					resolve: async ({ $channel, timestampMs, source }, context) => {
						if (source !== Source.LightningLnd_Rest) throw new Error(`LightningLnd_Rest: unsupported source ${source}`)
						assertLightningNetwork($channel.$network)
						const channel = (await lndChannels(context)).find((channel) => channel.chan_id === $channel.channelId)
						if (channel == null)
							throw new Error(`LightningLnd_Rest: channel not found ${$channel.channelId}`)
						return channelFieldsFromLndChannel(channel, timestampMs)[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningChannel, [], '$$timestamps')][0]
					},
				},
			},
		})({
				$channel: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], '$channel')],
				timestampMs: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'timestampMs')],
				source: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'source')],
				status: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'status')],
				capacitySats: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.LightningChannel_Timestamp, [], 'capacitySats')],
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
						return invoiceFieldsFromLndInvoice(invoice)
					},
				}
			},
		})({
				paymentRequest: (invoice) => invoice[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'paymentRequest')],
				memo: (invoice) => invoice[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'memo')],
				valueMsat: (invoice) => invoice[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'valueMsat')],
				createdAtMs: (invoice) => invoice[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'createdAtMs')],
				expirySeconds: (invoice) => invoice[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'expirySeconds')],
				private: (invoice) => invoice[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'private')],
				addIndex: (invoice) => invoice[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], 'addIndex')],
				$$timestamps: (invoice) => invoice[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], '$$timestamps')].map((timestamp) => ({
					[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
				})),
			}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.BlockheadLightningInvoice_Timestamp,
			resolve: {
				InvoiceTimestampMsSource: {
					resolve: async ({ $invoice, timestampMs, source }, context) => {
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
						return invoiceFieldsFromLndInvoice(invoice, timestampMs)[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningInvoice, [], '$$timestamps')][0]
					},
				},
			},
		})({
				$invoice: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningInvoice_Timestamp, [], '$invoice')],
				timestampMs: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningInvoice_Timestamp, [], 'timestampMs')],
				source: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningInvoice_Timestamp, [], 'source')],
				state: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningInvoice_Timestamp, [], 'state')],
				amountPaidMsat: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningInvoice_Timestamp, [], 'amountPaidMsat')],
				settledAtMs: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningInvoice_Timestamp, [], 'settledAtMs')],
				settleIndex: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningInvoice_Timestamp, [], 'settleIndex')],
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
				}
			},
		})({
				paymentRequest: (payment) => payment[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningPayment, [], 'paymentRequest')],
				valueMsat: (payment) => payment[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningPayment, [], 'valueMsat')],
				createdAtMs: (payment) => payment[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningPayment, [], 'createdAtMs')],
				paymentIndex: (payment) => payment[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningPayment, [], 'paymentIndex')],
				$$timestamps: (payment) => payment[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningPayment, [], '$$timestamps')].map((timestamp) => ({
					[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
				})),
			}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.BlockheadLightningPayment_Timestamp,
			resolve: {
				PaymentTimestampMsSource: {
					resolve: async ({ $payment, timestampMs, source }, context) => {
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
						return paymentFieldsFromLndPayment(payment, timestampMs)[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningPayment, [], '$$timestamps')][0]
					},
				},
			},
		})({
				$payment: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningPayment_Timestamp, [], '$payment')],
				timestampMs: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningPayment_Timestamp, [], 'timestampMs')],
				source: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningPayment_Timestamp, [], 'source')],
				status: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningPayment_Timestamp, [], 'status')],
				feeMsat: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningPayment_Timestamp, [], 'feeMsat')],
				failureReason: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningPayment_Timestamp, [], 'failureReason')],
				preimage: (timestamp) => timestamp[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BlockheadLightningPayment_Timestamp, [], 'preimage')],
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
					},
				}
			},
		})({
				$$nodes: (nodes) => nodes.map((node) => ({
					[EntityMetaKey.Selector]: node[EntityMetaKey.Selector],
				})),
			}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.LightningNetwork,
			resolve: {
				Network: {
					resolve: async ({ $network }, context) => {
						assertLightningNetwork($network)
						const info = await lndInfo(context)
						return (await lndChannels(context))
							.slice(0, resolverContextRowLimit(context))
							.map((channel) => channelFieldsFromLndChannel(channel))
					},
				}
			},
		})({
				$$channels: (channels) => channels.map((channel) => ({
					[EntityMetaKey.Selector]: channel[EntityMetaKey.Selector],
				})),
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
						).flatMap((invoice) => (
							invoicePaymentHash(invoice) == null ?
								[]
							:
								[invoiceFieldsFromLndInvoice(invoice)]
						))
					},
				}
			},
		})({
				$$invoices: (invoices) => invoices.map((invoice) => ({
					[EntityMetaKey.Selector]: invoice[EntityMetaKey.Selector],
				})),
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
						).map(paymentFieldsFromLndPayment)
					},
				}
			},
		})({
				$$payments: (payments) => payments.map((payment) => ({
					[EntityMetaKey.Selector]: payment[EntityMetaKey.Selector],
				})),
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
							.map((channel) => channelFieldsFromLndChannel(channel))
					},
				}
			},
		})({
				$$channels: (channels) => channels.map((channel) => ({
					[EntityMetaKey.Selector]: channel[EntityMetaKey.Selector],
				})),
			}),

	],
}

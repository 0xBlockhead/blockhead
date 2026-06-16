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
import { LightningHtlcDirection } from '$/schema/LightningHtlc.ts'
import { LightningInvoiceState } from '$/schema/LightningInvoice.ts'
import { LightningPaymentStatus } from '$/schema/LightningPayment.ts'
import { Source } from '$/sources/Source.ts'
import type {
	LndChannel,
	LndHtlc,
	LndInvoice,
	LndPayment,
} from '$/sources/LightningLnd/Rest/types.ts'
import { LightningNetworkSelector } from '$/schema/LightningNetwork.ts'
import { LightningNodeSelector } from '$/schema/LightningNode.ts'
import { LightningChannelSelector } from '$/schema/LightningChannel.ts'
import { LightningInvoiceSelector } from '$/schema/LightningInvoice.ts'
import { LightningPaymentSelector } from '$/schema/LightningPayment.ts'
import { LightningHtlcSelector } from '$/schema/LightningHtlc.ts'

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

const invoiceStateFromLnd = (state: string | null | undefined): LightningInvoiceState => (
	state === 'OPEN' ?
		LightningInvoiceState.Open
	:
		state === 'SETTLED' ?
			LightningInvoiceState.Settled
		:
			state === 'CANCELED' ?
				LightningInvoiceState.Canceled
			:
				state === 'ACCEPTED' ?
				LightningInvoiceState.Accepted
			:
				LightningInvoiceState.Unknown
)

const paymentStatusFromLnd = (status: string | null | undefined): LightningPaymentStatus => (
	status === 'IN_FLIGHT' ?
		LightningPaymentStatus.InFlight
	:
		status === 'SUCCEEDED' ?
			LightningPaymentStatus.Succeeded
		:
			status === 'FAILED' ?
				LightningPaymentStatus.Failed
			:
				LightningPaymentStatus.Unknown
)

const lndTransport = (context: SourceResolverContext<Source.LightningLnd_Rest>) => ({
	restBaseUrl: context.publicEnv.PUBLIC_LND_REST_BASE_URL,
	macaroonHex: context.publicEnv.PUBLIC_LND_MACAROON_HEX,
})

const channelFieldsFromLndChannel = (
	channel: LndChannel,
	localPublicKey?: string
) => ({
	[EntityMetaKey.Selector]: {
		$network: {
			slug: 'lightning',
		},
		channelId: channel.chan_id,
	},
	status: channelStatusFromLndChannel(channel),
	...(localPublicKey != null && {
		$node0: {
			[EntityMetaKey.Selector]: {
				$network: {
					slug: 'lightning',
				},
				publicKey: localPublicKey,
			},
		},
	}),
	$node1: {
		[EntityMetaKey.Selector]: {
			$network: {
				slug: 'lightning',
			},
			publicKey: channel.remote_pubkey,
		},
	},
	capacitySats: bigintFromWire(channel.capacity),
	localBalanceSats: bigintFromWire(channel.local_balance),
	remoteBalanceSats: bigintFromWire(channel.remote_balance),
	unsettledBalanceSats: bigintFromWire(channel.unsettled_balance),
	...channelPointParts(channel.channel_point),
	active: channel.active,
	private: channel.private,
	initiator: channel.initiator,
})

const invoicePaymentHash = (invoice: LndInvoice): string | undefined => (
	invoice.r_hash_str ?? invoice.r_hash
)

const invoiceFieldsFromLndInvoice = (invoice: LndInvoice) => ({
	[EntityMetaKey.Selector]: {
		$network: {
			slug: 'lightning',
		},
		paymentHash: invoicePaymentHash(invoice) ?? '',
	},
	paymentRequest: invoice.payment_request,
	memo: invoice.memo,
	valueMsat: bigintFromWire(invoice.value_msat),
	amountPaidMsat: bigintFromWire(invoice.amt_paid_msat),
	createdAtMs: timestampMsFromSeconds(invoice.creation_date),
	settledAtMs: timestampMsFromSeconds(invoice.settle_date),
	state: invoiceStateFromLnd(invoice.state),
	expirySeconds: invoice.expiry == null ? undefined : Number(invoice.expiry),
	private: invoice.private,
	addIndex: bigintFromWire(invoice.add_index),
	settleIndex: bigintFromWire(invoice.settle_index),
})

const paymentFieldsFromLndPayment = (payment: LndPayment) => ({
	[EntityMetaKey.Selector]: {
		$network: {
			slug: 'lightning',
		},
		paymentHash: payment.payment_hash,
	},
	paymentRequest: payment.payment_request,
	valueMsat: bigintFromWire(payment.value_msat),
	feeMsat: bigintFromWire(payment.fee_msat),
	createdAtMs: (
		timestampMsFromNanoseconds(payment.creation_time_ns)
		?? timestampMsFromSeconds(payment.creation_date)
	),
	status: paymentStatusFromLnd(payment.status),
	failureReason: payment.failure_reason,
	preimage: payment.payment_preimage,
	paymentIndex: bigintFromWire(payment.payment_index),
})

const htlcFieldsFromLndHtlc = (
	channel: LndChannel,
	htlc: LndHtlc,
	htlcIndex: number
) => ({
	[EntityMetaKey.Selector]: {
		$channel: {
			$network: {
				slug: 'lightning',
			},
			channelId: channel.chan_id,
		},
		htlcIndex,
	},
	direction: (
		htlc.incoming === true ?
			LightningHtlcDirection.Incoming
		:
			LightningHtlcDirection.Outgoing
	),
	amountMsat: bigintFromWire(htlc.amount),
	expiryHeight: htlc.expiration_height == null ? undefined : BigInt(htlc.expiration_height),
	hashLock: htlc.hash_lock,
	state: htlc.state,
})

const lndChannels = async (context: SourceResolverContext<Source.LightningLnd_Rest>) => {
	const { listChannels } = await import('$/sources/LightningLnd/Rest/queries.ts')
	return (await listChannels(lndTransport(context))).channels ?? []
}

const lndInfo = async (context: SourceResolverContext<Source.LightningLnd_Rest>) => {
	const { getInfo } = await import('$/sources/LightningLnd/Rest/queries.ts')
	return getInfo(lndTransport(context))
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
							alias: info.alias,
							color: info.color,
							channelCount: (info.num_active_channels ?? 0) + (info.num_inactive_channels ?? 0),
							networkAddresses: info.uris ?? [],
						}
					if (!channels.some((channel) => channel.remote_pubkey === publicKey))
						throw new Error(`LightningLnd_Rest: node not found ${publicKey}`)
					return {
						channelCount: channels.filter((channel) => channel.remote_pubkey === publicKey).length,
						networkAddresses: [],
					}
				}
			},
		})({
			fields: {
				alias: (node) => node.alias,
				color: (node) => node.color,
				channelCount: (node) => node.channelCount,
				networkAddresses: (node) => node.networkAddresses,
			},
		}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.LightningChannel,
			resolve: {
				[LightningChannelSelector.NetworkChannelId]: async ({ $network, channelId }, context) => {
					assertLightningNetwork($network)
					const info = await lndInfo(context)
					const channel = (await lndChannels(context)).find((channel) => channel.chan_id === channelId)
					if (channel == null)
						throw new Error(`LightningLnd_Rest: channel not found ${channelId}`)
					return channelFieldsFromLndChannel(channel, info.identity_pubkey)
				}
			},
		})({
			fields: {
				status: (channel) => channel.status,
				$node0: (channel) => channel.$node0,
				$node1: (channel) => channel.$node1,
				capacitySats: (channel) => channel.capacitySats,
				localBalanceSats: (channel) => channel.localBalanceSats,
				remoteBalanceSats: (channel) => channel.remoteBalanceSats,
				unsettledBalanceSats: (channel) => channel.unsettledBalanceSats,
				fundingTransactionId: (channel) => channel.fundingTransactionId,
				fundingOutputIndex: (channel) => channel.fundingOutputIndex,
				active: (channel) => channel.active,
				private: (channel) => channel.private,
				initiator: (channel) => channel.initiator,
			},
		}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.LightningInvoice,
			resolve: {
				[LightningInvoiceSelector.NetworkPaymentHash]: async ({ $network, paymentHash }, context) => {
					assertLightningNetwork($network)
					const { listInvoices } = await import('$/sources/LightningLnd/Rest/queries.ts')
					const invoice = (
						(await listInvoices(lndTransport(context))).invoices ?? []
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
				amountPaidMsat: (invoice) => invoice.amountPaidMsat,
				createdAtMs: (invoice) => invoice.createdAtMs,
				settledAtMs: (invoice) => invoice.settledAtMs,
				state: (invoice) => invoice.state,
				expirySeconds: (invoice) => invoice.expirySeconds,
				private: (invoice) => invoice.private,
				addIndex: (invoice) => invoice.addIndex,
				settleIndex: (invoice) => invoice.settleIndex,
			},
		}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.LightningPayment,
			resolve: {
				[LightningPaymentSelector.NetworkPaymentHash]: async ({ $network, paymentHash }, context) => {
					assertLightningNetwork($network)
					const { listPayments } = await import('$/sources/LightningLnd/Rest/queries.ts')
					const payment = (
						(await listPayments(lndTransport(context))).payments ?? []
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
				feeMsat: (payment) => payment.feeMsat,
				createdAtMs: (payment) => payment.createdAtMs,
				status: (payment) => payment.status,
				failureReason: (payment) => payment.failureReason,
				preimage: (payment) => payment.preimage,
				paymentIndex: (payment) => payment.paymentIndex,
			},
		}),

		defineResolver(Source.LightningLnd_Rest, {
			entityType: EntityType.LightningHtlc,
			resolve: {
				[LightningHtlcSelector.LightningChannelHtlcIndex]: async ({ $channel, htlcIndex }, context) => {
					assertLightningNetwork($channel.$network)
					const channel = (await lndChannels(context)).find((channel) => channel.chan_id === $channel.channelId)
					if (channel == null)
						throw new Error(`LightningLnd_Rest: channel not found ${$channel.channelId}`)
					const htlc = (channel.pending_htlcs ?? []).at(htlcIndex)
					if (htlc == null)
						throw new Error(`LightningLnd_Rest: HTLC not found ${$channel.channelId}:${htlcIndex}`)
					return htlcFieldsFromLndHtlc(channel, htlc, htlcIndex)
				}
			},
		})({
			fields: {
				direction: (htlc) => htlc.direction,
				amountMsat: (htlc) => htlc.amountMsat,
				expiryHeight: (htlc) => htlc.expiryHeight,
				hashLock: (htlc) => htlc.hashLock,
				state: (htlc) => htlc.state,
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
						.map((channel) => channelFieldsFromLndChannel(channel, info.identity_pubkey))
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
							...lndTransport(context),
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
							...lndTransport(context),
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
						.map((channel) => channelFieldsFromLndChannel(channel, info.identity_pubkey))
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
			entityType: EntityType.LightningChannel,
			resolve: {
				[LightningChannelSelector.NetworkChannelId]: async ({ $network, channelId }, context) => {
					assertLightningNetwork($network)
					const channel = (await lndChannels(context)).find((channel) => channel.chan_id === channelId)
					if (channel == null)
						throw new Error(`LightningLnd_Rest: channel not found ${channelId}`)
					return (channel.pending_htlcs ?? []).map((htlc, htlcIndex) => (
						htlcFieldsFromLndHtlc(channel, htlc, htlcIndex)
					))
				}
			},
		})({
			fields: {
				$$htlcs: (htlcs) => htlcs.map((htlc) => ({
					[EntityMetaKey.Selector]: htlc[EntityMetaKey.Selector],
				})),
			},
		}),
	],
}

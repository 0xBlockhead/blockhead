import { throwHttpError } from '$/lib/http.ts'
import bindings from '$/sources/LightningLnd/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import type { LndChannelEdge } from '$/sources/LightningLnd/Rest/types.ts'
import { type as arktype } from 'arktype'

const binding = bindings[Source.LightningLnd_Rest][0]

const unsignedSafe = arktype(`number.integer >= 0 <= ${Number.MAX_SAFE_INTEGER}`)
const losslessUnsignedString = arktype('/^(0|[1-9][0-9]*)$/')
const compressedPublicKey = arktype('/^(02|03)[0-9a-f]{64}$/')
const channelIdWire = arktype('/^(0|[1-9][0-9]*)$/')
const nonEmptyString = arktype('string > 0')

const routingPolicyWire = arktype({
	'time_lock_delta?': unsignedSafe,
	'min_htlc?': losslessUnsignedString,
	'fee_base_msat?': losslessUnsignedString,
	'fee_rate_milli_msat?': losslessUnsignedString,
	'disabled?': 'boolean',
	'max_htlc_msat?': losslessUnsignedString,
	'last_update?': unsignedSafe,
})

const channelEdgeWire = arktype({
	channel_id: channelIdWire,
	'chan_point?': nonEmptyString,
	'last_update?': unsignedSafe,
	node1_pub: compressedPublicKey,
	node2_pub: compressedPublicKey,
	'capacity?': losslessUnsignedString,
	'node1_policy?': routingPolicyWire,
	'node2_policy?': routingPolicyWire,
})

const getInfoWire = arktype({
	'version?': 'string',
	identity_pubkey: compressedPublicKey,
	'alias?': 'string',
	'color?': 'string',
	'num_active_channels?': unsignedSafe,
	'num_inactive_channels?': unsignedSafe,
	'num_pending_channels?': unsignedSafe,
	'num_peers?': unsignedSafe,
	'block_height?': unsignedSafe,
	'best_header_timestamp?': losslessUnsignedString,
	'synced_to_chain?': 'boolean',
	'synced_to_graph?': 'boolean',
	'uris?': 'string[]',
})

const amountWire = arktype({
	'sat?': losslessUnsignedString,
	'msat?': losslessUnsignedString,
})

const walletBalanceWire = arktype({
	'total_balance?': losslessUnsignedString,
	'confirmed_balance?': losslessUnsignedString,
	'unconfirmed_balance?': losslessUnsignedString,
	'locked_balance?': losslessUnsignedString,
	'reserved_balance_anchor_chan?': losslessUnsignedString,
})

const channelBalanceWire = arktype({
	'balance?': losslessUnsignedString,
	'pending_open_balance?': losslessUnsignedString,
	'local_balance?': amountWire,
	'remote_balance?': amountWire,
	'unsettled_local_balance?': amountWire,
	'unsettled_remote_balance?': amountWire,
	'pending_open_local_balance?': amountWire,
	'pending_open_remote_balance?': amountWire,
})

const networkInfoWire = arktype({
	'graph_diameter?': unsignedSafe,
	'avg_out_degree?': 'number',
	'max_out_degree?': unsignedSafe,
	'num_nodes?': unsignedSafe,
	'num_channels?': unsignedSafe,
	'total_network_capacity?': losslessUnsignedString,
	'avg_channel_size?': 'number',
	'min_channel_size?': losslessUnsignedString,
	'max_channel_size?': losslessUnsignedString,
	'median_channel_size_sat?': losslessUnsignedString,
	'num_zombie_chans?': losslessUnsignedString,
})

const nodeAddressWire = arktype({
	'network?': 'string',
	addr: nonEmptyString,
})

const graphNodeWire = arktype({
	'last_update?': unsignedSafe,
	pub_key: compressedPublicKey,
	'alias?': 'string',
	'addresses?': nodeAddressWire.array(),
	'color?': 'string',
})

const nodeInfoWire = arktype({
	node: graphNodeWire,
	'num_channels?': unsignedSafe,
	'total_capacity?': losslessUnsignedString,
	'channels?': channelEdgeWire.array(),
})

const htlcWire = arktype({
	'incoming?': 'boolean',
	'amount?': losslessUnsignedString,
	'hash_lock?': 'string',
	'expiration_height?': unsignedSafe,
	'htlc_index?': losslessUnsignedString,
	'state?': 'string',
})

const channelWire = arktype({
	'active?': 'boolean',
	remote_pubkey: compressedPublicKey,
	channel_point: nonEmptyString,
	chan_id: channelIdWire,
	'capacity?': losslessUnsignedString,
	'local_balance?': losslessUnsignedString,
	'remote_balance?': losslessUnsignedString,
	'unsettled_balance?': losslessUnsignedString,
	'commit_fee?': losslessUnsignedString,
	'commit_weight?': losslessUnsignedString,
	'fee_per_kw?': losslessUnsignedString,
	'private?': 'boolean',
	'initiator?': 'boolean',
	'num_updates?': losslessUnsignedString,
	'pending_htlcs?': htlcWire.array(),
})

const listChannelsWire = arktype({
	'channels?': channelWire.array(),
})

const invoiceWire = arktype({
	'memo?': 'string',
	'r_hash?': 'string',
	'r_hash_str?': 'string',
	'value?': losslessUnsignedString,
	'value_msat?': losslessUnsignedString,
	'settled?': 'boolean',
	'creation_date?': losslessUnsignedString,
	'settle_date?': losslessUnsignedString,
	'payment_request?': 'string',
	'expiry?': losslessUnsignedString,
	'private?': 'boolean',
	'add_index?': losslessUnsignedString,
	'settle_index?': losslessUnsignedString,
	'amt_paid_msat?': losslessUnsignedString,
	'state?': 'string',
})

const listInvoicesWire = arktype({
	'invoices?': invoiceWire.array(),
	'last_index_offset?': losslessUnsignedString,
	'first_index_offset?': losslessUnsignedString,
})

const paymentWire = arktype({
	payment_hash: nonEmptyString,
	'payment_preimage?': 'string',
	'value_msat?': losslessUnsignedString,
	'fee_msat?': losslessUnsignedString,
	'creation_date?': losslessUnsignedString,
	'creation_time_ns?': losslessUnsignedString,
	'payment_request?': 'string',
	'status?': 'string',
	'failure_reason?': 'string',
	'payment_index?': losslessUnsignedString,
})

const listPaymentsWire = arktype({
	'payments?': paymentWire.array(),
	'first_index_offset?': losslessUnsignedString,
	'last_index_offset?': losslessUnsignedString,
	'total_num_payments?': losslessUnsignedString,
})

const assertEnvelope = <_Value>(
	wire: {
		assert: (value: unknown) => _Value
	},
	response: unknown,
	label: string
): _Value => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`LightningLnd_Rest: invalid ${label} envelope`)
	}
}

const assertPublicKey = (publicKey: string) => {
	if (!compressedPublicKey.allows(publicKey))
		throw new Error('LightningLnd_Rest: invalid compressed node public key')
}

const assertChannelId = (channelId: string) => {
	if (!channelIdWire.allows(channelId))
		throw new Error('LightningLnd_Rest: invalid channel ID')
}

const assertChannelPoint = (channelPoint: string) => {
	const [fundingTransactionId, outputIndex] = channelPoint.split(':')
	if (
		fundingTransactionId === ''
		|| !losslessUnsignedString.allows(outputIndex)
	)
		throw new Error('LightningLnd_Rest: invalid channel funding point')
}

const requestLightningLndRestJson = async ({
	path,
}: {
	path: string
}) => {
	const response = await sourceFetch(binding, httpUrl(binding, path))
	if (!response.ok)
		await throwHttpError(`${binding.source} ${path}`, response)

	return response.json()
}

const assertGraphEdge = (
	edge: LndChannelEdge,
	expectedChannelId?: string
) => {
	if (expectedChannelId != null && edge.channel_id !== expectedChannelId)
		throw new Error('LightningLnd_Rest: channel graph response has mismatched identity')
	if (edge.chan_point != null)
		assertChannelPoint(edge.chan_point)
}

export const getInfo = async () => (
	assertEnvelope(
		getInfoWire,
		await requestLightningLndRestJson({
			path: '/v1/getinfo',
		}),
		'getinfo'
	)
)

export const getWalletBalance = async () => (
	// Official LND REST/OpenAPI proof:
	// https://lightning.engineering/api-docs/api/lnd/lightning/wallet-balance/
	assertEnvelope(
		walletBalanceWire,
		await requestLightningLndRestJson({
			path: '/v1/balance/blockchain',
		}),
		'wallet balance'
	)
)

export const getChannelBalance = async () => (
	// Official LND REST/OpenAPI proof:
	// https://lightning.engineering/api-docs/api/lnd/lightning/channel-balance/
	assertEnvelope(
		channelBalanceWire,
		await requestLightningLndRestJson({
			path: '/v1/balance/channels',
		}),
		'channel balance'
	)
)

export const getNetworkInfo = async () => (
	assertEnvelope(
		networkInfoWire,
		await requestLightningLndRestJson({
			path: '/v1/graph/info',
		}),
		'network info'
	)
)

export const getNodeInfo = async ({
	publicKey,
	includeChannels = false,
}: {
	publicKey: string
	includeChannels?: boolean
}) => {
	assertPublicKey(publicKey)
	const info = assertEnvelope(
		nodeInfoWire,
		await requestLightningLndRestJson({
			path: `/v1/graph/node/${encodeURIComponent(publicKey)}?include_channels=${includeChannels}`,
		}),
		'node info'
	)
	if (info.node.pub_key !== publicKey)
		throw new Error('LightningLnd_Rest: node graph response has mismatched identity')
	for (const channel of info.channels ?? []) {
		assertGraphEdge(channel)
		if (channel.node1_pub !== publicKey && channel.node2_pub !== publicKey)
			throw new Error('LightningLnd_Rest: node graph response contains a foreign channel')
	}
	return info
}

export const getChannelInfo = async ({
	channelId,
}: {
	channelId: string
}) => {
	// Official LND REST/OpenAPI proof:
	// https://lightning.engineering/api-docs/api/lnd/lightning/get-chan-info/
	assertChannelId(channelId)
	const edge = assertEnvelope(
		channelEdgeWire,
		await requestLightningLndRestJson({
			path: `/v1/graph/edge/${encodeURIComponent(channelId)}`,
		}),
		'channel edge'
	)
	assertGraphEdge(edge, channelId)
	return edge
}

export const getInvoice = async ({
	paymentHash,
}: {
	paymentHash: string
}) => {
	// Official LND REST/OpenAPI proof:
	// https://lightning.engineering/api-docs/api/lnd/lightning/lookup-invoice/
	if (!nonEmptyString.allows(paymentHash))
		throw new Error('LightningLnd_Rest: invalid invoice payment hash')
	const invoice = assertEnvelope(
		invoiceWire,
		await requestLightningLndRestJson({
			path: `/v1/invoice/${encodeURIComponent(paymentHash)}`,
		}),
		'invoice'
	)
	if ((invoice.r_hash_str ?? invoice.r_hash) !== paymentHash)
		throw new Error('LightningLnd_Rest: invoice response has mismatched identity')
	return invoice
}

export const listChannels = async () => {
	const response = assertEnvelope(
		listChannelsWire,
		await requestLightningLndRestJson({
			path: '/v1/channels',
		}),
		'list channels'
	)
	const channelIds = new Set<string>()
	for (const channel of response.channels ?? []) {
		assertChannelPoint(channel.channel_point)
		if (channelIds.has(channel.chan_id))
			throw new Error('LightningLnd_Rest: list channels contains a duplicate channel')
		channelIds.add(channel.chan_id)
	}
	return response
}

export const listInvoices = async ({
	indexOffset,
	numMaxInvoices = 100,
}: {
	indexOffset?: string
	numMaxInvoices?: number
} = {}) => {
	if (indexOffset != null && !losslessUnsignedString.allows(indexOffset))
		throw new Error('LightningLnd_Rest: invoice index offset must be an unsigned integer string')
	if (!Number.isSafeInteger(numMaxInvoices) || numMaxInvoices < 1 || numMaxInvoices > 100)
		throw new Error('LightningLnd_Rest: invoice page size must be a positive safe integer no greater than 100')
	const searchParams = new URLSearchParams({
		...(indexOffset != null && {
			index_offset: indexOffset,
		}),
		num_max_invoices: String(numMaxInvoices),
	})
	const page = assertEnvelope(
		listInvoicesWire,
		await requestLightningLndRestJson({
			path: `/v1/invoices${searchParams.size === 0 ? '' : `?${searchParams}`}`,
		}),
		'list invoices'
	)
	const paymentHashes = new Set<string>()
	for (const invoice of page.invoices ?? []) {
		const paymentHash = invoice.r_hash_str ?? invoice.r_hash
		if (paymentHash == null)
			continue
		if (paymentHashes.has(paymentHash))
			throw new Error('LightningLnd_Rest: invoice page contains a duplicate invoice')
		paymentHashes.add(paymentHash)
	}
	return page
}

export const listPayments = async ({
	indexOffset,
	maxPayments = 100,
}: {
	indexOffset?: string
	maxPayments?: number
} = {}) => {
	if (indexOffset != null && !losslessUnsignedString.allows(indexOffset))
		throw new Error('LightningLnd_Rest: payment index offset must be an unsigned integer string')
	if (!Number.isSafeInteger(maxPayments) || maxPayments < 1 || maxPayments > 100)
		throw new Error('LightningLnd_Rest: payment page size must be a positive safe integer no greater than 100')
	const searchParams = new URLSearchParams({
		...(indexOffset != null && {
			index_offset: indexOffset,
		}),
		max_payments: String(maxPayments),
	})
	const page = assertEnvelope(
		listPaymentsWire,
		await requestLightningLndRestJson({
			path: `/v1/payments${searchParams.size === 0 ? '' : `?${searchParams}`}`,
		}),
		'list payments'
	)
	const paymentHashes = new Set<string>()
	for (const payment of page.payments ?? []) {
		if (paymentHashes.has(payment.payment_hash))
			throw new Error('LightningLnd_Rest: payment page contains a duplicate payment')
		paymentHashes.add(payment.payment_hash)
	}
	return page
}

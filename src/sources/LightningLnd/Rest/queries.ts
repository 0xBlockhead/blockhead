import { throwHttpError } from '$/lib/http.ts'
import { requiredPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
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
		fundingTransactionId == null
		|| fundingTransactionId === ''
		|| outputIndex == null
		|| !losslessUnsignedString.allows(outputIndex)
	)
		throw new Error('LightningLnd_Rest: invalid channel funding point')
}

const lndHeaders = (macaroonHex: string) => ({
	'Grpc-Metadata-macaroon': macaroonHex,
})

const requestLightningLndRestJson = async ({
	publicEnv,
	path,
}: {
	publicEnv: SourcePublicEnv
	path: string
}) => {
	const response = await sourceFetch(binding, httpUrl(binding, path), {
		headers: lndHeaders(requiredPublicEnvString(publicEnv, 'PUBLIC_LND_MACAROON_HEX')),
	})
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

export const getInfo = async ({
	publicEnv,
}: {
	publicEnv: SourcePublicEnv
}) => (
	assertEnvelope(
		getInfoWire,
		await requestLightningLndRestJson({
			publicEnv,
			path: '/v1/getinfo',
		}),
		'getinfo'
	)
)

export const getNetworkInfo = async ({
	publicEnv,
}: {
	publicEnv: SourcePublicEnv
}) => (
	assertEnvelope(
		networkInfoWire,
		await requestLightningLndRestJson({
			publicEnv,
			path: '/v1/graph/info',
		}),
		'network info'
	)
)

export const getNodeInfo = async ({
	publicEnv,
	publicKey,
	includeChannels = false,
}: {
	publicEnv: SourcePublicEnv
	publicKey: string
	includeChannels?: boolean
}) => {
	assertPublicKey(publicKey)
	const info = assertEnvelope(
		nodeInfoWire,
		await requestLightningLndRestJson({
			publicEnv,
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
	publicEnv,
	channelId,
}: {
	publicEnv: SourcePublicEnv
	channelId: string
}) => {
	// Official LND REST/OpenAPI proof:
	// https://lightning.engineering/api-docs/api/lnd/lightning/get-chan-info/
	assertChannelId(channelId)
	const edge = assertEnvelope(
		channelEdgeWire,
		await requestLightningLndRestJson({
			publicEnv,
			path: `/v1/graph/edge/${encodeURIComponent(channelId)}`,
		}),
		'channel edge'
	)
	assertGraphEdge(edge, channelId)
	return edge
}

export const listChannels = async ({
	publicEnv,
}: {
	publicEnv: SourcePublicEnv
}) => {
	const response = assertEnvelope(
		listChannelsWire,
		await requestLightningLndRestJson({
			publicEnv,
			path: '/v1/channels',
		}),
		'list channels'
	)
	for (const channel of response.channels ?? [])
		assertChannelPoint(channel.channel_point)
	return response
}

export const listInvoices = async ({
	publicEnv,
	numMaxInvoices,
}: {
	publicEnv: SourcePublicEnv
	numMaxInvoices?: number
}) => {
	if (numMaxInvoices != null && (!Number.isSafeInteger(numMaxInvoices) || numMaxInvoices < 1))
		throw new Error('LightningLnd_Rest: invoice page size must be a positive safe integer')
	return assertEnvelope(
		listInvoicesWire,
		await requestLightningLndRestJson({
			publicEnv,
			path: `/v1/invoices${numMaxInvoices == null ? '' : `?num_max_invoices=${numMaxInvoices}`}`,
		}),
		'list invoices'
	)
}

export const listPayments = async ({
	publicEnv,
	maxPayments,
}: {
	publicEnv: SourcePublicEnv
	maxPayments?: number
}) => {
	if (maxPayments != null && (!Number.isSafeInteger(maxPayments) || maxPayments < 1))
		throw new Error('LightningLnd_Rest: payment page size must be a positive safe integer')
	return assertEnvelope(
		listPaymentsWire,
		await requestLightningLndRestJson({
			publicEnv,
			path: `/v1/payments${maxPayments == null ? '' : `?max_payments=${maxPayments}`}`,
		}),
		'list payments'
	)
}

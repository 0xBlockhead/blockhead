import { getJson } from '$/lib/http.ts'
import { requiredPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import type {
	LndGetInfoResponse,
	LndChannelEdge,
	LndListChannelsResponse,
	LndListInvoicesResponse,
	LndListPaymentsResponse,
	LndNetworkInfoResponse,
	LndNodeInfoResponse,
} from '$/sources/LightningLnd/Rest/types.ts'

const base = (restBaseUrl: string) => restBaseUrl.replace(/\/$/, '')
const lightningLndEndpointOrigins = [
	'https://127.0.0.1:8080',
	'http://127.0.0.1:8080',
	'https://localhost:8080',
	'http://localhost:8080',
] as const
const restBaseUrl = lightningLndEndpointOrigins[0]
const lightningLndOrigins = lightningLndEndpointOrigins.map((origin) => ({
	origin,
	corsEnabled: false,
}))

const lndHeaders = (macaroonHex: string) => ({
	'Grpc-Metadata-macaroon': macaroonHex,
})

const assertPublicKey = (publicKey: string) => {
	if (!/^(02|03)[0-9a-f]{64}$/.test(publicKey))
		throw new Error('LightningLnd_Rest: invalid compressed node public key')
}

const assertChannelId = (channelId: string) => {
	if (!/^(0|[1-9][0-9]*)$/.test(channelId))
		throw new Error('LightningLnd_Rest: invalid channel ID')
}

const assertLosslessUnsigned = (
	value: string | null | undefined,
	label: string
) => {
	if (value != null && !/^(0|[1-9][0-9]*)$/.test(value))
		throw new Error(`LightningLnd_Rest: invalid ${label}`)
}

const assertGraphEdge = (
	edge: LndChannelEdge,
	expectedChannelId?: string
) => {
	assertChannelId(edge.channel_id)
	if (expectedChannelId != null && edge.channel_id !== expectedChannelId)
		throw new Error('LightningLnd_Rest: channel graph response has mismatched identity')
	assertPublicKey(edge.node1_pub)
	assertPublicKey(edge.node2_pub)
	assertLosslessUnsigned(edge.capacity, 'channel capacity')
}

export const getInfo = (
	publicEnv: SourcePublicEnv
) => (
	getJson<LndGetInfoResponse>(
		`${base(restBaseUrl)}/v1/getinfo`,
		{
			origins: lightningLndOrigins,
			init: {
				headers: lndHeaders(requiredPublicEnvString(publicEnv, 'PUBLIC_LND_MACAROON_HEX')),
			},
		}
	)
)

export const getNetworkInfo = async (
	publicEnv: SourcePublicEnv
) => {
	const info = await getJson<LndNetworkInfoResponse>(
		`${base(restBaseUrl)}/v1/graph/info`,
		{
			origins: lightningLndOrigins,
			init: {
				headers: lndHeaders(requiredPublicEnvString(publicEnv, 'PUBLIC_LND_MACAROON_HEX')),
			},
		}
	)
	for (const [value, label] of [
		[info.total_network_capacity, 'network capacity'],
		[info.min_channel_size, 'minimum channel size'],
		[info.max_channel_size, 'maximum channel size'],
		[info.median_channel_size_sat, 'median channel size'],
		[info.num_zombie_chans, 'zombie channel count'],
	] as const)
		assertLosslessUnsigned(value, label)
	return info
}

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
	const info = await getJson<LndNodeInfoResponse>(
		`${base(restBaseUrl)}/v1/graph/node/${encodeURIComponent(publicKey)}?include_channels=${includeChannels}`,
		{
			origins: lightningLndOrigins,
			init: {
				headers: lndHeaders(requiredPublicEnvString(publicEnv, 'PUBLIC_LND_MACAROON_HEX')),
			},
		}
	)
	assertPublicKey(info.node.pub_key)
	if (info.node.pub_key !== publicKey)
		throw new Error('LightningLnd_Rest: node graph response has mismatched identity')
	assertLosslessUnsigned(info.total_capacity, 'node capacity')
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
	assertChannelId(channelId)
	const edge = await getJson<LndChannelEdge>(
		`${base(restBaseUrl)}/v1/graph/edge/${encodeURIComponent(channelId)}`,
		{
			origins: lightningLndOrigins,
			init: {
				headers: lndHeaders(requiredPublicEnvString(publicEnv, 'PUBLIC_LND_MACAROON_HEX')),
			},
		}
	)
	assertGraphEdge(edge, channelId)
	return edge
}

export const listChannels = (
	publicEnv: SourcePublicEnv
) => (
	getJson<LndListChannelsResponse>(
		`${base(restBaseUrl)}/v1/channels`,
		{
			origins: lightningLndOrigins,
			init: {
				headers: lndHeaders(requiredPublicEnvString(publicEnv, 'PUBLIC_LND_MACAROON_HEX')),
			},
		}
	)
)

export const listInvoices = ({
	publicEnv,
	numMaxInvoices,
}: {
	publicEnv: SourcePublicEnv
	numMaxInvoices?: number
}) => (
	getJson<LndListInvoicesResponse>(
		`${base(restBaseUrl)}/v1/invoices${numMaxInvoices == null ? '' : `?num_max_invoices=${numMaxInvoices}`}`,
		{
			origins: lightningLndOrigins,
			init: {
				headers: lndHeaders(requiredPublicEnvString(publicEnv, 'PUBLIC_LND_MACAROON_HEX')),
			},
		}
	)
)

export const listPayments = ({
	publicEnv,
	maxPayments,
}: {
	publicEnv: SourcePublicEnv
	maxPayments?: number
}) => (
	getJson<LndListPaymentsResponse>(
		`${base(restBaseUrl)}/v1/payments${maxPayments == null ? '' : `?max_payments=${maxPayments}`}`,
		{
			origins: lightningLndOrigins,
			init: {
				headers: lndHeaders(requiredPublicEnvString(publicEnv, 'PUBLIC_LND_MACAROON_HEX')),
			},
		}
	)
)

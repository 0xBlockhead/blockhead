import { getJson } from '$/lib/http.ts'
import type {
	MempoolSpaceLightningChannel,
	MempoolSpaceLightningChannelSummary,
	MempoolSpaceLightningNode,
	MempoolSpaceLightningRankedNode,
	MempoolSpaceLightningSearchResult,
	MempoolSpaceLightningStatisticsResponse,
} from '$/sources/LightningMempoolSpace/Rest/types.ts'

const lightningMempoolSpaceOrigins = [
	{
		origin: 'https://mempool.space',
		corsEnabled: true,
	},
] as const

const base = (restBaseUrl: string) => {
	const normalizedBaseUrl = restBaseUrl.replace(/\/$/, '')
	if (normalizedBaseUrl !== 'https://mempool.space/api/v1/lightning')
		throw new Error('LightningMempoolSpace_Rest: expected canonical Lightning API binding')
	return normalizedBaseUrl
}

const assertPublicKey = (publicKey: string) => {
	if (!/^(02|03)[0-9a-f]{64}$/.test(publicKey))
		throw new Error('LightningMempoolSpace_Rest: invalid compressed node public key')
}

const assertChannelId = (channelId: string) => {
	if (!/^(0|[1-9][0-9]*)$/.test(channelId))
		throw new Error('LightningMempoolSpace_Rest: invalid channel ID')
}

const assertSafeUnsigned = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`LightningMempoolSpace_Rest: invalid ${label}`)
}

const assertLosslessUnsigned = (
	value: number | string | null | undefined,
	label: string
) => {
	if (value == null)
		return
	if (
		typeof value === 'number' ?
			!Number.isSafeInteger(value) || value < 0
		:
			!/^(0|[1-9][0-9]*)$/.test(value)
	)
		throw new Error(`LightningMempoolSpace_Rest: invalid or lossy ${label}`)
}

const assertNode = (node: MempoolSpaceLightningNode) => {
	assertPublicKey(node.public_key)
	if (node.active_channel_count != null)
		assertSafeUnsigned(node.active_channel_count, 'active channel count')
	if (node.channels != null)
		assertSafeUnsigned(node.channels, 'channel count')
	assertLosslessUnsigned(node.capacity, 'node capacity')
}

const assertChannel = (
	channel: MempoolSpaceLightningChannel,
	expectedChannelId?: string
) => {
	assertChannelId(channel.id)
	if (expectedChannelId != null && channel.id !== expectedChannelId)
		throw new Error('LightningMempoolSpace_Rest: channel response has mismatched identity')
	assertLosslessUnsigned(channel.capacity, 'channel capacity')
	assertLosslessUnsigned(channel.closing_fee, 'channel closing fee')
	if (channel.transaction_vout != null)
		assertSafeUnsigned(channel.transaction_vout, 'funding output index')
	if (channel.node_left != null)
		assertPublicKey(channel.node_left.public_key)
	if (channel.node_right != null)
		assertPublicKey(channel.node_right.public_key)
	if (channel.node != null)
		assertPublicKey(channel.node.public_key)
}

export const getLightningStatistics = async ({
	restBaseUrl,
	interval = 'latest',
}: {
	restBaseUrl: string
	interval?: string
}) => {
	const response = await getJson<MempoolSpaceLightningStatisticsResponse>(
		`${base(restBaseUrl)}/statistics/${encodeURIComponent(interval)}`,
		{ origins: lightningMempoolSpaceOrigins }
	)
	if (!Number.isFinite(Date.parse(response.latest.added)))
		throw new Error('LightningMempoolSpace_Rest: invalid statistics timestamp')
	for (const [value, label] of [
		[response.latest.total_capacity, 'network capacity'],
		[response.latest.avg_capacity, 'average channel capacity'],
		[response.latest.med_capacity, 'median channel capacity'],
	] as const)
		assertLosslessUnsigned(value, label)
	for (const [value, label] of [
		[response.latest.channel_count, 'channel count'],
		[response.latest.node_count, 'node count'],
		[response.latest.tor_nodes, 'Tor node count'],
		[response.latest.clearnet_nodes, 'clearnet node count'],
		[response.latest.unannounced_nodes, 'unannounced node count'],
	] as const)
		if (value != null)
			assertSafeUnsigned(value, label)
	return response
}

export const getLightningNode = async ({
	restBaseUrl,
	publicKey,
}: {
	restBaseUrl: string
	publicKey: string
}) => {
	assertPublicKey(publicKey)
	const node = await getJson<MempoolSpaceLightningNode>(
		`${base(restBaseUrl)}/nodes/${encodeURIComponent(publicKey)}`,
		{ origins: lightningMempoolSpaceOrigins }
	)
	assertNode(node)
	if (node.public_key !== publicKey)
		throw new Error('LightningMempoolSpace_Rest: node response has mismatched identity')
	return node
}

export const getLightningNodeChannels = async ({
	restBaseUrl,
	publicKey,
	status = 'open',
	index = 0,
}: {
	restBaseUrl: string
	publicKey: string
	status?: 'open' | 'active' | 'closed'
	index?: number
}) => {
	assertPublicKey(publicKey)
	assertSafeUnsigned(index, 'channel page index')
	const channels = await getJson<MempoolSpaceLightningChannelSummary[]>(
		`${base(restBaseUrl)}/channels?public_key=${encodeURIComponent(publicKey)}&status=${status}&index=${index}`,
		{ origins: lightningMempoolSpaceOrigins }
	)
	if (channels.length > 10)
		throw new Error('LightningMempoolSpace_Rest: channel page exceeds provider page size')
	const channelIds = new Set<string>()
	for (const channel of channels) {
		assertChannel(channel)
		if (channel.node?.public_key === publicKey)
			throw new Error('LightningMempoolSpace_Rest: channel page returned the queried node as its peer')
		if (channelIds.has(channel.id))
			throw new Error('LightningMempoolSpace_Rest: channel page contains a duplicate channel')
		channelIds.add(channel.id)
	}
	return channels
}

export const getLightningChannel = async ({
	restBaseUrl,
	channelId,
}: {
	restBaseUrl: string
	channelId: string
}) => {
	assertChannelId(channelId)
	const channel = await getJson<MempoolSpaceLightningChannel>(
		`${base(restBaseUrl)}/channels/${encodeURIComponent(channelId)}`,
		{ origins: lightningMempoolSpaceOrigins }
	)
	assertChannel(channel, channelId)
	return channel
}

export const getTopLightningNodesByConnectivity = async ({
	restBaseUrl,
}: {
	restBaseUrl: string
}) => {
	const nodes = await getJson<MempoolSpaceLightningRankedNode[]>(
		`${base(restBaseUrl)}/nodes/rankings/connectivity`,
		{ origins: lightningMempoolSpaceOrigins }
	)
	if (nodes.length > 100)
		throw new Error('LightningMempoolSpace_Rest: connectivity ranking exceeds provider limit')
	const publicKeys = new Set<string>()
	for (const node of nodes) {
		assertPublicKey(node.publicKey)
		assertLosslessUnsigned(node.capacity, 'ranked node capacity')
		if (publicKeys.has(node.publicKey))
			throw new Error('LightningMempoolSpace_Rest: connectivity ranking contains a duplicate node')
		publicKeys.add(node.publicKey)
	}
	return nodes
}

export const searchLightning = ({
	restBaseUrl,
	searchText,
}: {
	restBaseUrl: string
	searchText: string
}) => (
	getJson<MempoolSpaceLightningSearchResult>(
		`${base(restBaseUrl)}/search?searchText=${encodeURIComponent(searchText)}`,
		{ origins: lightningMempoolSpaceOrigins }
	)
)

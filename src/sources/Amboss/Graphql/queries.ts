import { graphql, queryAmboss } from '$/sources/Amboss/Graphql/client.ts'
import bindings from '$/sources/Amboss/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	ambossGetEdgeDataWire,
	ambossGetNodeChannelsDataWire,
	ambossGetNodeDataWire,
	ambossGetPopularNodesDataWire,
	parseAmbossChannelFundingPoint,
} from '$/sources/Amboss/Graphql/types.ts'

const binding = bindings[Source.Amboss_Graphql][0]

const assertEnvelope = <_Value>(
	label: string,
	wire: {
		assert: (value: unknown) => _Value
	},
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`Amboss_Graphql: invalid ${label} response envelope`)
	}
}

const assertPublicKey = (publicKey: string) => {
	if (!/^(02|03)[0-9a-f]{64}$/.test(publicKey))
		throw new Error('Amboss_Graphql: invalid compressed node public key')
}

const assertChannelId = (channelId: string) => {
	if (!/^(0|[1-9][0-9]*)(x[0-9]+x[0-9]+)?$/.test(channelId))
		throw new Error('Amboss_Graphql: invalid channel ID')
}

const assertClosedEdgeSemantics = (
	closedInfo: {
		close_transaction_id?: string | null
		closed_date: string
		closed_height: number
		closure_type?: string | null
	} | null | undefined,
	isClosed: boolean
) => {
	if (!isClosed) {
		if (closedInfo != null)
			throw new Error('Amboss_Graphql: open channel must not include closed_info')
		return
	}
	if (closedInfo == null)
		throw new Error('Amboss_Graphql: closed channel is missing closed_info')
	if (!Number.isFinite(Date.parse(closedInfo.closed_date)))
		throw new Error('Amboss_Graphql: invalid channel closed_date')
}

export const getNode = async ({
	publicKey,
}: {
	publicKey: string
}) => {
	assertPublicKey(publicKey)
	const data = assertEnvelope(
		'node',
		ambossGetNodeDataWire,
		await queryAmboss(
			binding,
			graphql(`
				query GetAmbossNode($pubkey: String!) {
					getNode(pubkey: $pubkey) {
						graph_info {
							node {
								pub_key
								alias
								color
								last_update
								addresses {
									addr
									ip_info {
										city
										country_code
									}
								}
							}
							channels {
								num_channels
								total_capacity
							}
						}
					}
				}
			`),
			{ pubkey: publicKey }
		)
	)
	const node = data.getNode
	if (node == null)
		throw new Error('Amboss_Graphql: node response is missing')
	const graphNode = node.graph_info.node
	if (graphNode == null)
		throw new Error('Amboss_Graphql: node response is missing graph identity')
	if (graphNode.pub_key !== publicKey)
		throw new Error('Amboss_Graphql: node response has mismatched identity')
	return {
		graph_info: {
			node: graphNode,
			channels: node.graph_info.channels,
		},
	}
}

export const getEdge = async ({
	channelId,
}: {
	channelId: string
}) => {
	assertChannelId(channelId)
	const data = assertEnvelope(
		'channel',
		ambossGetEdgeDataWire,
		await queryAmboss(
			binding,
			graphql(`
				query GetAmbossEdge($id: String!) {
					getEdge(id: $id) {
						long_channel_id
						short_channel_id
						graph {
							info {
								capacity
								is_closed
								last_update
								chan_point
								node1_pub
								node2_pub
								node1_policy {
									fee_rate_milli_msat
									disabled
								}
								node2_policy {
									fee_rate_milli_msat
									disabled
								}
								closed_info {
									close_transaction_id
									closed_date
									closed_height
									closure_type
								}
								transactions {
									close_transaction {
										id
										fee
									}
								}
							}
						}
					}
				}
			`),
			{ id: channelId }
		)
	)
	const edge = data.getEdge
	if (edge == null)
		throw new Error('Amboss_Graphql: channel response is missing')
	if (edge.graph == null)
		throw new Error('Amboss_Graphql: channel response is missing graph identity')
	if (edge.long_channel_id !== channelId && edge.short_channel_id !== channelId)
		throw new Error('Amboss_Graphql: channel response has mismatched identity')
	const edgeInfo = edge.graph.info
	parseAmbossChannelFundingPoint(edgeInfo.chan_point)
	assertClosedEdgeSemantics(edgeInfo.closed_info, edgeInfo.is_closed)
	return {
		long_channel_id: edge.long_channel_id,
		short_channel_id: edge.short_channel_id,
		graph: {
			info: edgeInfo,
		},
	}
}

export const getNodeChannels = async ({
	publicKey,
	limit,
	offset = 0,
}: {
	publicKey: string
	limit: number
	offset?: number
}) => {
	assertPublicKey(publicKey)
	if (!Number.isSafeInteger(limit) || limit < 1)
		throw new Error('Amboss_Graphql: channel list limit must be a positive safe integer')
	if (!Number.isSafeInteger(offset) || offset < 0)
		throw new Error('Amboss_Graphql: channel list offset must be a nonnegative safe integer')

	const data = assertEnvelope(
		'node channels',
		ambossGetNodeChannelsDataWire,
		await queryAmboss(
			binding,
			graphql(`
				query GetAmbossNodeChannels($pubkey: String!, $limit: Float!, $offset: Float!) {
					getNode(pubkey: $pubkey) {
						graph_info {
							channels {
								num_channels
								channel_list(page: { limit: $limit, offset: $offset }) {
									list {
										long_channel_id
										short_channel_id
										chan_point
										capacity
										last_update
										node1_pub
										node2_pub
										node1_policy {
											fee_rate_milli_msat
											disabled
										}
										node2_policy {
											fee_rate_milli_msat
											disabled
										}
									}
									pagination {
										limit
										offset
									}
								}
							}
						}
					}
				}
			`),
			{
				pubkey: publicKey,
				limit,
				offset,
			}
		)
	)
	const node = data.getNode
	if (node == null)
		throw new Error('Amboss_Graphql: node channels response is missing')
	const channels = node.graph_info.channels
	if (channels == null)
		throw new Error('Amboss_Graphql: node channels response is missing channel catalog')
	if (channels.channel_list.pagination.offset !== offset)
		throw new Error('Amboss_Graphql: channel page offset does not match request')

	const channelIdentities = new Set<string>()
	for (const channel of channels.channel_list.list) {
		parseAmbossChannelFundingPoint(channel.chan_point)
		if (
			channel.node1_pub !== publicKey
			&& channel.node2_pub !== publicKey
		)
			throw new Error('Amboss_Graphql: channel list row is not owned by requested node')
		if (channelIdentities.has(channel.long_channel_id))
			throw new Error('Amboss_Graphql: duplicate channel identities')
		channelIdentities.add(channel.long_channel_id)
	}

	return {
		num_channels: channels.num_channels,
		channel_list: channels.channel_list,
	}
}

export const getPopularNodePubkeys = async () => {
	const data = assertEnvelope(
		'popular nodes',
		ambossGetPopularNodesDataWire,
		await queryAmboss(
			binding,
			graphql(`
				query GetAmbossPopularNodes {
					getPopularNodes
				}
			`)
		)
	)
	const publicKeys = data.getPopularNodes
	if (publicKeys == null)
		throw new Error('Amboss_Graphql: popular nodes response is missing')
	const uniquePublicKeys = new Set<string>()
	for (const publicKey of publicKeys) {
		if (uniquePublicKeys.has(publicKey))
			throw new Error('Amboss_Graphql: popular nodes contain a duplicate public key')
		uniquePublicKeys.add(publicKey)
	}
	return publicKeys
}

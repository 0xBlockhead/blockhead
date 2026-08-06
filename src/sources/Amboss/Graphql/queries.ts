import { graphql, queryAmboss } from '$/sources/Amboss/Graphql/client.ts'

const assertPublicKey = (publicKey: string) => {
	if (!/^(02|03)[0-9a-f]{64}$/.test(publicKey))
		throw new Error('Amboss_Graphql: invalid compressed node public key')
}

const assertChannelId = (channelId: string) => {
	if (!/^(0|[1-9][0-9]*)(x[0-9]+x[0-9]+)?$/.test(channelId))
		throw new Error('Amboss_Graphql: invalid channel ID')
}

const assertSafeUnsigned = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`Amboss_Graphql: invalid ${label}`)
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
		throw new Error(`Amboss_Graphql: invalid or lossy ${label}`)
}

export const getNode = async ({
	publicKey,
}: {
	publicKey: string
}) => {
	assertPublicKey(publicKey)
	const node = await queryAmboss(
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
	).then((data) => data.getNode)
	if (node == null)
		throw new Error('Amboss_Graphql: node response is missing')
	const graphNode = node.graph_info.node
	if (graphNode == null)
		throw new Error('Amboss_Graphql: node response is missing graph identity')
	assertPublicKey(graphNode.pub_key)
	if (graphNode.pub_key !== publicKey)
		throw new Error('Amboss_Graphql: node response has mismatched identity')
	if (!Number.isFinite(graphNode.last_update) || graphNode.last_update < 0)
		throw new Error('Amboss_Graphql: invalid node last_update')
	for (const address of graphNode.addresses) {
		if (address.addr === '')
			throw new Error('Amboss_Graphql: node address must not be empty')
	}
	const channels = node.graph_info.channels
	if (channels != null) {
		assertSafeUnsigned(channels.num_channels, 'channel count')
		assertLosslessUnsigned(channels.total_capacity, 'node capacity')
	}
	return {
		graph_info: {
			node: graphNode,
			channels,
		},
	}
}

const assertChannelPoint = (
	chanPoint: string
) => {
	const [fundingTransactionId, outputIndex] = chanPoint.split(':')
	if (
		fundingTransactionId == null
		|| fundingTransactionId === ''
		|| outputIndex == null
		|| !/^(0|[1-9][0-9]*)$/.test(outputIndex)
	)
		throw new Error('Amboss_Graphql: invalid channel funding point')

	return {
		fundingTransactionId,
		fundingOutputIndex: Number(outputIndex),
	}
}

const assertClosedEdge = (
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
	if (closedInfo.closed_date === '')
		throw new Error('Amboss_Graphql: invalid channel closed_date')
	if (!Number.isFinite(Date.parse(closedInfo.closed_date)))
		throw new Error('Amboss_Graphql: invalid channel closed_date')
	if (!Number.isSafeInteger(closedInfo.closed_height) || closedInfo.closed_height < 0)
		throw new Error('Amboss_Graphql: invalid channel closed_height')
	if (closedInfo.close_transaction_id != null && closedInfo.close_transaction_id === '')
		throw new Error('Amboss_Graphql: close transaction id must not be empty')
}

export const getEdge = async ({
	channelId,
}: {
	channelId: string
}) => {
	assertChannelId(channelId)
	const edge = await queryAmboss(
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
	).then((data) => data.getEdge)
	if (edge == null)
		throw new Error('Amboss_Graphql: channel response is missing')
	if (edge.graph == null)
		throw new Error('Amboss_Graphql: channel response is missing graph identity')
	assertChannelId(edge.long_channel_id)
	assertChannelId(edge.short_channel_id)
	if (edge.long_channel_id !== channelId && edge.short_channel_id !== channelId)
		throw new Error('Amboss_Graphql: channel response has mismatched identity')
	const edgeInfo = edge.graph.info
	assertPublicKey(edgeInfo.node1_pub)
	assertPublicKey(edgeInfo.node2_pub)
	assertLosslessUnsigned(edgeInfo.capacity, 'channel capacity')
	assertLosslessUnsigned(edgeInfo.node1_policy?.fee_rate_milli_msat, 'node1 fee rate')
	assertLosslessUnsigned(edgeInfo.node2_policy?.fee_rate_milli_msat, 'node2 fee rate')
	assertChannelPoint(edgeInfo.chan_point)
	assertClosedEdge(edgeInfo.closed_info, edgeInfo.is_closed)
	const closeTransaction = edgeInfo.transactions.close_transaction
	if (closeTransaction != null) {
		if (closeTransaction.id === '')
			throw new Error('Amboss_Graphql: close transaction id must not be empty')
		assertLosslessUnsigned(closeTransaction.fee, 'close transaction fee')
	}
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

	const node = await queryAmboss(
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
	).then((data) => data.getNode)
	if (node == null)
		throw new Error('Amboss_Graphql: node channels response is missing')
	const channels = node.graph_info.channels
	if (channels == null)
		throw new Error('Amboss_Graphql: node channels response is missing channel catalog')

	assertSafeUnsigned(channels.num_channels, 'channel count')
	assertSafeUnsigned(channels.channel_list.pagination.limit, 'channel page limit')
	assertSafeUnsigned(channels.channel_list.pagination.offset, 'channel page offset')
	if (channels.channel_list.pagination.offset !== offset)
		throw new Error('Amboss_Graphql: channel page offset does not match request')

	const channelIdentities = new Set<string>()
	for (const channel of channels.channel_list.list) {
		assertChannelId(channel.long_channel_id)
		assertChannelId(channel.short_channel_id)
		assertPublicKey(channel.node1_pub)
		assertPublicKey(channel.node2_pub)
		assertLosslessUnsigned(channel.capacity, 'channel capacity')
		assertChannelPoint(channel.chan_point)
		if (!Number.isFinite(channel.last_update) || channel.last_update < 0)
			throw new Error('Amboss_Graphql: invalid channel last_update')
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
	const publicKeys = await queryAmboss(
		graphql(`
			query GetAmbossPopularNodes {
				getPopularNodes
			}
		`)
	).then((data) => data.getPopularNodes)
	if (publicKeys == null)
		throw new Error('Amboss_Graphql: popular nodes response is missing')
	const uniquePublicKeys = new Set<string>()
	for (const publicKey of publicKeys) {
		assertPublicKey(publicKey)
		if (uniquePublicKeys.has(publicKey))
			throw new Error('Amboss_Graphql: popular nodes contain a duplicate public key')
		uniquePublicKeys.add(publicKey)
	}
	return publicKeys
}

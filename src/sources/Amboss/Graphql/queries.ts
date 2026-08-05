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
	return {
		long_channel_id: edge.long_channel_id,
		short_channel_id: edge.short_channel_id,
		graph: {
			info: edgeInfo,
		},
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

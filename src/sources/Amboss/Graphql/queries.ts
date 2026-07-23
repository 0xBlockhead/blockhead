import { graphql, queryAmboss } from '$/sources/Amboss/Graphql/client.ts'

const assertPublicKey = (publicKey: string) => {
	if (!/^(02|03)[0-9a-f]{64}$/.test(publicKey))
		throw new Error('Amboss_Graphql: invalid compressed node public key')
}

const assertChannelId = (channelId: string) => {
	if (!/^(0|[1-9][0-9]*)(x[0-9]+x[0-9]+)?$/.test(channelId))
		throw new Error('Amboss_Graphql: invalid channel ID')
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
	if (node.graph_info.node.pub_key !== publicKey)
		throw new Error('Amboss_Graphql: node response has mismatched identity')
	return node
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
	assertChannelId(edge.long_channel_id)
	assertChannelId(edge.short_channel_id)
	if (edge.long_channel_id !== channelId && edge.short_channel_id !== channelId)
		throw new Error('Amboss_Graphql: channel response has mismatched identity')
	assertPublicKey(edge.graph.info.node1_pub)
	assertPublicKey(edge.graph.info.node2_pub)
	return edge
}

export const getPopularNodePubkeys = async () => {
	const publicKeys = await queryAmboss(
		graphql(`
			query GetAmbossPopularNodes {
				getPopularNodes
			}
		`)
	).then((data) => data.getPopularNodes)
	const uniquePublicKeys = new Set<string>()
	for (const publicKey of publicKeys) {
		assertPublicKey(publicKey)
		if (uniquePublicKeys.has(publicKey))
			throw new Error('Amboss_Graphql: popular nodes contain a duplicate public key')
		uniquePublicKeys.add(publicKey)
	}
	return publicKeys
}

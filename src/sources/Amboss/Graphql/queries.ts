import { graphql, queryAmboss } from '$/sources/Amboss/Graphql/client.ts'

export const getAmbossNode = ({
	publicKey,
}: {
	publicKey: string
}) => (
	queryAmboss(
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
		{ pubkey: publicKey },
	).then((data) => data.getNode)
)

export const getAmbossEdge = ({
	channelId,
}: {
	channelId: string
}) => (
	queryAmboss(
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
		{ id: channelId },
	).then((data) => data.getEdge)
)

export const getAmbossPopularNodePubkeys = () => (
	queryAmboss(
		graphql(`
			query GetAmbossPopularNodes {
				getPopularNodes
			}
		`),
	).then((data) => data.getPopularNodes)
)

import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { defineObservationTimeWriter } from '$/resolvers/observationTimeWriter.ts'

const nodeStateObservation = defineObservationTimeWriter({
	entityType: EntityType.BlockheadRadicleNodeState_Timestamp,
	selectorName: 'NodeStateTimestampMsSource',
	source: Source.RadicleNode_Control,
	provenance: 'HttpResponse',
})

const connectionId = 'radicle-node'

const loadRadicleNodeQueries = async () => {
	const [queries, remote] = await Promise.all([
		import('$/sources/RadicleNode/Rest/queries.ts'),
		import('$/sources/RadicleNode/Rest/queries.remote.ts'),
	])
	return {
		getNode: remote.getNode,
		parseConnectPeer: queries.parseConnectPeer,
	}
}

const verifiedNode = async ({
	connectionId: requestedConnectionId,
	nodeId,
}: {
	connectionId: string
	nodeId: string
}) => {
	if (requestedConnectionId !== connectionId)
		throw new Error(`RadicleNode_Control: unsupported connection ${requestedConnectionId}`)

	const queries = await loadRadicleNodeQueries()
	const node = await queries.getNode()
	if (node.id !== nodeId)
		throw new Error(`RadicleNode_Control: local node ${node.id} does not match ${nodeId}`)

	const addressesByPeer = new Map<string, Set<string>>()
	for (const entry of node.config.connect ?? []) {
		const peer = queries.parseConnectPeer(entry)
		const addresses = addressesByPeer.get(peer.nodeId) ?? new Set<string>()
		addresses.add(peer.address)
		addressesByPeer.set(peer.nodeId, addresses)
	}

	return {
		node,
		peers: Array.from(addressesByPeer, ([nodeId, addresses]) => ({
			nodeId,
			addresses: [...addresses],
		})),
	}
}

const resolverModule = {
	source: Source.RadicleNode_Control,

	resolvers: [
		defineResolver({
			entityType: EntityType.BlockheadRadicleNodeState,
			resolve: {
				ConnectionIdNodeId: {
					resolve: verifiedNode,
				},
			},
		})({
			connectionId: () => connectionId,
			nodeId: ({ node }) => node.id,
			did: ({ node }) => `did:key:${node.id}`,
			publicKey: ({ node }) => node.id,
			$$peers: {
				select: ({ peers }, $node) => peers.map((peer) => ({
					[EntityMetaKey.Selector]: { $node, peerNodeId: peer.nodeId },
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.BlockheadRadiclePeer, [], 'addresses')]: peer.addresses,
					},
				})),
				resolveCount: ({ peers }) => peers.length,
			},
			$$timestamps: {
				select: ({ node }, $nodeState) => [nodeStateObservation.write({
					$nodeState, timestampMs: node.observedAtMs, source: Source.RadicleNode_Control,
				}, {
					[entityFieldAddressKey(EntityType.BlockheadRadicleNodeState_Timestamp, [], 'alias')]: node.config.alias,
					[entityFieldAddressKey(EntityType.BlockheadRadicleNodeState_Timestamp, [], 'nodeVersion')]: node.agent,
					[entityFieldAddressKey(EntityType.BlockheadRadicleNodeState_Timestamp, [], 'listenAddresses')]: node.config.listen ?? [],
					[entityFieldAddressKey(EntityType.BlockheadRadicleNodeState_Timestamp, [], 'externalAddresses')]: node.config.externalAddresses ?? [],
				})],
			},
		}),

		defineResolver({
			entityType: EntityType.BlockheadRadiclePeer,
			resolve: {
				NodePeerNodeId: {
					resolve: async ({ $node, peerNodeId }) => {
						const { peers } = await verifiedNode({
							...$node,
						})
						const peer = peers.find((candidate) => candidate.nodeId === peerNodeId)
						if (peer == null)
							throw new Error(`RadicleNode_Control: peer not found for ${peerNodeId}`)

						return {
							$node: {
								[EntityMetaKey.Selector]: $node,
							},
							peerNodeId,
							addresses: peer.addresses,
						}
					},
				},
			},
		})({
			$node: (peer) => peer.$node,
			peerNodeId: (peer) => peer.peerNodeId,
			addresses: (peer) => peer.addresses,
		}),
	] as const,
}

export default resolverModule satisfies RegisteredSourceResolverModule

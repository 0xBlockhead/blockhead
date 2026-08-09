import { networkBySlug } from '$/constants/Network.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertAvalanchePChain = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== networkBySlug['avalanche-p-chain'].slug)
		throw new Error('AvalancheInfo_JsonRpc: unsupported network')
}

const percentFromWire = (
	value: string,
	fieldName: string
) => {
	const percent = Number(value)
	if (!Number.isFinite(percent))
		throw new Error(`AvalancheInfo_JsonRpc: malformed ${fieldName}`)
	return percent
}

export default {
	source: Source.AvalancheInfo_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.BlockheadAvalancheNodeState,
			resolve: {
				NodeId: {
					resolve: async ({ nodeId }) => {
						const {
							getNetworkName,
							getNodeId,
							getNodeVersion,
						} = await import('$/sources/AvalancheInfo/JsonRpc/queries.ts')
						const node = await getNodeId()
						if (node.nodeID !== nodeId)
							throw new Error(`AvalancheInfo_JsonRpc: connected node ${node.nodeID} does not match ${nodeId}`)
						const [
							network,
							version,
						] = await Promise.all([
							getNetworkName(),
							getNodeVersion(),
						])
						if (network.networkName !== 'mainnet')
							throw new Error(`AvalancheInfo_JsonRpc: unexpected network ${network.networkName}`)
						return {
							nodeId: node.nodeID,
							$network: {
								[EntityMetaKey.Selector]: {
									slug: networkBySlug['avalanche-p-chain'].slug,
								},
							},
							...(node.nodePOP != null && {
								nodePopPublicKey: node.nodePOP.publicKey,
								nodePopProofOfPossession: node.nodePOP.proofOfPossession,
							}),
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$nodeState: {
										nodeId: node.nodeID,
									},
									timestampMs: Date.now(),
									source: Source.AvalancheInfo_JsonRpc,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.BlockheadAvalancheNodeState_Timestamp, [], 'networkName')]: network.networkName,
									[entityFieldAddressKey(EntityType.BlockheadAvalancheNodeState_Timestamp, [], 'nodeVersion')]: version.version,
									[entityFieldAddressKey(EntityType.BlockheadAvalancheNodeState_Timestamp, [], 'databaseVersion')]: version.databaseVersion,
									[entityFieldAddressKey(EntityType.BlockheadAvalancheNodeState_Timestamp, [], 'gitCommit')]: version.gitCommit,
									[entityFieldAddressKey(EntityType.BlockheadAvalancheNodeState_Timestamp, [], 'rpcProtocolVersion')]: version.rpcProtocolVersion,
									[entityFieldAddressKey(EntityType.BlockheadAvalancheNodeState_Timestamp, [], 'vmVersions')]: version.vmVersions,
								},
							}],
						}
					},
				},
			},
		})({
			$network: (nodeState) => nodeState.$network,
			nodeIp: () => undefined,
			nodePopPublicKey: (nodeState) => nodeState.nodePopPublicKey,
			nodePopProofOfPossession: (nodeState) => nodeState.nodePopProofOfPossession,
			$$timestamps: (nodeState) => nodeState.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.BlockheadAvalancheNodeState_Timestamp,
			resolve: {
				NodeStateTimestampMsSource: {
					resolve: async ({ $nodeState, source }) => {
						if (source !== Source.AvalancheInfo_JsonRpc)
							throw new Error('AvalancheInfo_JsonRpc: observation source mismatch')
						const {
							getNetworkName,
							getNodeId,
							getNodeVersion,
							getPeers,
							getUptime,
						} = await import('$/sources/AvalancheInfo/JsonRpc/queries.ts')
						const node = await getNodeId()
						if (node.nodeID !== $nodeState.nodeId)
							throw new Error(`AvalancheInfo_JsonRpc: connected node ${node.nodeID} does not match ${$nodeState.nodeId}`)
						const [
							network,
							version,
							peers,
						] = await Promise.all([
							getNetworkName(),
							getNodeVersion(),
							getPeers(),
						])
						assertAvalanchePChain({
							slug: networkBySlug['avalanche-p-chain'].slug,
						})
						let uptimePercent: number | undefined
						try {
							uptimePercent = percentFromWire(
								(await getUptime()).weightedAveragePercentage,
								'uptime'
							)
						} catch {
							uptimePercent = undefined
						}
						return {
							timestampMs: Date.now(),
							source: Source.AvalancheInfo_JsonRpc,
							networkName: network.networkName,
							nodeVersion: version.version,
							databaseVersion: version.databaseVersion,
							gitCommit: version.gitCommit,
							rpcProtocolVersion: version.rpcProtocolVersion,
							connectedPeerCount: Number(peers.numPeers),
							...(uptimePercent != null && { uptimePercent }),
							vmVersions: version.vmVersions,
						}
					},
				},
			},
		})({
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			networkName: (observation) => observation.networkName,
			nodeVersion: (observation) => observation.nodeVersion,
			databaseVersion: (observation) => observation.databaseVersion,
			gitCommit: (observation) => observation.gitCommit,
			rpcProtocolVersion: (observation) => observation.rpcProtocolVersion,
			connectedPeerCount: (observation) => observation.connectedPeerCount,
			uptimePercent: (observation) => observation.uptimePercent,
			vmVersions: (observation) => observation.vmVersions,
			lastSyncedAt: () => undefined,
		}),
	] as const,
} satisfies RegisteredSourceResolverModule

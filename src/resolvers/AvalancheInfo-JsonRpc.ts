import { networkBySlug } from '$/constants/Network.ts'
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
							getPeers,
							getUptime,
						} = await import('$/sources/AvalancheInfo/JsonRpc/queries.ts')
						const node = await getNodeId()
						if (node.nodeID !== nodeId)
							throw new Error(`AvalancheInfo_JsonRpc: connected node ${node.nodeID} does not match ${nodeId}`)
						const [
							network,
							version,
							peers,
						] = await Promise.all([
							getNetworkName(),
							getNodeVersion(),
							getPeers(),
						])
						if (network.networkName !== 'mainnet')
							throw new Error(`AvalancheInfo_JsonRpc: unexpected network ${network.networkName}`)
						let uptimePercent: number | undefined
						try {
							uptimePercent = percentFromWire(
								(await getUptime()).weightedAveragePercentage,
								'uptime'
							)
						} catch {
							uptimePercent = undefined
						}
						const timestampMs = Date.now()
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
									timestampMs,
									source: Source.AvalancheInfo_JsonRpc,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.BlockheadAvalancheNodeState_Timestamp, [], 'networkName')]: network.networkName,
									[entityFieldAddressKey(EntityType.BlockheadAvalancheNodeState_Timestamp, [], 'nodeVersion')]: version.version,
									[entityFieldAddressKey(EntityType.BlockheadAvalancheNodeState_Timestamp, [], 'databaseVersion')]: version.databaseVersion,
									[entityFieldAddressKey(EntityType.BlockheadAvalancheNodeState_Timestamp, [], 'gitCommit')]: version.gitCommit,
									[entityFieldAddressKey(EntityType.BlockheadAvalancheNodeState_Timestamp, [], 'rpcProtocolVersion')]: version.rpcProtocolVersion,
									[entityFieldAddressKey(EntityType.BlockheadAvalancheNodeState_Timestamp, [], 'connectedPeerCount')]: Number(peers.numPeers),
									...(uptimePercent != null && {
										[entityFieldAddressKey(EntityType.BlockheadAvalancheNodeState_Timestamp, [], 'uptimePercent')]: uptimePercent,
									}),
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
	] as const,
} satisfies RegisteredSourceResolverModule

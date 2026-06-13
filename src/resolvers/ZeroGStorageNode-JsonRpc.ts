import { networkBySlug } from '$/constants/Network.ts'
import { zeroGStorageNodeDefaultLocalRpcUrl } from '$/constants/ZeroGNetwork.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertZeroGMainnet = (network: NetworkId) => {
	if (!('networkSlug' in network) || network.networkSlug !== networkBySlug['0g'].slug) {
		throw new Error('ZeroGStorageNode_JsonRpc: unsupported network')
	}
}

const localStorageNodeId = async () => {
	const { getStatus } = await import('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts')
	return (await getStatus({ rpcUrl: zeroGStorageNodeDefaultLocalRpcUrl })).networkIdentity.flowAddress
}

const fileInfoForDataBlob = async (entityId: {
	$network: NetworkId
	dataRoot: string
}) => {
	assertZeroGMainnet(entityId.$network)
	const { getFileInfo } = await import('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts')
	const fileInfo = await getFileInfo({
		rpcUrl: zeroGStorageNodeDefaultLocalRpcUrl,
		root: entityId.dataRoot,
		needAvailable: true,
	})
	if (fileInfo == null) throw new Error(`ZeroGStorageNode_JsonRpc: data root not found ${entityId.dataRoot}`)
	return fileInfo
}

export default {
	source: Source.ZeroGStorageNode_JsonRpc,

	resolvers: [
		defineResolver(Source.ZeroGStorageNode_JsonRpc, {
			entityType: EntityType.ZeroGStorageNode,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				assertZeroGMainnet(entityId.$network)
				const { getStatus } = await import('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts')
				const status = await getStatus({ rpcUrl: zeroGStorageNodeDefaultLocalRpcUrl })
				if (status.networkIdentity.flowAddress !== entityId.nodeId) {
					throw new Error(`ZeroGStorageNode_JsonRpc: local node ${status.networkIdentity.flowAddress} does not match ${entityId.nodeId}`)
				}
				return {
					$operator: {
						[EntityMetaKey.Id]: {
							address: status.networkIdentity.flowAddress,
						},
					},
					endpoint: zeroGStorageNodeDefaultLocalRpcUrl,
				}
			}
			}
		})({
				fields: {
			$operator: (snapshot) => snapshot.$operator,
			endpoint: (snapshot) => snapshot.endpoint,
		},
			}),

		defineResolver(Source.ZeroGStorageNode_JsonRpc, {
			entityType: EntityType.ZeroGDataBlob,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const fileInfo = await fileInfoForDataBlob(entityId)
				return {
					sizeBytes: BigInt(fileInfo.tx.size),
					$$chunks: fileInfo.tx.streamIds.map((_chunkRoot, chunkIndex) => ({
						[EntityMetaKey.Id]: {
							$dataBlob: entityId,
							chunkIndex,
						},
					})),
				}
			}
			}
		})({
				fields: {
			sizeBytes: (snapshot) => snapshot.sizeBytes,
			$$chunks: (snapshot) => snapshot.$$chunks,
		},
			}),

		defineResolver(Source.ZeroGStorageNode_JsonRpc, {
			entityType: EntityType.ZeroGDataChunk,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId) => {
				const fileInfo = await fileInfoForDataBlob(entityId.$dataBlob)
				const chunkRoot = fileInfo.tx.streamIds.at(entityId.chunkIndex)
				if (chunkRoot == null) throw new Error(`ZeroGStorageNode_JsonRpc: chunk not found ${entityId.$dataBlob.dataRoot}:${String(entityId.chunkIndex)}`)
				return {
					$storageNode: {
						[EntityMetaKey.Id]: {
							$network: entityId.$dataBlob.$network,
							nodeId: await localStorageNodeId(),
						},
					},
					chunkRoot,
				}
			}
			}
		})({
				fields: {
			$storageNode: (snapshot) => snapshot.$storageNode,
			chunkRoot: (snapshot) => snapshot.chunkRoot,
		},
			}),
	],
}

import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const zeroGStorageNodeRpcUrl = 'http://127.0.0.1:5678'

const assertZeroGMainnet = (network: { namespace: string; reference: string }) => {
	if (network.namespace !== NetworkNamespace.ZeroG || network.reference !== 'mainnet') {
		throw new Error(`ZeroGStorageNode_JsonRpc: unsupported network ${network.namespace}:${network.reference}`)
	}
}

const localStorageNodeId = async () => {
	const { zgsGetStatus } = await import('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts')
	return (await zgsGetStatus({ rpcUrl: zeroGStorageNodeRpcUrl })).networkIdentity.flowAddress
}

const fileInfoForDataBlob = async (entityId: {
	$network: {
		namespace: string
		reference: string
	}
	dataRoot: string
}) => {
	assertZeroGMainnet(entityId.$network)
	const { zgsGetFileInfo } = await import('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts')
	const fileInfo = await zgsGetFileInfo({
		rpcUrl: zeroGStorageNodeRpcUrl,
		root: entityId.dataRoot,
		needAvailable: true,
	})
	if (fileInfo == null) throw new Error(`ZeroGStorageNode_JsonRpc: data root not found ${entityId.dataRoot}`)
	return fileInfo
}

export default {
	source: Source.ZeroGStorageNode_JsonRpc,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.ZeroGStorageNode,
			resolve: async (entityId) => {
				assertZeroGMainnet(entityId.$network)
				const { zgsGetStatus } = await import('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts')
				const status = await zgsGetStatus({ rpcUrl: zeroGStorageNodeRpcUrl })
				if (status.networkIdentity.flowAddress !== entityId.nodeId) {
					throw new Error(`ZeroGStorageNode_JsonRpc: local node ${status.networkIdentity.flowAddress} does not match ${entityId.nodeId}`)
				}
				return {
					operatorAddress: status.networkIdentity.flowAddress,
					endpoint: zeroGStorageNodeRpcUrl,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.ZeroGDataBlob,
			resolve: async (entityId) => ({
				sizeBytes: BigInt((await fileInfoForDataBlob(entityId)).tx.size),
			}),
		}),

		defineEntityResolver({
			entityType: EntityType.ZeroGDataChunk,
			resolve: async (entityId) => {
				const fileInfo = await fileInfoForDataBlob(entityId.$dataBlob)
				const chunkRoot = fileInfo.tx.streamIds[entityId.chunkIndex]
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
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.ZeroGDataBlob,
			fieldName: '$$chunks',
			resolve: async (entityId) => (
				(await fileInfoForDataBlob(entityId)).tx.streamIds.map((_chunkRoot, chunkIndex) => ({
					[EntityMetaKey.Id]: {
						$dataBlob: entityId,
						chunkIndex,
					},
				}))
			),
		}),
	],
}

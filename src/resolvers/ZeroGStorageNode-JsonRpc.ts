import { networkBySlug } from '$/constants/Network.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { ZeroGStorageNodeSelector } from '$/schema/ZeroGStorageNode.ts'
import { ZeroGDataBlobSelector } from '$/schema/ZeroGDataBlob.ts'
import { ZeroGDataChunkSelector } from '$/schema/ZeroGDataChunk.ts'

type NetworkId = { caip2: {
	namespace: string
	reference: string
} } | { slug: string }

const assertZeroGMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== networkBySlug['0g'].slug)
		throw new Error('ZeroGStorageNode_JsonRpc: unsupported network')
}

const zeroGStorageNodeRpcUrl = async () =>
	(await import('$/sources/ZeroG/StorageNode/JsonRpc/endpoints.ts')).zeroGStorageNodeRpcEndpoints[0].url

const localStorageNodeId = async () => {
	const { getStatus } = await import('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts')
	return (await getStatus({ rpcUrl: await zeroGStorageNodeRpcUrl() })).networkIdentity.flowAddress
}

const fileInfoForDataBlob = async ({ $network, dataRoot }: {
	$network: NetworkId
	dataRoot: string
}) => {
	assertZeroGMainnet($network)
	const { getFileInfo } = await import('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts')
	const fileInfo = await getFileInfo({
		rpcUrl: await zeroGStorageNodeRpcUrl(),
		root: dataRoot,
		needAvailable: true,
	})
	if (fileInfo == null) throw new Error(`ZeroGStorageNode_JsonRpc: data root not found ${dataRoot}`)
	return fileInfo
}

export default {
	source: Source.ZeroGStorageNode_JsonRpc,

	resolvers: [
		defineResolver(Source.ZeroGStorageNode_JsonRpc, {
			entityType: EntityType.ZeroGStorageNode,
			resolve: {
				[ZeroGStorageNodeSelector.NetworkNodeId]: async ({ $network, nodeId }) => {
					assertZeroGMainnet($network)
					const { getStatus } = await import('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts')
					const rpcUrl = await zeroGStorageNodeRpcUrl()
					const status = await getStatus({ rpcUrl })
					if (status.networkIdentity.flowAddress !== nodeId)
						throw new Error(`ZeroGStorageNode_JsonRpc: local node ${status.networkIdentity.flowAddress} does not match ${nodeId}`)
					return {
						$operator: {
							[EntityMetaKey.Selector]: {
								address: status.networkIdentity.flowAddress,
							},
						},
						endpoint: rpcUrl,
					}
				}
			},
		})({
				$operator: (snapshot) => snapshot.$operator,
				endpoint: (snapshot) => snapshot.endpoint,
			}),

		defineResolver(Source.ZeroGStorageNode_JsonRpc, {
			entityType: EntityType.ZeroGDataBlob,
			resolve: {
				[ZeroGDataBlobSelector.NetworkDataRoot]: async (entitySelector) => {
					const fileInfo = await fileInfoForDataBlob(entitySelector)
					return {
						sizeBytes: BigInt(fileInfo.tx.size),
					}
				}
			},
		})({
				sizeBytes: (snapshot) => snapshot.sizeBytes,
			}),

		defineResolver(Source.ZeroGStorageNode_JsonRpc, {
			entityType: EntityType.ZeroGDataChunk,
			resolve: {
				[ZeroGDataChunkSelector.ZeroGDataBlobChunkIndex]: async ({ $dataBlob, chunkIndex }) => {
					const fileInfo = await fileInfoForDataBlob($dataBlob)
					const chunkRoot = fileInfo.tx.streamIds.at(chunkIndex)
					if (chunkRoot == null) throw new Error(`ZeroGStorageNode_JsonRpc: chunk not found ${$dataBlob.dataRoot}:${String(chunkIndex)}`)
					return {
						chunkRoot,
					}
				}
			},
		})({
				chunkRoot: (snapshot) => snapshot.chunkRoot,
			}),
	],
}

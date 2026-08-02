import { networkBySlug } from '$/constants/Network.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertZeroGMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== networkBySlug['0g'].slug)
		throw new Error('ZeroGStorageNode_JsonRpc: unsupported network')
}

const localStorageNodeId = async () => {
	const { getStatus } = await import('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts')
	return (await getStatus()).networkIdentity.flowAddress
}

const fileInfoForDataBlob = async ({ $network, dataRoot }: {
	$network: NetworkId
	dataRoot: string
}) => {
	assertZeroGMainnet($network)
	const { getFileInfo } = await import('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts')
	const fileInfo = await getFileInfo({
		root: dataRoot,
		needAvailable: true,
	})
	if (fileInfo == null) throw new Error(`ZeroGStorageNode_JsonRpc: data root not found ${dataRoot}`)
	return fileInfo
}

export default {
	source: Source.ZeroGStorageNode_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.ZeroGStorageNode,
			resolve: {
				NetworkNodeId: {
					resolve: async ({ $network, nodeId }) => {
						assertZeroGMainnet($network)
						const { getStatus } = await import('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts')
						const status = await getStatus()
						if (status.networkIdentity.flowAddress !== nodeId)
							throw new Error(`ZeroGStorageNode_JsonRpc: local node ${status.networkIdentity.flowAddress} does not match ${nodeId}`)
						return {
							$operator: {
								[EntityMetaKey.Selector]: {
									address: status.networkIdentity.flowAddress,
								},
							},
							endpoint: (
								await import('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts')
							).endpoint,
						}
					},
				}
			},
		})({
				$operator: (snapshot) => snapshot.$operator,
				endpoint: (snapshot) => snapshot.endpoint,
			}),

		defineResolver({
			entityType: EntityType.ZeroGDataBlob,
			resolve: {
				NetworkDataRoot: {
					resolve: async (entitySelector) => {
						const fileInfo = await fileInfoForDataBlob(entitySelector)
						return {
							sizeBytes: BigInt(fileInfo.tx.size),
						}
					},
				}
			},
		})({
				sizeBytes: (snapshot) => snapshot.sizeBytes,
			}),

		defineResolver({
			entityType: EntityType.ZeroGDataChunk,
			resolve: {
				ZeroGDataBlobChunkIndex: {
					resolve: async ({ $dataBlob, chunkIndex }) => {
						const fileInfo = await fileInfoForDataBlob($dataBlob)
						const chunkRoot = fileInfo.tx.streamIds.at(chunkIndex)
						if (chunkRoot == null) throw new Error(`ZeroGStorageNode_JsonRpc: chunk not found ${$dataBlob.dataRoot}:${String(chunkIndex)}`)
						return {
							chunkRoot,
						}
					},
				}
			},
		})({
				chunkRoot: (snapshot) => snapshot.chunkRoot,
			}),
	],
} satisfies RegisteredSourceResolverModule

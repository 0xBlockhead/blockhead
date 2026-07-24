import { networkBySlug } from '$/constants/Network.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'
import { firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
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

const zeroGStorageNodeBindings = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.filter((binding) => (
		binding.source === Source.ZeroGStorageNode_JsonRpc
		&& binding.target.kind === SourceTargetKind.LocalDevice
		&& binding.target.key === 'local-0g-storage-node'
	))

if (zeroGStorageNodeBindings.length !== 1)
	throw new Error('ZeroGStorageNode_JsonRpc: canonical local storage-node binding is missing or ambiguous')

const zeroGStorageNodeBinding = zeroGStorageNodeBindings[0]

const localStorageNodeId = async () => {
	const { getStatus } = await import('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts')
	return (await getStatus(zeroGStorageNodeBinding)).networkIdentity.flowAddress
}

const fileInfoForDataBlob = async ({ $network, dataRoot }: {
	$network: NetworkId
	dataRoot: string
}) => {
	assertZeroGMainnet($network)
	const { getFileInfo } = await import('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts')
	const fileInfo = await getFileInfo({
		binding: zeroGStorageNodeBinding,
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
				[ZeroGStorageNodeSelector.NetworkNodeId]: {
					resolve: async ({ $network, nodeId }) => {
						assertZeroGMainnet($network)
						const { getStatus } = await import('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts')
						const status = await getStatus(zeroGStorageNodeBinding)
						if (status.networkIdentity.flowAddress !== nodeId)
							throw new Error(`ZeroGStorageNode_JsonRpc: local node ${status.networkIdentity.flowAddress} does not match ${nodeId}`)
						return {
							$operator: {
								[EntityMetaKey.Selector]: {
									address: status.networkIdentity.flowAddress,
								},
							},
							endpoint: firstHttpUrlForBinding(zeroGStorageNodeBinding),
						}
					},
				}
			},
		})({
				$operator: (snapshot) => snapshot.$operator,
				endpoint: (snapshot) => snapshot.endpoint,
			}),

		defineResolver(Source.ZeroGStorageNode_JsonRpc, {
			entityType: EntityType.ZeroGDataBlob,
			resolve: {
				[ZeroGDataBlobSelector.NetworkDataRoot]: {
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

		defineResolver(Source.ZeroGStorageNode_JsonRpc, {
			entityType: EntityType.ZeroGDataChunk,
			resolve: {
				[ZeroGDataChunkSelector.ZeroGDataBlobChunkIndex]: {
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
}

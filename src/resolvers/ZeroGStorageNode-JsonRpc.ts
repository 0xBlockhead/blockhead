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
							$$chunks: fileInfo.tx.streamIds.map((_chunkRoot, chunkIndex) => ({
								[EntityMetaKey.Selector]: {
									$dataBlob: entitySelector,
									chunkIndex,
								},
							})),
							$storageLogEntry: {
								[EntityMetaKey.Selector]: {
									$network: entitySelector.$network,
									logEntryId: String(fileInfo.tx.seq),
								},
							},
						}
					},
				}
			},
		})({
				sizeBytes: (snapshot) => snapshot.sizeBytes,
				$$chunks: (snapshot) => snapshot.$$chunks,
				$storageLogEntry: (snapshot) => snapshot.$storageLogEntry,
			}),

		defineResolver({
			entityType: EntityType.ZeroGStorageLogEntry,
			resolve: {
				NetworkLogEntryId: {
					resolve: async ({
						$network,
						logEntryId,
					}) => {
						assertZeroGMainnet($network)
						const { getFileInfoByTxSeq } = await import('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts')
						const sequenceNumber = BigInt(logEntryId)
						const fileInfo = await getFileInfoByTxSeq({
							txSeq: sequenceNumber,
						})
						if (fileInfo == null)
							throw new Error(`ZeroGStorageNode_JsonRpc: storage log entry not found ${logEntryId}`)
						if (BigInt(fileInfo.tx.seq) !== sequenceNumber)
							throw new Error(`ZeroGStorageNode_JsonRpc: storage log entry seq mismatch ${logEntryId}`)

						return {
							$dataBlob: {
								[EntityMetaKey.Selector]: {
									$network,
									dataRoot: fileInfo.tx.dataMerkleRoot,
								},
							},
							sequenceNumber,
							commitment: fileInfo.tx.dataMerkleRoot,
						}
					},
				},
			},
		})({
				$dataBlob: (snapshot) => snapshot.$dataBlob,
				sequenceNumber: (snapshot) => snapshot.sequenceNumber,
				commitment: (snapshot) => snapshot.commitment,
			}),

		defineResolver({
			entityType: EntityType.ZeroGStorageProof,
			resolve: {
				ZeroGStorageNodeProofId: {
					resolve: async ({
						$storageNode,
						proofId,
					}) => {
						assertZeroGMainnet($storageNode.$network)
						const sectorIndex = Number(proofId)
						if (!Number.isSafeInteger(sectorIndex) || sectorIndex < 0)
							throw new Error(`ZeroGStorageNode_JsonRpc: invalid sector proof id ${proofId}`)

						const { getSectorProof } = await import('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts')
						await getSectorProof({
							sectorIndex,
						})

						return {
							$storageNode: {
								[EntityMetaKey.Selector]: $storageNode,
							},
							proofKind: 'sector',
						}
					},
				},
			},
		})({
				$storageNode: (snapshot) => snapshot.$storageNode,
				proofKind: (snapshot) => snapshot.proofKind,
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

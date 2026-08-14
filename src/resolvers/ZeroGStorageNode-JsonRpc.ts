import { networkBySlug } from '$/constants/Network.ts'
import { zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
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

const zeroGChainId = 16661

const loadZeroGStorageNodeQueries = async () => {
	if (typeof window !== 'undefined')
		return import('$/sources/ZeroG/StorageNode/JsonRpc/queries.remote.ts')

	const queries = await import('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts')
	return {
		getEndpoint: async () => queries.endpoint,
		getFileInfo: (input: Parameters<typeof queries.getFileInfo>[0]) => queries.getFileInfo(input),
		getFileInfoByTxSeq: (input: Parameters<typeof queries.getFileInfoByTxSeq>[0]) => queries.getFileInfoByTxSeq(input),
		getSectorProof: (input: Parameters<typeof queries.getSectorProof>[0]) => queries.getSectorProof(input),
		getStatus: () => queries.getStatus(),
	}
}

const assertZeroGMainnet = (network: NetworkId) => {
	if (!('slug' in network) || network.slug !== networkBySlug['0g'].slug)
		throw new Error('ZeroGStorageNode_JsonRpc: unsupported network')
}

const localStorageNodeId = async () => {
	const { getStatus } = await loadZeroGStorageNodeQueries()
	const status = await getStatus()
	if (status.networkIdentity.chainId !== zeroGChainId)
		throw new Error('ZeroGStorageNode_JsonRpc: local node is connected to an unsupported chain')

	return zeroExLowerCase(status.networkIdentity.flowAddress)
}

const localConnectionId = 'local-0g-storage-node'

const fileInfoForDataBlob = async ({ $network, dataRoot }: {
	$network: NetworkId
	dataRoot: string
}) => {
	assertZeroGMainnet($network)
	const { getFileInfo } = await loadZeroGStorageNodeQueries()
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
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async () => [{
						[EntityMetaKey.Selector]: {
							connectionId: localConnectionId,
							$network: { slug: networkBySlug['0g'].slug },
							nodeId: await localStorageNodeId(),
						},
					}],
				},
			},
		})({
			$$blockheadZeroGStorageNodeStates: (nodeStates) => nodeStates,
		}),

		defineResolver({
			entityType: EntityType.ZeroGNetwork,
			resolve: {
				Slug: {
					resolve: async (network) => {
						assertZeroGMainnet(network)
						const timestampMs = Date.now()
						const nodeId = await localStorageNodeId()
						return {
							$$storageNodes: [{
								[EntityMetaKey.Selector]: {
									$network: network,
									nodeId,
								},
							}],
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$network: network,
									timestampMs,
									source: Source.ZeroGStorageNode_JsonRpc,
								},
							}],
						}
					},
				},
			},
		})({
			$$storageNodes: (snapshot) => snapshot.$$storageNodes,
			$$timestamps: (snapshot) => snapshot.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.ZeroGNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({ $network, timestampMs, source }) => {
						if (source !== Source.ZeroGStorageNode_JsonRpc)
							throw new Error('ZeroGStorageNode_JsonRpc: unsupported timestamp source')
						assertZeroGMainnet($network)
						const { getStatus } = await loadZeroGStorageNodeQueries()
						const status = await getStatus()
						if (status.networkIdentity.chainId !== zeroGChainId)
							throw new Error('ZeroGStorageNode_JsonRpc: local node is connected to an unsupported chain')

						return {
							$network: { [EntityMetaKey.Selector]: $network },
							timestampMs,
							source,
							storageLogSyncHeight: status.logSyncHeight,
						}
					},
				},
			},
		})({
			$network: (snapshot) => snapshot.$network,
			timestampMs: (snapshot) => snapshot.timestampMs,
			source: (snapshot) => snapshot.source,
			storageLogSyncHeight: (snapshot) => snapshot.storageLogSyncHeight,
		}),

		defineResolver({
			entityType: EntityType.BlockheadZeroGStorageNodeState,
			resolve: {
				ConnectionIdNetworkNodeId: {
					resolve: async ({ connectionId, $network, nodeId }) => {
						if (connectionId !== localConnectionId)
							throw new Error(`ZeroGStorageNode_JsonRpc: unsupported connection ${connectionId}`)
						assertZeroGMainnet($network)
						const resolvedNodeId = await localStorageNodeId()
						if (nodeId.toLowerCase() !== resolvedNodeId)
							throw new Error(`ZeroGStorageNode_JsonRpc: local node ${resolvedNodeId} does not match ${nodeId}`)
						const { getEndpoint } = await loadZeroGStorageNodeQueries()
						return {
							endpoint: await getEndpoint(),
						}
					},
				},
			},
		})({
			endpoint: (snapshot) => snapshot.endpoint,
		}),

		defineResolver({
			entityType: EntityType.BlockheadZeroGStoredChunk,
			resolve: {
				NodeStateDataRootChunkIndex: {
					resolve: async ({ $nodeState, dataRoot, chunkIndex }) => {
						if ($nodeState.connectionId !== localConnectionId)
							throw new Error(`ZeroGStorageNode_JsonRpc: unsupported connection ${$nodeState.connectionId}`)
						assertZeroGMainnet($nodeState.$network)
						if (await localStorageNodeId() !== zeroExLowerCase($nodeState.nodeId))
							throw new Error('ZeroGStorageNode_JsonRpc: stored chunk node identity mismatch')
						const { getFileInfo } = await loadZeroGStorageNodeQueries()
						const fileInfo = await getFileInfo({
							root: dataRoot,
							needAvailable: true,
						})
						const chunkRoot = fileInfo?.tx.streamIds.at(chunkIndex)
						const checkedAt = Date.now()

						return {
							$dataBlob: {
								[EntityMetaKey.Selector]: {
									$network: $nodeState.$network,
									dataRoot,
								},
							},
							...(chunkRoot != null && {
								$publicChunk: {
									[EntityMetaKey.Selector]: {
										$dataBlob: {
											$network: $nodeState.$network,
											dataRoot,
										},
										chunkIndex,
									},
								},
								chunkRoot,
							}),
							present: chunkRoot != null,
							lastCheckedAt: checkedAt,
						}
					},
				},
			},
		})({
			$dataBlob: (snapshot) => snapshot.$dataBlob,
			$publicChunk: (snapshot) => snapshot.$publicChunk,
			chunkRoot: (snapshot) => snapshot.chunkRoot,
			present: (snapshot) => snapshot.present,
			lastCheckedAt: (snapshot) => snapshot.lastCheckedAt,
		}),

		defineResolver({
			entityType: EntityType.ZeroGStorageNode,
			resolve: {
				NetworkNodeId: {
					resolve: async ({ $network, nodeId }) => {
						assertZeroGMainnet($network)
						const { getEndpoint, getStatus } = await loadZeroGStorageNodeQueries()
						const status = await getStatus()
						if (status.networkIdentity.flowAddress !== nodeId)
							throw new Error(`ZeroGStorageNode_JsonRpc: local node ${status.networkIdentity.flowAddress} does not match ${nodeId}`)
						return {
							$operator: {
								[EntityMetaKey.Selector]: {
									address: status.networkIdentity.flowAddress,
								},
							},
							endpoint: await getEndpoint(),
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
						const { getFileInfoByTxSeq } = await loadZeroGStorageNodeQueries()
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

						const { getSectorProof } = await loadZeroGStorageNodeQueries()
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

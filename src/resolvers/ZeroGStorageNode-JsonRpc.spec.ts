import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const queries = vi.hoisted(() => ({
	getStatus: vi.fn(),
	getFileInfo: vi.fn(),
	getFileInfoByTxSeq: vi.fn(),
	getSectorProof: vi.fn(),
	endpoint: 'http://127.0.0.1:5678',
}))

vi.mock('$/sources/ZeroG/StorageNode/JsonRpc/queries.ts', () => queries)

const { default: zeroGStorageNode } = await import('$/resolvers/ZeroGStorageNode-JsonRpc.ts')

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const network = {
	slug: '0g',
} as const

const dataBlob = {
	$network: network,
	dataRoot: '0xbbb',
} as const

const resolverFor = (
	entityType: EntityType,
	projection: string
) => {
	const resolver = zeroGStorageNode.resolvers.find((candidate) => (
		candidate.entityType === entityType
		&& projection in candidate.projections
	))
	if (resolver == null)
		throw new Error(`ZeroGStorageNode_JsonRpc spec missing ${entityType}.${projection}`)
	return resolver
}

describe('ZeroGStorageNode_JsonRpc resolver leftovers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		queries.getStatus.mockResolvedValue({
			connectedPeers: 1,
			logSyncHeight: 10,
			logSyncBlock: '0xabc',
			nextTxSeq: 2,
			networkIdentity: {
				chainId: 16661,
				flowAddress: '0x4d19f72978eaf45f6b0dc4db43f15b4a39d65bfd',
				p2pProtocolVersion: {
					major: 1,
					minor: 0,
					build: 0,
				},
			},
		})
		queries.getFileInfo.mockResolvedValue({
			tx: {
				streamIds: ['0xchunk0', '0xchunk1'],
				data: '0x',
				dataMerkleRoot: '0xbbb',
				startEntryIndex: 0,
				size: 12,
				seq: 7,
			},
			finalized: true,
			isCached: false,
			uploadedSegNum: 2,
			pruned: false,
		})
		queries.getFileInfoByTxSeq.mockResolvedValue({
			tx: {
				streamIds: ['0xchunk0'],
				data: '0x',
				dataMerkleRoot: '0xbbb',
				startEntryIndex: 0,
				size: 12,
				seq: 7,
			},
			finalized: true,
			isCached: false,
			uploadedSegNum: 1,
			pruned: false,
		})
		queries.getSectorProof.mockResolvedValue({
			lemma: ['0x1'],
			path: [true],
		})
	})

	it('projects DataBlob $$chunks + storage log leftover and StorageLogEntry by tx seq', async () => {
		const dataBlobResolver = resolverFor(EntityType.ZeroGDataBlob, '$$chunks')
		await expect(dataBlobResolver.resolve.NetworkDataRoot.resolve(dataBlob, context)).resolves.toMatchObject({
			sizeBytes: 12n,
			$$chunks: [
				{
					[EntityMetaKey.Selector]: {
						$dataBlob: dataBlob,
						chunkIndex: 0,
					},
				},
				{
					[EntityMetaKey.Selector]: {
						$dataBlob: dataBlob,
						chunkIndex: 1,
					},
				},
			],
			$storageLogEntry: {
				[EntityMetaKey.Selector]: {
					$network: network,
					logEntryId: '7',
				},
			},
		})

		const logEntryResolver = resolverFor(EntityType.ZeroGStorageLogEntry, 'commitment')
		await expect(logEntryResolver.resolve.NetworkLogEntryId.resolve({
			$network: network,
			logEntryId: '7',
		}, context)).resolves.toMatchObject({
			sequenceNumber: 7n,
			commitment: '0xbbb',
			$dataBlob: {
				[EntityMetaKey.Selector]: {
					$network: network,
					dataRoot: '0xbbb',
				},
			},
		})
	})

	it('materializes the local node in global and 0G network hierarchy with source-owned sync history', async () => {
		const globalResolver = resolverFor(EntityType._Global, '$$blockheadZeroGStorageNodeStates')
		await expect(globalResolver.resolve.Scope.resolve({ scope: 'global' }, context)).resolves.toEqual([{
			[EntityMetaKey.Selector]: {
				connectionId: 'local-0g-storage-node',
				$network: { slug: '0g' },
				nodeId: '0x4d19f72978eaf45f6b0dc4db43f15b4a39d65bfd',
			},
		}])

		const networkResolver = resolverFor(EntityType.ZeroGNetwork, '$$storageNodes')
		const networkSnapshot = await networkResolver.resolve.Slug.resolve(network, context)
		expect(networkSnapshot.$$storageNodes).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				nodeId: '0x4d19f72978eaf45f6b0dc4db43f15b4a39d65bfd',
			},
		}])
		expect(networkSnapshot.$$timestamps).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				timestampMs: expect.any(Number),
				source: Source.ZeroGStorageNode_JsonRpc,
			},
		}])

		const timestampResolver = resolverFor(EntityType.ZeroGNetwork_Timestamp, 'storageLogSyncHeight')
		await expect(timestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: network,
			timestampMs: 123,
			source: Source.ZeroGStorageNode_JsonRpc,
		}, context)).resolves.toMatchObject({
			timestampMs: 123,
			source: Source.ZeroGStorageNode_JsonRpc,
			storageLogSyncHeight: 10,
		})
	})

	it('resolves the canonical local storage-node state without inventing unsupported local metrics', async () => {
		const nodeState = {
			connectionId: 'local-0g-storage-node',
			$network: network,
			nodeId: '0x4d19f72978eaf45f6b0dc4db43f15b4a39d65bfd' as const,
		}
		const nodeStateResolver = resolverFor(EntityType.BlockheadZeroGStorageNodeState, 'endpoint')
		const snapshot = await nodeStateResolver.resolve.ConnectionIdNetworkNodeId.resolve(nodeState, context)
		expect(snapshot).toEqual({
			endpoint: 'http://127.0.0.1:5678',
		})
	})

	it('maps local chunk presence to the public blob/chunk hierarchy without inventing size or verification', async () => {
		const nodeState = {
			connectionId: 'local-0g-storage-node',
			$network: network,
			nodeId: '0x4d19f72978eaf45f6b0dc4db43f15b4a39d65bfd' as const,
		}
		const storedChunkResolver = resolverFor(EntityType.BlockheadZeroGStoredChunk, 'present')
		await expect(storedChunkResolver.resolve.NodeStateDataRootChunkIndex.resolve({
			$nodeState: nodeState,
			dataRoot: '0xbbb',
			chunkIndex: 1,
		}, context)).resolves.toMatchObject({
			$dataBlob: {
				[EntityMetaKey.Selector]: {
					$network: network,
					dataRoot: '0xbbb',
				},
			},
			$publicChunk: {
				[EntityMetaKey.Selector]: {
					$dataBlob: {
						$network: network,
						dataRoot: '0xbbb',
					},
					chunkIndex: 1,
				},
			},
			chunkRoot: '0xchunk1',
			present: true,
			lastCheckedAt: expect.any(Number),
		})

		await expect(storedChunkResolver.resolve.NodeStateDataRootChunkIndex.resolve({
			$nodeState: nodeState,
			dataRoot: '0xbbb',
			chunkIndex: 9,
		}, context)).resolves.toEqual({
			$dataBlob: {
				[EntityMetaKey.Selector]: {
					$network: network,
					dataRoot: '0xbbb',
				},
			},
			present: false,
			lastCheckedAt: expect.any(Number),
		})
	})

	it('projects sector proofKind for enrolled ZeroGStorageProof', async () => {
		const proofResolver = resolverFor(EntityType.ZeroGStorageProof, 'proofKind')
		await expect(proofResolver.resolve.ZeroGStorageNodeProofId.resolve({
			$storageNode: {
				$network: network,
				nodeId: '0x4d19f72978eaf45f6b0dc4db43f15b4a39d65bfd',
			},
			proofId: '0',
		}, context)).resolves.toMatchObject({
			proofKind: 'sector',
		})
		expect(queries.getSectorProof).toHaveBeenCalledWith({
			sectorIndex: 0,
		})
	})
})

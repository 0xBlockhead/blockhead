import { createResolverContext } from '../../tests/resolverContext.ts'
import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const queries = vi.hoisted(() => ({
	getStorageSummary: vi.fn(),
	listStorageMiners: vi.fn(),
	listStorageTransactions: vi.fn(),
	getStorageMiner: vi.fn(),
	getStorageTransaction: vi.fn(),
	listStorageRewards: vi.fn(),
}))

vi.mock('$/sources/ZeroG/StorageScan/Rest/queries.ts', () => queries)

const { default: zeroGStorageScan } = await import('$/resolvers/ZeroGStorageScan-Rest.ts')

const context = createResolverContext()

const network = {
	slug: '0g',
} as const

const resolverFor = (
	entityType: EntityType,
	projection: string
) => {
	const resolver = zeroGStorageScan.resolvers.find((candidate) => (
		candidate.entityType === entityType
		&& (
			projection in candidate.projections
			|| (
				'ZeroG' in candidate.projections
				&& projection in (candidate.projections.ZeroG as object)
			)
		)
	))
	if (resolver == null)
		throw new Error(`ZeroGStorageScan_Rest spec missing ${entityType}.${projection}`)
	return resolver
}

describe('ZeroGStorageScan_Rest resolver leftovers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		queries.getStorageSummary.mockResolvedValue({
			storageFee: {
				chargeToken: {
					address: '',
					name: '',
					symbol: 'OG',
					decimals: 18,
					native: true,
				},
				storageFeeTotal: '1',
			},
			logSync: {
				'layer1-logSyncHeight': 10,
				logSyncHeight: 9,
			},
			storageFile: {
				totalExpiredFiles: 0,
				totalPrunedFiles: 1,
			},
			minerReward: {
				avgReward24Hours: '1',
				totalReward: '2',
				totalWinCount: 3,
			},
		})
		queries.listStorageMiners.mockResolvedValue({
			total: 149,
			list: [{
				miner: '0x4D19F72978eaF45F6B0dC4db43f15B4a39D65bfD',
				totalReward: '1',
				winCount: 2,
				miningAttempts: 3,
				timestamp: 1,
			}],
		})
		queries.listStorageTransactions.mockResolvedValue({
			total: 185009,
			list: [{
				txSeq: 12,
				from: '0x2a07aDDB53d94308FaFbD27AB0509081f4F55B18',
				method: 'submit',
				rootHash: '0xe544394edc2172a48434739594fd295221bcc36339777ab39e2375baf393721e',
				dataSize: 3170,
				storageFee: '1',
				status: 2,
				blockNumber: 1,
				txHash: '0xc0096b77649851f5b2dcb484175fbcf727e71ce56ac7d692092dd5e4775187b8',
				timestamp: 1,
				segments: 1,
				uploadedSegments: 1,
			}],
		})
	})

	it('projects Network.ZeroG tip lists with authoritative resolveCount and blob/log leftovers', async () => {
		const storageNodesResolver = resolverFor(EntityType.Network, '$$storageNodes')
		const storageNodesSnapshot = await storageNodesResolver.resolve.Slug.resolve(network, {
			...context,
			providerContinuationToken: '10',
		})
		expect(storageNodesResolver.projections.ZeroG.$$storageNodes.resolveCount?.(storageNodesSnapshot)).toBe(149)
		expect(queries.listStorageMiners).toHaveBeenCalledWith({
			limit: 64,
			skip: 10,
		})
		expect(storageNodesResolver.projections.ZeroG.$$storageNodes.continuation?.(storageNodesSnapshot)).toEqual({
			operation: 'storage-miners',
			terminal: false,
			token: '11',
		})
		expect(storageNodesResolver.projections.ZeroG.$$storageNodes.select(storageNodesSnapshot)[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$network: network,
				nodeId: '0x4D19F72978eaF45F6B0dC4db43f15B4a39D65bfD',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.ZeroGStorageNode, [], '$$timestamps')]: [
					{
						[EntityMetaKey.Selector]: {
							source: Source.ZeroGStorageScan_Rest,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], 'totalReward')]: '1',
							[entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], 'winCount')]: 2,
							[entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], 'miningAttempts')]: 3,
						},
					},
				],
			},
		})

		const blobsResolver = resolverFor(EntityType.Network, '$$dataBlobs')
		const blobsSnapshot = await blobsResolver.resolve.Slug.resolve(network, {
			...context,
			pagination: {
				offset: 20,
			},
		})
		expect(blobsResolver.projections.ZeroG.$$dataBlobs.resolveCount?.(blobsSnapshot)).toBe(185009)
		expect(queries.listStorageTransactions).toHaveBeenCalledWith({
			limit: 64,
			skip: 20,
		})
		expect(blobsResolver.projections.ZeroG.$$dataBlobs.continuation?.(blobsSnapshot)).toEqual({
			operation: 'storage-transactions',
			terminal: false,
			token: '21',
		})
		expect(blobsResolver.projections.ZeroG.$$storageLogEntries.resolveCount?.(blobsSnapshot)).toBe(185009)
		expect(blobsResolver.projections.ZeroG.$$dataBlobs.select(blobsSnapshot)[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				dataRoot: '0xe544394edc2172a48434739594fd295221bcc36339777ab39e2375baf393721e',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.ZeroGDataBlob, [], 'sizeBytes')]: 3170n,
				[entityFieldAddressKey(EntityType.ZeroGDataBlob, [], '$storageLogEntry')]: {
					[EntityMetaKey.Selector]: {
						logEntryId: '12',
					},
				},
				[entityFieldAddressKey(EntityType.ZeroGDataBlob, [], '$consensusNetwork')]: {
					[EntityMetaKey.Selector]: {
						consensusNetworkId: '0g',
					},
				},
			},
		})
	})

	it('stamps storage-node list observations after StorageScan miner reads settle', async () => {
		let minersRead = false
		vi.spyOn(Date, 'now').mockImplementation(() => {
			if (!minersRead)
				throw new Error('ZeroGStorageScan observation clock sampled before miner list read')

			return 1_700_000_000_000
		})
		queries.listStorageMiners.mockImplementation(async () => {
			await Promise.resolve()
			minersRead = true
			return {
				total: 149,
				list: [{
					miner: '0x4D19F72978eaF45F6B0dC4db43f15B4a39D65bfD',
					totalReward: '1',
					winCount: 2,
					miningAttempts: 3,
					timestamp: 1,
				}],
			}
		})

		const storageNodesResolver = resolverFor(EntityType.Network, '$$storageNodes')
		const storageNodesSnapshot = await storageNodesResolver.resolve.Slug.resolve(network, context)
		expect(storageNodesResolver.projections.ZeroG.$$storageNodes.select(storageNodesSnapshot)[0]).toMatchObject({
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.ZeroGStorageNode, [], '$$timestamps')]: [
					{
						[EntityMetaKey.Selector]: {
							timestampMs: 1_700_000_000_000,
						},
					},
				],
			},
		})
	})

	it('projects ZeroGNetwork storage nodes with the same StorageScan list leftovers as Network.ZeroG', async () => {
		const zeroGNetworkStorageNodesResolver = resolverFor(EntityType.ZeroGNetwork, '$$storageNodes')
		const zeroGNetworkStorageNodesSnapshot = await zeroGNetworkStorageNodesResolver.resolve.Slug.resolve(network, context)
		expect(zeroGNetworkStorageNodesResolver.projections.$$storageNodes.select(zeroGNetworkStorageNodesSnapshot)[0]).toMatchObject({
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.ZeroGStorageNode, [], '$operator')]: {
					[EntityMetaKey.Selector]: {
						address: '0x4D19F72978eaF45F6B0dC4db43f15B4a39D65bfD',
					},
				},
				[entityFieldAddressKey(EntityType.ZeroGStorageNode, [], '$$timestamps')]: [
					{
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.ZeroGStorageNode_Timestamp, [], 'winCount')]: 2,
						},
					},
				],
			},
		})
	})

	it('projects ZeroGDataBlob consensus + storage log refs from StorageScan tx', async () => {
		const dataBlobResolver = resolverFor(EntityType.ZeroGDataBlob, 'sizeBytes')
		await expect(dataBlobResolver.resolve.NetworkDataRoot.resolve({
			$network: network,
			dataRoot: '0xe544394edc2172a48434739594fd295221bcc36339777ab39e2375baf393721e',
		}, context)).resolves.toMatchObject({
			sizeBytes: 3170n,
			$consensusNetwork: {
				[EntityMetaKey.Selector]: {
					$network: network,
					consensusNetworkId: '0g',
				},
			},
			$storageLogEntry: {
				[EntityMetaKey.Selector]: {
					$network: network,
					logEntryId: '12',
				},
			},
		})
	})

	it('does not register a direct ZeroGNetwork_Timestamp resolver', () => {
		expect(zeroGStorageScan.resolvers.some((resolver) => (
			resolver.entityType === EntityType.ZeroGNetwork_Timestamp
		))).toBe(false)
	})

	it('embeds current storage summary fields on Network.ZeroG and ZeroGNetwork timestamp refs', async () => {
		const networkTimestampsResolver = resolverFor(EntityType.Network, '$$timestamps')
		const networkTimestamps = await networkTimestampsResolver.resolve.Slug.resolve(network, context)
		expect(networkTimestampsResolver.projections.ZeroG.$$timestamps(networkTimestamps)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				timestampMs: expect.any(Number),
				source: Source.ZeroGStorageScan_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.ZeroGNetwork_Timestamp, [], 'storageLogSyncHeight')]: 9,
				[entityFieldAddressKey(EntityType.ZeroGNetwork_Timestamp, [], 'storageLayer1LogSyncHeight')]: 10,
				[entityFieldAddressKey(EntityType.ZeroGNetwork_Timestamp, [], 'storageTransactionCount')]: 185009,
				[entityFieldAddressKey(EntityType.ZeroGNetwork_Timestamp, [], 'latestDataRoot')]: '0xe544394edc2172a48434739594fd295221bcc36339777ab39e2375baf393721e',
				[entityFieldAddressKey(EntityType.ZeroGNetwork_Timestamp, [], 'latestDataSizeBytes')]: 3170n,
				[entityFieldAddressKey(EntityType.ZeroGNetwork_Timestamp, [], 'latestStorageTxHash')]: '0xc0096b77649851f5b2dcb484175fbcf727e71ce56ac7d692092dd5e4775187b8',
				[entityFieldAddressKey(EntityType.ZeroGNetwork_Timestamp, [], 'storageMinerCount')]: 149,
				[entityFieldAddressKey(EntityType.ZeroGNetwork_Timestamp, [], 'latestStorageMiner')]: '0x4D19F72978eaF45F6B0dC4db43f15B4a39D65bfD',
				[entityFieldAddressKey(EntityType.ZeroGNetwork_Timestamp, [], 'storageFeeTotal')]: '1',
				[entityFieldAddressKey(EntityType.ZeroGNetwork_Timestamp, [], 'storageRewardTotal')]: '2',
				[entityFieldAddressKey(EntityType.ZeroGNetwork_Timestamp, [], 'storageTotalWinCount')]: 3,
				[entityFieldAddressKey(EntityType.ZeroGNetwork_Timestamp, [], 'expiredFileCount')]: 0,
				[entityFieldAddressKey(EntityType.ZeroGNetwork_Timestamp, [], 'prunedFileCount')]: 1,
			},
		}])
		expect(queries.getStorageSummary).toHaveBeenCalledTimes(1)
		expect(queries.listStorageMiners).toHaveBeenCalledWith({
			limit: 1,
		})
		expect(queries.listStorageTransactions).toHaveBeenCalledWith({
			limit: 1,
		})

		const zeroGNetworkTimestampsResolver = resolverFor(EntityType.ZeroGNetwork, '$$timestamps')
		const zeroGNetworkTimestamps = await zeroGNetworkTimestampsResolver.resolve.Slug.resolve(network, context)
		expect(
			zeroGNetworkTimestampsResolver.projections.$$timestamps(zeroGNetworkTimestamps)[0][EntityMetaKey.Fields]
		).toEqual(
			networkTimestampsResolver.projections.ZeroG.$$timestamps(networkTimestamps)[0][EntityMetaKey.Fields]
		)
	})

	it('does not expose an arbitrary current-state ZeroGStorageNode_Timestamp facet', () => {
		expect(zeroGStorageScan.resolvers.some((resolver) => (
			resolver.entityType === EntityType.ZeroGStorageNode_Timestamp
		))).toBe(false)
	})
})

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
		const storageNodesSnapshot = await storageNodesResolver.resolve.Slug.resolve(network, context)
		expect(storageNodesResolver.projections.ZeroG.$$storageNodes.resolveCount?.(storageNodesSnapshot)).toBe(149)
		expect(storageNodesResolver.projections.ZeroG.$$storageNodes.select(storageNodesSnapshot)[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$network: network,
				nodeId: '0x4D19F72978eaF45F6B0dC4db43f15B4a39D65bfD',
			},
		})

		const blobsResolver = resolverFor(EntityType.Network, '$$dataBlobs')
		const blobsSnapshot = await blobsResolver.resolve.Slug.resolve(network, context)
		expect(blobsResolver.projections.ZeroG.$$dataBlobs.resolveCount?.(blobsSnapshot)).toBe(185009)
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

	it('projects ZeroGNetwork_Timestamp tip storage fields', async () => {
		const timestampResolver = resolverFor(EntityType.ZeroGNetwork_Timestamp, 'storageLogSyncHeight')
		await expect(timestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: network,
			timestampMs: 1,
			source: Source.ZeroGStorageScan_Rest,
		}, context)).resolves.toMatchObject({
			storageLogSyncHeight: 9,
			storageTransactionCount: 185009,
			storageMinerCount: 149,
			latestDataRoot: '0xe544394edc2172a48434739594fd295221bcc36339777ab39e2375baf393721e',
			prunedFileCount: 1,
		})
	})
})

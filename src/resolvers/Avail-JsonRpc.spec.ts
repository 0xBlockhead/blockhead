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

const getBlock = vi.hoisted(() => vi.fn())
const getBlockHash = vi.hoisted(() => vi.fn())
const getBlockTimestamp = vi.hoisted(() => vi.fn())
const getDataProof = vi.hoisted(() => vi.fn())
const getFinalizedHead = vi.hoisted(() => vi.fn())
const getHeader = vi.hoisted(() => vi.fn())
const getHeaderByBlockNumber = vi.hoisted(() => vi.fn())
const getNetworkIdentity = vi.hoisted(() => vi.fn())
const getSystemHealth = vi.hoisted(() => vi.fn())
const getSystemSyncState = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Avail/JsonRpc/queries.ts', () => ({
	getBlock,
	getBlockHash,
	getBlockTimestamp,
	getDataProof,
	getFinalizedHead,
	getHeader,
	getHeaderByBlockNumber,
	getNetworkIdentity,
	getSystemHealth,
	getSystemSyncState,
}))

const { default: avail } = await import('$/resolvers/Avail-JsonRpc.ts')

const network = {
	slug: 'avail',
}
const availNetwork = {
	$network: network,
}
const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 2,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {
		PUBLIC_AVAIL_RPC_URL: 'https://example.com',
	},
}

const networkTimestampsResolver = avail.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AvailNetwork
	&& '$$timestamps' in resolver.projections
))
const networkBlocksResolver = avail.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AvailNetwork
	&& '$$blocks' in resolver.projections
))
const timestampResolver = avail.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AvailNetwork_Timestamp
))
const blockResolver = avail.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AvailBlock
	&& 'blockHash' in resolver.projections
))
const blockTimestampResolver = avail.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AvailBlock
	&& 'timestampMs' in resolver.projections
))
const dataSubmissionResolver = avail.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AvailDataSubmission
))

if (
	networkTimestampsResolver == null
	|| networkBlocksResolver == null
	|| timestampResolver == null
	|| blockResolver == null
	|| blockTimestampResolver == null
	|| dataSubmissionResolver == null
)
	throw new Error('Avail-JsonRpc spec missing resolvers')

const hash = `0x${'a'.repeat(64)}`
const parentHash = `0x${'b'.repeat(64)}`
const header = {
	hash,
	parentHash,
	blockNumber: 100n,
	stateRoot: `0x${'c'.repeat(64)}`,
	extrinsicsRoot: `0x${'d'.repeat(64)}`,
	digestLogs: ['0x00'],
	finalized: false,
}

beforeEach(() => {
	getBlock.mockReset()
	getBlockHash.mockReset()
	getBlockTimestamp.mockReset()
	getBlockTimestamp.mockResolvedValue(1_787_225_800_000)
	getDataProof.mockReset()
	getFinalizedHead.mockReset()
	getHeader.mockReset()
	getHeaderByBlockNumber.mockReset()
	getNetworkIdentity.mockReset()
	getSystemHealth.mockReset()
	getSystemSyncState.mockReset()
})

describe('Avail JsonRpc resolver', () => {
	it('materializes exact block proof under the native submission owner', async () => {
		getHeaderByBlockNumber.mockResolvedValue(header)
		getFinalizedHead.mockResolvedValue({
			...header,
			finalized: true,
		})
		getBlock.mockResolvedValue({
			...header,
			extrinsicCount: 2,
			extrinsics: [
				'0x00',
				'0x01',
			],
		})
		getDataProof.mockResolvedValue({
			dataProof: {
				roots: {
					dataRoot: `0x${'e'.repeat(64)}`,
					blobRoot: `0x${'f'.repeat(64)}`,
					bridgeRoot: `0x${'0'.repeat(64)}`,
				},
				proof: [
					`0x${'1'.repeat(64)}`,
				],
				numberOfLeaves: 2,
				leafIndex: 1,
				leaf: `0x${'2'.repeat(64)}`,
			},
		})

		const snapshot = await dataSubmissionResolver.resolve.NetworkSourceSubmissionKey.resolve({
			$network: availNetwork,
			source: Source.Avail,
			submissionKey: '100:1',
		}, context)

		expect(dataSubmissionResolver.projections.$block(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: availNetwork,
				blockNumber: 100n,
			},
		})
		expect(dataSubmissionResolver.projections.extrinsicIndex(snapshot)).toBe(1)
		expect(dataSubmissionResolver.projections.dataHash(snapshot)).toBe(`0x${'2'.repeat(64)}`)
		expect(dataSubmissionResolver.projections.commitment(snapshot)).toBe(`0x${'f'.repeat(64)}`)
		expect(dataSubmissionResolver.projections.proofAvailable(snapshot)).toBe(true)
		expect(getDataProof).toHaveBeenCalledWith(context.publicEnv, hash, 1)
	})

	it('rejects unfinalized or absent submission coordinates before requesting a proof', async () => {
		getHeaderByBlockNumber.mockResolvedValue(header)
		getFinalizedHead.mockResolvedValue({
			...header,
			blockNumber: 99n,
			finalized: true,
		})

		await expect(dataSubmissionResolver.resolve.NetworkSourceSubmissionKey.resolve({
			$network: availNetwork,
			source: Source.Avail,
			submissionKey: '100:1',
		}, context)).rejects.toThrow('data submission block is not finalized')
		expect(getBlock).not.toHaveBeenCalled()
		expect(getDataProof).not.toHaveBeenCalled()

		getFinalizedHead.mockResolvedValue({
			...header,
			finalized: true,
		})
		getBlock.mockResolvedValue({
			...header,
			extrinsicCount: 1,
			extrinsics: ['0x00'],
		})

		await expect(dataSubmissionResolver.resolve.NetworkSourceSubmissionKey.resolve({
			$network: availNetwork,
			source: Source.Avail,
			submissionKey: '100:1',
		}, context)).rejects.toThrow('data submission extrinsic is absent from block')
		expect(getDataProof).not.toHaveBeenCalled()
	})

	it('rejects malformed or out-of-range submission coordinates', async () => {
		await expect(dataSubmissionResolver.resolve.NetworkSourceSubmissionKey.resolve({
			$network: availNetwork,
			source: Source.Avail,
			submissionKey: 'latest:1',
		}, context)).rejects.toThrow('blockNumber:extrinsicIndex')
		await expect(dataSubmissionResolver.resolve.NetworkSourceSubmissionKey.resolve({
			$network: availNetwork,
			source: Source.CelestiaNode,
			submissionKey: '100:1',
		}, context)).rejects.toThrow('unsupported data submission source')
		expect(getDataProof).not.toHaveBeenCalled()
	})

	it('projects tip timestamps and tip-walked blocks', async () => {
		getNetworkIdentity.mockResolvedValue({
			chainName: 'Avail DA Mainnet',
			genesisHash: '0xb91746b45e0346cc2f815a520b9c6cb4d5c0902af848db0a80f85932d2e8276a',
		})
		getBlockHash.mockResolvedValue(hash)
		getHeader.mockResolvedValue(header)
		getFinalizedHead.mockResolvedValue({
			...header,
			blockNumber: 90n,
			hash: parentHash,
			finalized: true,
		})
		getSystemHealth.mockResolvedValue({
			peers: 8,
			isSyncing: false,
			shouldHavePeers: true,
		})
		getSystemSyncState.mockResolvedValue({
			startingBlock: 0n,
			currentBlock: 100n,
			highestBlock: 100n,
		})

		const timestamps = await networkTimestampsResolver.resolve.Network.resolve({
			$network: network,
		}, context)
		expect(networkTimestampsResolver.projections.$$timestamps(timestamps)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: availNetwork,
					timestampMs: expect.any(Number),
					source: Source.Avail,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.AvailNetwork_Timestamp, [], 'latestBlockNumber')]: 100n,
					[entityFieldAddressKey(EntityType.AvailNetwork_Timestamp, [], 'latestBlockHash')]: hash,
					[entityFieldAddressKey(EntityType.AvailNetwork_Timestamp, [], 'finalizedBlockNumber')]: 90n,
					[entityFieldAddressKey(EntityType.AvailNetwork_Timestamp, [], 'finalizedBlockHash')]: parentHash,
					[entityFieldAddressKey(EntityType.AvailNetwork_Timestamp, [], 'syncing')]: false,
					[entityFieldAddressKey(EntityType.AvailNetwork_Timestamp, [], 'health')]: 'ok',
				},
			},
		])

		getBlockHash.mockResolvedValue(hash)
		getHeader.mockResolvedValue(header)
		getHeaderByBlockNumber.mockResolvedValue({
			...header,
			blockNumber: 99n,
			hash: parentHash,
		})
		getBlock
			.mockResolvedValueOnce({
				...header,
				extrinsicCount: 3,
				extrinsics: ['0x00', '0x01', '0x02'],
			})
			.mockResolvedValueOnce({
				...header,
				blockNumber: 99n,
				hash: parentHash,
				extrinsicCount: 1,
				extrinsics: ['0x00'],
			})
		const blocks = await networkBlocksResolver.resolve.Network.resolve({
			$network: network,
		}, context)
		expect(networkBlocksResolver.projections.$$blocks.select(blocks)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: availNetwork,
					blockNumber: 100n,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.AvailBlock, [], 'blockHash')]: hash,
					[entityFieldAddressKey(EntityType.AvailBlock, [], 'parentHash')]: parentHash,
					[entityFieldAddressKey(EntityType.AvailBlock, [], 'stateRoot')]: header.stateRoot,
					[entityFieldAddressKey(EntityType.AvailBlock, [], 'extrinsicsRoot')]: header.extrinsicsRoot,
					[entityFieldAddressKey(EntityType.AvailBlock, [], 'extrinsicCount')]: 3,
					[entityFieldAddressKey(EntityType.AvailBlock, [], '$parent')]: {
						[EntityMetaKey.Selector]: {
							$network: availNetwork,
							blockNumber: 99n,
						},
					},
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: availNetwork,
					blockNumber: 99n,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.AvailBlock, [], 'blockHash')]: parentHash,
					[entityFieldAddressKey(EntityType.AvailBlock, [], 'parentHash')]: parentHash,
					[entityFieldAddressKey(EntityType.AvailBlock, [], 'stateRoot')]: header.stateRoot,
					[entityFieldAddressKey(EntityType.AvailBlock, [], 'extrinsicsRoot')]: header.extrinsicsRoot,
					[entityFieldAddressKey(EntityType.AvailBlock, [], 'extrinsicCount')]: 1,
					[entityFieldAddressKey(EntityType.AvailBlock, [], '$parent')]: {
						[EntityMetaKey.Selector]: {
							$network: availNetwork,
							blockNumber: 98n,
						},
					},
				},
			},
		])
		expect(networkBlocksResolver.projections.$$blocks.continuation(blocks)).toEqual({
			operation: 'network-blocks',
			terminal: false,
			token: '98',
		})

		getBlock.mockResolvedValue({
			extrinsicCount: 0,
		})
		getHeaderByBlockNumber.mockImplementation(async (_publicEnv, blockNumber: bigint) => ({
			...header,
			blockNumber,
			hash: `0x${blockNumber.toString()}`,
		}))
		const nextBlocks = await networkBlocksResolver.resolve.Network.resolve({
			$network: network,
		}, {
			...context,
			pagination: {
				limit: 2,
			},
			providerContinuationToken: '98',
		})
		expect(networkBlocksResolver.projections.$$blocks.select(nextBlocks).map((block) => (
			block[EntityMetaKey.Selector].blockNumber
		))).toEqual([
			98n,
			97n,
		])
		expect(networkBlocksResolver.projections.$$blocks.continuation(nextBlocks).token).toBe('96')

		const blocksCountResolver = avail.resolvers.find((resolver) => (
			resolver.entityType === EntityType.AvailNetwork
			&& typeof resolver.projections.$$blocks === 'object'
			&& resolver.projections.$$blocks != null
			&& 'resolveCount' in resolver.projections.$$blocks
		))
		if (blocksCountResolver == null || !('Network' in blocksCountResolver.resolve))
			throw new Error('Avail block count resolver missing')
		await expect(blocksCountResolver.resolve.Network.resolve({
			$network: network,
		}, context)).resolves.toBe(101)
		expect(
			typeof blocksCountResolver.projections.$$blocks === 'object'
			&& blocksCountResolver.projections.$$blocks != null
			&& 'resolveCount' in blocksCountResolver.projections.$$blocks
			&& blocksCountResolver.projections.$$blocks.resolveCount(101)
		).toBe(101)
	})

	it('projects enrolled network observation fields', async () => {
		getNetworkIdentity.mockResolvedValue({
			chainName: 'Avail DA Mainnet',
			genesisHash: '0xb91746b45e0346cc2f815a520b9c6cb4d5c0902af848db0a80f85932d2e8276a',
		})
		getBlockHash.mockResolvedValue(hash)
		getHeader.mockResolvedValue(header)
		getFinalizedHead.mockResolvedValue({
			...header,
			blockNumber: 90n,
			hash: parentHash,
			finalized: true,
		})
		getSystemHealth.mockResolvedValue({
			peers: 8,
			isSyncing: false,
			shouldHavePeers: true,
		})
		getSystemSyncState.mockResolvedValue({
			startingBlock: 0n,
			currentBlock: 100n,
			highestBlock: 100n,
		})

		const snapshot = await timestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: availNetwork,
			timestampMs: 1,
			source: Source.Avail,
		}, context)

		expect(timestampResolver.projections.latestBlockNumber(snapshot)).toBe(100n)
		expect(timestampResolver.projections.latestBlockHash(snapshot)).toBe(hash)
		expect(timestampResolver.projections.finalizedBlockNumber(snapshot)).toBe(90n)
		expect(timestampResolver.projections.finalizedBlockHash(snapshot)).toBe(parentHash)
		expect(timestampResolver.projections.syncing(snapshot)).toBe(false)
		expect(timestampResolver.projections.health(snapshot)).toBe('ok')
	})

	it('projects blocks by number and hash with parent refs', async () => {
		getHeaderByBlockNumber.mockResolvedValue(header)
		getBlock.mockResolvedValue({
			...header,
			extrinsicCount: 3,
			extrinsics: [
				'0x00',
				'0x01',
				'0x02',
			],
		})

		const byNumber = await blockResolver.resolve.NetworkBlockNumber.resolve({
			$network: availNetwork,
			blockNumber: 100n,
		}, context)
		expect(blockResolver.projections.blockHash(byNumber)).toBe(hash)
		expect(blockResolver.projections.extrinsicCount(byNumber)).toBe(3)
		expect(blockResolver.projections.$parent(byNumber)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: availNetwork,
				blockNumber: 99n,
			},
		})

		const byHash = await blockResolver.resolve.NetworkBlockHash.resolve({
			$network: availNetwork,
			blockHash: hash,
		}, context)
		expect(blockResolver.projections.blockNumber(byHash)).toBe(100n)
		expect(blockResolver.projections.parentHash(byHash)).toBe(parentHash)

		getBlockHash.mockResolvedValue(hash)
		const timestampByNumber = await blockTimestampResolver.resolve.NetworkBlockNumber.resolve({
			$network: availNetwork,
			blockNumber: 100n,
		}, context)
		expect(blockTimestampResolver.projections.timestampMs(timestampByNumber)).toBe(1_787_225_800_000)
		expect(getBlockHash).toHaveBeenCalledWith(context.publicEnv, 100n)
		expect(getBlockTimestamp).toHaveBeenCalledWith(context.publicEnv, hash)

		const timestampByHash = await blockTimestampResolver.resolve.NetworkBlockHash.resolve({
			$network: availNetwork,
			blockHash: hash,
		}, context)
		expect(blockTimestampResolver.projections.timestampMs(timestampByHash)).toBe(1_787_225_800_000)
	})
})

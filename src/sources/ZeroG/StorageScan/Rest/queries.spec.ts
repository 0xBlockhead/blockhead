import {
	afterEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/ZeroG/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.fn()

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: { endpoints: { locator: string }[] }) => binding.endpoints[0]?.locator,
	sourceGetJson,
	sourceGetText: vi.fn(),
	sourceFetch: vi.fn(),
}))

const {
	getStorageMiner,
	getStorageSummary,
	getStorageTransaction,
	listStorageMiners,
	listStorageRewards,
	listStorageTransactions,
} = await import('$/sources/ZeroG/StorageScan/Rest/queries.ts')

const summaryWire = {
	code: 0,
	message: 'Success',
	data: {
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
			totalPrunedFiles: 0,
		},
		minerReward: {
			avgReward24Hours: '1',
			totalReward: '2',
			totalWinCount: 3,
		},
	},
}

describe('ZeroG StorageScan REST envelopes', () => {
	afterEach(() => {
		sourceGetJson.mockReset()
	})

	it('accepts live-shaped summary / txs / miners / rewards and fails closed on bad envelopes', async () => {
		sourceGetJson.mockResolvedValueOnce(summaryWire)
		await expect(getStorageSummary()).resolves.toMatchObject({
			storageFee: {
				storageFeeTotal: '1',
			},
			logSync: {
				logSyncHeight: 9,
			},
		})

		sourceGetJson.mockResolvedValueOnce({
			code: 0,
			message: 'Success',
			data: {
				total: 1,
				list: [{
					txSeq: '12',
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
			},
		})
		await expect(listStorageTransactions({ limit: 1 })).resolves.toMatchObject({
			total: 1,
			list: [{
				txSeq: '12',
				rootHash: '0xe544394edc2172a48434739594fd295221bcc36339777ab39e2375baf393721e',
			}],
		})

		sourceGetJson.mockResolvedValueOnce({
			code: 0,
			message: 'Success',
			data: {
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
			},
		})
		await expect(getStorageTransaction({ txSeq: 12 })).resolves.toMatchObject({
			txSeq: 12,
		})

		sourceGetJson.mockResolvedValueOnce({
			code: 0,
			message: 'Success',
			data: {
				total: '2',
				list: [{
					miner: '0x4D19F72978eaF45F6B0dC4db43f15B4a39D65bfD',
					totalReward: '1',
					winCount: 1,
					miningAttempts: 2,
					timestamp: 1,
				}],
			},
		})
		await expect(listStorageMiners({ limit: 1 })).resolves.toMatchObject({
			total: 2,
		})

		sourceGetJson.mockResolvedValueOnce({
			code: 0,
			message: 'Success',
			data: {
				balance: '1',
				totalReward: '2',
			},
		})
		await expect(getStorageMiner({
			address: '0x0000000000000000000000000000000000000001',
		})).resolves.toEqual({
			balance: '1',
			totalReward: '2',
		})

		sourceGetJson.mockResolvedValueOnce({
			code: 0,
			message: 'Success',
			data: {
				total: 1,
				list: [{
					miner: '0x4D19F72978eaF45F6B0dC4db43f15B4a39D65bfD',
					reward: '1',
					blockNumber: 1,
					txHash: '0xc0096b77649851f5b2dcb484175fbcf727e71ce56ac7d692092dd5e4775187b8',
					timestamp: 1,
				}],
			},
		})
		await expect(listStorageRewards({ limit: 1 })).resolves.toMatchObject({
			total: 1,
		})
		expect(sourceGetJson).toHaveBeenLastCalledWith(
			bindings[Source.ZeroGStorageScan_Rest][0],
			'https://storagescan.0g.ai/api/rewards?limit=1'
		)

		sourceGetJson.mockResolvedValueOnce({
			code: 0,
			message: 'Success',
			data: {
				total: 1,
				list: [{
					miner: 'not-an-address',
					totalReward: '1',
					winCount: 1,
					miningAttempts: 2,
					timestamp: 1,
				}],
			},
		})
		await expect(listStorageMiners({ limit: 1 })).rejects.toThrow('invalid miners response envelope')

		sourceGetJson.mockResolvedValueOnce({
			code: 1,
			message: 'nope',
			data: summaryWire.data,
		})
		await expect(getStorageSummary()).rejects.toThrow('stats/summary: nope')
	})
})

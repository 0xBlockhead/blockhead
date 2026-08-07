import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Cardanoscan/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

const {
	getAddressBalance,
	getLatestBlock,
	getTransaction,
	listPools,
	queryPath,
} = await import('$/sources/Cardanoscan/Rest/queries.ts')

const binding = bindings[Source.Cardanoscan_Rest][0]

const validBlock = {
	hash: 'a'.repeat(64),
	previousBlockHash: 'b'.repeat(64),
	blockHeight: 12_345_678,
	totalFees: '1000',
	slot: 432_000,
	epoch: 500,
	absSlot: 130_000_102,
	timestamp: '2026-07-31T19:32:02.172Z',
	txCount: 7,
	assetTxCount: 1,
	totalOutput: '5000000',
	slotLeader: 'pool1example',
	bodySize: 80_000,
}

const validTransaction = {
	hash: 'c'.repeat(64),
	blockHash: 'a'.repeat(64),
	fees: '170000',
	slot: 432_000,
	epoch: 500,
	blockHeight: 12_345_678,
	absSlot: 130_000_102,
	timestamp: '2026-07-31T19:32:02.172Z',
	index: 0,
	status: true,
}

describe('Cardanoscan public REST transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('uses the exact binding-owned public endpoint', async () => {
		sourceGetJson.mockResolvedValueOnce({
			status: 'ok',
		})

		await expect(queryPath('/api/v1/block')).resolves.toEqual({
			status: 'ok',
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://api.cardanoscan.io/api/v1/block'
		)
	})

	it('fail-closes latest-block envelopes through getLatestBlock', async () => {
		sourceGetJson.mockResolvedValueOnce(validBlock)
		await expect(getLatestBlock()).resolves.toMatchObject({
			blockHeight: 12_345_678,
			absSlot: 130_000_102,
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://api.cardanoscan.io/api/v1/block/latest'
		)

		sourceGetJson.mockResolvedValueOnce({
			...validBlock,
			hash: 'not-hex',
		})
		await expect(getLatestBlock()).rejects.toThrow('invalid block envelope')
	})

	it('fail-closes transaction envelopes', async () => {
		sourceGetJson.mockResolvedValueOnce(validTransaction)
		await expect(getTransaction('c'.repeat(64))).resolves.toMatchObject({
			fees: '170000',
			status: true,
		})

		sourceGetJson.mockResolvedValueOnce({
			...validTransaction,
			fees: '-1',
		})
		await expect(getTransaction('c'.repeat(64))).rejects.toThrow('invalid transaction envelope')
	})

	it('fail-closes address balance envelopes', async () => {
		sourceGetJson.mockResolvedValueOnce({
			hash: 'addr1example',
			balance: '1000000',
		})
		await expect(getAddressBalance('addr1example')).resolves.toEqual({
			hash: 'addr1example',
			balance: '1000000',
		})

		sourceGetJson.mockResolvedValueOnce({
			hash: 'addr1example',
			balance: '01',
		})
		await expect(getAddressBalance('addr1example')).rejects.toThrow('invalid address balance envelope')
	})

	it('rejects invalid pool list bounds and duplicate identities', async () => {
		await expect(listPools(0, 10)).rejects.toThrow('pageNo must be a positive integer')
		await expect(listPools(1, 101)).rejects.toThrow('limit must be an integer from 0 through 100')
		await expect(listPools(1, 0)).resolves.toEqual({
			pageNo: 1,
			limit: 0,
			count: 0,
			pools: [],
		})

		sourceGetJson.mockResolvedValueOnce({
			pageNo: 1,
			limit: 2,
			count: 2,
			pools: [
				{
					poolId: 'pool1dup',
					status: true,
				},
				{
					poolId: 'pool1dup',
					status: false,
				},
			],
		})
		await expect(listPools(1, 2)).rejects.toThrow('duplicate identities')
	})
})

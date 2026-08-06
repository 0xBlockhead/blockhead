import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Voyager/bindings.ts'
import { Source } from '$/sources/Source.ts'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const queries = await import('$/sources/Voyager/Rest/queries.ts')
const {
	getApiStatus,
	getBlockByHash,
	getClassByHash,
	getContractByAddress,
	getNetworkStats,
	getTransactionByHash,
	listBlocks,
	listEvents,
	listTransactions,
} = queries
const binding = bindings[Source.Voyager][0]

const transactionEnvelope = {
	blockNumber: 100,
	hash: '0xabc',
	timestamp: 1_700_000_000,
	status: 'Accepted on L2',
	type: 'INVOKE',
	signature: [],
	receipt: {
		events: [],
	},
}

const blockEnvelope = {
	blockNumber: 10,
	hash: '0x194',
	timestamp: 1_700_000_000,
	status: 'Accepted on L2',
}

const contractEnvelope = {
	address: '0x1',
	blockNumber: 1,
	nonce: 0,
	classHash: '0x2',
}

const classEnvelope = {
	hash: '0x3',
	transactionHash: '0x4',
	version: '1',
}

describe('Voyager OpenAPI operations', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it.each([
		['getTransactionByHash', () => getTransactionByHash({ txnHash: '0xabc/def' }), '/txns/0xabc%2Fdef', transactionEnvelope],
		['getContractByAddress', () => getContractByAddress({ contractAddress: '0xabc/def' }), '/contracts/0xabc%2Fdef', contractEnvelope],
		['getClassByHash', () => getClassByHash({ classHash: '0xabc/def' }), '/classes/0xabc%2Fdef', classEnvelope],
		['getBlockByHash', () => getBlockByHash({ blockHash: '0xabc/def' }), '/blocks/0xabc%2Fdef', blockEnvelope],
	] as const)('queries the documented %s route', async (_operation, request, path, envelope) => {
		getJson.mockResolvedValue(envelope)

		await request()

		expect(getJson).toHaveBeenCalledWith(binding, path)
	})

	it.each([
		['getNetworkStats', getNetworkStats, '/stats', {
			blocksCount: '10',
			tpsAtBlockHash: '0x1',
		}],
		['getApiStatus', getApiStatus, '/api-status', {
			timestamp: 1,
			apis: {
				core: {
					status: 'ok',
				},
			},
		}],
	] as const)('queries the documented %s route', async (_operation, request, path, envelope) => {
		getJson.mockResolvedValue(envelope)

		await request()

		expect(getJson).toHaveBeenCalledWith(binding, path)
	})

	it('lists blocks, transactions, and events with arktype fail-closed envelopes', async () => {
		getJson.mockResolvedValueOnce({
			items: [{
				blockNumber: 20,
				hash: '0x20',
				timestamp: 1,
				status: 'Accepted on L2',
			}],
			lastPage: 3,
		})
		await expect(listBlocks({
			limit: 16,
			page: 2,
		})).resolves.toMatchObject({
			lastPage: 3,
		})
		expect(getJson).toHaveBeenCalledWith(binding, '/blocks?p=2&ps=25')

		getJson.mockResolvedValueOnce({
			items: [{
				hash: '0x1',
				type: 'INVOKE',
				timestamp: 1,
				status: 'Accepted on L2',
				blockNumber: 20,
			}],
			lastPage: 1,
		})
		await expect(listTransactions({
			limit: 10,
			block: '20',
		})).resolves.toMatchObject({
			items: [{
				hash: '0x1',
			}],
		})
		expect(getJson).toHaveBeenCalledWith(binding, '/txns?p=1&ps=10&block=20')

		getJson.mockResolvedValueOnce({
			items: [{
				number: 1,
				fromAddress: '0x2',
				selector: '0x3',
				dataDecoded: [{
					value: '0x4',
				}],
			}],
			lastPage: 1,
		})
		await expect(listEvents({
			limit: 10,
			txnHash: '0xabc',
		})).resolves.toMatchObject({
			items: [{
				number: 1,
			}],
		})

		getJson.mockResolvedValueOnce({
			items: 'nope',
			lastPage: 1,
		})
		await expect(listBlocks({
			limit: 10,
		})).rejects.toThrow('invalid blocks page envelope')
	})

	it('exports deepened endpoint operations', () => {
		expect(Object.keys(queries).sort()).toEqual([
			'getApiStatus',
			'getBlockByHash',
			'getClassByHash',
			'getContractByAddress',
			'getNetworkStats',
			'getTransactionByHash',
			'listBlocks',
			'listEvents',
			'listTransactions',
		])
	})

	it('hard-fails HTTP through getJson (no soft-empty accepted statuses)', async () => {
		getJson.mockRejectedValueOnce(new Error('Voyager https://api.voyager.online/beta/txns/0x1 → 404 Not Found'))

		await expect(getTransactionByHash({ txnHash: '0x1' })).rejects.toThrow('404 Not Found')
		expect(getJson).toHaveBeenCalledWith(binding, '/txns/0x1')
		expect(getJson.mock.calls[0]).toHaveLength(2)
	})

	it('fail-closes malformed singular envelopes', async () => {
		getJson.mockResolvedValueOnce({})
		await expect(getTransactionByHash({
			txnHash: '0x1',
		})).rejects.toThrow('invalid transaction envelope')
	})
})

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
	listClasses,
	listClassContracts,
	listContracts,
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
		expect(getJson).toHaveBeenCalledWith(binding, '/events?p=1&ps=10&txnHash=0xabc')

		getJson.mockResolvedValueOnce({
			items: 'nope',
			lastPage: 1,
		})
		await expect(listBlocks({
			limit: 10,
		})).rejects.toThrow('invalid blocks page envelope')
	})

	it('lists contracts, classes, and class contracts with arktype fail-closed envelopes', async () => {
		getJson.mockResolvedValueOnce({
			items: [{
				address: '0x07b7',
				blockNumber: 1655799,
				classHash: '0x0360',
				type: 'Ready',
			}],
			lastPage: 4,
		})
		await expect(listContracts({
			limit: 16,
			page: 2,
			type: 'account',
		})).resolves.toMatchObject({
			lastPage: 4,
		})
		expect(getJson).toHaveBeenCalledWith(binding, '/contracts?p=2&ps=25&type=account')

		getJson.mockResolvedValueOnce({
			items: [{
				hash: '0x04ad',
				transactionHash: '0x749e',
				version: '2.12.2',
			}],
			lastPage: 6853,
		})
		await expect(listClasses({
			limit: 10,
		})).resolves.toMatchObject({
			items: [{
				hash: '0x04ad',
			}],
		})
		expect(getJson).toHaveBeenCalledWith(binding, '/classes?p=1&ps=10')

		getJson.mockResolvedValueOnce({
			items: [{
				address: '0x0368',
				creationTimestamp: 1757525503,
				txnCount: 0,
			}],
			lastPage: 1,
		})
		await expect(listClassContracts({
			classHash: '0xabc/def',
			limit: 25,
		})).resolves.toMatchObject({
			items: [{
				address: '0x0368',
			}],
		})
		expect(getJson).toHaveBeenCalledWith(binding, '/classes/0xabc%2Fdef/contracts?p=1&ps=25')

		getJson.mockResolvedValueOnce({
			items: [{
				address: 1,
			}],
			lastPage: 1,
		})
		await expect(listContracts({
			limit: 10,
		})).rejects.toThrow('Voyager_Rest: invalid contracts page envelope')
	})

	it('rejects duplicate native identities from list pages', async () => {
		getJson
			.mockResolvedValueOnce({
				items: [
					{
						hash: '0x1',
						type: 'INVOKE',
						timestamp: 1,
						status: 'Accepted on L2',
					},
					{
						hash: '0x01',
						type: 'INVOKE',
						timestamp: 2,
						status: 'Accepted on L2',
					},
				],
				lastPage: 1,
			})
			.mockResolvedValueOnce({
				items: [
					{
						address: '0x1',
						blockNumber: 1,
						classHash: '0x2',
					},
					{
						address: '0x01',
						blockNumber: 2,
						classHash: '0x3',
					},
				],
				lastPage: 1,
			})
			.mockResolvedValueOnce({
				items: [
					{
						hash: '0x1',
						transactionHash: '0x2',
					},
					{
						hash: '0x01',
						transactionHash: '0x3',
					},
				],
				lastPage: 1,
			})
			.mockResolvedValueOnce({
				items: [
					{
						address: '0x1',
					},
					{
						address: '0x01',
					},
				],
				lastPage: 1,
			})

		await expect(listTransactions({ limit: 10 })).rejects.toThrow('transactions page returned a duplicate identity')
		await expect(listContracts({ limit: 10 })).rejects.toThrow('contracts page returned a duplicate identity')
		await expect(listClasses({ limit: 10 })).rejects.toThrow('classes page returned a duplicate identity')
		await expect(listClassContracts({ classHash: '0x1', limit: 10 })).rejects.toThrow('class contracts page returned a duplicate identity')
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

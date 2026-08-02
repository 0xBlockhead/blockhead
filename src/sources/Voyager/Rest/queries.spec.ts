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
} = queries
const binding = bindings[Source.Voyager][0]

describe('Voyager OpenAPI operations', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it.each([
		['getTransactionByHash', () => getTransactionByHash({ txnHash: '0xabc/def' }), '/txns/0xabc%2Fdef'],
		['getContractByAddress', () => getContractByAddress({ contractAddress: '0xabc/def' }), '/contracts/0xabc%2Fdef'],
		['getClassByHash', () => getClassByHash({ classHash: '0xabc/def' }), '/classes/0xabc%2Fdef'],
		['getBlockByHash', () => getBlockByHash({ blockHash: '0xabc/def' }), '/blocks/0xabc%2Fdef'],
	] as const)('queries the documented %s route', async (_operation, request, path) => {
		getJson.mockResolvedValue({})

		await request()

		expect(getJson).toHaveBeenCalledWith(binding, path)
	})

	it.each([
		['getNetworkStats', getNetworkStats, '/stats'],
		['getApiStatus', getApiStatus, '/api-status'],
	] as const)('queries the documented %s route', async (_operation, request, path) => {
		getJson.mockResolvedValue({})

		await request()

		expect(getJson).toHaveBeenCalledWith(binding, path)
	})

	it('exports only endpoint-specific operations', () => {
		expect(Object.keys(queries).sort()).toEqual([
			'getApiStatus',
			'getBlockByHash',
			'getClassByHash',
			'getContractByAddress',
			'getNetworkStats',
			'getTransactionByHash',
		])
	})
})

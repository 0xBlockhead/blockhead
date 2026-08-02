import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/Wormholescan/bindings.ts'
import { Source } from '$/sources/Source.ts'

const {
	getJson,
	postJson,
} = vi.hoisted(() => ({
	getJson: vi.fn(),
	postJson: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
	postJson,
}))

const queries = await import('$/sources/Wormholescan/Rest/queries.ts')
const binding = bindings[Source.Wormholescan][0]

describe('Wormholescan OpenAPI operations', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('checks health through the canonical binding', async () => {
		getJson.mockResolvedValue({ status: 'OK' })

		await expect(queries.getHealth()).resolves.toEqual({ status: 'OK' })
		expect(getJson).toHaveBeenCalledWith(binding, 'health')
	})

	it('encodes official operation filters without a generic path surface', async () => {
		getJson.mockResolvedValue([])

		await queries.getOperations({
			address: '0xaddress/with space',
			page: 2,
			pageSize: 25,
			sourceChain: '2,4',
			exclusiveAppId: false,
			minAmount: 0,
			addressType: 'from',
		})

		expect(getJson).toHaveBeenCalledWith(
			binding,
			'operations?address=0xaddress%2Fwith+space&page=2&pageSize=25&sourceChain=2%2C4&exclusiveAppId=false&minAmount=0&addressType=from'
		)
	})

	it('searches the official operation endpoint by source transaction hashes', async () => {
		postJson.mockResolvedValue([])
		const transactionHashes = [
			'0x1111111111111111111111111111111111111111111111111111111111111111',
			'0x2222222222222222222222222222222222222222222222222222222222222222',
		]

		await queries.searchOperations(transactionHashes)

		expect(postJson).toHaveBeenCalledWith({
			binding,
			path: 'operations',
			body: transactionHashes,
		})
	})

	it('exports only named OpenAPI operations', () => {
		expect(Object.keys(queries).sort()).toEqual([
			'getHealth',
			'getOperations',
			'searchOperations',
		])
	})
})

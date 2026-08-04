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
} = vi.hoisted(() => ({
	getJson: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
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

	it('checks readiness through the canonical binding', async () => {
		getJson.mockResolvedValue({ ready: 'OK' })

		await expect(queries.getReady()).resolves.toEqual({ ready: 'OK' })
		expect(getJson).toHaveBeenCalledWith(binding, 'ready')
	})

	it('unwraps the live operations page envelope and encodes filters', async () => {
		getJson.mockResolvedValue({
			operations: [{ id: '2/emitter/1' }],
		})

		await expect(queries.getOperations({
			address: '0xaddress/with space',
			page: 2,
			pageSize: 25,
			sourceChain: '2,4',
			exclusiveAppId: false,
			minAmount: 0,
			addressType: 'from',
		})).resolves.toEqual([{ id: '2/emitter/1' }])

		expect(getJson).toHaveBeenCalledWith(
			binding,
			'operations?address=0xaddress%2Fwith+space&page=2&pageSize=25&sourceChain=2%2C4&exclusiveAppId=false&minAmount=0&addressType=from'
		)
	})

	it('returns an empty list when the live page has zero operations', async () => {
		getJson.mockResolvedValue({
			operations: [],
		})

		await expect(queries.getOperations({ txHash: '0xabc' })).resolves.toEqual([])
	})

	it('hard-fails when the operations page omits operations', async () => {
		getJson.mockResolvedValue({})

		await expect(queries.getOperations()).rejects.toThrow(
			'Wormholescan_Rest: operations missing operations'
		)
	})

	it('loads a single operation by wormhole id path', async () => {
		getJson.mockResolvedValue({ id: '2/abcdef/7' })

		await expect(queries.getOperationById({
			chainId: 2,
			emitter: 'abcdef',
			sequence: 7,
		})).resolves.toEqual({ id: '2/abcdef/7' })
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'operations/2/abcdef/7'
		)
	})

	it('loads a global transaction by wormhole id path', async () => {
		getJson.mockResolvedValue({ id: 'global' })

		await expect(queries.findGlobalTransactionById({
			chainId: 2,
			emitter: 'ab/cd',
			sequence: '3',
		})).resolves.toEqual({ id: 'global' })
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'global-tx/2/ab%2Fcd/3'
		)
	})

	it('exports only live-supported OpenAPI GET operations', () => {
		expect(Object.keys(queries).sort()).toEqual([
			'findGlobalTransactionById',
			'getHealth',
			'getOperationById',
			'getOperations',
			'getReady',
		])
	})
})

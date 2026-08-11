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
			operations: [{
				id: '2/abcdef/1',
				emitterChain: 2,
				emitterAddress: { hex: 'abcdef' },
				sequence: '1',
			}],
		})

		await expect(queries.getOperations({
			address: '0xaddress/with space',
			page: 2,
			pageSize: 25,
			sourceChain: '2,4',
			exclusiveAppId: false,
			minAmount: 0,
			addressType: 'from',
		})).resolves.toMatchObject([{
			id: '2/abcdef/1',
		}])

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

	it('rejects malformed page bounds and duplicate operation identities before materializing bridge rows', async () => {
		for (const parameters of [
			{ page: -1 },
			{ page: 1.5 },
			{ pageSize: 0 },
			{ pageSize: 1.5 },
			{ minAmount: -1 },
			{ minAmount: Number.NaN },
		])
			await expect(queries.getOperations(parameters)).rejects.toThrow('Wormholescan_Rest: invalid operations')
		expect(getJson).not.toHaveBeenCalled()

		getJson.mockResolvedValueOnce({
			operations: [
				{
					id: '2/abcdef/1',
					emitterChain: 2,
					emitterAddress: { hex: 'abcdef' },
					sequence: '1',
				},
				{
					id: '2/abcdef/1',
					emitterChain: 2,
					emitterAddress: { hex: 'abcdef' },
					sequence: '1',
				},
			],
		})
		await expect(queries.getOperations()).rejects.toThrow('operations page contains duplicate identities')
	})

	it('hard-fails when the operations page omits operations', async () => {
		getJson.mockResolvedValue({})

		await expect(queries.getOperations()).rejects.toThrow(
			'Wormholescan_Rest: invalid operations response envelope'
		)
	})

	it('loads a single operation by wormhole id path', async () => {
		getJson.mockResolvedValue({
			id: '2/abcdef/7',
			emitterChain: 2,
			emitterAddress: { hex: 'abcdef' },
			sequence: '7',
		})

		await expect(queries.getOperationById({
			chainId: 2,
			emitter: 'abcdef',
			sequence: 7,
		})).resolves.toMatchObject({ id: '2/abcdef/7' })
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'operations/2/abcdef/7'
		)
	})

	it('hard-fails when a detail operation does not echo its requested identity', async () => {
		getJson.mockResolvedValue({
			id: '2/abcdef/8',
			emitterChain: 2,
			emitterAddress: { hex: 'abcdef' },
			sequence: '7',
		})

		await expect(queries.getOperationById({
			chainId: 2,
			emitter: 'abcdef',
			sequence: 7,
		})).rejects.toThrow('Wormholescan_Rest: mismatched operation id 2/abcdef/8')
	})

	it('hard-fails when a detail operation has no envelope', async () => {
		getJson.mockResolvedValue(null)

		await expect(queries.getOperationById({
			chainId: 2,
			emitter: 'abcdef',
			sequence: 7,
		})).rejects.toThrow('Wormholescan_Rest: invalid operation response envelope')
	})

	it('rejects invalid operation path atoms before transport', async () => {
		await expect(queries.getOperationById({
			chainId: 2.5,
			emitter: 'abcdef',
			sequence: 7,
		})).rejects.toThrow('Wormholescan_Rest: invalid wormhole chain id')
		await expect(queries.getOperationById({
			chainId: 2,
			emitter: 'not/hex',
			sequence: 7,
		})).rejects.toThrow('Wormholescan_Rest: invalid emitter address')
		await expect(queries.getOperationById({
			chainId: 2,
			emitter: 'abcdef',
			sequence: 'not/a-sequence',
		})).rejects.toThrow('Wormholescan_Rest: invalid operation sequence')
		expect(getJson).not.toHaveBeenCalled()
	})

	it('accepts an opaque operation sequence from the live operation identifier', async () => {
		const sequence = '55ee23ea14ca558ffda4e033257cee58b30db3868bd68bdbb60266f0cf2020ce-0'
		getJson.mockResolvedValue({
			id: `2/abcdef/${sequence}`,
			emitterChain: 2,
			emitterAddress: { hex: 'abcdef' },
			sequence,
		})

		await expect(queries.getOperationById({
			chainId: 2,
			emitter: 'abcdef',
			sequence,
		})).resolves.toMatchObject({ sequence })
	})

	it('loads a global transaction by wormhole id path', async () => {
		getJson.mockResolvedValue({ id: 'global' })

		await expect(queries.findGlobalTransactionById({
			chainId: 2,
			emitter: 'abcd',
			sequence: '3',
		})).resolves.toEqual({ id: 'global' })
		expect(getJson).toHaveBeenCalledWith(
			binding,
			'global-tx/2/abcd/3'
		)
	})

	it('rejects non-canonical global transaction path atoms before transport', async () => {
		expect(() => queries.findGlobalTransactionById({
			chainId: -1,
			emitter: 'abcd',
			sequence: 3,
		})).toThrow('invalid wormhole chain id')
		expect(() => queries.findGlobalTransactionById({
			chainId: 2,
			emitter: 'ab/cd',
			sequence: 3,
		})).toThrow('invalid emitter address')
		expect(() => queries.findGlobalTransactionById({
			chainId: 2,
			emitter: 'abcd',
			sequence: '01',
		})).toThrow('invalid VAA sequence')
		expect(getJson).not.toHaveBeenCalled()
	})

	it('loads a VAA snapshot by wormhole id and asserts identity', async () => {
		const emitter = '0000000000000000000000003ee18b2214aff97000d974cf647e7c347e8fa585'
		const vaa = {
			id: `2/${emitter}/1`,
			sequence: 1,
			emitterChain: 2,
			emitterAddr: emitter,
			timestamp: '2021-09-13T16:29:18Z',
			vaa: 'AQAAAA',
		}
		getJson.mockResolvedValue({
			data: vaa,
			pagination: { next: '' },
		})

		await expect(queries.getVaaById({
			chainId: 2,
			emitter,
			sequence: 1,
			parsedPayload: false,
		})).resolves.toEqual(vaa)
		expect(getJson).toHaveBeenCalledWith(
			binding,
			`vaas/2/${emitter}/1?parsedPayload=false`
		)
	})

	it('hard-fails when the VAA page omits data', async () => {
		getJson.mockResolvedValue({ pagination: { next: '' } })

		await expect(queries.getVaaById({
			chainId: 2,
			emitter: 'aa',
			sequence: 1,
		})).rejects.toThrow('Wormholescan_Rest: invalid VAA response envelope')
	})

	it('hard-fails when the VAA endpoint returns no envelope', async () => {
		getJson.mockResolvedValue(null)

		await expect(queries.getVaaById({
			chainId: 2,
			emitter: 'aa',
			sequence: 1,
		})).rejects.toThrow('Wormholescan_Rest: invalid VAA response envelope')
	})

	it('hard-fails when the VAA page omits pagination', async () => {
		getJson.mockResolvedValue({
			data: {
				id: '2/aa/1',
				sequence: 1,
				emitterChain: 2,
				emitterAddr: 'aa',
				timestamp: '2021-09-13T16:29:18Z',
				vaa: 'AQAAAA',
			},
		})

		await expect(queries.getVaaById({
			chainId: 2,
			emitter: 'aa',
			sequence: 1,
		})).rejects.toThrow('Wormholescan_Rest: invalid VAA response envelope')
	})

	it('hard-fails when the VAA identity does not match the request', async () => {
		getJson.mockResolvedValue({
			data: {
				id: '2/aa/1',
				sequence: 1,
				emitterChain: 2,
				emitterAddr: 'aa',
				timestamp: '2021-09-13T16:29:18Z',
				vaa: 'AQAAAA',
			},
			pagination: { next: '' },
		})

		await expect(queries.getVaaById({
			chainId: 2,
			emitter: 'bb',
			sequence: 1,
		})).rejects.toThrow('Wormholescan_Rest: mismatched VAA identity')
	})

	it('hard-fails when the VAA omits signed bytes', async () => {
		getJson.mockResolvedValue({
			data: {
				id: '2/aa/1',
				sequence: 1,
				emitterChain: 2,
				emitterAddr: 'aa',
				timestamp: '2021-09-13T16:29:18Z',
				vaa: '',
			},
			pagination: { next: '' },
		})

		await expect(queries.getVaaById({
			chainId: 2,
			emitter: 'aa',
			sequence: 1,
		})).rejects.toThrow('Wormholescan_Rest: invalid VAA response envelope')
	})

	it('rejects unsafe VAA path atoms before transport', async () => {
		await expect(queries.getVaaById({
			chainId: 2.5,
			emitter: 'aa',
			sequence: 1,
		})).rejects.toThrow('Wormholescan_Rest: invalid wormhole chain id')
		await expect(queries.getVaaById({
			chainId: 2,
			emitter: 'not/hex',
			sequence: 1,
		})).rejects.toThrow('Wormholescan_Rest: invalid emitter address')
		await expect(queries.getVaaById({
			chainId: 2,
			emitter: 'aa',
			sequence: '01',
		})).rejects.toThrow('Wormholescan_Rest: invalid VAA sequence')
		expect(getJson).not.toHaveBeenCalled()
	})

	it('exports only live-supported OpenAPI GET operations', () => {
		expect(Object.keys(queries).sort()).toEqual([
			'findGlobalTransactionById',
			'getHealth',
			'getOperationById',
			'getOperations',
			'getReady',
			'getVaaById',
		])
	})
})

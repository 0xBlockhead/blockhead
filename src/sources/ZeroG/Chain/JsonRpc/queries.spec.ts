import { beforeEach, expect, it, vi } from 'vitest'

import bindings from '$/sources/ZeroG/bindings.ts'
import { Source } from '$/sources/Source.ts'

const requests = vi.hoisted(() => ({
	getBlockByNumber: vi.fn(),
	getBlockNumber: vi.fn(),
	getCode: vi.fn(),
	getTransactionByHash: vi.fn(),
	getTransactionReceipt: vi.fn(),
}))
const evmExecutionJsonRpc = vi.hoisted(() => vi.fn(() => requests))
const jsonRpc2 = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts', () => ({
	evmExecutionJsonRpc,
}))
vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const queries = await import('$/sources/ZeroG/Chain/JsonRpc/queries.ts')
const binding = bindings[Source.ZeroGChain_JsonRpc][0]

beforeEach(() => {
	for (const request of Object.values(requests))
		request.mockReset()
	jsonRpc2.mockReset()
})

it('binds both EVM block representations to the 0G chain', async () => {
	requests.getBlockByNumber.mockResolvedValue({ number: '0x2a' })
	requests.getBlockNumber.mockResolvedValue('0x2a')
	requests.getCode.mockResolvedValue('0x6000')
	requests.getTransactionByHash.mockResolvedValue({ hash: '0xtransaction' })
	requests.getTransactionReceipt.mockResolvedValue({ transactionHash: '0xtransaction' })

	await queries.getBlockByNumber(42n)
	await queries.getBlockWithTransactionsByNumber(42n)
	await queries.getBlockNumber()
	await queries.getCode({ address: '0xaddress' })
	await queries.getTransactionByHash({ txHash: '0xtransaction' })
	await queries.getTransactionReceipt({ txHash: '0xtransaction' })

	expect(evmExecutionJsonRpc).toHaveBeenCalledWith({ binding })
	expect(requests.getBlockByNumber.mock.calls).toEqual([
		[{
			blockNumber: 42n,
			txObjects: false,
		}],
		[{
			blockNumber: 42n,
			txObjects: true,
		}],
	])
	expect(requests.getBlockNumber).toHaveBeenCalledOnce()
	expect(requests.getCode).toHaveBeenCalledWith({ address: '0xaddress' })
	expect(requests.getTransactionByHash).toHaveBeenCalledWith({ txHash: '0xtransaction' })
	expect(requests.getTransactionReceipt).toHaveBeenCalledWith({ txHash: '0xtransaction' })
})

it('requests transaction count with an exact address and block tag', async () => {
	jsonRpc2.mockResolvedValueOnce('0x20000000000001')

	await expect(queries.getTransactionCount({
		address: '0x0000000000000000000000000000000000000001',
		blockTag: '0x20',
	})).resolves.toBe(0x20000000000001n)
	expect(jsonRpc2).toHaveBeenCalledWith(
		binding,
		'eth_getTransactionCount',
		[
			'0x0000000000000000000000000000000000000001',
			'0x20',
		]
	)
})

it.each([
	'42',
	'0x',
	'0xg',
	1,
])('rejects malformed transaction-count quantity %j', async (quantity) => {
	jsonRpc2.mockResolvedValueOnce(quantity)

	await expect(queries.getTransactionCount({
		address: '0x0000000000000000000000000000000000000001',
	})).rejects.toThrow('invalid eth_getTransactionCount quantity')
})

it('propagates transaction-count RPC failure without converting it to zero', async () => {
	const failure = new Error('0G RPC unavailable')
	jsonRpc2.mockRejectedValueOnce(failure)

	await expect(queries.getTransactionCount({
		address: '0x0000000000000000000000000000000000000001',
	})).rejects.toBe(failure)
})

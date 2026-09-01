import { beforeEach, expect, it, vi } from 'vitest'

import bindings from '$/sources/Hyperliquid/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'

const requests = vi.hoisted(() => ({
	getBlockByNumber: vi.fn(),
	getBlockNumber: vi.fn(),
	getTransactionByHash: vi.fn(),
	getTransactionReceipt: vi.fn(),
}))
const evmExecutionJsonRpc = vi.hoisted(() => vi.fn(() => requests))

vi.mock('$/sources/_shared/interfaces/EvmExecutionJsonRpc/queries.ts', () => ({
	evmExecutionJsonRpc,
}))

const queries = await import('$/sources/Hyperliquid/JsonRpc/queries.ts')
const binding = bindings[Source.Hyperliquid].find(
	({ apiFamily }) => apiFamily === ApiFamily.EvmExecutionJsonRpc
)

if (binding == null)
	throw new Error('Hyperliquid JSON-RPC spec missing EVM binding')

beforeEach(() => {
	for (const request of Object.values(requests))
		request.mockReset()
})

it('binds EVM operations to the Hyperliquid RPC endpoint and requests transaction objects', async () => {
	requests.getBlockByNumber.mockResolvedValue({ number: '0x2a' })
	requests.getTransactionByHash.mockResolvedValue({ hash: '0xtransaction' })
	requests.getTransactionReceipt.mockResolvedValue({ transactionHash: '0xtransaction' })

	await expect(queries.getBlockByNumber(42n)).resolves.toEqual({ number: '0x2a' })
	await queries.getTransactionByHash({ txHash: '0xtransaction' })
	await queries.getTransactionReceipt({ txHash: '0xtransaction' })
	expect(evmExecutionJsonRpc).toHaveBeenCalledWith({ binding })
	expect(requests.getBlockByNumber).toHaveBeenCalledWith({
		blockNumber: 42n,
		txObjects: true,
	})
	expect(requests.getTransactionByHash).toHaveBeenCalledWith({ txHash: '0xtransaction' })
	expect(requests.getTransactionReceipt).toHaveBeenCalledWith({ txHash: '0xtransaction' })
	expect(queries.hyperliquidJsonRpcEndpoints).toEqual([{
		url: 'https://rpc.hyperliquid.xyz/evm',
		transportType: 'Http',
		providerName: 'Hyperliquid',
	}])
})

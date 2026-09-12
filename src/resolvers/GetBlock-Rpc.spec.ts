import { createResolverContext } from '../../tests/resolverContext.ts'
import { readFileSync } from 'node:fs'
import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EvmTransactionExecutionStatus } from '$/constants/Evm.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import receiptFixture from '$/sources/GetBlock/Rpc/fixtures/transaction-receipt.json'
import {
	getTransactionByHash,
	getTransactionReceipt,
} from '$/sources/GetBlock/Rpc/queries.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://go.getblock.io/runtime-token/',
	sourceFetch,
}))

const { default: getBlockRpc } = await import('$/resolvers/GetBlock-Rpc.ts')
const transaction = readFileSync(
	new URL('../sources/GetBlock/Rpc/fixtures/transaction.json', import.meta.url),
	'utf8'
)
const receipt = JSON.stringify(receiptFixture)
const network = {
	caip2: {
		namespace: 'eip155',
		reference: '1',
	},
}
const context = createResolverContext()
describe('GetBlock RPC transaction source', () => {
	beforeEach(() => sourceFetch.mockReset())

	it('executes transaction and receipt JSON-RPC methods', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(transaction))
			.mockResolvedValueOnce(new Response(receipt))
		await expect(getTransactionByHash({ txHash: '0xaaaa' })).resolves.toMatchObject({
			hash: expect.any(String),
		})
		await expect(getTransactionReceipt({ txHash: '0xaaaa' })).resolves.toMatchObject({
			status: '0x1',
		})
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body)).toMatchObject({
			id: 1,
			method: 'eth_getTransactionByHash',
			params: ['0xaaaa'],
		})
		expect(JSON.parse(sourceFetch.mock.calls[1][2].body)).toMatchObject({
			id: 1,
			method: 'eth_getTransactionReceipt',
			params: ['0xaaaa'],
		})
	})

	it('maps the exact transaction and receipt field ownership', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(transaction))
			.mockResolvedValueOnce(new Response(receipt))
		const resolved = await getBlockRpc.resolvers[0].resolve['EvmNetworkTxHash'].resolve({
			$network: network,
			txHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		}, context)
		expect(resolved).toMatchObject({
			$block: {
				[EntityMetaKey.Selector]: {
					blockNumber: 16n,
				},
			},
			value: 100n,
			nonce: 3,
			indexInBlock: 2,
			gas: 21_000n,
			gasUsed: 21_000n,
			cumulativeGasUsed: 21_000n,
			executionStatus: EvmTransactionExecutionStatus.Success,
			$$logs: [{
				[EntityMetaKey.Selector]: {
					indexInTransaction: 0,
				},
			}],
		})
		expect(getBlockRpc.resolvers[0].projections.$$logs.resolveCount(resolved)).toBe(1)
	})

	it('preserves a pending transaction when its receipt is not available yet', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(transaction))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				jsonrpc: '2.0',
				id: 2,
				result: null,
			})))
		const resolved = await getBlockRpc.resolvers[0].resolve['EvmNetworkTxHash'].resolve({
			$network: network,
			txHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		}, context)
		expect(resolved).toMatchObject({
			executionStatus: EvmTransactionExecutionStatus.Pending,
			$$logs: [],
		})
		expect(getBlockRpc.resolvers[0].projections.$$logs.resolveCount(resolved)).toBe(0)
	})

	it('projects a mined failed receipt without treating inclusion as success', async () => {
		const failedReceipt = structuredClone(receiptFixture)
		failedReceipt.result.status = '0x0'
		sourceFetch
			.mockResolvedValueOnce(new Response(transaction))
			.mockResolvedValueOnce(new Response(JSON.stringify(failedReceipt)))

		const resolved = await getBlockRpc.resolvers[0].resolve['EvmNetworkTxHash'].resolve({
			$network: network,
			txHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		}, context)

		expect(resolved).toMatchObject({
			$block: expect.any(Object),
			executionStatus: EvmTransactionExecutionStatus.Failed,
		})
	})

	it('rejects a receipt belonging to a different transaction', async () => {
		const mismatchedReceipt = structuredClone(receiptFixture)
		mismatchedReceipt.result.transactionHash = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
		sourceFetch
			.mockResolvedValueOnce(new Response(transaction))
			.mockResolvedValueOnce(new Response(JSON.stringify(mismatchedReceipt)))

		await expect(getBlockRpc.resolvers[0].resolve['EvmNetworkTxHash'].resolve({
			$network: network,
			txHash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		}, context)).rejects.toThrow('transaction identity mismatch')
	})

	it('keeps an empty transaction distinct from transport failure', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			result: null,
		})))
		await expect(getTransactionByHash({ txHash: '0xmissing' })).resolves.toBeNull()
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body).params).toEqual(['0xmissing'])
		sourceFetch.mockResolvedValueOnce(new Response('upstream failed', { status: 503 }))
		await expect(getTransactionByHash({ txHash: '0xfailure' })).rejects.toThrow()
		expect(JSON.parse(sourceFetch.mock.calls[1][2].body).params).toEqual(['0xfailure'])
	})
})

import { afterEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Blockscout/bindings.ts'
import {
	getAddressTransactions,
	getBlockTransactions,
	getBlocks,
	getCode,
	getErc4337SmartAccountList,
	getSmartContract,
	getStats,
	getTokenTransfers,
	getTransactionByHash,
	getTransactionLogs,
	getTransactionTokenTransfers,
	getTransactions,
	getUserOperationsPage,
} from '$/sources/Blockscout/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'
import { SourceOperationGroup } from '$/sources/SourceBinding.ts'

const ethereumBlockscoutRestV2Binding = bindings[Source.Blockscout_Rest].find((binding) => (
	binding.target.key === '1'
	&& binding.operationGroups.some((operationGroup) => operationGroup === SourceOperationGroup.BlockscoutAccountAbstraction)
))

if (ethereumBlockscoutRestV2Binding == null)
	throw new Error('Blockscout REST spec missing Ethereum account-abstraction binding')

const jsonResponse = (body: unknown) => new Response(JSON.stringify(body))
const hex = (character: string, length: number): `0x${string}` => `0x${character.repeat(length)}`
const gasPrices = {
	slow: 0.12,
	average: 0.23,
	fast: 1.61,
}
const userOperation = {
	hash: '0x1234',
	status: true,
}
const transaction = {
	block_hash: hex('1', 64),
	block_number: 12,
	from: {
		hash: hex('2', 40),
	},
	gas_limit: '21000',
	hash: hex('3', 64),
	nonce: 4,
	to: {
		hash: hex('4', 40),
	},
} as const

describe('Blockscout account-abstraction queries', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('routes stats through the registered browser HTTP proxy binding', async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse({
			gas_price_updated_at: '2026-07-16T09:30:43.020427Z',
			gas_prices: gasPrices,
		}))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})
		await expect(getStats({
			chainId: 1,
		})).resolves.toMatchObject({
			gas_prices: gasPrices,
		})
		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringMatching(/^\/api-proxy\/.+\/0\/https%3A%2F%2Feth\.blockscout\.com%2Fapi%2Fv2%2Fstats$/),
			expect.objectContaining({
				signal: expect.any(AbortSignal),
			})
		)
	})

	it('softens only unavailable stats endpoints', async () => {
		const fetchMock = vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(new Response(null, { status: 404 }))
			.mockResolvedValueOnce(new Response(null, { status: 500 }))

		await expect(getStats({ chainId: 1 })).resolves.toBeNull()
		await expect(getStats({ chainId: 1 })).rejects.toThrow('500')
	})

	it('hard-fails account-abstraction smart-account and operation list HTTP errors', async () => {
		vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(new Response(JSON.stringify({ error: 'timeout' }), { status: 500 }))
			.mockResolvedValueOnce(new Response(null, { status: 501 }))
			.mockResolvedValueOnce(new Response(JSON.stringify({ error: 'timeout' }), { status: 500 }))
			.mockResolvedValueOnce(new Response(null, { status: 400 }))

		await expect(getErc4337SmartAccountList({
			chainId: 1,
			limit: 16,
		})).rejects.toThrow('500')
		await expect(getErc4337SmartAccountList({
			chainId: 1,
			limit: 16,
		})).rejects.toThrow('501')
		await expect(getUserOperationsPage({
			chainId: 1,
			limit: 16,
		})).rejects.toThrow('500')
		await expect(getUserOperationsPage({
			chainId: 1,
			limit: 16,
		})).rejects.toThrow('400')
	})

	it('routes execution methods through the shared JSON-RPC binding', async () => {
		const fetchMock = vi.fn<typeof fetch>()
			.mockResolvedValueOnce(jsonResponse({
				jsonrpc: '2.0',
				id: 1,
				result: '0x6000',
			}))
		vi.stubGlobal('fetch', fetchMock)
		vi.stubGlobal('window', {})

		await expect(getCode({
			chainId: 1,
			address: hex('A', 40),
		})).resolves.toBe('0x6000')
		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringMatching(/https%3A%2F%2Feth\.blockscout\.com%2Fapi%2Feth-rpc$/),
			expect.objectContaining({
				method: 'POST',
				body: JSON.stringify({
					jsonrpc: '2.0',
					id: 1,
					method: 'eth_getCode',
					params: [
						hex('a', 40),
						'latest',
					],
				}),
			})
		)
	})

	it('reads ABI and implementation metadata from REST v2 smart-contract detail', async () => {
		const smartContract = {
			abi: [{ type: 'fallback' }],
			implementations: [{
				address_hash: hex('B', 40),
				name: null,
			}],
		}
		const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(smartContract))
		await expect(getSmartContract({
			chainId: 1,
			address: hex('A', 40),
		})).resolves.toEqual(smartContract)
		expect(decodeURIComponent(String(fetchMock.mock.calls[0][0]))).toContain(
			`/api/v2/smart-contracts/${hex('a', 40)}`
		)
	})

	it('returns validated endpoint-native block rows', async () => {
		const block = {
			hash: '0xblock',
			height: 12,
			parent_hash: '0xparent',
			timestamp: '2026-07-16T09:30:43.020Z',
			transactions_count: 3,
		}
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			items: [block],
		}))
		await expect(getBlocks({
			chainId: 1,
			limit: 1,
		})).resolves.toEqual([block])
	})

	it('returns exact validated transaction wires from detail, network, address, and block endpoints', async () => {
		const requestedTxHash = hex('A', 64)
		const fetchMock = vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(jsonResponse(transaction))
			.mockImplementation(async () => jsonResponse({
				items: [transaction],
			}))
		await expect(getTransactionByHash({
			chainId: 1,
			txHash: requestedTxHash,
		})).resolves.toEqual(transaction)
		await expect(getTransactions({
			chainId: 1,
			limit: 1,
		})).resolves.toEqual([transaction])
		await expect(getAddressTransactions({
			chainId: 1,
			address: hex('A', 40),
			limit: 1,
		})).resolves.toEqual([transaction])
		await expect(getBlockTransactions({
			chainId: 1,
			blockNumber: 12n,
			limit: 1,
		})).resolves.toEqual([transaction])

		expect(fetchMock.mock.calls.map(([url]) => decodeURIComponent(String(url)))).toEqual([
			expect.stringContaining(`/transactions/${requestedTxHash.toLowerCase()}`),
			expect.stringContaining('/transactions?items_count=1'),
			expect.stringContaining(`/addresses/${hex('a', 40)}/transactions?items_count=1`),
			expect.stringContaining('/blocks/12/transactions?items_count=1'),
		])
	})

	it('uses the operation-specific token-transfer query signatures', async () => {
		const transfer = {
			transaction_hash: hex('1', 64),
		}
		const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => jsonResponse({
			items: [
				transfer,
				transfer,
			],
		}))

		await expect(getTokenTransfers({
			chainId: 1,
			limit: 1,
		})).resolves.toHaveLength(2)
		await expect(getTransactionTokenTransfers({
			chainId: 1,
			txHash: hex('2', 64),
			limit: 1,
		})).resolves.toHaveLength(1)
		expect(fetchMock.mock.calls.map(([url]) => decodeURIComponent(String(url)))).toEqual([
			expect.stringContaining('/token-transfers?limit=1'),
			expect.stringMatching(/\/transactions\/0x2{64}\/token-transfers$/),
		])
	})

	it('preserves exact native log rows across receipt-log pagination', async () => {
		const logs = [
			{
				address_hash: {
					hash: hex('1', 40),
				},
				block_number: 12,
				data: '0x01',
				index: 5,
				topics: [
					hex('2', 64),
					null,
				],
				transaction_hash: hex('3', 64),
			},
			{
				address_hash: hex('4', 40),
				index: 6,
			},
		]
		const fetchMock = vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(jsonResponse({
				items: [logs[0]],
				next_page_params: {
					index: 6,
				},
			}))
			.mockResolvedValueOnce(jsonResponse({
				items: [logs[1]],
			}))
		await expect(getTransactionLogs({
			chainId: 1,
			txHash: hex('A', 64),
		})).resolves.toEqual(logs)
		expect(fetchMock.mock.calls.map(([url]) => decodeURIComponent(String(url)))).toEqual([
			expect.stringContaining(`/transactions/${hex('a', 64)}/logs`),
			expect.stringContaining(`/transactions/${hex('a', 64)}/logs?index=6`),
		])
	})

	it('rejects malformed transaction identities before transport', async () => {
		const fetchMock = vi.spyOn(globalThis, 'fetch')
		await expect(getTransactionByHash({
			chainId: 1,
			txHash: 'not-a-transaction-hash',
		})).resolves.toBeNull()
		await expect(getTransactionLogs({
			chainId: 1,
			txHash: 'not-a-transaction-hash',
		})).resolves.toEqual([])
		expect(fetchMock).not.toHaveBeenCalled()
	})

	it('rejects invalid decimal transaction quantities', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			items: [{
				gas_limit: 'not-a-quantity',
			}],
		}))

		await expect(getTransactions({
			chainId: 1,
			limit: 1,
		})).rejects.toThrow()
	})

	it('returns account-abstraction rows from the documented success response', async () => {
		const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			items: [userOperation],
			next_page_params: {
				page: 2,
			},
		}))

		await expect(getUserOperationsPage({
			chainId: 1,
			limit: 3,
			transactionHash: hex('a', 64),
		})).resolves.toEqual([userOperation])
		expect(fetchMock).toHaveBeenCalledWith(
			expect.stringContaining(`transaction_hash=${hex('a', 64)}`),
			expect.any(Object)
		)
	})
})

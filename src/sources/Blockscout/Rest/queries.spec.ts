import { afterEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Blockscout/bindings.ts'
import * as blockscoutQueries from '$/sources/Blockscout/Rest/queries.ts'
import {
	getAddressCoinBalanceHistory,
	getAddressTokenBalances,
	getAddressTokens,
	getAddressTransactions,
	getBlockByNumber,
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
	address: {
		hash: hex('a', 40),
	},
	hash: hex('a', 64),
	status: true,
	transaction_hash: hex('a', 64),
}
const transaction = {
	block_hash: hex('1', 64),
	block_number: 12,
	from: {
		hash: hex('a', 40),
	},
	gas_limit: '21000',
	hash: hex('A', 64),
	nonce: 4,
	raw_input: '0x',
	to: {
		hash: hex('4', 40),
	},
	value: '0',
} as const
const tokenTransfer = {
	from: {
		hash: hex('5', 40),
	},
	log_index: 1,
	to: {
		hash: hex('6', 40),
	},
	token: {
		address_hash: hex('7', 40),
	},
	token_type: 'ERC-20',
	total: {
		decimals: '6',
		value: '1',
	},
	transaction_hash: hex('2', 64),
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

	it('omits timed-out Network registry list queries instead of soft-emptying HTTP 500', () => {
		// Live eth.blockscout.com (2026-08-04): GET …/proxy/account-abstraction/{bundlers,paymasters,factories}?page_size=1 → 500 {"error":"timeout"}
		expect(blockscoutQueries).not.toHaveProperty('getErc4337BundlerList')
		expect(blockscoutQueries).not.toHaveProperty('getErc4337PaymasterList')
		expect(blockscoutQueries).not.toHaveProperty('getErc4337AccountFactoryList')
	})

	it('hard-fails transaction token-transfer HTTP errors instead of soft-emptying 422', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify({
			errors: [{
				title: 'Invalid value',
				source: { pointer: '/items_count' },
				detail: 'Unexpected field: items_count',
			}],
		}), { status: 422 }))

		await expect(getTransactionTokenTransfers({
			chainId: 1,
			txHash: hex('2', 64),
			limit: 1,
		})).rejects.toThrow('422')
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

	it('fails closed for malformed block and transaction detail envelopes', async () => {
		vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(jsonResponse({
				height: 12,
			}))
			.mockResolvedValueOnce(jsonResponse({
				hash: hex('1', 64),
			}))

		await expect(getBlockByNumber({
			chainId: 1,
			blockNumber: 12n,
		})).rejects.toThrow('Blockscout_Rest: invalid block detail response envelope')
		await expect(getTransactionByHash({
			chainId: 1,
			txHash: hex('1', 64),
		})).rejects.toThrow('Blockscout_Rest: invalid transaction detail response envelope')
	})

	it('fails closed for malformed EIP-7702 authorization quantities on transaction detail', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			...transaction,
			authorization_list: [{
				address_hash: hex('8', 40),
				authority: hex('9', 40),
				chain_id: 1,
				nonce: 'not-a-number',
				r: '1',
				s: '2',
				v: 0,
				status: 'ok',
			}],
		}))

		await expect(getTransactionByHash({
			chainId: 1,
			txHash: transaction.hash,
		})).rejects.toThrow()
	})

	it('fails closed for malformed EIP-4844 blob quantities on transaction detail', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			...transaction,
			type: 3,
			max_fee_per_blob_gas: 'not-a-number',
			blob_gas_used: '131072',
			blob_versioned_hashes: [`0x01${'ab'.repeat(31)}`],
		}))

		await expect(getTransactionByHash({
			chainId: 1,
			txHash: transaction.hash,
		})).rejects.toThrow()
	})

	it('fails closed for malformed EIP-4844 blob quantities on block detail', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			hash: hex('1', 64),
			height: 12,
			miner: {
				hash: hex('2', 40),
			},
			parent_hash: hex('3', 64),
			timestamp: '2024-01-02T03:04:05.000Z',
			transactions_count: 1,
			blob_gas_used: 'not-a-number',
			excess_blob_gas: '0',
		}))

		await expect(getBlockByNumber({
			chainId: 1,
			blockNumber: 12n,
		})).rejects.toThrow()
	})

	it('fails closed for malformed block, transaction, and token list envelopes', async () => {
		vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(jsonResponse({
				items: [{}],
			}))
			.mockResolvedValueOnce(jsonResponse({
				items: [{}],
			}))
			.mockResolvedValueOnce(jsonResponse({
				items: [{}],
			}))

		await expect(getBlocks({
			chainId: 1,
			limit: 1,
		})).rejects.toThrow('Blockscout_Rest: invalid blocks response envelope')
		await expect(getTransactions({
			chainId: 1,
			limit: 1,
		})).rejects.toThrow('Blockscout_Rest: invalid transactions response envelope')
		await expect(getTokenTransfers({
			chainId: 1,
			limit: 1,
		})).rejects.toThrow('Blockscout_Rest: invalid token transfers response envelope')
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
		const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => jsonResponse({
			items: [
				tokenTransfer,
				{ ...tokenTransfer, log_index: 2 },
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
				transaction_hash: hex('A', 64),
			},
			{
				address_hash: hex('4', 40),
				index: 6,
				transaction_hash: hex('A', 64),
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

	it('returns all address token balances from /token-balances', async () => {
		const tokenBalance = {
			token: {
				address_hash: hex('7', 40),
				type: 'ERC-20',
				symbol: 'USDC',
				decimals: '6',
			},
			token_id: null,
			token_instance: null,
			value: '1000000',
		}
		const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse([
			tokenBalance,
		]))

		await expect(getAddressTokenBalances({
			chainId: 1,
			address: hex('a', 40),
		})).resolves.toEqual([
			tokenBalance,
		])
		expect(decodeURIComponent(String(fetchMock.mock.calls[0][0]))).toContain(
			`/api/v2/addresses/${hex('a', 40)}/token-balances`
		)
	})

	it('returns native coin balance history from /coin-balance-history', async () => {
		const historyItem = {
			block_number: 22_800_000,
			block_timestamp: '2026-01-01T00:00:00.000Z',
			delta: '100',
			transaction_hash: hex('c', 64),
			value: '1000000000000000000',
		}
		const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			items: [historyItem],
		}))

		await expect(getAddressCoinBalanceHistory({
			chainId: 1,
			address: hex('a', 40),
			limit: 5,
		})).resolves.toEqual([
			historyItem,
		])
		expect(decodeURIComponent(String(fetchMock.mock.calls[0][0]))).toContain(
			`/api/v2/addresses/${hex('a', 40)}/coin-balance-history`
		)
		expect(decodeURIComponent(String(fetchMock.mock.calls[0][0]))).toContain('items_count=5')
	})

	it('fails closed for malformed coin balance history envelopes', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			items: [{
				block_number: 1,
				value: '1',
			}],
		}))

		await expect(getAddressCoinBalanceHistory({
			chainId: 1,
			address: hex('a', 40),
			limit: 5,
		})).rejects.toThrow('Blockscout_Rest: invalid address coin balance history response envelope')
	})

	it('returns paginated address tokens with optional type filter', async () => {
		const tokenBalance = {
			token: {
				address_hash: hex('8', 40),
				type: 'ERC-721',
			},
			token_id: '1',
			token_instance: null,
			value: '1',
		}
		const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			items: [
				tokenBalance,
			],
		}))

		await expect(getAddressTokens({
			chainId: 1,
			address: hex('b', 40),
			limit: 5,
			type: 'ERC-721',
		})).resolves.toEqual([
			tokenBalance,
		])
		expect(decodeURIComponent(String(fetchMock.mock.calls[0][0]))).toMatch(
			new RegExp(`/api/v2/addresses/${hex('b', 40)}/tokens\\?.*type=ERC-721`)
		)
	})

	it('fails closed for malformed address token balance envelopes', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse([
			{
				value: '1',
			},
		]))

		await expect(getAddressTokenBalances({
			chainId: 1,
			address: hex('a', 40),
		})).rejects.toThrow('Blockscout_Rest: invalid address token balances response envelope')
	})

	it('rejects invalid address identities before token-balance transport', async () => {
		const fetchMock = vi.spyOn(globalThis, 'fetch')
		await expect(getAddressTokenBalances({
			chainId: 1,
			address: 'not-an-address' as `0x${string}`,
		})).rejects.toThrow('Blockscout address token balances: invalid address')
		expect(fetchMock).not.toHaveBeenCalled()
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

	it('forwards account-abstraction address filters on operations and accounts', async () => {
		const fetchMock = vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(jsonResponse({
				items: [userOperation],
			}))
			.mockResolvedValueOnce(jsonResponse({
				items: [{
					address: {
						hash: hex('b', 40),
					},
					total_ops: 1,
				}],
			}))

		await expect(getUserOperationsPage({
			chainId: 1,
			limit: 3,
			bundler: hex('c', 40),
		})).resolves.toEqual([userOperation])
		expect(fetchMock).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining(`bundler=${hex('c', 40)}`),
			expect.any(Object)
		)

		await expect(getErc4337SmartAccountList({
			chainId: 1,
			limit: 3,
			factory: hex('d', 40),
		})).resolves.toEqual([{
			address: {
				hash: hex('b', 40),
			},
			total_ops: 1,
		}])
		expect(fetchMock).toHaveBeenNthCalledWith(
			2,
			expect.stringContaining(`factory=${hex('d', 40)}`),
			expect.any(Object)
		)
	})

	it('rejects address transactions that do not involve the requested address', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			items: [{
				...transaction,
				from: { hash: hex('b', 40) },
				to: { hash: hex('c', 40) },
			}],
		}))

		await expect(getAddressTransactions({
			chainId: 1,
			address: hex('A', 40),
			limit: 1,
		})).rejects.toThrow('does not match the requested address')
	})

	it('rejects duplicate transaction identities in block and network lists', async () => {
		const fetchMock = vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(jsonResponse({
				items: [transaction, transaction],
			}))
			.mockResolvedValueOnce(jsonResponse({
				items: [transaction, transaction],
			}))

		await expect(getBlockTransactions({
			chainId: 1,
			blockNumber: 12n,
			limit: 2,
		})).rejects.toThrow('duplicate identities')
		await expect(getTransactions({
			chainId: 1,
			limit: 2,
		})).rejects.toThrow('duplicate identities')
		expect(fetchMock).toHaveBeenCalledTimes(2)
	})

	it('rejects transaction logs with a stale or duplicate cursor', async () => {
		const logs = [
			{
				address_hash: hex('4', 40),
				index: 5,
				transaction_hash: hex('A', 64),
			},
		]
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			items: [logs[0]],
			next_page_params: {
				index: 5,
			},
		}))

		await expect(getTransactionLogs({
			chainId: 1,
			txHash: hex('A', 64),
		})).rejects.toThrow('cursor did not progress')
	})

	it('rejects user operations whose transaction hash does not match the filter', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({
			items: [userOperation],
		}))

		await expect(getUserOperationsPage({
			chainId: 1,
			limit: 1,
			transactionHash: hex('b', 64),
		})).rejects.toThrow('does not match the requested transaction hash')
	})
})

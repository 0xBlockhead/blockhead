import { beforeEach, describe, expect, it, vi } from 'vitest'
import bindings from '$/sources/Etherscan/bindings.ts'
import { Source } from '$/sources/Source.ts'

const etherscanV2GetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Etherscan/Rest/client.ts', async (importOriginal) => {
	const original = await importOriginal<typeof import('$/sources/Etherscan/Rest/client.ts')>()
	return {
		...original,
		etherscanV2GetJson,
		etherscanV2GetProxyResult: async (request: Parameters<typeof etherscanV2GetJson>[0]) => (
			original.etherscanV2UnwrapProxyResult(await etherscanV2GetJson(request))
		),
		etherscanV2UnwrapAccountResultArray: original.etherscanV2UnwrapAccountResultArray,
	}
})

const {
	etherscanQueries,
	supportsChainId,
} = await import('$/sources/Etherscan/Rest/queries.ts')
const {
	getGasOracle,
	getInternalTransactionsByTxHash,
	getTokenTransfersByAddress,
	getTokenTransfersByTransaction,
	getTransactionByHash,
	getTransactionReceipt,
} = etherscanQueries

const {
	etherscanV2UnwrapAccountResultArray,
	etherscanV2UnwrapProxyResult,
} = await import('$/sources/Etherscan/Rest/client.ts')

const publicEnv = {}
const uppercaseTxHash = `0x${'A'.repeat(64)}`
const normalizedTxHash = uppercaseTxHash.toLowerCase()
const transferTopic0 = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
const fromTopic = `0x${'0'.repeat(24)}${'11'.repeat(20)}`
const toTopic = `0x${'0'.repeat(24)}${'22'.repeat(20)}`

describe('Etherscan fail-closed envelopes', () => {
	it('unwraps successful account lists and known empty status-0 messages', () => {
		expect(etherscanV2UnwrapAccountResultArray({
			status: '1',
			message: 'OK',
			result: [{ hash: normalizedTxHash }],
		})).toEqual([{ hash: normalizedTxHash }])
		expect(etherscanV2UnwrapAccountResultArray({
			status: '0',
			message: 'No transactions found',
			result: 'No transactions found',
		})).toEqual([])
		expect(etherscanV2UnwrapAccountResultArray({
			status: '0',
			message: 'No records found',
			result: 'No records found',
		})).toEqual([])
	})

	it('throws on account list hard failures instead of soft-null', () => {
		expect(() => etherscanV2UnwrapAccountResultArray({
			status: '0',
			message: 'NOTOK',
			result: 'Max rate limit reached',
		})).toThrow('Etherscan_Rest: account list failed: Max rate limit reached')
		expect(() => etherscanV2UnwrapAccountResultArray(null)).toThrow('account list response missing envelope')
	})

	it('throws on proxy NOTOK / JSON-RPC error; keeps null result as absence', () => {
		expect(etherscanV2UnwrapProxyResult({
			jsonrpc: '2.0',
			id: 1,
			result: null,
		})).toBeNull()
		expect(() => etherscanV2UnwrapProxyResult({
			status: '0',
			message: 'NOTOK',
			result: 'Free API access is not supported for this chain',
		})).toThrow('Etherscan_Rest: proxy NOTOK')
		expect(() => etherscanV2UnwrapProxyResult({
			error: {
				code: -32000,
				message: 'execution reverted',
			},
		})).toThrow('Etherscan_Rest: proxy error -32000: execution reverted')
	})
})

describe('Etherscan transaction hash query boundaries', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('rejects invalid schema strings before transport', async () => {
		await expect(getTransactionByHash({
			publicEnv,
			chainId: 1,
			txHash: 'invalid',
		})).rejects.toThrow('Etherscan_Rest: invalid tx hash')
		await expect(getTransactionReceipt({
			publicEnv,
			chainId: 1,
			txHash: 'invalid',
		})).rejects.toThrow('Etherscan_Rest: invalid tx hash')
		await expect(getTokenTransfersByTransaction({
			publicEnv,
			chainId: 1,
			txHash: 'invalid',
			offset: 1,
		})).rejects.toThrow('Etherscan_Rest: invalid tx hash')
		await expect(getInternalTransactionsByTxHash({
			publicEnv,
			chainId: 1,
			txHash: 'invalid',
		})).rejects.toThrow('Etherscan_Rest: invalid tx hash')

		expect(etherscanV2GetJson).not.toHaveBeenCalled()
	})

	it('normalizes valid transaction hashes before every transport', async () => {
		etherscanV2GetJson.mockImplementation(async ({ query }) => (
			query.action === 'txlistinternal' ?
				{
					status: '1',
					message: 'OK',
					result: [],
				}
			: query.action === 'eth_getTransactionByHash' ?
				{
					result: {
						from: null,
						to: null,
					},
				}
			: query.action === 'eth_getTransactionReceipt' ?
				{
					result: {
						logs: [],
					},
				}
			:
				{ result: {} }
		))

		await getTransactionByHash({
			publicEnv,
			chainId: 1,
			txHash: uppercaseTxHash,
		})
		await getTransactionReceipt({
			publicEnv,
			chainId: 1,
			txHash: uppercaseTxHash,
		})
		await getTokenTransfersByTransaction({
			publicEnv,
			chainId: 1,
			txHash: uppercaseTxHash,
			offset: 1,
		})
		await getInternalTransactionsByTxHash({
			publicEnv,
			chainId: 1,
			txHash: uppercaseTxHash,
		})

		expect(etherscanV2GetJson.mock.calls.map(([
			{ query },
		]) => query.txhash)).toEqual([
			normalizedTxHash,
			normalizedTxHash,
			normalizedTxHash,
			normalizedTxHash,
		])
	})

	it('rejects substituted transaction and receipt subjects', async () => {
		etherscanV2GetJson.mockResolvedValueOnce({
			result: {
				hash: `0x${'b'.repeat(64)}`,
			},
		})

		await expect(getTransactionByHash({
			publicEnv,
			chainId: 1,
			txHash: normalizedTxHash,
		})).rejects.toThrow('transaction subject mismatch')

		etherscanV2GetJson.mockResolvedValueOnce({
			result: {
				transactionHash: `0x${'b'.repeat(64)}`,
			},
		})

		await expect(getTransactionReceipt({
			publicEnv,
			chainId: 1,
			txHash: normalizedTxHash,
		})).rejects.toThrow('transaction receipt subject mismatch')
	})

	it('derives token transfers from receipt Transfer logs for one tx', async () => {
		etherscanV2GetJson.mockResolvedValue({
			result: {
				logs: [{
					address: '0x3333333333333333333333333333333333333333',
					topics: [
						transferTopic0,
						fromTopic,
						toTopic,
					],
					data: `0x${'0'.repeat(63)}1`,
					logIndex: '0x7',
					transactionHash: normalizedTxHash,
				}],
			},
		})

		await expect(getTokenTransfersByTransaction({
			publicEnv,
			chainId: 1,
			txHash: uppercaseTxHash,
		})).resolves.toEqual([{
			standard: 'erc20',
			row: {
				hash: normalizedTxHash,
				logIndex: '0x7',
				contractAddress: '0x3333333333333333333333333333333333333333',
				from: '0x1111111111111111111111111111111111111111',
				to: '0x2222222222222222222222222222222222222222',
				value: '1',
			},
		}])
		expect(etherscanV2GetJson).toHaveBeenCalledWith(expect.objectContaining({
			query: expect.objectContaining({
				action: 'eth_getTransactionReceipt',
				txhash: normalizedTxHash,
			}),
		}))
	})

	it('requests account activity newest-first', async () => {
		etherscanV2GetJson.mockResolvedValue({
			status: '1',
			message: 'OK',
			result: [],
		})
		await getTokenTransfersByAddress({
			publicEnv,
			chainId: 1,
			address: '0x1111111111111111111111111111111111111111',
			offset: 10,
		})
		expect(etherscanV2GetJson.mock.calls.every(([{
			query,
		}]) => query.sort === 'desc')).toBe(true)
	})

	it('throws when gasoracle status is not OK', async () => {
		etherscanV2GetJson.mockResolvedValue({
			status: '0',
			message: 'NOTOK',
			result: 'Max rate limit reached',
		})
		await expect(getGasOracle({
			publicEnv,
			chainId: 1,
		})).rejects.toThrow('Etherscan_Rest: gasoracle failed: Max rate limit reached')
	})

	it('accepts official V2 chainlist members and rejects unknowns', () => {
		expect(supportsChainId(56)).toBe(true)
		expect(supportsChainId(11155420)).toBe(true)
		expect(supportsChainId(534352)).toBe(false)
	})
})

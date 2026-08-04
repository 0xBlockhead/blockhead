import { beforeEach, describe, expect, it, vi } from 'vitest'

const etherscanV2GetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Etherscan/Rest/client.ts', () => ({
	etherscanV2GetJson,
	etherscanV2GetProxyResult: async (request: Parameters<typeof etherscanV2GetJson>[0]) => (
		(await etherscanV2GetJson(request))?.result ?? null
	),
	etherscanV2UnwrapAccountResultArray: (
		wire: { result?: unknown[] } | null
	) => wire?.result ?? null,
}))

const {
	getInternalTransactionsByTxHash,
	getTokenTransfersByAddress,
	getTokenTransfersByTransaction,
	getTransactionByHash,
	getTransactionReceipt,
	supportsChainId,
} = await import('$/sources/Etherscan/Rest/queries.ts')

const publicEnv = {}
const uppercaseTxHash = `0x${'A'.repeat(64)}`
const normalizedTxHash = uppercaseTxHash.toLowerCase()
const transferTopic0 = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
const fromTopic = `0x${'0'.repeat(24)}${'11'.repeat(20)}`
const toTopic = `0x${'0'.repeat(24)}${'22'.repeat(20)}`

describe('Etherscan transaction hash query boundaries', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('rejects invalid schema strings before transport', async () => {
		await expect(getTransactionByHash({
			publicEnv,
			chainId: 1,
			txHash: 'invalid',
		})).resolves.toBeNull()
		await expect(getTransactionReceipt({
			publicEnv,
			chainId: 1,
			txHash: 'invalid',
		})).resolves.toBeNull()
		await expect(getTokenTransfersByTransaction({
			publicEnv,
			chainId: 1,
			txHash: 'invalid',
			offset: 1,
		})).resolves.toBeNull()
		await expect(getInternalTransactionsByTxHash({
			publicEnv,
			chainId: 1,
			txHash: 'invalid',
		})).resolves.toBeNull()

		expect(etherscanV2GetJson).not.toHaveBeenCalled()
	})

	it('normalizes valid transaction hashes before every transport', async () => {
		etherscanV2GetJson.mockImplementation(async ({ query }) => (
			query.action === 'txlistinternal' ?
				{
					status: '1',
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

	it('accepts official V2 chainlist members and rejects unknowns', () => {
		expect(supportsChainId(56)).toBe(true)
		expect(supportsChainId(11155420)).toBe(true)
		expect(supportsChainId(534352)).toBe(false)
	})
})

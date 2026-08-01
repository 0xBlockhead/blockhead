import { beforeEach, describe, expect, it, vi } from 'vitest'

const etherscanV2GetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Etherscan/Rest/client.ts', () => ({
	etherscanV2GetJson,
	etherscanV2UnwrapAccountResultArray: (
		wire: { result?: unknown[] } | null
	) => wire?.result ?? null,
	etherscanV2UnwrapProxyResult: (
		wire: { result?: unknown } | null
	) => wire?.result ?? null,
}))

const {
	getInternalTransactionsByTxHash,
	getTokenTransfersByTransaction,
	getTransactionByHash,
	getTransactionReceipt,
} = await import('$/sources/Etherscan/Rest/queries.ts')

const publicEnv = {}
const uppercaseTxHash = `0x${'A'.repeat(64)}`
const normalizedTxHash = uppercaseTxHash.toLowerCase()

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
})

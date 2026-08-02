import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/TonApi/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type { TonApiAccountTransactionWire } from '$/sources/TonApi/Rest/types.ts'

const { getJson } = vi.hoisted(() => ({
	getJson: vi.fn(),
}))

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceGetJson: getJson,
}))

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	httpUrl: (_binding: unknown, path: string) => path,
}))

const { getBlockchainAccountTransactions } = await import('$/sources/TonApi/Rest/queries.ts')

const binding = bindings[Source.TonApi_Rest][0]

const accountId = '0:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
const transaction = {
	hash: 'D43981844B5FB58FFAB8A78EF19B5B4C3B1D2B4201B57A7A5FDFDB425BA81C9E',
	lt: 34_758_440_000_003,
	account: {
		address: accountId,
		is_scam: false,
		is_wallet: true,
	},
	success: false,
	utime: 1_674_646_605,
	total_fees: 333_328,
	end_balance: 0,
	transaction_type: 'TransOrd',
	block: '(0,8000000000000000,32400585)',
	aborted: true,
	destroyed: false,
} satisfies TonApiAccountTransactionWire

describe('TonAPI raw account transaction transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('preserves raw subject identity, lossless units, descending order, and logical-time continuation', async () => {
		getJson.mockResolvedValueOnce({
			transactions: [
				transaction,
				{
					...transaction,
					hash: 'a'.repeat(64),
					lt: transaction.lt - 2,
					total_fees: 9_007_199_254_740_991,
					end_balance: 9_007_199_254_740_990,
				},
			],
		})

		await expect(getBlockchainAccountTransactions(
			{
				accountId,
				limit: 2,
				beforeLt: BigInt(transaction.lt + 1),
			}
		)).resolves.toEqual({
			transactions: [
				{
					hash: transaction.hash.toLowerCase(),
					lt: BigInt(transaction.lt),
					accountAddress: accountId,
					success: false,
					utime: transaction.utime,
					totalFeesNano: 333_328n,
					endBalanceNano: 0n,
					transactionType: 'TransOrd',
					block: transaction.block,
					aborted: true,
					destroyed: false,
				},
				{
					hash: 'a'.repeat(64),
					lt: BigInt(transaction.lt - 2),
					accountAddress: accountId,
					success: false,
					utime: transaction.utime,
					totalFeesNano: 9_007_199_254_740_991n,
					endBalanceNano: 9_007_199_254_740_990n,
					transactionType: 'TransOrd',
					block: transaction.block,
					aborted: true,
					destroyed: false,
				},
			],
			nextBeforeLt: BigInt(transaction.lt - 2),
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			`/v2/blockchain/accounts/${encodeURIComponent(accountId)}/transactions?limit=2&sort_order=desc&before_lt=${transaction.lt + 1}`
		)
	})

	it('terminates partial and zero-limit pages without inventing a cursor', async () => {
		getJson.mockResolvedValueOnce({
			transactions: [transaction],
		})

		await expect(getBlockchainAccountTransactions({
			accountId,
			limit: 2,
		})).resolves.toMatchObject({
			transactions: [{
				lt: BigInt(transaction.lt),
			}],
		})
		await expect(getBlockchainAccountTransactions({
			accountId,
			limit: 0,
		})).resolves.toEqual({
			transactions: [],
		})
		expect(getJson).toHaveBeenCalledTimes(1)
	})

	it('rejects foreign subjects, unsafe numbers, duplicates, and non-descending pages', async () => {
		getJson.mockResolvedValueOnce({
			transactions: [{
				...transaction,
				account: {
					...transaction.account,
					address: `0:${'f'.repeat(64)}`,
				},
			}],
		})
		await expect(getBlockchainAccountTransactions({
			accountId,
			limit: 2,
		})).rejects.toThrow('foreign account row')

		getJson.mockResolvedValueOnce({
			transactions: [{
				...transaction,
				lt: Number.MAX_SAFE_INTEGER + 1,
			}],
		})
		await expect(getBlockchainAccountTransactions({
			accountId,
			limit: 2,
		})).rejects.toThrow('lossless JSON bounds')

		getJson.mockResolvedValueOnce({
			transactions: [
				transaction,
				{
					...transaction,
					hash: transaction.hash.toLowerCase(),
					lt: transaction.lt - 1,
				},
			],
		})
		await expect(getBlockchainAccountTransactions({
			accountId,
			limit: 2,
		})).rejects.toThrow('duplicate hash')

		getJson.mockResolvedValueOnce({
			transactions: [
				transaction,
				{
					...transaction,
					hash: 'b'.repeat(64),
					lt: transaction.lt + 1,
				},
			],
		})
		await expect(getBlockchainAccountTransactions({
			accountId,
			limit: 2,
		})).rejects.toThrow('not strictly newest-first')
	})

	it('enforces raw identity and bounds before transport', async () => {
		await expect(getBlockchainAccountTransactions({
			accountId: 'EQ/a+b',
			limit: 1,
		})).rejects.toThrow('malformed raw account address')
		await expect(getBlockchainAccountTransactions({
			accountId,
			limit: 1_001,
		})).rejects.toThrow('0 through 1000')
		await expect(getBlockchainAccountTransactions({
			accountId,
			limit: 1,
			beforeLt: -1n,
		})).rejects.toThrow('non-negative')
		expect(getJson).not.toHaveBeenCalled()
	})
})

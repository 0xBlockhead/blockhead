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

const {
	getAccount,
	getBlockchainAccountTransaction,
	getBlockchainAccountTransactions,
	getBlockchainRawAccount,
} = await import('$/sources/TonApi/Rest/queries.ts')

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

	it('resolves one exact logical-time and hash identity', async () => {
		getJson.mockResolvedValueOnce({
			transactions: [transaction],
		})

		await expect(getBlockchainAccountTransaction({
			accountId,
			lt: BigInt(transaction.lt),
			hash: transaction.hash.toLowerCase(),
		})).resolves.toMatchObject({
			hash: transaction.hash.toLowerCase(),
			lt: BigInt(transaction.lt),
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
			`/v2/blockchain/accounts/${encodeURIComponent(accountId)}/transactions?limit=1&sort_order=desc&before_lt=${transaction.lt + 1}`
		)
	})

	it('rejects absent, mismatched, and malformed exact transaction identities', async () => {
		getJson.mockResolvedValueOnce({
			transactions: [{
				...transaction,
				lt: transaction.lt - 1,
			}],
		})
		await expect(getBlockchainAccountTransaction({
			accountId,
			lt: BigInt(transaction.lt),
		})).rejects.toThrow('transaction not found')

		getJson.mockResolvedValueOnce({
			transactions: [transaction],
		})
		await expect(getBlockchainAccountTransaction({
			accountId,
			lt: BigInt(transaction.lt),
			hash: 'a'.repeat(64),
		})).rejects.toThrow('transaction hash mismatch')

		await expect(getBlockchainAccountTransaction({
			accountId,
			lt: -1n,
		})).rejects.toThrow('logical time must be non-negative')
		await expect(getBlockchainAccountTransaction({
			accountId,
			lt: BigInt(transaction.lt),
			hash: 'not-a-hash',
		})).rejects.toThrow('malformed transaction hash')
		expect(getJson).toHaveBeenCalledTimes(2)
	})
})

describe('TonAPI blockchain raw account transport leftovers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('accepts enrolled leftover clocks/hashes and fail-closes unsafe integers', async () => {
		getJson.mockResolvedValueOnce({
			address: accountId,
			balance: 1,
			status: 'active',
			last_transaction_lt: 2,
			last_transaction_hash: 'ab'.repeat(32),
			storage: {
				used_cells: 0,
				used_bits: 0,
				used_public_cells: 0,
				last_paid: 0,
				due_payment: 0,
			},
		})
		await expect(getBlockchainRawAccount(accountId)).resolves.toMatchObject({
			last_transaction_lt: 2,
			last_transaction_hash: 'ab'.repeat(32),
		})

		getJson.mockResolvedValueOnce({
			address: accountId,
			balance: Number.MAX_SAFE_INTEGER + 1,
			status: 'active',
			last_transaction_lt: 2,
			storage: {
				used_cells: 0,
				used_bits: 0,
				used_public_cells: 0,
				last_paid: 0,
				due_payment: 0,
			},
		})
		await expect(getBlockchainRawAccount(accountId)).rejects.toThrow()
	})

	it('rejects malformed account identity and unsafe account clocks before resolver projection', async () => {
		getJson
			.mockResolvedValueOnce({
				address: '0:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
				balance: '1',
				last_activity: 1,
				status: 'active',
				interfaces: [],
				get_methods: [],
				is_wallet: false,
			})
			.mockResolvedValueOnce({
				address: accountId,
				balance: '1',
				last_activity: Number.MAX_SAFE_INTEGER,
				status: 'active',
				interfaces: [],
				get_methods: [],
				is_wallet: false,
			})
			.mockResolvedValueOnce({
				address: accountId,
				balance: 1,
				status: 'active',
				last_transaction_lt: 2,
				storage: {
					used_cells: Number.MAX_SAFE_INTEGER + 1,
					used_bits: 0,
					used_public_cells: 0,
					last_paid: 0,
					due_payment: 0,
				},
			})

		await expect(getAccount(accountId)).rejects.toThrow('account response identity mismatch')
		await expect(getAccount(accountId)).rejects.toThrow('activity clock exceeds safe millisecond bounds')
		await expect(getBlockchainRawAccount(accountId)).rejects.toThrow('raw account numeric field exceeds lossless JSON bounds')
	})
})

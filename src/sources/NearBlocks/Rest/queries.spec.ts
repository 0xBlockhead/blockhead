import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/NearBlocks/bindings.ts'
import type {
	NearBlocksV3AccountBalance,
	NearBlocksV3Response,
	NearBlocksV3Transaction,
} from '$/sources/NearBlocks/Rest/types.ts'

const { getNearBlocksRestJson } = vi.hoisted(() => ({
	getNearBlocksRestJson: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson: getNearBlocksRestJson,
}))

const {
	getAccountBalance,
	getAccountTransactions,
} = await import('$/sources/NearBlocks/Rest/queries.ts')

const binding = bindings[Source.NearBlocks_Rest]

const transaction = {
	actions: [{
		action: 'TRANSFER',
	}],
	actions_agg: {
		deposit: '42',
		gas_attached: '30000000000000',
	},
	block: {
		block_hash: 'block-hash',
		block_height: '208137439',
		block_timestamp: '1784777079149554306',
	},
	block_timestamp: '1784777079149554306',
	index_in_chunk: 0,
	outcomes: {
		status: true,
		status_key: 'SUCCESS_VALUE',
	},
	outcomes_agg: {
		gas_used: '1900000000000',
		transaction_fee: '7442984711078700000000',
	},
	receipt_conversion_gas_burnt: '1000000000',
	receipt_conversion_tokens_burnt: '20000000000000000000',
	receiver_account_id: 'alice.near',
	shard_id: 4,
	signer_account_id: 'bob.near',
	transaction_hash: 'transaction-hash',
} satisfies NearBlocksV3Transaction

describe('NearBlocks v3 account portfolio transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads an exact canonical-mainnet account balance', async () => {
		const balance = {
			account_id: 'alice.near',
			amount: '100',
			amount_staked: '20',
			storage_usage: '30',
		} satisfies NearBlocksV3AccountBalance
		getNearBlocksRestJson.mockResolvedValueOnce({
			data: balance,
		} satisfies NearBlocksV3Response<NearBlocksV3AccountBalance>)

		await expect(getAccountBalance('alice.near')).resolves.toEqual(balance)
		expect(getNearBlocksRestJson).toHaveBeenCalledWith(
			binding,
			'/v3/accounts/alice.near/balance'
		)
	})

	it('walks opaque bounded account transaction cursors', async () => {
		getNearBlocksRestJson.mockResolvedValueOnce({
			data: [transaction],
			meta: {
				next_page: 'opaque-next',
			},
		} satisfies NearBlocksV3Response<NearBlocksV3Transaction[]>)

		await expect(getAccountTransactions({
			accountId: 'alice.near',
			limit: 25,
			next: 'opaque+/=current',
		})).resolves.toEqual({
			transactions: [transaction],
			continuationToken: 'opaque-next',
		})
		expect(getNearBlocksRestJson).toHaveBeenCalledWith(
			binding,
			'/v3/accounts/alice.near/txns?limit=25&next=opaque%2B%2F%3Dcurrent'
		)
	})

	it('fails closed on foreign, duplicate, oversized, and non-progress pages', async () => {
		getNearBlocksRestJson.mockResolvedValueOnce({
			data: [{
				...transaction,
				receiver_account_id: 'carol.near',
			}],
		})
		await expect(getAccountTransactions({
			accountId: 'alice.near',
			limit: 25,
		})).rejects.toThrow('foreign account row')

		getNearBlocksRestJson.mockResolvedValueOnce({
			data: [
				transaction,
				transaction,
			],
		})
		await expect(getAccountTransactions({
			accountId: 'alice.near',
			limit: 25,
		})).rejects.toThrow('invalid or duplicate hash')

		getNearBlocksRestJson.mockResolvedValueOnce({
			data: [
				transaction,
				{
					...transaction,
					transaction_hash: 'second-transaction-hash',
				},
			],
		})
		await expect(getAccountTransactions({
			accountId: 'alice.near',
			limit: 1,
		})).rejects.toThrow('exceeds requested limit')

		getNearBlocksRestJson.mockResolvedValueOnce({
			data: [transaction],
			meta: {
				next_page: 'same',
			},
		})
		await expect(getAccountTransactions({
			accountId: 'alice.near',
			limit: 25,
			next: 'same',
		})).rejects.toThrow('did not advance')
	})

	it('preserves newest-first order and rejects malformed lossless transaction context', async () => {
		getNearBlocksRestJson.mockResolvedValueOnce({
			data: [
				transaction,
				{
					...transaction,
					block: {
						...transaction.block,
						block_timestamp: '1784777079149554307',
					},
					block_timestamp: '1784777079149554307',
					transaction_hash: 'newer-second-transaction',
				},
			],
		})
		await expect(getAccountTransactions({
			accountId: 'alice.near',
			limit: 25,
		})).rejects.toThrow('not newest-first')

		for (const malformedTransaction of [
			{
				...transaction,
				index_in_chunk: -1,
			},
			{
				...transaction,
				block_timestamp: '1',
			},
			{
				...transaction,
				receipt_conversion_tokens_burnt: '-1',
			},
		]) {
			getNearBlocksRestJson.mockResolvedValueOnce({
				data: [malformedTransaction],
			})
			await expect(getAccountTransactions({
				accountId: 'alice.near',
				limit: 25,
			})).rejects.toThrow(/malformed identity|does not match|invalid receipt conversion/)
		}
	})

	it('rejects invalid requests and malformed balances without transport ambiguity', async () => {
		await expect(getAccountTransactions({
			accountId: 'alice.near',
			limit: 0,
		})).resolves.toEqual({
			transactions: [],
			continuationToken: undefined,
		})
		await expect(getAccountTransactions({
			accountId: 'alice.near',
			limit: 101,
		})).rejects.toThrow('integer from 0 through 100')
		await expect(getAccountTransactions({
			accountId: 'alice.near',
			limit: 25,
			next: '',
		})).rejects.toThrow('must not be empty')
		expect(getNearBlocksRestJson).not.toHaveBeenCalled()

		getNearBlocksRestJson.mockResolvedValueOnce({
			data: {
				account_id: 'foreign.near',
				amount: '100',
				amount_staked: '20',
				storage_usage: '30',
			},
		})
		await expect(getAccountBalance('alice.near')).rejects.toThrow(
			'identity does not match'
		)

		getNearBlocksRestJson.mockResolvedValueOnce({
			data: {
				account_id: 'alice.near',
				amount: '-1',
				amount_staked: '20',
				storage_usage: '30',
			},
		})
		await expect(getAccountBalance('alice.near')).rejects.toThrow(
			'invalid account amount'
		)
	})
})

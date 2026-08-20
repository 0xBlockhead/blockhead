import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/NearBlocks/bindings.ts'
import type {
	NearBlocksAccount,
	NearBlocksAccountResponse,
	NearBlocksBlock,
	NearBlocksBlockResponse,
	NearBlocksTransaction,
	NearBlocksTransactionResponse,
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
	getAccount,
	getAccountBalance,
	getAccountTransactions,
	getBlock,
	getTransaction,
	listBlocks,
} = await import('$/sources/NearBlocks/Rest/queries.ts')

const binding = bindings[Source.NearBlocks_Rest][0]

const account = {
	account_id: 'alice.near',
	amount: '100',
	block_hash: 'account-block-hash',
	block_height: '208137439',
	locked: '0',
	storage_usage: 182,
} satisfies NearBlocksAccount

const block = {
	block_hash: 'block-hash',
	block_height: '208137439',
	block_timestamp: '1784777079149554306',
	prev_block_hash: 'prev-block-hash',
	epoch_id: 'epoch-id',
} satisfies NearBlocksBlock

const blockWithoutEpoch = {
	block_hash: 'block-hash',
	block_height: '208137439',
	block_timestamp: '1784777079149554306',
	prev_block_hash: 'prev-block-hash',
} satisfies NearBlocksBlock

const transaction = {
	actions: [{
		action: 'FUNCTION_CALL',
		method: 'ft_transfer',
	}],
	actions_agg: {
		deposit: '0',
		gas_attached: '30000000000000',
	},
	block: {
		block_height: '208137439',
	},
	block_timestamp: '1784777079149554306',
	included_in_block_hash: 'included-block-hash',
	outcomes: {
		status: true,
	},
	outcomes_agg: {
		gas_used: '1900000000000',
		transaction_fee: '7442984711078700000000',
	},
	receiver_account_id: 'alice.near',
	signer_account_id: 'bob.near',
	transaction_hash: 'transaction-hash',
} satisfies NearBlocksTransaction

const v3Transaction = {
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

describe('NearBlocks v1 entity transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads a canonical account and rejects identity or amount drift', async () => {
		getNearBlocksRestJson.mockResolvedValueOnce({
			account: [account],
		} satisfies NearBlocksAccountResponse)

		await expect(getAccount({
			accountId: 'alice.near',
		})).resolves.toEqual(account)
		expect(getNearBlocksRestJson).toHaveBeenCalledWith(
			binding,
			'/v1/account/alice.near'
		)

		getNearBlocksRestJson.mockResolvedValueOnce({
			account: [{
				...account,
				account_id: 'foreign.near',
			}],
		})
		await expect(getAccount({
			accountId: 'alice.near',
		})).rejects.toThrow('identity does not match')

		getNearBlocksRestJson.mockResolvedValueOnce({
			account: [{
				...account,
				amount: '-1',
			}],
		})
		await expect(getAccount({
			accountId: 'alice.near',
		})).rejects.toThrow('invalid account response envelope')

		getNearBlocksRestJson.mockResolvedValueOnce({
			account: [],
		})
		await expect(getAccount({
			accountId: 'alice.near',
		})).rejects.toThrow('not found')
	})

	it('loads blocks by height or hash and rejects selector mismatches', async () => {
		getNearBlocksRestJson.mockResolvedValueOnce({
			blocks: [blockWithoutEpoch],
		} satisfies NearBlocksBlockResponse)

		await expect(getBlock({
			block: 208137439n,
		})).resolves.toEqual(blockWithoutEpoch)
		expect(getNearBlocksRestJson).toHaveBeenCalledWith(
			binding,
			'/v1/blocks/208137439'
		)

		getNearBlocksRestJson.mockResolvedValueOnce({
			blocks: [block],
		})
		await expect(getBlock({
			block: 'block-hash',
		})).resolves.toEqual(block)

		getNearBlocksRestJson.mockResolvedValueOnce({
			blocks: [{
				...blockWithoutEpoch,
				block_height: '1',
			}],
		})
		await expect(getBlock({
			block: 208137439n,
		})).rejects.toThrow('height does not match')

		getNearBlocksRestJson.mockResolvedValueOnce({
			blocks: [{
				...blockWithoutEpoch,
				block_hash: 'other-hash',
			}],
		})
		await expect(getBlock({
			block: 'block-hash',
		})).rejects.toThrow('hash does not match')

		getNearBlocksRestJson.mockResolvedValueOnce({
			blocks: [{
				...blockWithoutEpoch,
				prev_block_hash: '',
			}],
		})
		await expect(getBlock({
			block: 208137439n,
		})).rejects.toThrow('invalid block response envelope')

		getNearBlocksRestJson.mockResolvedValueOnce({
			blocks: [{
				block_hash: 'block-hash',
				block_height: '208137439',
				block_timestamp: '1784777079149554306',
			}],
		})
		await expect(getBlock({
			block: 208137439n,
		})).rejects.toThrow('previous block hash missing')
	})

	it('lists newest-first tip blocks and fails closed on envelope drift', async () => {
		getNearBlocksRestJson.mockResolvedValueOnce({
			blocks: [
				{
					block_hash: 'newer-hash',
					block_height: '208137440',
					block_timestamp: '1784777079149554307',
				},
				{
					block_hash: 'older-hash',
					block_height: '208137439',
					block_timestamp: '1784777079149554306',
				},
			],
		} satisfies NearBlocksBlockResponse)

		await expect(listBlocks({
			limit: 2,
		})).resolves.toHaveLength(2)
		expect(getNearBlocksRestJson).toHaveBeenCalledWith(
			binding,
			'/v1/blocks?per_page=2'
		)

		getNearBlocksRestJson.mockResolvedValueOnce({
			blocks: [
				{
					block_hash: 'older-hash',
					block_height: '208137439',
					block_timestamp: '1784777079149554306',
				},
				{
					block_hash: 'newer-hash',
					block_height: '208137440',
					block_timestamp: '1784777079149554307',
				},
			],
		})
		await expect(listBlocks({
			limit: 2,
		})).rejects.toThrow('not newest-first')

		getNearBlocksRestJson.mockResolvedValueOnce({
			blocks: 'nope',
		})
		await expect(listBlocks({
			limit: 1,
		})).rejects.toThrow('invalid blocks response envelope')

		await expect(listBlocks({
			limit: 0,
		})).resolves.toEqual([])
		expect(getNearBlocksRestJson).toHaveBeenCalledTimes(3)
	})

	it('loads transactions and rejects missing actions or hash drift', async () => {
		getNearBlocksRestJson.mockResolvedValueOnce({
			txns: [transaction],
		} satisfies NearBlocksTransactionResponse)

		await expect(getTransaction({
			transactionHash: 'transaction-hash',
		})).resolves.toEqual(transaction)
		expect(getNearBlocksRestJson).toHaveBeenCalledWith(
			binding,
			'/v1/txns/transaction-hash'
		)

		getNearBlocksRestJson.mockResolvedValueOnce({
			txns: [{
				...transaction,
				transaction_hash: 'other-hash',
			}],
		})
		await expect(getTransaction({
			transactionHash: 'transaction-hash',
		})).rejects.toThrow('hash does not match')

		getNearBlocksRestJson.mockResolvedValueOnce({
			txns: [{
				...transaction,
				actions: [{
					action: '',
				}],
			}],
		})
		await expect(getTransaction({
			transactionHash: 'transaction-hash',
		})).rejects.toThrow('invalid transaction response envelope')

		getNearBlocksRestJson.mockResolvedValueOnce({
			txns: [{
				...transaction,
				included_in_block_hash: '',
			}],
		})
		await expect(getTransaction({
			transactionHash: 'transaction-hash',
		})).rejects.toThrow('invalid transaction response envelope')

		getNearBlocksRestJson.mockResolvedValueOnce({
			txns: [{
				...transaction,
				outcomes_agg: {
					...transaction.outcomes_agg,
					transaction_fee: 7442984711078700000000,
				},
			}],
		})
		await expect(getTransaction({
			transactionHash: 'transaction-hash',
		})).rejects.toThrow('invalid transaction fee')
	})
})

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
			data: [v3Transaction],
			meta: {
				next_page: 'opaque-next',
			},
		} satisfies NearBlocksV3Response<NearBlocksV3Transaction[]>)

		await expect(getAccountTransactions({
			accountId: 'alice.near',
			limit: 25,
			next: 'opaque+/=current',
		})).resolves.toEqual({
			transactions: [v3Transaction],
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
				...v3Transaction,
				receiver_account_id: 'carol.near',
			}],
		})
		await expect(getAccountTransactions({
			accountId: 'alice.near',
			limit: 25,
		})).rejects.toThrow('foreign account row')

		getNearBlocksRestJson.mockResolvedValueOnce({
			data: [
				v3Transaction,
				v3Transaction,
			],
		})
		await expect(getAccountTransactions({
			accountId: 'alice.near',
			limit: 25,
		})).rejects.toThrow('invalid or duplicate hash')

		getNearBlocksRestJson.mockResolvedValueOnce({
			data: [
				v3Transaction,
				{
					...v3Transaction,
					transaction_hash: 'second-transaction-hash',
				},
			],
		})
		await expect(getAccountTransactions({
			accountId: 'alice.near',
			limit: 1,
		})).rejects.toThrow('exceeds requested limit')

		getNearBlocksRestJson.mockResolvedValueOnce({
			data: [v3Transaction],
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
				v3Transaction,
				{
					...v3Transaction,
					block: {
						...v3Transaction.block,
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
				...v3Transaction,
				index_in_chunk: -1,
			},
			{
				...v3Transaction,
				block_timestamp: '1',
			},
			{
				...v3Transaction,
				receipt_conversion_tokens_burnt: '-1',
			},
		]) {
			getNearBlocksRestJson.mockResolvedValueOnce({
				data: [malformedTransaction],
			})
			await expect(getAccountTransactions({
				accountId: 'alice.near',
				limit: 25,
			})).rejects.toThrow(/invalid account transactions response envelope|does not match|invalid receipt conversion/)
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
			'invalid account balance response envelope'
		)
	})
})

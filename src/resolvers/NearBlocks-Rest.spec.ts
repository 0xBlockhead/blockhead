import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type {
	NearBlocksBlock,
	NearBlocksTransaction,
	NearBlocksV3AccountBalance,
	NearBlocksV3Transaction,
} from '$/sources/NearBlocks/Rest/types.ts'

const getAccountBalance = vi.fn()
const getAccountTransactions = vi.fn()
const getBlock = vi.fn()
const getTransaction = vi.fn()

vi.mock('$/sources/NearBlocks/Rest/queries.ts', () => ({
	getAccountBalance,
	getAccountTransactions,
	getBlock,
	getTransaction,
}))

const { default: nearBlocks } = await import('$/resolvers/NearBlocks-Rest.ts')

const accountResolver = nearBlocks.resolvers.find((resolver) => (
	resolver.entityType === EntityType.NearAccount
	&& 'amountYoctoNear' in resolver.projections
))
const accountTransactionsResolver = nearBlocks.resolvers.find((resolver) => (
	resolver.entityType === EntityType.NearAccount
	&& '$$transactions' in resolver.projections
))
const blockResolver = nearBlocks.resolvers.find((resolver) => (
	resolver.entityType === EntityType.NearBlock
))
const transactionResolver = nearBlocks.resolvers.find((resolver) => (
	resolver.entityType === EntityType.NearTransaction
))

if (accountResolver == null)
	throw new Error('NearBlocks-Rest spec missing NearAccount resolver')
if (accountTransactionsResolver == null)
	throw new Error('NearBlocks-Rest spec missing NearAccount.$$transactions resolver')
if (blockResolver == null)
	throw new Error('NearBlocks-Rest spec missing NearBlock resolver')
if (transactionResolver == null)
	throw new Error('NearBlocks-Rest spec missing NearTransaction resolver')

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const network = {
	slug: networkBySlug.near.slug,
}

const account = {
	$network: network,
	accountId: 'alice.near',
}

const balance = {
	account_id: 'alice.near',
	amount: '100',
	amount_staked: '20',
	storage_usage: '30',
} satisfies NearBlocksV3AccountBalance

const block = {
	block_hash: 'block-hash',
	block_height: '208137439',
	block_timestamp: '1784777079149554306',
	prev_block_hash: 'prev-block-hash',
	epoch_id: 'epoch-id',
} satisfies NearBlocksBlock

const transaction = {
	actions: [{
		action: 'FUNCTION_CALL',
		method: 'ft_transfer',
		deposit: '42',
	}],
	block_timestamp: '1784777079149554306',
	nonce: '7',
	outcomes: {
		status: true,
	},
	receiver_account_id: 'alice.near',
	signer_account_id: 'bob.near',
	transaction_hash: 'transaction-hash',
} satisfies NearBlocksTransaction

const v3Transaction = {
	actions: [{
		action: 'FUNCTION_CALL',
		method: 'ft_transfer',
	}],
	actions_agg: {
		deposit: '0',
		gas_attached: '1',
	},
	block: {
		block_hash: 'block-hash',
		block_height: '208137439',
		block_timestamp: '1784777079149554306',
	},
	index_in_chunk: 0,
	outcomes: {
		status: true,
	},
	outcomes_agg: {
		gas_used: '1',
		transaction_fee: '1',
	},
	receiver_account_id: 'alice.near',
	shard_id: 0,
	signer_account_id: 'bob.near',
	transaction_hash: 'transaction-hash',
} satisfies NearBlocksV3Transaction

describe('NearBlocks schema-shaped resolvers', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('projects account balance fields from v3 portfolio transport', async () => {
		getAccountBalance.mockResolvedValueOnce(balance)

		const snapshot = await accountResolver.resolve.NetworkAccountId.resolve({
			$network: network,
			accountId: 'alice.near',
		}, context)

		expect(getAccountBalance).toHaveBeenCalledWith('alice.near')
		expect(accountResolver.projections.amountYoctoNear(snapshot)).toBe(100n)
		expect(accountResolver.projections.storageUsageBytes(snapshot)).toBe(30n)
	})

	it('projects NearTransaction refs from account transaction pages with opaque continuation', async () => {
		getAccountTransactions.mockResolvedValueOnce({
			transactions: [v3Transaction],
			continuationToken: 'opaque-next',
		})

		const page = await accountTransactionsResolver.resolve.NetworkAccountId.resolve(
			account,
			{
				...context,
				pagination: {
					limit: 25,
				},
				providerContinuationToken: 'opaque-current',
			}
		)
		const projection = accountTransactionsResolver.projections.$$transactions
		if (
			typeof projection === 'function'
			|| projection.select == null
			|| projection.continuation == null
		)
			throw new Error('NearBlocks-Rest spec missing account transaction pagination')

		expect(getAccountTransactions).toHaveBeenCalledWith({
			accountId: 'alice.near',
			limit: 25,
			next: 'opaque-current',
		})
		expect(projection.select(page, account, context)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				hash: 'transaction-hash',
				signerAccountId: 'bob.near',
			},
		}])
		expect(projection.continuation(page, account, context)).toEqual({
			operation: 'account-transactions',
			target: 'alice.near',
			terminal: false,
			token: 'opaque-next',
		})
	})

	it('terminates empty account transaction pages and rejects foreign networks before transport', async () => {
		getAccountTransactions.mockResolvedValueOnce({
			transactions: [],
			continuationToken: undefined,
		})

		const page = await accountTransactionsResolver.resolve.NetworkAccountId.resolve(
			account,
			{
				...context,
				pagination: {
					limit: 0,
				},
			}
		)
		const projection = accountTransactionsResolver.projections.$$transactions
		if (
			typeof projection === 'function'
			|| projection.select == null
			|| projection.continuation == null
		)
			throw new Error('NearBlocks-Rest spec missing account transaction pagination')

		expect(getAccountTransactions).toHaveBeenCalledWith({
			accountId: 'alice.near',
			limit: 0,
		})
		expect(projection.select(page, account, context)).toEqual([])
		expect(projection.continuation(page, account, context)).toEqual({
			operation: 'account-transactions',
			target: 'alice.near',
			terminal: true,
		})

		await expect(accountTransactionsResolver.resolve.NetworkAccountId.resolve({
			$network: {
				slug: 'ethereum',
			},
			accountId: 'alice.near',
		}, context)).rejects.toThrow('unsupported network')
		expect(getAccountTransactions).toHaveBeenCalledTimes(1)
	})

	it('projects block parent and timestamp from hard-fail block transport', async () => {
		getBlock.mockResolvedValueOnce(block)

		const snapshot = await blockResolver.resolve.NetworkHeightHash.resolve({
			$network: network,
			hash: 'block-hash',
			height: 208137439n,
		}, context)

		expect(getBlock).toHaveBeenCalledWith({
			block: 'block-hash',
		})
		expect(blockResolver.projections.hash(snapshot)).toBe('block-hash')
		expect(blockResolver.projections.epochId(snapshot)).toBe('epoch-id')
		expect(blockResolver.projections.timestampMs(snapshot)).toBe(1784777079149)
		expect(blockResolver.projections.$parent(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				height: 208137438n,
				hash: 'prev-block-hash',
			},
		})
	})

	it('rejects block height selector drift', async () => {
		getBlock.mockResolvedValueOnce(block)

		await expect(blockResolver.resolve.NetworkHeightHash.resolve({
			$network: network,
			hash: 'block-hash',
			height: 1n,
		}, context)).rejects.toThrow('height does not match selector')
	})

	it('projects transaction signer, actions, and outcomes', async () => {
		getTransaction.mockResolvedValueOnce(transaction)

		const snapshot = await transactionResolver.resolve.NetworkHashSignerAccountId.resolve({
			$network: network,
			hash: 'transaction-hash',
			signerAccountId: 'bob.near',
		}, context)

		expect(getTransaction).toHaveBeenCalledWith({
			transactionHash: 'transaction-hash',
		})
		expect(transactionResolver.projections.$signer(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				accountId: 'bob.near',
			},
		})
		expect(transactionResolver.projections.signerAccountId(snapshot)).toBe('bob.near')
		expect(transactionResolver.projections.$receiver(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				accountId: 'alice.near',
			},
		})
		expect(transactionResolver.projections.nonce(snapshot)).toBe(7n)
		expect(transactionResolver.projections.$$actions(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: network,
					hash: 'transaction-hash',
					signerAccountId: 'bob.near',
				},
				actionIndex: 0,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.NearAction, [], 'actionKind')]: 'FUNCTION_CALL',
				[entityFieldAddressKey(EntityType.NearAction, [], 'methodName')]: 'ft_transfer',
				[entityFieldAddressKey(EntityType.NearAction, [], 'depositYoctoNear')]: 42n,
			},
		}])
		expect(transactionResolver.projections.$$executionOutcomes(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: network,
					hash: 'transaction-hash',
					signerAccountId: 'bob.near',
				},
				outcomeId: 'transaction-hash',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.NearExecutionOutcome, [], 'status')]: 'SuccessValue',
			},
		}])
	})

	it('rejects transaction signer selector drift', async () => {
		getTransaction.mockResolvedValueOnce(transaction)

		await expect(transactionResolver.resolve.NetworkHashSignerAccountId.resolve({
			$network: network,
			hash: 'transaction-hash',
			signerAccountId: 'carol.near',
		}, context)).rejects.toThrow('signer does not match selector')
	})

	it('rejects unsupported networks without soft-empty success', async () => {
		await expect(accountResolver.resolve.NetworkAccountId.resolve({
			$network: {
				slug: 'ethereum',
			},
			accountId: 'alice.near',
		}, context)).rejects.toThrow('unsupported network')
		expect(getAccountBalance).not.toHaveBeenCalled()
	})
})

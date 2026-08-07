import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type {
	NearBlocksAccount,
	NearBlocksBlock,
	NearBlocksTransaction,
	NearBlocksV3AccountBalance,
	NearBlocksV3Transaction,
} from '$/sources/NearBlocks/Rest/types.ts'

const getAccount = vi.fn()
const getAccountBalance = vi.fn()
const getAccountTransactions = vi.fn()
const getBlock = vi.fn()
const getTransaction = vi.fn()
const listBlocks = vi.fn()

vi.mock('$/sources/NearBlocks/Rest/queries.ts', () => ({
	getAccount,
	getAccountBalance,
	getAccountTransactions,
	getBlock,
	getTransaction,
	listBlocks,
}))

const { default: nearBlocks } = await import('$/resolvers/NearBlocks-Rest.ts')

const accountResolver = nearBlocks.resolvers.find((resolver) => (
	resolver.entityType === EntityType.NearAccount
	&& 'amountYoctoNear' in resolver.projections
))
const accountTimestampResolver = nearBlocks.resolvers.find((resolver) => (
	resolver.entityType === EntityType.NearAccount_Timestamp
))
const accountTransactionsResolver = nearBlocks.resolvers.find((resolver) => (
	resolver.entityType === EntityType.NearAccount
	&& '$$transactions' in resolver.projections
))
const blockResolver = nearBlocks.resolvers.find((resolver) => (
	resolver.entityType === EntityType.NearBlock
))
const networkBlocksResolver = nearBlocks.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Near' in resolver.projections
))
const transactionResolver = nearBlocks.resolvers.find((resolver) => (
	resolver.entityType === EntityType.NearTransaction
))

if (accountResolver == null)
	throw new Error('NearBlocks-Rest spec missing NearAccount resolver')
if (accountTimestampResolver == null)
	throw new Error('NearBlocks-Rest spec missing NearAccount_Timestamp resolver')
if (accountTransactionsResolver == null)
	throw new Error('NearBlocks-Rest spec missing NearAccount.$$transactions resolver')
if (blockResolver == null)
	throw new Error('NearBlocks-Rest spec missing NearBlock resolver')
if (networkBlocksResolver == null)
	throw new Error('NearBlocks-Rest spec missing Network.Near.$$blocks resolver')
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

const accountWire = {
	account_id: 'alice.near',
	amount: '100',
	block_hash: 'account-block-hash',
	block_height: '208137439',
	locked: '7',
	storage_usage: 182,
	deleted: {
		transaction_hash: null,
		block_timestamp: null,
	},
} satisfies NearBlocksAccount

const block = {
	block_hash: 'block-hash',
	block_height: '208137439',
	block_timestamp: '1784777079149554306',
	prev_block_hash: 'prev-block-hash',
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
	outcomes_agg: {
		gas_used: '1900000000000',
		transaction_fee: '1',
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

	it('projects NearAccount_Timestamp locked storage and block meta from v1 account', async () => {
		getAccount.mockResolvedValueOnce(accountWire)

		const snapshot = await accountTimestampResolver.resolve.AccountTimestampMsSource.resolve({
			$account: account,
			timestampMs: 1,
			source: Source.NearBlocks_Rest,
		}, context)

		expect(getAccount).toHaveBeenCalledWith({
			accountId: 'alice.near',
		})
		expect(accountTimestampResolver.projections.amountYoctoNear(snapshot)).toBe(100n)
		expect(accountTimestampResolver.projections.lockedYoctoNear(snapshot)).toBe(7n)
		expect(accountTimestampResolver.projections.storageUsageBytes(snapshot)).toBe(182n)
		expect(accountTimestampResolver.projections.blockHeight(snapshot)).toBe(208137439n)
		expect(accountTimestampResolver.projections.blockHash(snapshot)).toBe('account-block-hash')
		expect(accountTimestampResolver.projections.deleted(snapshot)).toBe(false)
	})

	it('rejects NearAccount_Timestamp for foreign source selectors', async () => {
		await expect(accountTimestampResolver.resolve.AccountTimestampMsSource.resolve({
			$account: account,
			timestampMs: 1,
			source: Source.NearRpc_JsonRpc,
		}, context)).rejects.toThrow('unsupported source')
		expect(getAccount).not.toHaveBeenCalled()
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

	it('projects block parent and timestamp from hard-fail block transport without inventing epoch', async () => {
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
		expect(blockResolver.projections.epochId(snapshot)).toBeUndefined()
		expect(blockResolver.projections.timestampMs(snapshot)).toBe(1784777079149)
		expect(blockResolver.projections.$parent(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				height: 208137438n,
				hash: 'prev-block-hash',
			},
		})
	})

	it('projects Network.Near.$$blocks tip walk from listBlocks', async () => {
		listBlocks.mockResolvedValueOnce([
			{
				block_hash: 'newer-hash',
				block_height: '208137440',
				block_timestamp: '1784777079149554307',
			},
			{
				block_hash: 'older-hash',
				block_height: '208137439',
				block_timestamp: '1784777079149554306',
				epoch_id: 'epoch-id',
			},
		])

		const blocks = await networkBlocksResolver.resolve.Slug.resolve(
			network,
			{
				...context,
				pagination: {
					limit: 2,
				},
			}
		)

		expect(listBlocks).toHaveBeenCalledWith({
			limit: 2,
		})
		expect(networkBlocksResolver.projections.Near.$$blocks(blocks)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					height: 208137440n,
					hash: 'newer-hash',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.NearBlock, [], 'timestampMs')]: 1784777079149,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					height: 208137439n,
					hash: 'older-hash',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.NearBlock, [], 'timestampMs')]: 1784777079149,
					[entityFieldAddressKey(EntityType.NearBlock, [], 'epochId')]: 'epoch-id',
				},
			},
		])
	})

	it('rejects block height selector drift', async () => {
		getBlock.mockResolvedValueOnce(block)

		await expect(blockResolver.resolve.NetworkHeightHash.resolve({
			$network: network,
			hash: 'block-hash',
			height: 1n,
		}, context)).rejects.toThrow('height does not match selector')
	})

	it('projects transaction signer, actions, outcomes, and gasBurnt', async () => {
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
				[entityFieldAddressKey(EntityType.NearExecutionOutcome, [], 'gasBurnt')]: 1900000000000n,
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

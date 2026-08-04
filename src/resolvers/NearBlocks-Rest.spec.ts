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
} from '$/sources/NearBlocks/Rest/types.ts'

const getAccountBalance = vi.fn()
const getBlock = vi.fn()
const getTransaction = vi.fn()

vi.mock('$/sources/NearBlocks/Rest/queries.ts', () => ({
	getAccountBalance,
	getBlock,
	getTransaction,
}))

const { default: nearBlocks } = await import('$/resolvers/NearBlocks-Rest.ts')

const accountResolver = nearBlocks.resolvers.find((resolver) => (
	resolver.entityType === EntityType.NearAccount
))
const blockResolver = nearBlocks.resolvers.find((resolver) => (
	resolver.entityType === EntityType.NearBlock
))
const transactionResolver = nearBlocks.resolvers.find((resolver) => (
	resolver.entityType === EntityType.NearTransaction
))

if (accountResolver == null)
	throw new Error('NearBlocks-Rest spec missing NearAccount resolver')
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

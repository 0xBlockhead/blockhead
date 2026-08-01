import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const executeSui = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Sui/Graphql/client.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Sui/Graphql/client.ts')>(),
	executeSui,
}))

const { default: suiResolvers } = await import('$/resolvers/Sui.ts')
const balancesResolver = suiResolvers.resolvers[0]
const transactionsResolver = suiResolvers.resolvers[1]

const canonicalAddress = `0x${'0'.repeat(63)}2`
const account = {
	$network: {
		$network: {
			slug: 'sui',
		},
	},
	address: '0x2',
} as const
const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 2,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('Sui GraphQL public-account resolver', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		executeSui.mockReset()
	})

	it('materializes normalized source-provenanced balances with lossless amounts', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_752_624_000_000)
		executeSui.mockResolvedValueOnce({
			address: {
				address: canonicalAddress,
				balances: {
					pageInfo: {
						hasNextPage: true,
						endCursor: 'balance-cursor',
					},
					nodes: [
						{
							coinType: {
								repr: '0x2::sui::SUI',
							},
							totalBalance: '123456789012345678901234',
							coinBalance: '123456789012345678901000',
							addressBalance: '234',
						},
						{
							coinType: {
								repr: '0xabc::coin::COIN',
							},
							totalBalance: '9',
							coinBalance: '9',
							addressBalance: '0',
						},
					],
				},
			},
		})
		const snapshot = await balancesResolver.resolve['NetworkAddress'].resolve(
			account,
			context
		)

		expect(balancesResolver.projections.$$balances.select(snapshot, account, context)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$account: {
						$network: account.$network,
						address: canonicalAddress,
					},
					coinType: '0x2::sui::SUI',
					timestampMs: 1_752_624_000_000,
					source: 'Sui',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SuiCoinBalance_Timestamp, [], 'totalBalance')]: 123_456_789_012_345_678_901_234n,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$account: {
						$network: account.$network,
						address: canonicalAddress,
					},
					coinType: '0xabc::coin::COIN',
					timestampMs: 1_752_624_000_000,
					source: 'Sui',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SuiCoinBalance_Timestamp, [], 'totalBalance')]: 9n,
				},
			},
		])
		expect(balancesResolver.projections.$$balances.continuation(snapshot, account, context)).toEqual({
			operation: 'account-balances',
			target: canonicalAddress,
			terminal: false,
			token: 'balance-cursor',
		})
		expect(executeSui.mock.calls[0][1]).toEqual({
			address: canonicalAddress,
			first: 2,
		})
	})

	it('preserves provider transaction order and canonicalizes sender identities', async () => {
		executeSui.mockResolvedValueOnce({
			address: {
				address: canonicalAddress,
			},
			transactions: {
				pageInfo: {
					hasNextPage: true,
					endCursor: 'transaction-cursor',
				},
				nodes: [
					{
						digest: 'TransactionDigest2',
						sender: {
							address: '0xA',
						},
					},
					{
						digest: 'TransactionDigest1',
						sender: null,
					},
				],
			},
		})
		const snapshot = await transactionsResolver.resolve['NetworkAddress'].resolve(
			account,
			context
		)
		const transactions = transactionsResolver.projections.$$transactions.select(snapshot, account, context)

		expect(transactions).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: account.$network,
					digest: 'TransactionDigest2',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.SuiTransaction, [], 'sender')]: `0x${'0'.repeat(63)}a`,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: account.$network,
					digest: 'TransactionDigest1',
				},
			},
		])
		expect(transactionsResolver.projections.$$transactions.continuation(snapshot, account, context)).toEqual({
			operation: 'account-transactions',
			target: canonicalAddress,
			terminal: false,
			token: 'transaction-cursor',
		})
	})

	it('caps pages, terminates completed pages, and rejects invalid subjects before transport', async () => {
		executeSui.mockResolvedValueOnce({
			address: {
				address: canonicalAddress,
			},
			transactions: {
				pageInfo: {
					hasNextPage: false,
					endCursor: null,
				},
				nodes: [],
			},
		})
		const snapshot = await transactionsResolver.resolve['NetworkAddress'].resolve(account, {
			...context,
			pagination: {
				limit: 1_000,
			},
		})

		expect(executeSui.mock.calls[0][1]).toEqual({
			address: canonicalAddress,
			first: 50,
		})
		expect(transactionsResolver.projections.$$transactions.continuation(snapshot, account, context)).toEqual({
			operation: 'account-transactions',
			target: canonicalAddress,
			terminal: true,
		})

		executeSui.mockReset()
		await expect(transactionsResolver.resolve['NetworkAddress'].resolve({
			...account,
			address: '0xz',
		}, context)).rejects.toThrow('hexadecimal address')
		await expect(transactionsResolver.resolve['NetworkAddress'].resolve({
			...account,
			$network: {
				$network: {
					slug: 'sui-testnet',
				},
			},
		}, context)).rejects.toThrow('unsupported network')
		expect(executeSui).not.toHaveBeenCalled()
	})

	it('fails closed on a malformed sender returned for an affected-address page', async () => {
		executeSui.mockResolvedValueOnce({
			address: {
				address: canonicalAddress,
			},
			transactions: {
				pageInfo: {
					hasNextPage: false,
					endCursor: null,
				},
				nodes: [{
					digest: 'TransactionDigest',
					sender: {
						address: 'not-an-address',
					},
				}],
			},
		})

		await expect(transactionsResolver.resolve[
			'NetworkAddress'
		].resolve(account, context)).rejects.toThrow('hexadecimal address')
	})
})

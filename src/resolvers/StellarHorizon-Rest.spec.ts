import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const { getJson } = vi.hoisted(() => ({
	getJson: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const { default: stellarHorizonResolvers } = await import('$/resolvers/StellarHorizon-Rest.ts')

const resolverFor = (fieldName: '$$timestamps' | '$$transactions') => {
	const resolver = stellarHorizonResolvers.resolvers.find((candidate) => (
		fieldName in candidate.projections
	))
	if (resolver == null)
		throw new Error(`Stellar Horizon spec missing StellarAccount.${fieldName} resolver`)

	return resolver
}

const accountId = `G${'A'.repeat(55)}`
const otherAccountId = `G${'B'.repeat(55)}`
const account = {
	$network: {
		$network: {
			slug: 'stellar',
		},
	},
	accountId,
}
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
const page = <_Record>(records: _Record[]) => ({
	_links: {
		next: {
			href: 'https://horizon.stellar.org/next',
		},
	},
	_embedded: {
		records,
	},
})

describe('Stellar Horizon public-account resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('materializes an exact source-provenanced account observation', async () => {
		getJson.mockResolvedValueOnce({
			id: accountId,
			account_id: accountId,
			sequence: '9223372036854775807',
			subentry_count: 3,
			last_modified_ledger: 5_000_000,
			last_modified_time: '2026-07-22T00:00:00Z',
			balances: [
				{
					asset_type: 'native',
					balance: '12345678901234567890.1234567',
					buying_liabilities: '0.0000000',
					selling_liabilities: '0.0000000',
				},
				{
					asset_type: 'credit_alphanum4',
					asset_code: 'USDC',
					asset_issuer: otherAccountId,
					balance: '12.3456789',
				},
			],
			signers: [
				{
					key: accountId,
					weight: 1,
					type: 'ed25519_public_key',
				},
			],
		})
		const resolver = resolverFor('$$timestamps')
		const timestamps = await resolver.resolve['NetworkAccountId'].resolve(
			account,
			context
		)

		expect(resolver.projections.$$timestamps(timestamps)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$account: account,
					timestampMs: Date.parse('2026-07-22T00:00:00Z'),
					source: 'StellarHorizon_Rest',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.StellarAccount_Timestamp, [], 'ledgerSequence')]: 5_000_000n,
					[entityFieldAddressKey(EntityType.StellarAccount_Timestamp, [], 'sequence')]: '9223372036854775807',
					[entityFieldAddressKey(EntityType.StellarAccount_Timestamp, [], 'nativeBalance')]: '12345678901234567890.1234567',
					[entityFieldAddressKey(EntityType.StellarAccount_Timestamp, [], 'subentryCount')]: 3,
					[entityFieldAddressKey(EntityType.StellarAccount_Timestamp, [], 'signerCount')]: 1,
				},
			},
		])
		expect(getJson.mock.calls[0]).toEqual([
			expect.objectContaining({
				source: 'StellarHorizon_Rest',
				target: {
					kind: 'Global',
					key: 'stellar-public-horizon',
				},
			}),
			`/accounts/${accountId}`,
		])
	})

	it('preserves descending transaction order, ledger identity, amounts, and cursor', async () => {
		getJson.mockResolvedValueOnce(page([
			{
				id: 'transaction-2',
				paging_token: '200',
				successful: true,
				hash: 'b'.repeat(64),
				ledger: 102,
				created_at: '2026-07-22T00:02:00Z',
				source_account: otherAccountId,
				source_account_sequence: '9223372036854775807',
				fee_account: otherAccountId,
				fee_charged: '9223372036854775807',
				max_fee: '9223372036854775808',
				operation_count: 2,
				memo_type: 'text',
				memo: 'invoice-2',
			},
			{
				id: 'transaction-1',
				paging_token: '190',
				successful: false,
				hash: 'a'.repeat(64),
				ledger: 101,
				created_at: '2026-07-22T00:01:00Z',
				source_account: accountId,
				source_account_sequence: '9223372036854775806',
				fee_account: accountId,
				fee_charged: '100',
				max_fee: '200',
				operation_count: 1,
				memo_type: 'none',
			},
		]))
		const resolver = resolverFor('$$transactions')
		const snapshot = await resolver.resolve['NetworkAccountId'].resolve(
			account,
			context
		)
		const transactions = resolver.projections.$$transactions.select(snapshot, account, context)

		expect(transactions.map((transaction) => transaction[EntityMetaKey.Selector])).toEqual([
			{
				$network: account.$network,
				hash: 'b'.repeat(64),
			},
			{
				$network: account.$network,
				hash: 'a'.repeat(64),
			},
		])
		expect(transactions[0][EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.StellarTransaction, [], 'sourceAccount')]: otherAccountId,
			[entityFieldAddressKey(EntityType.StellarTransaction, [], '$$timestamps')]: [{
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network: account.$network,
						hash: 'b'.repeat(64),
					},
					timestampMs: Date.parse('2026-07-22T00:02:00Z'),
					source: 'StellarHorizon_Rest',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'ledgerSequence')]: 102n,
					[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'successful')]: true,
					[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'feeCharged')]: 9_223_372_036_854_775_807n,
					[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'maxFee')]: 9_223_372_036_854_775_808n,
					[entityFieldAddressKey(EntityType.StellarTransaction_Timestamp, [], 'memo')]: {
						type: 'text',
						value: 'invoice-2',
					},
				},
			}],
		})
		expect(resolver.projections.$$transactions.continuation(snapshot, account, context)).toEqual({
			operation: 'account-transactions',
			target: accountId,
			terminal: false,
			token: '190',
		})
		expect(getJson.mock.calls[0][1]).toBe(
			`/accounts/${accountId}/transactions?limit=2&order=desc`
		)
	})

	it('caps Horizon pages, terminates short pages, and rejects non-G or foreign-network subjects', async () => {
		getJson.mockResolvedValueOnce(page([]))
		const resolver = resolverFor('$$transactions')
		const snapshot = await resolver.resolve['NetworkAccountId'].resolve(account, {
			...context,
			pagination: {
				limit: 1_000,
			},
		})

		expect(getJson.mock.calls[0][1]).toBe(
			`/accounts/${accountId}/transactions?limit=200&order=desc`
		)
		expect(resolver.projections.$$transactions.continuation(snapshot, account, context)).toEqual({
			operation: 'account-transactions',
			target: accountId,
			terminal: true,
		})

		vi.clearAllMocks()
		await expect(resolver.resolve['NetworkAccountId'].resolve({
			...account,
			accountId: `M${'A'.repeat(68)}`,
		}, context)).rejects.toThrow('invalid account ID')
		await expect(resolver.resolve['NetworkAccountId'].resolve({
			...account,
			$network: {
				$network: {
					slug: 'stellar-testnet',
				},
			},
		}, context)).rejects.toThrow('unsupported network')
		expect(getJson).not.toHaveBeenCalled()
	})

	it('fails closed on invalid account and transaction observation clocks', async () => {
		const timestampResolver = resolverFor('$$timestamps')
		getJson.mockResolvedValueOnce({
			id: accountId,
			account_id: accountId,
			sequence: '1',
			subentry_count: 0,
			last_modified_ledger: 1,
			last_modified_time: 'not-a-time',
			balances: [{
				asset_type: 'native',
				balance: '1.0000000',
			}],
			signers: [],
		})
		await expect(timestampResolver.resolve[
			'NetworkAccountId'
		].resolve(account, context)).rejects.toThrow('invalid account modification time')

		const transactionResolver = resolverFor('$$transactions')
		getJson.mockResolvedValueOnce(page([{
			id: 'transaction',
			paging_token: '1',
			successful: true,
			hash: 'a'.repeat(64),
			ledger: 1,
			created_at: 'not-a-time',
			source_account: accountId,
			source_account_sequence: '1',
			fee_account: accountId,
			fee_charged: '100',
			max_fee: '100',
			operation_count: 1,
			memo_type: 'none',
		}]))
		const snapshot = await transactionResolver.resolve[
			'NetworkAccountId'
		].resolve(account, context)
		expect(() => transactionResolver.projections.$$transactions.select(
			snapshot,
			account,
			context
		)).toThrow('invalid transaction creation time')
	})
})

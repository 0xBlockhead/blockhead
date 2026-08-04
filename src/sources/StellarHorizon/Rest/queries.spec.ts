import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/StellarHorizon/bindings.ts'
import { Source } from '$/sources/Source.ts'

const { getJson } = vi.hoisted(() => ({
	getJson: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const {
	getAccount,
	getAccountOffers,
	getAccountOperations,
	getAccountPayments,
	getAccountTrades,
	getAccountTransactions,
	getTransaction,
	getTransactionOperations,
	operationIndexFromHorizonId,
} = await import('$/sources/StellarHorizon/Rest/queries.ts')

const binding = bindings[Source.StellarHorizon_Rest][0]

const accountId = `G${'A'.repeat(55)}`
const otherAccountId = `G${'B'.repeat(55)}`

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

describe('Stellar Horizon account transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads exact account state and preserves decimal balances', async () => {
		getJson.mockResolvedValueOnce({
			id: accountId,
			account_id: accountId,
			sequence: '9223372036854775807',
			subentry_count: 2,
			last_modified_ledger: 100,
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
					limit: '922337203685.4775807',
				},
			],
			signers: [],
		})

		await expect(getAccount(accountId)).resolves.toMatchObject({
			sequence: '9223372036854775807',
			balances: [
				{
					balance: '12345678901234567890.1234567',
				},
				{
					balance: '12.3456789',
				},
			],
		})
		expect(getJson).toHaveBeenCalledWith(binding, `/accounts/${accountId}`)
	})

	it('loads bounded payment and operation pages with account ownership proof', async () => {
		getJson.mockResolvedValueOnce(page([{
			id: 'payment-id',
			paging_token: '101',
			transaction_hash: 'a'.repeat(64),
			type: 'payment',
			type_i: 1,
			created_at: '2026-07-22T00:00:00Z',
			from: otherAccountId,
			to: accountId,
			amount: '1.0000000',
			asset_type: 'native',
		}]))
		await expect(getAccountPayments(accountId, 25, '100')).resolves.toMatchObject({
			_embedded: {
				records: [{
					id: 'payment-id',
				}],
			},
		})
		expect(getJson).toHaveBeenLastCalledWith(
			binding,
			`/accounts/${accountId}/payments?limit=25&order=desc&cursor=100`
		)

		getJson.mockResolvedValueOnce(page([{
			id: 'operation-id',
			paging_token: '102',
			transaction_hash: 'b'.repeat(64),
			type: 'manage_data',
			type_i: 10,
			created_at: '2026-07-22T00:00:00Z',
			source_account: accountId,
		}]))
		await expect(getAccountOperations(accountId, 25)).resolves.toMatchObject({
			_embedded: {
				records: [{
					type: 'manage_data',
				}],
			},
		})
	})

	it('loads lossless transaction history from the account-scoped endpoint', async () => {
		getJson.mockResolvedValueOnce(page([{
			id: 'transaction-id',
			paging_token: '200',
			successful: true,
			hash: 'c'.repeat(64),
			ledger: 100,
			created_at: '2026-07-22T00:00:00Z',
			source_account: otherAccountId,
			source_account_sequence: '9223372036854775807',
			fee_account: otherAccountId,
			fee_charged: '100',
			max_fee: '100',
			operation_count: 1,
			memo_type: 'none',
		}]))

		await expect(getAccountTransactions(accountId, 10)).resolves.toMatchObject({
			_embedded: {
				records: [{
					source_account_sequence: '9223372036854775807',
				}],
			},
		})
	})

	it('fails closed on foreign, duplicate, malformed, stalled, and oversized pages', async () => {
		getJson.mockResolvedValueOnce(page([{
			id: 'foreign',
			paging_token: '1',
			transaction_hash: 'a'.repeat(64),
			type: 'payment',
			type_i: 1,
			created_at: '2026-07-22T00:00:00Z',
			from: otherAccountId,
			to: otherAccountId,
			amount: '1.0000000',
		}]))
		await expect(getAccountPayments(accountId, 1)).rejects.toThrow('foreign account row')

		getJson.mockResolvedValueOnce(page([
			{
				id: 'duplicate',
				paging_token: '1',
			},
			{
				id: 'duplicate',
				paging_token: '2',
			},
		]))
		await expect(getAccountOperations(accountId, 2)).rejects.toThrow('duplicate record ID')

		getJson.mockResolvedValueOnce(page([{
			id: 'stalled',
			paging_token: 'same',
		}]))
		await expect(getAccountOperations(accountId, 1, 'same')).rejects.toThrow('cursor did not advance')

		await expect(getAccountPayments(accountId, 201)).rejects.toThrow('0 through 200')
		expect(getJson).toHaveBeenCalledTimes(3)
	})

	it('does not transport zero-cardinality pages', async () => {
		await expect(getAccountTransactions(accountId, 0)).resolves.toMatchObject({
			_embedded: {
				records: [],
			},
		})
		expect(getJson).not.toHaveBeenCalled()
	})

	it('loads account offers and trades with seller/party ownership proof', async () => {
		getJson.mockResolvedValueOnce(page([{
			id: '2',
			paging_token: '2',
			seller: accountId,
			selling: {
				asset_type: 'native',
			},
			buying: {
				asset_type: 'credit_alphanum4',
				asset_code: 'USDC',
				asset_issuer: otherAccountId,
			},
			amount: '1.0000000',
			price_r: {
				n: 1,
				d: 2,
			},
			price: '0.5000000',
			last_modified_ledger: 100,
			last_modified_time: '2026-07-22T00:00:00Z',
		}]))
		await expect(getAccountOffers(accountId, 10)).resolves.toMatchObject({
			_embedded: {
				records: [{
					id: '2',
				}],
			},
		})
		expect(getJson).toHaveBeenLastCalledWith(
			binding,
			`/accounts/${accountId}/offers?limit=10&order=desc`
		)

		getJson.mockResolvedValueOnce(page([{
			id: '246907709817896961-0',
			paging_token: '246907709817896961-0',
			ledger_close_time: '2026-07-22T00:00:00Z',
			trade_type: 'orderbook',
			base_offer_id: '1',
			base_account: accountId,
			base_amount: '1.0000000',
			base_asset_type: 'native',
			counter_offer_id: '2',
			counter_account: otherAccountId,
			counter_amount: '2.0000000',
			counter_asset_type: 'credit_alphanum4',
			counter_asset_code: 'USDC',
			counter_asset_issuer: otherAccountId,
			price: {
				n: '2',
				d: '1',
			},
		}]))
		await expect(getAccountTrades(accountId, 10)).resolves.toMatchObject({
			_embedded: {
				records: [{
					id: '246907709817896961-0',
				}],
			},
		})
	})

	it('loads transaction snapshots and ordered operations', async () => {
		const hash = 'c'.repeat(64)
		getJson.mockResolvedValueOnce({
			id: hash,
			paging_token: '200',
			successful: true,
			hash,
			ledger: 100,
			created_at: '2026-07-22T00:00:00Z',
			source_account: accountId,
			source_account_sequence: '1',
			fee_account: accountId,
			fee_charged: '100',
			max_fee: '100',
			operation_count: 1,
			memo_type: 'none',
		})
		await expect(getTransaction(hash)).resolves.toMatchObject({
			hash,
			source_account: accountId,
		})
		expect(getJson).toHaveBeenLastCalledWith(
			binding,
			`/transactions/${hash}`
		)

		getJson.mockResolvedValueOnce(page([{
			id: '273998503801384961',
			paging_token: '273998503801384961',
			transaction_successful: true,
			source_account: accountId,
			type: 'payment',
			type_i: 1,
			created_at: '2026-07-22T00:00:00Z',
			transaction_hash: hash,
		}]))
		await expect(getTransactionOperations(hash, 2)).resolves.toMatchObject({
			_embedded: {
				records: [{
					type: 'payment',
				}],
			},
		})
		expect(getJson).toHaveBeenLastCalledWith(
			binding,
			`/transactions/${hash}/operations?limit=2&order=asc`
		)
		expect(operationIndexFromHorizonId('273998503801384961')).toBe(1)
	})
})

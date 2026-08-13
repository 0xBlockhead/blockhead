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
	getLiquidityPool,
	getLiquidityPools,
	getLedgerTransactions,
	getOffer,
	getOfferTrades,
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
			thresholds: {
				low_threshold: 0,
				med_threshold: 1,
				high_threshold: 2,
			},
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
			thresholds: {
				low_threshold: 0,
				med_threshold: 1,
				high_threshold: 2,
			},
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

	it('parses exact account thresholds and signer weights', async () => {
		getJson
			.mockResolvedValueOnce({
				id: accountId,
				account_id: accountId,
				sequence: '1',
				subentry_count: 0,
				last_modified_ledger: 1,
				last_modified_time: '2026-07-22T00:00:00Z',
				thresholds: {
					low_threshold: 0,
					med_threshold: 128,
					high_threshold: 255,
					provider_extension: 'dropped',
				},
				balances: [],
				signers: [{
					key: accountId,
					weight: 255,
					type: 'ed25519_public_key',
					sponsor: otherAccountId,
					provider_extension: 'dropped',
				}],
				provider_extension: 'preserved',
			})
			.mockResolvedValueOnce({
				id: accountId,
				account_id: accountId,
				sequence: '1',
				subentry_count: 0,
				last_modified_ledger: 1,
				last_modified_time: '2026-07-22T00:00:00Z',
				thresholds: {
					low_threshold: 0,
					med_threshold: 128,
					high_threshold: 256,
				},
				balances: [],
				signers: [],
			})
			.mockResolvedValueOnce({
				id: accountId,
				account_id: accountId,
				sequence: '1',
				subentry_count: 0,
				last_modified_ledger: 1,
				last_modified_time: '2026-07-22T00:00:00Z',
				thresholds: {
					low_threshold: 0,
					med_threshold: 128,
					high_threshold: 255,
				},
				balances: [],
				signers: [{
					key: accountId,
					weight: 256,
					type: 'ed25519_public_key',
				}],
			})

		const account = await getAccount(accountId)
		expect(account).toMatchObject({
			provider_extension: 'preserved',
		})
		expect(account.thresholds).toEqual({
			low_threshold: 0,
			med_threshold: 128,
			high_threshold: 255,
		})
		expect(account.signers).toEqual([{
			key: accountId,
			weight: 255,
			type: 'ed25519_public_key',
			sponsor: otherAccountId,
		}])
		await expect(getAccount(accountId)).rejects.toThrow('invalid account response envelope')
		await expect(getAccount(accountId)).rejects.toThrow('invalid account response envelope')
	})

	it('fail-closes malformed account and transaction envelopes', async () => {
		getJson.mockResolvedValueOnce({
			id: accountId,
			account_id: accountId,
			sequence: '1',
			subentry_count: 0,
			last_modified_ledger: 1,
			last_modified_time: '2026-07-22T00:00:00Z',
			balances: [],
			signers: [],
		})
		await expect(getAccount(accountId)).rejects.toThrow('invalid account response envelope')

		getJson.mockResolvedValueOnce({
			id: 'tx',
			paging_token: '1',
			successful: true,
			hash: 'c'.repeat(64),
			ledger: -1,
			created_at: '2026-07-22T00:00:00Z',
			source_account: accountId,
			source_account_sequence: '1',
			fee_account: accountId,
			fee_charged: '100',
			max_fee: '100',
			operation_count: 1,
			memo_type: 'none',
		})
		await expect(getTransaction('c'.repeat(64))).rejects.toThrow('invalid transaction response envelope')
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

	it('loads only transactions owned by the requested ledger', async () => {
		getJson.mockResolvedValueOnce(page([{
			id: 'transaction-id',
			paging_token: '200',
			successful: true,
			hash: 'c'.repeat(64),
			ledger: 100,
			created_at: '2026-07-22T00:00:00Z',
			source_account: otherAccountId,
			source_account_sequence: '1',
			fee_account: otherAccountId,
			fee_charged: '100',
			max_fee: '100',
			operation_count: 1,
			memo_type: 'none',
		}]))

		await expect(getLedgerTransactions(100n, 10)).resolves.toMatchObject({
			_embedded: {
				records: [{
					ledger: 100,
				}],
			},
		})
		expect(getJson).toHaveBeenLastCalledWith(
			binding,
			'/ledgers/100/transactions?limit=10&order=desc'
		)

		getJson.mockResolvedValueOnce(page([{
			id: 'transaction-id',
			paging_token: '200',
			successful: true,
			hash: 'c'.repeat(64),
			ledger: 101,
			created_at: '2026-07-22T00:00:00Z',
			source_account: otherAccountId,
			source_account_sequence: '1',
			fee_account: otherAccountId,
			fee_charged: '100',
			max_fee: '100',
			operation_count: 1,
			memo_type: 'none',
		}]))
		await expect(getLedgerTransactions(100n, 10)).rejects.toThrow('foreign ledger')
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
				transaction_hash: 'a'.repeat(64),
				type: 'payment',
				type_i: 1,
				created_at: '2026-07-22T00:00:00Z',
				source_account: accountId,
			},
			{
				id: 'duplicate',
				paging_token: '2',
				transaction_hash: 'b'.repeat(64),
				type: 'payment',
				type_i: 1,
				created_at: '2026-07-22T00:00:01Z',
				source_account: accountId,
			},
		]))
		await expect(getAccountOperations(accountId, 2)).rejects.toThrow('duplicate record ID')

		getJson.mockResolvedValueOnce(page([{
			id: 'stalled',
			paging_token: 'same',
			transaction_hash: 'a'.repeat(64),
			type: 'manage_data',
			type_i: 10,
			created_at: '2026-07-22T00:00:00Z',
			source_account: accountId,
		}]))
		await expect(getAccountOperations(accountId, 1, 'same')).rejects.toThrow('cursor did not advance')

		getJson.mockResolvedValueOnce(page([{
			id: 'malformed',
			paging_token: '3',
			transaction_hash: 'a'.repeat(64),
			type: 'payment',
			type_i: -1,
			created_at: '2026-07-22T00:00:00Z',
			source_account: accountId,
		}]))
		await expect(getAccountOperations(accountId, 1)).rejects.toThrow('invalid operation page response envelope')

		await expect(getAccountPayments(accountId, 201)).rejects.toThrow('0 through 200')
		expect(getJson).toHaveBeenCalledTimes(4)
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

	it('resolves an offer and only its related trades by canonical offer ID', async () => {
		getJson.mockResolvedValueOnce({
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
		})
		await expect(getOffer('2')).resolves.toMatchObject({
			id: '2',
			seller: accountId,
		})
		expect(getJson).toHaveBeenLastCalledWith(binding, '/offers/2')

		getJson.mockResolvedValueOnce(page([{
			id: '246907709817896961-0',
			paging_token: '246907709817896961-0',
			ledger_close_time: '2026-07-22T00:00:00Z',
			offer_id: '2',
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
		await expect(getOfferTrades('2', 10)).resolves.toMatchObject({
			_embedded: {
				records: [{
					id: '246907709817896961-0',
				}],
			},
		})
		expect(getJson).toHaveBeenLastCalledWith(
			binding,
			'/offers/2/trades?limit=10&order=desc'
		)

		getJson.mockResolvedValueOnce(page([{
			id: '246907709817896962-0',
			paging_token: '246907709817896962-0',
			ledger_close_time: '2026-07-22T00:00:00Z',
			trade_type: 'orderbook',
			base_offer_id: '3',
			base_account: accountId,
			base_amount: '1.0000000',
			base_asset_type: 'native',
			counter_offer_id: '4',
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
		await expect(getOfferTrades('2', 10)).rejects.toThrow('offer trade page contains a foreign offer')
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
			envelope_xdr: 'AAAAAg==',
			result_xdr: 'AAAAAAAAAGQ=',
			fee_meta_xdr: 'AAAAAg==',
			signatures: ['sig'],
		})
		await expect(getTransaction(hash)).resolves.toMatchObject({
			hash,
			source_account: accountId,
			envelope_xdr: 'AAAAAg==',
			signatures: ['sig'],
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

describe('Stellar Horizon liquidity-pool transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('preserves the native pool, reserve assets, and source ledger observation', async () => {
		const liquidityPoolId = 'a'.repeat(64)
		getJson
			.mockResolvedValueOnce(page([{
				id: liquidityPoolId,
				paging_token: liquidityPoolId,
				fee_bp: 30,
				type: 'constant_product',
				total_trustlines: '12',
				total_shares: '5494.2144063',
				reserves: [
					{
						asset: 'native',
						amount: '0.2500452',
					},
					{
						asset: `USDC:${otherAccountId}`,
						amount: '223681544.4698246',
					},
				],
				last_modified_ledger: 63_779_242,
				last_modified_time: '2026-08-03T11:35:17Z',
			}]))
			.mockResolvedValueOnce({
				id: liquidityPoolId,
				paging_token: liquidityPoolId,
				fee_bp: 30,
				type: 'constant_product',
				total_trustlines: '12',
				total_shares: '5494.2144063',
				reserves: [
					{
						asset: 'native',
						amount: '0.2500452',
					},
					{
						asset: `USDC:${otherAccountId}`,
						amount: '223681544.4698246',
					},
				],
				last_modified_ledger: 63_779_242,
				last_modified_time: '2026-08-03T11:35:17Z',
			})

		await expect(getLiquidityPools(2)).resolves.toMatchObject({
			_embedded: {
				records: [{
					liquidityPoolId,
					feeBps: 30,
					accounts: 12,
					totalShares: '5494.2144063',
					ledgerSequence: 63_779_242n,
					reserveA: {
						assetKey: 'XLM',
						amount: '0.2500452',
					},
					reserveB: {
						assetKey: `USDC-${otherAccountId}`,
						amount: '223681544.4698246',
					},
				}],
			},
		})
		await expect(getLiquidityPool(liquidityPoolId)).resolves.toMatchObject({
			liquidityPoolId,
			poolType: 'constant_product',
		})
		expect(getJson.mock.calls).toEqual([
			[
				binding,
				'/liquidity_pools?limit=2&order=desc',
			],
			[
				binding,
				`/liquidity_pools/${liquidityPoolId}`,
			],
		])
	})

	it('rejects noncanonical pool identities and nonconstant-product reserve shapes', async () => {
		getJson
			.mockResolvedValueOnce({
				id: 'A'.repeat(64),
				paging_token: 'A'.repeat(64),
				fee_bp: 30,
				type: 'constant_product',
				total_trustlines: '1',
				total_shares: '1.0000000',
				reserves: [],
				last_modified_ledger: 1,
				last_modified_time: '2026-08-03T11:35:17Z',
			})
			.mockResolvedValueOnce({
				id: 'b'.repeat(64),
				paging_token: 'b'.repeat(64),
				fee_bp: 30,
				type: 'weighted',
				total_trustlines: '1',
				total_shares: '1.0000000',
				reserves: [],
				last_modified_ledger: 1,
				last_modified_time: '2026-08-03T11:35:17Z',
			})

		await expect(getLiquidityPool('a'.repeat(64))).rejects.toThrow('liquidity pool response identity mismatch')
		await expect(getLiquidityPool('b'.repeat(64))).rejects.toThrow('unsupported liquidity pool type')
	})
})

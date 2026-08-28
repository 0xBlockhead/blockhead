import { beforeEach, describe, expect, it, vi } from 'vitest'
import bindings from '$/sources/AptosIndexer/bindings.ts'
import { Source } from '$/sources/Source.ts'

const aptosIndexerBinding = bindings[Source.AptosIndexer_Graphql][0]

const { executeAptosIndexer } = vi.hoisted(() => ({
	executeAptosIndexer: vi.fn(),
}))

vi.mock('$/sources/AptosIndexer/Graphql/client.ts', () => ({
	executeAptosIndexer,
}))

const {
	getAccountTransactions,
	getCurrentFungibleAssetBalance,
	getCurrentFungibleAssetBalances,
	getTableItem,
	getTransaction,
} = await import('$/sources/AptosIndexer/Graphql/queries.ts')

const transaction = {
	account_address: '0xa11ce',
	transaction_version: '18446744073709551615',
	user_transaction: {
		block_height: '9001',
		gas_unit_price: '100',
		sender: '0xbob',
		timestamp: '2026-07-22T12:00:00Z',
		version: '18446744073709551615',
	},
}

const balance = {
	amount: '340282366920938463463374607431768211455',
	asset_type: '0x1::aptos_coin::AptosCoin',
	asset_type_v1: '0x1::aptos_coin::AptosCoin',
	is_primary: true,
	last_transaction_timestamp: '2026-07-22T12:00:00Z',
	last_transaction_version: '18446744073709551615',
	owner_address: '0xa11ce',
	storage_id: '0xstore',
	token_standard: 'v1',
}

const currentTableItem = {
	decoded_key: {
		account: '0xa11ce',
	},
	decoded_value: {
		amount: '25',
	},
	is_deleted: false,
	key: '0xrawkey',
	key_hash: '0xkeyhash',
	last_transaction_version: '42',
	table_handle: '0xhandle',
}

describe('Aptos Indexer account portfolio queries', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('preserves account identity and lossless transaction versions', async () => {
		executeAptosIndexer.mockResolvedValueOnce({
			account_transactions: [transaction],
		})

		await expect(getAccountTransactions('0xa11ce', 25, 5)).resolves.toEqual([transaction])
		expect(executeAptosIndexer.mock.calls[0][0]).toBe(aptosIndexerBinding)
		expect(executeAptosIndexer.mock.calls[0][2]).toEqual({
			accountAddress: '0xa11ce',
			limit: 25,
			offset: 5,
		})
	})

	it('preserves owner identity and lossless fungible amounts', async () => {
		executeAptosIndexer.mockResolvedValueOnce({
			current_fungible_asset_balances: [balance],
		})

		await expect(getCurrentFungibleAssetBalances('0xa11ce', 25, 5)).resolves.toEqual([balance])
		expect(executeAptosIndexer.mock.calls[0][0]).toBe(aptosIndexerBinding)
		expect(executeAptosIndexer.mock.calls[0][2]).toEqual({
			ownerAddress: '0xa11ce',
			limit: 25,
			offset: 5,
		})
	})

	it('fails closed on foreign and internally inconsistent rows', async () => {
		executeAptosIndexer.mockResolvedValueOnce({
			account_transactions: [{
				...transaction,
				account_address: '0xforeign',
			}],
		})
		await expect(getAccountTransactions('0xa11ce')).rejects.toThrow('foreign account row')

		executeAptosIndexer.mockResolvedValueOnce({
			account_transactions: [{
				...transaction,
				user_transaction: {
					...transaction.user_transaction,
					version: '7',
				},
			}],
		})
		await expect(getAccountTransactions('0xa11ce')).rejects.toThrow('invalid transaction version')

		executeAptosIndexer.mockResolvedValueOnce({
			current_fungible_asset_balances: [{
				...balance,
				owner_address: '0xforeign',
			}],
		})
		await expect(getCurrentFungibleAssetBalances('0xa11ce')).rejects.toThrow('foreign owner row')

		executeAptosIndexer.mockResolvedValueOnce({
			current_fungible_asset_balances: [{
				...balance,
				amount: '-1',
			}],
		})
		await expect(getCurrentFungibleAssetBalances('0xa11ce')).rejects.toThrow('response envelope')
	})

	it('fails closed on malformed GraphQL envelopes', async () => {
		executeAptosIndexer.mockResolvedValueOnce({
			account_transactions: [{
				account_address: '0xa11ce',
				transaction_version: 'not-a-u64',
			}],
		})
		await expect(getAccountTransactions('0xa11ce')).rejects.toThrow('response envelope')

		executeAptosIndexer.mockResolvedValueOnce({
			user_transactions: [{
				sender: '0xa11ce',
				timestamp: '2026-07-22T12:00:00Z',
				version: '42',
			}],
		})
		await expect(getTransaction(42n)).rejects.toThrow('response envelope')

		executeAptosIndexer.mockResolvedValueOnce({
			current_fungible_asset_balances_by_pk: {
				...balance,
				is_primary: 'yes',
			},
		})
		await expect(getCurrentFungibleAssetBalance('0xstore')).rejects.toThrow('response envelope')

		executeAptosIndexer.mockResolvedValueOnce({
			current_table_items: [{
				...currentTableItem,
				is_deleted: 'no',
			}],
		})
		await expect(getTableItem('0xhandle', '0xkeyhash')).rejects.toThrow('response envelope')
	})
	it('preserves nested table-item JSON values', async () => {
		const item = {
			...currentTableItem,
			decoded_value: {
				entries: [
					null,
					true,
					2,
					{ amount: '25' },
				],
			},
		}
		executeAptosIndexer.mockResolvedValueOnce({ current_table_items: [item] })
		await expect(getTableItem('0xhandle', '0xkeyhash')).resolves.toEqual({
			current: item,
			versioned: undefined,
		})
	})

	it('rejects non-JSON values nested in a table-item envelope', async () => {
		executeAptosIndexer.mockResolvedValueOnce({
			current_table_items: [{
				...currentTableItem,
				decoded_value: { entries: [undefined] },
			}],
		})
		await expect(getTableItem('0xhandle', '0xkeyhash')).rejects.toThrow('response envelope')
	})


	it('bounds offset pages and avoids transport for zero cardinality', async () => {
		await expect(getAccountTransactions('0xa11ce', 0)).resolves.toEqual([])
		await expect(getCurrentFungibleAssetBalances('0xa11ce', 0)).resolves.toEqual([])
		expect(() => getAccountTransactions('0xa11ce', 101)).toThrow('0 through 100')
		expect(() => getCurrentFungibleAssetBalances('0xa11ce', 25, -1)).toThrow('nonnegative')
		expect(executeAptosIndexer).not.toHaveBeenCalled()
	})

})

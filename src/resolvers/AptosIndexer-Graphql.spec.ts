import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import AptosCoinBalance_Timestamp from '$/schema/AptosCoinBalance_Timestamp.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/AptosIndexer/bindings.ts'
import {
	SourceDelivery,
} from '$/sources/SourceBinding.ts'

const sourceFetch = vi.fn()

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: { endpoints: { locator: string }[] }) => binding.endpoints[0].locator,
	sourceFetch,
}))

const queries = await import('$/sources/AptosIndexer/Graphql/queries.ts')
const {
	aptosAccountBalancesResolver,
	aptosAccountTransactionsResolver,
	aptosCoinBalanceResolver,
	aptosTableItemResolver,
	aptosTableItemTimestampResolver,
	aptosTransactionResolver,
} = await import('$/resolvers/AptosIndexer-Graphql.ts')

const aptosIndexerBinding = bindings[Source.AptosIndexer_Graphql]

const aptosNetwork = {
	$network: {
		caip2: {
			namespace: 'aptos',
			reference: '1',
		},
	},
}

const aptosAccount = {
	$network: aptosNetwork,
	address: '0xa11ce',
}

const tableItem = {
	$network: aptosNetwork,
	tableHandle: '0xhandle',
	keyHash: '0xkeyhash',
}

const balance = {
	amount: '25',
	asset_type: '0x1::aptos_coin::AptosCoin',
	asset_type_v1: '0x1::aptos_coin::AptosCoin',
	is_primary: true,
	last_transaction_timestamp: '2026-07-14T08:00:00Z',
	last_transaction_version: '42',
	owner_address: '0xa11ce',
	storage_id: '0xprimary-store',
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

const versionedTableItem = {
	decoded_key: currentTableItem.decoded_key,
	decoded_value: currentTableItem.decoded_value,
	key: currentTableItem.key,
	table_handle: currentTableItem.table_handle,
	transaction_version: '42',
	write_set_change_index: '3',
}

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 25,
		offset: 5,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('Aptos Indexer typed operations', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		sourceFetch.mockReset()
	})

	it('executes bounded account, current-balance, transaction, and table operations', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(JSON.stringify({
				data: {
					account_transactions: [],
				},
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				data: {
					current_fungible_asset_balances: [balance],
				},
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				data: {
					current_fungible_asset_balances_by_pk: balance,
				},
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				data: {
					user_transactions: [],
				},
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				data: {
					current_table_items: [currentTableItem],
				},
			})))
			.mockResolvedValueOnce(new Response(JSON.stringify({
				data: {
					table_items: [versionedTableItem],
				},
			})))

		await queries.getAccountTransactions('0xa11ce', 25, 5)
		await queries.getCurrentFungibleAssetBalances('0xa11ce', 25, 5)
		await queries.getCurrentFungibleAssetBalance(balance.storage_id)
		await queries.getTransaction(42n)
		await queries.getTableItem('0xhandle', '0xkeyhash', 42n)

		expect(sourceFetch).toHaveBeenCalledTimes(6)
		expect(Object.keys(bindings)).toEqual([Source.AptosIndexer_Graphql])
		expect(aptosIndexerBinding.delivery).toBe(SourceDelivery.HttpProxy)
		expect(sourceFetch.mock.calls.every((call) => call[0] === aptosIndexerBinding)).toBe(true)
		expect(sourceFetch.mock.calls.every((call) => call[1] === 'https://api.mainnet.aptoslabs.com/v1/graphql')).toBe(true)
		expect(sourceFetch.mock.calls.every((call) => !call[1].includes('{'))).toBe(true)
		expect(sourceFetch.mock.calls.map((call) => JSON.parse(call[2].body).variables)).toEqual([
			{
				accountAddress: '0xa11ce',
				limit: 25,
				offset: 5,
			},
			{
				ownerAddress: '0xa11ce',
				limit: 25,
				offset: 5,
			},
			{
				storageId: balance.storage_id,
			},
			{
				version: '42',
			},
			{
				keyHash: '0xkeyhash',
				tableHandle: '0xhandle',
			},
			{
				key: '0xrawkey',
				tableHandle: '0xhandle',
				transactionVersion: '42',
			},
		])
		expect(JSON.parse(sourceFetch.mock.calls[1][2].body).query).toContain('order_by: {storage_id: asc}')
		expect(JSON.parse(sourceFetch.mock.calls[1][2].body).query).toContain('limit: $limit')
		expect(JSON.parse(sourceFetch.mock.calls[1][2].body).query).toContain('offset: $offset')
	})
})

describe('Aptos Indexer resolver materialization', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
	})

	it('keeps non-null balance wire fields required in the product schema', () => {
		expect(Object.fromEntries(AptosCoinBalance_Timestamp.fields.map((field) => [
			field.name,
			field.cardinality,
		]))).toMatchObject({
			amount: EntityFieldCardinality.One,
			ownerAddress: EntityFieldCardinality.One,
			storageId: EntityFieldCardinality.One,
			isPrimary: EntityFieldCardinality.One,
		})
	})

	it('reuses canonical account and transaction selectors', async () => {
		vi.spyOn(queries, 'getAccountTransactions').mockResolvedValue([{
			account_address: aptosAccount.address,
			transaction_version: '42',
			user_transaction: {
				sender: aptosAccount.address,
				timestamp: '2026-07-14T08:00:00Z',
				version: '42',
			},
		}])
		vi.spyOn(queries, 'getTransaction').mockResolvedValue({
			sender: aptosAccount.address,
			timestamp: '2026-07-14T08:00:00Z',
			version: '42',
		})

		await expect(aptosAccountTransactionsResolver.resolve['NetworkAddress'].resolve(
			aptosAccount,
			resolverContext
		)).resolves.toEqual([{
			[EntityMetaKey.Selector]: {
				$network: aptosNetwork,
				version: 42n,
			},
		}])
		expect(queries.getAccountTransactions).toHaveBeenCalledWith(
			aptosAccount.address,
			25,
			5
		)
		await expect(aptosTransactionResolver.resolve['NetworkVersion'].resolve(
			{
				$network: aptosNetwork,
				version: 42n,
			}
		)).resolves.toEqual({
			version: 42n,
			transactionKind: 'user_transaction',
			sender: aptosAccount.address,
		})
	})

	it('accepts canonical Aptos identities and rejects unsupported networks before transport', async () => {
		const resolveAccountTransactions = aptosAccountTransactionsResolver.resolve[
			'NetworkAddress'
		]
		expect([
			aptosAccountTransactionsResolver,
			aptosAccountBalancesResolver,
			aptosCoinBalanceResolver,
			aptosTransactionResolver,
			aptosTableItemResolver,
			aptosTableItemTimestampResolver,
		].flatMap((resolver) => Object.values(resolver.resolve))
			.every((operation) => operation.appliesTo != null)).toBe(true)
		expect(resolveAccountTransactions.appliesTo).toEqual([
			{
				$network: {
					$network: aptosNetwork.$network,
				},
			},
			{
				$network: {
					$network: {
						slug: 'aptos',
					},
				},
			},
		])

		const getAccountTransactions = vi.spyOn(queries, 'getAccountTransactions').mockResolvedValue([])
		for (const network of [
			aptosNetwork.$network,
			{ slug: 'aptos' } as const,
		])
			await expect(resolveAccountTransactions.resolve({
				...aptosAccount,
				$network: {
					$network: network,
				},
			}, resolverContext)).resolves.toEqual([])
		expect(getAccountTransactions).toHaveBeenCalledTimes(2)

		await expect(resolveAccountTransactions.resolve({
			...aptosAccount,
			$network: {
				$network: {
					caip2: {
						namespace: 'aptos',
						reference: '2',
					},
				},
			},
		}, resolverContext)).rejects.toThrow('unsupported network')
		expect(getAccountTransactions).toHaveBeenCalledTimes(2)
	})

	it('keeps same-asset current rows distinct by official storage identity', async () => {
		const secondaryBalance = {
			...balance,
			amount: '7',
			is_primary: false,
			storage_id: '0xsecondary-store',
		}
		vi.spyOn(queries, 'getCurrentFungibleAssetBalances').mockResolvedValue([
			balance,
			secondaryBalance,
		])
		const balanceSelectors = await aptosAccountBalancesResolver.resolve['NetworkAddress'].resolve(
			aptosAccount,
			resolverContext
		)
		expect(balanceSelectors).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$account: aptosAccount,
					storageId: balance.storage_id,
					ledgerVersion: 42n,
					source: Source.AptosIndexer_Graphql,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$account: aptosAccount,
					storageId: secondaryBalance.storage_id,
					ledgerVersion: 42n,
					source: Source.AptosIndexer_Graphql,
				},
			},
		])
		expect(queries.getCurrentFungibleAssetBalances).toHaveBeenCalledWith(
			aptosAccount.address,
			25,
			5
		)

		vi.spyOn(queries, 'getCurrentFungibleAssetBalance').mockImplementation(async (storageId) => (
			storageId === secondaryBalance.storage_id ? secondaryBalance : balance
		))
		await expect(aptosCoinBalanceResolver.resolve['AccountStorageIdLedgerVersionSource'].resolve(
			balanceSelectors[0][EntityMetaKey.Selector]
		)).resolves.toEqual({
			assetType: balance.asset_type,
			isPrimary: true,
			amount: 25n,
			ownerAddress: aptosAccount.address,
			coinType: balance.asset_type_v1,
			timestampMs: 1_784_016_000_000,
		})
		await expect(aptosCoinBalanceResolver.resolve['AccountStorageIdLedgerVersionSource'].resolve(
			balanceSelectors[1][EntityMetaKey.Selector]
		)).resolves.toMatchObject({
			isPrimary: false,
			amount: 7n,
		})
		await expect(aptosCoinBalanceResolver.resolve['AccountStorageIdLedgerVersionSource'].resolve(
			{
				...balanceSelectors[0][EntityMetaKey.Selector],
				ledgerVersion: 41n,
			}
		)).rejects.toThrow('current balance observation version mismatch')
	})

	it('keeps current table point reads separate from explicit versioned rows', async () => {
		vi.spyOn(queries, 'getTableItem').mockImplementation(async (_tableHandle, _keyHash, ledgerVersion) => ({
			current: currentTableItem,
			versioned: ledgerVersion === 42n ? versionedTableItem : undefined,
		}))
		await expect(aptosTableItemResolver.resolve['NetworkTableHandleKeyHash'].resolve(
			tableItem
		)).resolves.toEqual({
			key: currentTableItem.decoded_key,
		})
		expect(aptosTableItemResolver.projections).not.toHaveProperty('$$timestamps')

		await expect(aptosTableItemTimestampResolver.resolve['TableItemLedgerVersionSource'].resolve(
			{
				$tableItem: tableItem,
				ledgerVersion: 42n,
				source: Source.AptosIndexer_Graphql,
			}
		)).resolves.toEqual({
			value: versionedTableItem.decoded_value,
		})
		await expect(aptosTableItemTimestampResolver.resolve['TableItemLedgerVersionSource'].resolve(
			{
				$tableItem: tableItem,
				ledgerVersion: 41n,
				source: Source.AptosIndexer_Graphql,
			}
		)).rejects.toThrow('versioned table item mismatch')
	})
})

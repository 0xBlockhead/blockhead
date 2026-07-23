import {
	initGraphQLTada,
	type ResultOf,
} from 'gql.tada'

import { executeAptosIndexer } from './client.ts'
import type {
	AptosIndexerGraphqlScalars,
	AptosIndexerGraphqlSchema,
} from './types.ts'

const graphql = initGraphQLTada<{
	introspection: AptosIndexerGraphqlSchema
	scalars: AptosIndexerGraphqlScalars
}>()

const accountTransactionsDocument = graphql(`
	query AptosIndexerAccountTransactions(
		$accountAddress: String!
		$limit: Int!
		$offset: Int!
	) {
		account_transactions(
			where: { account_address: { _eq: $accountAddress } }
			order_by: { transaction_version: desc }
			limit: $limit
			offset: $offset
		) {
			account_address
			transaction_version
			user_transaction {
				sender
				timestamp
				version
			}
		}
	}
`)

const transactionDocument = graphql(`
	query AptosIndexerTransaction($version: bigint!) {
		user_transactions(where: { version: { _eq: $version } }, limit: 1) {
			sender
			timestamp
			version
		}
	}
`)

const currentFungibleAssetBalancesDocument = graphql(`
	query AptosIndexerCurrentFungibleAssetBalances(
		$ownerAddress: String!
		$limit: Int!
		$offset: Int!
	) {
		current_fungible_asset_balances(
			where: { owner_address: { _eq: $ownerAddress } }
			order_by: { storage_id: asc }
			limit: $limit
			offset: $offset
		) {
			amount
			asset_type
			asset_type_v1
			is_primary
			last_transaction_timestamp
			last_transaction_version
			owner_address
			storage_id
			token_standard
		}
	}
`)

const currentFungibleAssetBalanceDocument = graphql(`
	query AptosIndexerCurrentFungibleAssetBalance($storageId: String!) {
		current_fungible_asset_balances_by_pk(storage_id: $storageId) {
			amount
			asset_type
			asset_type_v1
			is_primary
			last_transaction_timestamp
			last_transaction_version
			owner_address
			storage_id
			token_standard
		}
	}
`)

const currentTableItemDocument = graphql(`
	query AptosIndexerCurrentTableItem($tableHandle: String!, $keyHash: String!) {
		current_table_items(
			where: {
				table_handle: { _eq: $tableHandle }
				key_hash: { _eq: $keyHash }
			}
			limit: 1
		) {
			decoded_key
			decoded_value
			is_deleted
			key
			key_hash
			last_transaction_version
			table_handle
		}
	}
`)

const versionedTableItemDocument = graphql(`
	query AptosIndexerVersionedTableItem(
		$tableHandle: String!
		$key: String!
		$transactionVersion: bigint!
	) {
		table_items(
			where: {
				table_handle: { _eq: $tableHandle }
				key: { _eq: $key }
				transaction_version: { _eq: $transactionVersion }
			}
			limit: 1
		) {
			decoded_key
			decoded_value
			key
			table_handle
			transaction_version
			write_set_change_index
		}
	}
`)

export const getAccountTransactions = (
	accountAddress: string,
	limit = 100,
	offset = 0
): Promise<ResultOf<typeof accountTransactionsDocument>['account_transactions']> => {
	if (accountAddress.length === 0)
		throw new Error('AptosIndexer_Graphql: account address must not be empty')
	if (!Number.isSafeInteger(limit) || limit < 0 || limit > 100)
		throw new Error('AptosIndexer_Graphql: transaction limit must be an integer from 0 through 100')
	if (!Number.isSafeInteger(offset) || offset < 0)
		throw new Error('AptosIndexer_Graphql: transaction offset must be a nonnegative safe integer')
	if (limit === 0)
		return Promise.resolve([])

	return executeAptosIndexer(accountTransactionsDocument, {
		accountAddress,
		limit,
		offset,
	}).then((data) => {
		if (data.account_transactions.length > limit)
			throw new Error('AptosIndexer_Graphql: transaction page exceeds requested limit')

		const versions = new Set<string>()
		for (const transaction of data.account_transactions) {
			if (transaction.account_address !== accountAddress)
				throw new Error('AptosIndexer_Graphql: transaction page contains a foreign account row')
			try {
				if (
					BigInt(transaction.transaction_version) < 0n
					|| (
						transaction.user_transaction != null
						&& transaction.user_transaction.version !== transaction.transaction_version
					)
				)
					throw new Error()
			} catch {
				throw new Error('AptosIndexer_Graphql: invalid transaction version')
			}
			if (versions.has(transaction.transaction_version))
				throw new Error('AptosIndexer_Graphql: duplicate transaction version')
			versions.add(transaction.transaction_version)
		}
		return data.account_transactions
	})
}

export const getTransaction = (
	version: bigint
): Promise<ResultOf<typeof transactionDocument>['user_transactions'][number] | undefined> => (
	executeAptosIndexer(transactionDocument, {
		version: version.toString(),
	}).then((data) => data.user_transactions.at(0))
)

export const getCurrentFungibleAssetBalances = (
	ownerAddress: string,
	limit = 100,
	offset = 0
): Promise<ResultOf<typeof currentFungibleAssetBalancesDocument>['current_fungible_asset_balances']> => {
	if (ownerAddress.length === 0)
		throw new Error('AptosIndexer_Graphql: owner address must not be empty')
	if (!Number.isSafeInteger(limit) || limit < 0 || limit > 100)
		throw new Error('AptosIndexer_Graphql: balance limit must be an integer from 0 through 100')
	if (!Number.isSafeInteger(offset) || offset < 0)
		throw new Error('AptosIndexer_Graphql: balance offset must be a nonnegative safe integer')
	if (limit === 0)
		return Promise.resolve([])

	return executeAptosIndexer(currentFungibleAssetBalancesDocument, {
		ownerAddress,
		limit,
		offset,
	}).then((data) => {
		if (data.current_fungible_asset_balances.length > limit)
			throw new Error('AptosIndexer_Graphql: balance page exceeds requested limit')

		const storageIds = new Set<string>()
		for (const balance of data.current_fungible_asset_balances) {
			if (balance.owner_address !== ownerAddress)
				throw new Error('AptosIndexer_Graphql: balance page contains a foreign owner row')
			try {
				if (
					BigInt(balance.amount) < 0n
					|| (
						balance.last_transaction_version != null
						&& BigInt(balance.last_transaction_version) < 0n
					)
				)
					throw new Error()
			} catch {
				throw new Error('AptosIndexer_Graphql: invalid balance amount or version')
			}
			if (balance.storage_id.length === 0 || storageIds.has(balance.storage_id))
				throw new Error('AptosIndexer_Graphql: invalid or duplicate balance storage ID')
			storageIds.add(balance.storage_id)
		}
		return data.current_fungible_asset_balances
	})
}

export const getCurrentFungibleAssetBalance = (
	storageId: string
): Promise<ResultOf<typeof currentFungibleAssetBalanceDocument>['current_fungible_asset_balances_by_pk']> => (
	executeAptosIndexer(currentFungibleAssetBalanceDocument, {
		storageId,
	}).then((data) => data.current_fungible_asset_balances_by_pk)
)

export const getTableItem = async (
	tableHandle: string,
	keyHash: string,
	ledgerVersion?: bigint
) => {
	const current = (
		await executeAptosIndexer(currentTableItemDocument, {
			keyHash,
			tableHandle,
		})
	).current_table_items.at(0)
	if (current == null || ledgerVersion == null)
		return {
			current,
			versioned: undefined,
		}

	return {
		current,
		versioned: (
			await executeAptosIndexer(versionedTableItemDocument, {
				key: current.key,
				tableHandle,
				transactionVersion: ledgerVersion.toString(),
			})
		).table_items.at(0),
	}
}

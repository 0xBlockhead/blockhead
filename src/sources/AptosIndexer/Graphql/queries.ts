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
): Promise<ResultOf<typeof accountTransactionsDocument>['account_transactions']> => (
	executeAptosIndexer(accountTransactionsDocument, {
		accountAddress,
		limit,
		offset,
	}).then((data) => data.account_transactions)
)

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
): Promise<ResultOf<typeof currentFungibleAssetBalancesDocument>['current_fungible_asset_balances']> => (
	executeAptosIndexer(currentFungibleAssetBalancesDocument, {
		ownerAddress,
		limit,
		offset,
	}).then((data) => data.current_fungible_asset_balances)
)

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

import { type as arktype } from 'arktype'

import type { introspection } from './graphql-env.d.ts'

export type AptosIndexerGraphqlSchema = introspection

export type AptosIndexerGraphqlScalars = {
	bigint: string
	jsonb: unknown
	numeric: string
	timestamp: string
}

/** Hasura bigint / numeric scalars arrive as decimal strings. */
const aptosIndexerNonNegativeIntegerString = arktype('string').narrow((value, ctx) => {
	try {
		return BigInt(value) >= 0n || ctx.mustBe('a nonnegative integer string')
	} catch {
		return ctx.mustBe('a nonnegative integer string')
	}
})

const aptosIndexerJsonValue = arktype(
	'string | number | boolean | null | object.json'
)

export const aptosIndexerUserTransactionWire = arktype({
	sender: 'string',
	timestamp: 'string',
	version: aptosIndexerNonNegativeIntegerString,
	block_height: aptosIndexerNonNegativeIntegerString,
	gas_unit_price: aptosIndexerNonNegativeIntegerString,
})

export const aptosIndexerAccountTransactionWire = arktype({
	account_address: 'string',
	transaction_version: aptosIndexerNonNegativeIntegerString,
	'user_transaction?': aptosIndexerUserTransactionWire.or(arktype('null')),
})

export const aptosIndexerAccountTransactionsDataWire = arktype({
	account_transactions: aptosIndexerAccountTransactionWire.array(),
})

export const aptosIndexerTransactionDataWire = arktype({
	user_transactions: aptosIndexerUserTransactionWire.array(),
})

export const aptosIndexerFungibleAssetBalanceWire = arktype({
	amount: aptosIndexerNonNegativeIntegerString,
	asset_type: 'string',
	'asset_type_v1?': arktype('string').or(arktype('null')),
	is_primary: 'boolean',
	'last_transaction_timestamp?': arktype('string').or(arktype('null')),
	'last_transaction_version?': aptosIndexerNonNegativeIntegerString.or(arktype('null')),
	owner_address: 'string',
	storage_id: 'string',
	token_standard: 'string',
})

export const aptosIndexerFungibleAssetBalancesDataWire = arktype({
	current_fungible_asset_balances: aptosIndexerFungibleAssetBalanceWire.array(),
})

export const aptosIndexerFungibleAssetBalanceByPkDataWire = arktype({
	'current_fungible_asset_balances_by_pk?': aptosIndexerFungibleAssetBalanceWire.or(arktype('null')),
})

export const aptosIndexerCurrentTableItemWire = arktype({
	decoded_key: aptosIndexerJsonValue,
	'decoded_value?': aptosIndexerJsonValue,
	is_deleted: 'boolean',
	key: 'string',
	key_hash: 'string',
	last_transaction_version: aptosIndexerNonNegativeIntegerString,
	table_handle: 'string',
})

export const aptosIndexerCurrentTableItemsDataWire = arktype({
	current_table_items: aptosIndexerCurrentTableItemWire.array(),
})

export const aptosIndexerVersionedTableItemWire = arktype({
	decoded_key: aptosIndexerJsonValue,
	'decoded_value?': aptosIndexerJsonValue,
	key: 'string',
	table_handle: 'string',
	transaction_version: aptosIndexerNonNegativeIntegerString,
	write_set_change_index: aptosIndexerNonNegativeIntegerString,
})

export const aptosIndexerVersionedTableItemsDataWire = arktype({
	table_items: aptosIndexerVersionedTableItemWire.array(),
})

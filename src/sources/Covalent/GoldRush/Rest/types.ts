/**
 * GoldRush Foundational API envelopes (fail-closed arktype).
 * @see https://goldrush.dev/docs/api-reference/transactions/get-a-transaction/
 * @see https://goldrush.dev/docs/api-reference/balances/get-token-balances-for-address/
 * @see https://goldrush.dev/docs/api-reference/transactions/get-transactions-for-address-v3/
 */

import { type as arktype } from 'arktype'


const nonNegativeInteger = arktype('number.integer >= 0')
const nonEmptyString = arktype('string > 0')
const unsignedIntegerString = arktype(/^(0|[1-9][0-9]*)$/)
const evmAddress = arktype(/^0x[0-9a-fA-F]{40}$/)
const evmTransactionHash = arktype(/^0x[0-9a-fA-F]{64}$/)
const topicHash = arktype(/^0x[0-9a-fA-F]{64}$/)
const hexData = arktype(/^0x([0-9a-fA-F]{2})*$/)
const methodId = arktype(/^0x[0-9a-fA-F]*$/)
const nullableUrl = arktype('string.url').or(arktype.null)

export const goldRushLogEventWire = arktype({
	block_signed_at: nonEmptyString,
	block_height: nonNegativeInteger,
	tx_offset: nonNegativeInteger,
	log_offset: nonNegativeInteger,
	tx_hash: evmTransactionHash,
	raw_log_topics: topicHash.array().atLeastLength(1),
	sender_address: evmAddress,
	raw_log_data: hexData.or(arktype.null),
}).onUndeclaredKey('delete')

export type GoldRushLogEvent = typeof goldRushLogEventWire.infer

export const goldRushInternalTransferWire = arktype({
	from_address: evmAddress,
	to_address: evmAddress.or(arktype.null),
	value: unsignedIntegerString,
	gas_limit: nonNegativeInteger,
}).onUndeclaredKey('delete')

export type GoldRushInternalTransfer = typeof goldRushInternalTransferWire.infer

export const goldRushStorageChangeWire = arktype({
	storage_address: nonEmptyString,
	value_before: nonEmptyString,
	value_after: nonEmptyString,
}).onUndeclaredKey('delete')

export type GoldRushStorageChange = typeof goldRushStorageChangeWire.infer

export const goldRushStateChangeWire = arktype({
	address: evmAddress,
	balance_before: unsignedIntegerString,
	balance_after: unsignedIntegerString,
	storage_changes: goldRushStorageChangeWire.array(),
	nonce_before: nonNegativeInteger,
	nonce_after: nonNegativeInteger,
}).onUndeclaredKey('delete')

export type GoldRushStateChange = typeof goldRushStateChangeWire.infer

export const goldRushInputDataWire = arktype({
	method_id: methodId,
}).onUndeclaredKey('delete')

export type GoldRushInputData = typeof goldRushInputDataWire.infer

export const goldRushTransactionItemWire = arktype({
	block_signed_at: nonEmptyString,
	block_height: nonNegativeInteger,
	block_hash: topicHash,
	tx_hash: evmTransactionHash,
	tx_offset: nonNegativeInteger,
	successful: 'boolean',
	from_address: evmAddress,
	to_address: evmAddress.or(arktype.null),
	value: unsignedIntegerString,
	gas_offered: nonNegativeInteger,
	gas_spent: nonNegativeInteger,
	gas_price: nonNegativeInteger,
	log_events: goldRushLogEventWire.array(),
	'internal_transfers?': goldRushInternalTransferWire.array().or(arktype.null),
	'state_changes?': goldRushStateChangeWire.array().or(arktype.null),
	'input_data?': goldRushInputDataWire.or(arktype.null),
}).onUndeclaredKey('delete')

export type GoldRushTransactionItem = typeof goldRushTransactionItemWire.infer

export const goldRushTransactionDataWire = arktype({
	updated_at: nonEmptyString,
	chain_id: arktype('number.integer >= 1'),
	chain_name: nonEmptyString,
	items: goldRushTransactionItemWire.array(),
}).onUndeclaredKey('delete')

export type GoldRushTransactionData = typeof goldRushTransactionDataWire.infer

export const goldRushTransactionResponseWire = arktype({
	data: goldRushTransactionDataWire.or(arktype.null),
	error: 'boolean',
	error_message: nonEmptyString.or(arktype.null),
	error_code: arktype('number').or(arktype.null),
}).onUndeclaredKey('delete')

export type GoldRushTransactionResponse = typeof goldRushTransactionResponseWire.infer

export type GoldRushTransactionExpansions = {
	withInternal?: boolean
	withState?: boolean
	withInputData?: boolean
}

export const goldRushTokenBalanceItemWire = arktype({
	contract_decimals: arktype('0 <= number.integer <= 255'),
	contract_name: 'string',
	contract_ticker_symbol: nonEmptyString,
	contract_address: evmAddress,
	contract_display_name: 'string',
	supports_erc: arktype('string').array(),
	last_transferred_at: nonEmptyString.or(arktype.null),
	block_height: nonNegativeInteger,
	is_native_token: 'boolean',
	type: 'string',
	is_spam: 'boolean',
	balance: unsignedIntegerString,
	balance_24h: unsignedIntegerString.or(arktype.null),
	quote_rate: arktype('number').or(arktype.null),
	quote_rate_24h: arktype('number').or(arktype.null),
	quote: arktype('number').or(arktype.null),
	quote_24h: arktype('number').or(arktype.null),
	pretty_quote: 'string | null',
	pretty_quote_24h: 'string | null',
}).onUndeclaredKey('delete')

export type GoldRushTokenBalanceItem = typeof goldRushTokenBalanceItemWire.infer

export const goldRushTokenBalancesDataWire = arktype({
	address: evmAddress,
	chain_id: arktype('number.integer >= 1'),
	chain_name: nonEmptyString,
	chain_tip_height: nonNegativeInteger,
	chain_tip_signed_at: nonEmptyString,
	quote_currency: nonEmptyString,
	updated_at: nonEmptyString,
	items: goldRushTokenBalanceItemWire.array().atMostLength(5_000),
}).onUndeclaredKey('delete')

export type GoldRushTokenBalancesData = typeof goldRushTokenBalancesDataWire.infer

export const goldRushTokenBalancesResponseWire = arktype({
	data: goldRushTokenBalancesDataWire.or(arktype.null),
	error: 'boolean',
	error_message: nonEmptyString.or(arktype.null),
	error_code: arktype('number').or(arktype.null),
}).onUndeclaredKey('delete')

export type GoldRushTokenBalancesResponse = typeof goldRushTokenBalancesResponseWire.infer

export const goldRushAddressTransactionsDataWire = arktype({
	address: evmAddress,
	updated_at: nonEmptyString,
	quote_currency: nonEmptyString,
	chain_id: arktype('number.integer >= 1'),
	chain_name: nonEmptyString,
	chain_tip_height: nonNegativeInteger,
	chain_tip_signed_at: nonEmptyString,
	current_page: nonNegativeInteger,
	links: {
		prev: nullableUrl,
		next: nullableUrl,
	},
	items: goldRushTransactionItemWire.array().atMostLength(100),
}).onUndeclaredKey('delete')

export type GoldRushAddressTransactionsData = typeof goldRushAddressTransactionsDataWire.infer

export const goldRushAddressTransactionsResponseWire = arktype({
	data: goldRushAddressTransactionsDataWire.or(arktype.null),
	error: 'boolean',
	error_message: nonEmptyString.or(arktype.null),
	error_code: arktype('number').or(arktype.null),
}).onUndeclaredKey('delete')

export type GoldRushAddressTransactionsResponse = typeof goldRushAddressTransactionsResponseWire.infer

/** Transport fail-closed max for balances_v2; snapshots at the cap may be truncated. */
export const goldRushTokenBalancesItemsCap = 5_000

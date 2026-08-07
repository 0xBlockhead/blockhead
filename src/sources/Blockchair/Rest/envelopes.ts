/**
 * Blockchair REST API v2 fail-closed arktype envelopes for consumed explorer wires.
 *
 * @see https://blockchair.com/api/docs
 * @see https://github.com/Blockchair/Blockchair.Support/blob/master/API.md
 */

import { type as arktype } from 'arktype'


const unsignedSafe = arktype(`number.integer >= 0 <= ${Number.MAX_SAFE_INTEGER}`)
const nonEmptyString = arktype('string > 0')
const finiteNumber = arktype('number')
const stringOrNumber = arktype('string').or(finiteNumber)

export const blockchairContextWire = arktype({
	code: 'number.integer',
	'error?': 'string',
	'source?': 'string',
	'state?': unsignedSafe,
	'state_layer_2?': unsignedSafe,
	'market_price_usd?': finiteNumber,
	'cache?': 'unknown',
	'api?': 'unknown',
	'servers?': 'string',
	'time?': arktype('number').or(arktype('null')),
	'render_time?': finiteNumber,
	'full_time?': finiteNumber,
	'request_cost?': finiteNumber,
	'results?': arktype('number').or(arktype('null')),
	'limit?': arktype('number').or('string').or(arktype('null')),
	'offset?': arktype('number').or('string').or(arktype('null')),
	'rows?': arktype('number').or(arktype('null')),
})

export const blockchairBitcoinLikeStatsWire = arktype({
	'blocks?': unsignedSafe,
	'transactions?': unsignedSafe,
	'outputs?': unsignedSafe,
	'circulation?': finiteNumber,
	'blocks_24h?': unsignedSafe,
	'transactions_24h?': unsignedSafe,
	'difficulty?': finiteNumber,
	'volume_24h?': finiteNumber,
	'mempool_transactions?': unsignedSafe,
	'mempool_size?': unsignedSafe,
	'mempool_tps?': finiteNumber,
	'mempool_total_fee_usd?': finiteNumber,
	'mempool_outputs?': unsignedSafe,
	'best_block_height?': unsignedSafe,
	'best_block_hash?': nonEmptyString,
	'best_block_time?': nonEmptyString,
	'blockchain_size?': unsignedSafe,
	'average_transaction_fee_24h?': unsignedSafe,
	'average_transaction_fee_usd_24h?': finiteNumber,
	'median_transaction_fee_24h?': unsignedSafe,
	'median_transaction_fee_usd_24h?': finiteNumber,
	'inflation_24h?': finiteNumber,
	'inflation_usd_24h?': finiteNumber,
	'cdd_24h?': finiteNumber,
	'largest_transaction_24h?': {
		'hash?': 'string',
		'value_usd?': arktype('number').or(arktype('null')),
	},
	'nodes?': unsignedSafe,
	'hashrate_24h?': 'string',
	'market_price_usd?': finiteNumber,
	'market_price_btc?': finiteNumber,
	'market_price_usd_change_24h_percentage?': finiteNumber,
	'market_cap_usd?': finiteNumber,
	'market_dominance_percentage?': finiteNumber,
	'next_retarget_time_estimate?': arktype('string').or(arktype('null')),
	'next_difficulty_estimate?': arktype('number').or(arktype('null')),
	'countdowns?': 'unknown[]',
	'suggested_transaction_fee_per_byte_sat?': unsignedSafe,
	'hodling_addresses?': unsignedSafe,
})

export const blockchairEthereumLikeStatsWire = arktype({
	'blocks?': unsignedSafe,
	'transactions?': unsignedSafe,
	'calls?': unsignedSafe,
	'accounts?': unsignedSafe,
	'addresses?': unsignedSafe,
	'circulation?': stringOrNumber,
	'circulation_approximate?': stringOrNumber,
	'blocks_24h?': unsignedSafe,
	'transactions_24h?': unsignedSafe,
	'calls_24h?': unsignedSafe,
	'difficulty?': stringOrNumber,
	'volume_24h?': stringOrNumber,
	'volume_24h_approximate?': stringOrNumber,
	'mempool_transactions?': unsignedSafe,
	'mempool_size?': unsignedSafe,
	'mempool_tps?': finiteNumber,
	'mempool_median_gas_price?': unsignedSafe,
	'mempool_total_value_approximate?': stringOrNumber,
	'best_block_height?': unsignedSafe,
	'best_block_hash?': nonEmptyString,
	'best_block_time?': nonEmptyString,
	'blockchain_size?': unsignedSafe,
	'average_transaction_fee_24h?': stringOrNumber,
	'average_transaction_fee_usd_24h?': finiteNumber,
	'median_transaction_fee_24h?': stringOrNumber,
	'median_transaction_fee_usd_24h?': finiteNumber,
	'market_price_usd?': finiteNumber,
	'market_price_btc?': finiteNumber,
	'market_price_usd_change_24h_percentage?': finiteNumber,
	'market_cap_usd?': finiteNumber,
	'market_dominance_percentage?': finiteNumber,
	'suggested_transaction_fee_gwei?': unsignedSafe,
	'suggested_transaction_fee_gwei_options?': 'Record<string, number>',
	'layer_2?': 'unknown',
	'uncles?': unsignedSafe,
	'uncles_24h?': unsignedSafe,
	'burned?': stringOrNumber,
	'burned_24h?': stringOrNumber,
	'countdowns?': 'unknown[]',
	'hashrate_24h?': 'string',
	'largest_transaction_24h?': {
		'hash?': 'string',
		'value_usd?': arktype('number').or(arktype('null')),
	},
})

export const blockchairBitcoinLikeBlockWire = arktype({
	id: unsignedSafe,
	hash: nonEmptyString,
	'date?': 'string',
	'time?': 'string',
	'median_time?': arktype('string').or(arktype('null')),
	'size?': unsignedSafe,
	'stripped_size?': unsignedSafe,
	'weight?': unsignedSafe,
	'version?': 'number.integer',
	'version_hex?': 'string',
	'version_bits?': 'string',
	'merkle_root?': 'string',
	'nonce?': unsignedSafe,
	'bits?': unsignedSafe,
	'difficulty?': finiteNumber,
	'chainwork?': 'string',
	'coinbase_data_hex?': arktype('string').or(arktype('null')),
	'transaction_count?': unsignedSafe,
	'witness_count?': unsignedSafe,
	'input_count?': unsignedSafe,
	'output_count?': unsignedSafe,
	'input_total?': finiteNumber,
	'input_total_usd?': finiteNumber,
	'output_total?': finiteNumber,
	'output_total_usd?': finiteNumber,
	'fee_total?': finiteNumber,
	'fee_total_usd?': finiteNumber,
	'fee_per_kb?': finiteNumber,
	'fee_per_kb_usd?': finiteNumber,
	'fee_per_kwu?': finiteNumber,
	'fee_per_kwu_usd?': finiteNumber,
	'cdd_total?': finiteNumber,
	'generation?': finiteNumber,
	'generation_usd?': finiteNumber,
	'reward?': finiteNumber,
	'reward_usd?': finiteNumber,
	'guessed_miner?': arktype('string').or(arktype('null')),
})

export const blockchairBitcoinLikeTransactionWire = arktype({
	'block_id?': 'number.integer',
	'id?': unsignedSafe,
	hash: nonEmptyString,
	'date?': 'string',
	'time?': 'string',
	'size?': unsignedSafe,
	'weight?': unsignedSafe,
	'version?': 'number.integer',
	'lock_time?': unsignedSafe,
	'is_coinbase?': 'boolean',
	'has_witness?': 'boolean',
	'input_count?': unsignedSafe,
	'output_count?': unsignedSafe,
	'input_total?': finiteNumber,
	'input_total_usd?': finiteNumber,
	'output_total?': finiteNumber,
	'output_total_usd?': finiteNumber,
	'fee?': unsignedSafe,
	'fee_usd?': finiteNumber,
	'fee_per_kb?': finiteNumber,
	'fee_per_kb_usd?': finiteNumber,
	'fee_per_kwu?': finiteNumber,
	'fee_per_kwu_usd?': finiteNumber,
	'cdd_total?': finiteNumber,
	'is_rbf?': 'boolean',
})

export const blockchairBitcoinLikeIoWire = arktype({
	'block_id?': 'number.integer',
	'transaction_hash?': 'string',
	'index?': unsignedSafe,
	'time?': 'string',
	'value?': unsignedSafe,
	'value_usd?': finiteNumber,
	'recipient?': 'string',
	'type?': 'string',
	'script_hex?': 'string',
	'is_from_coinbase?': 'boolean',
	'is_spendable?': 'boolean',
	'spending_block_id?': arktype('number.integer').or(arktype('null')),
	'spending_transaction_hash?': arktype('string').or(arktype('null')),
	'spending_index?': arktype('number.integer').or(arktype('null')),
	'spending_time?': arktype('string').or(arktype('null')),
	'spending_value_usd?': arktype('number').or(arktype('null')),
	'spending_sequence?': arktype('number.integer').or(arktype('null')),
	'spending_signature_hex?': arktype('string').or(arktype('null')),
	'spending_witness?': arktype('string').or(arktype('null')),
	'lifespan?': arktype('number').or(arktype('null')),
	'cdd?': arktype('number').or(arktype('null')),
})

export const blockchairBitcoinLikeAddressWire = arktype({
	'type?': 'string',
	'script_hex?': 'string',
	'balance?': unsignedSafe,
	'balance_usd?': finiteNumber,
	'received?': unsignedSafe,
	'received_usd?': finiteNumber,
	'spent?': unsignedSafe,
	'spent_usd?': finiteNumber,
	'output_count?': unsignedSafe,
	'unspent_output_count?': unsignedSafe,
	'first_seen_receiving?': arktype('string').or(arktype('null')),
	'last_seen_receiving?': arktype('string').or(arktype('null')),
	'first_seen_spending?': arktype('string').or(arktype('null')),
	'last_seen_spending?': arktype('string').or(arktype('null')),
	'transaction_count?': unsignedSafe,
})

export const blockchairBitcoinLikeBlockDashboardWire = arktype({
	block: blockchairBitcoinLikeBlockWire,
	transactions: blockchairBitcoinLikeTransactionWire.array(),
})

export const blockchairBitcoinLikeTransactionDashboardWire = arktype({
	transaction: blockchairBitcoinLikeTransactionWire,
	inputs: blockchairBitcoinLikeIoWire.array(),
	outputs: blockchairBitcoinLikeIoWire.array(),
})

export const blockchairBitcoinLikeAddressDashboardWire = arktype({
	address: blockchairBitcoinLikeAddressWire,
	transactions: (
		arktype('string').array()
			.or(blockchairBitcoinLikeTransactionWire.array())
	),
	'utxo?': blockchairBitcoinLikeIoWire.array(),
})

export const blockchairBitcoinLikeStatsResponseWire = arktype({
	data: blockchairBitcoinLikeStatsWire,
	context: blockchairContextWire,
})

export const blockchairEthereumLikeStatsResponseWire = arktype({
	data: blockchairEthereumLikeStatsWire,
	context: blockchairContextWire,
})

export const blockchairBitcoinLikeBlockDashboardResponseWire = arktype({
	data: {
		'[string]': blockchairBitcoinLikeBlockDashboardWire,
	},
	context: blockchairContextWire,
})

export const blockchairBitcoinLikeTransactionDashboardResponseWire = arktype({
	data: {
		'[string]': blockchairBitcoinLikeTransactionDashboardWire,
	},
	context: blockchairContextWire,
})

export const blockchairBitcoinLikeAddressDashboardResponseWire = arktype({
	data: {
		'[string]': blockchairBitcoinLikeAddressDashboardWire,
	},
	context: blockchairContextWire,
})

export const blockchairBitcoinLikeBlocksResponseWire = arktype({
	data: blockchairBitcoinLikeBlockWire.array(),
	context: blockchairContextWire,
})

export const blockchairBitcoinLikeTransactionsResponseWire = arktype({
	data: blockchairBitcoinLikeTransactionWire.array(),
	context: blockchairContextWire,
})

export const assertBlockchairEnvelope = <_Value>(
	wire: {
		assert: (value: unknown) => _Value
	},
	response: unknown,
	label: string
): _Value => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`Blockchair_Rest: invalid ${label} envelope`)
	}
}

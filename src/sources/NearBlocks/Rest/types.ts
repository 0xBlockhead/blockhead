import { type as arktype } from 'arktype'

export const nearBlocksUnsignedDecimal = '/^(0|[1-9]\\d*)$/'

export const nearBlocksNonnegativeIntegerWire = arktype(nearBlocksUnsignedDecimal)
	.or('number.integer >= 0')

export const nearBlocksAccountLifecycleWire = arktype({
	'block_timestamp?': arktype(nearBlocksUnsignedDecimal)
		.or('number.integer >= 0')
		.or('null'),
	'transaction_hash?': arktype('string > 0').or('null'),
})

export const nearBlocksAccountWire = arktype({
	account_id: 'string > 0',
	amount: nearBlocksUnsignedDecimal,
	block_hash: 'string > 0',
	block_height: nearBlocksNonnegativeIntegerWire,
	'created?': nearBlocksAccountLifecycleWire.or('null'),
	'deleted?': nearBlocksAccountLifecycleWire.or('null'),
	'locked?': nearBlocksUnsignedDecimal,
	'storage_usage?': nearBlocksNonnegativeIntegerWire,
})

export type NearBlocksAccount = typeof nearBlocksAccountWire.infer

export const nearBlocksAccountResponseWire = arktype({
	account: nearBlocksAccountWire.array(),
})

export type NearBlocksAccountResponse = typeof nearBlocksAccountResponseWire.infer

export const nearBlocksBlockWire = arktype({
	'author_account_id?': 'string > 0',
	block_hash: 'string > 0',
	block_height: nearBlocksNonnegativeIntegerWire,
	block_timestamp: nearBlocksUnsignedDecimal,
	'chunks_agg?': {
		'gas_limit?': 'number.integer >= 0',
		'gas_used?': 'number.integer >= 0',
		'shards?': 'number.integer >= 0',
	},
	'epoch_id?': 'string > 0',
	'gas_price?': nearBlocksUnsignedDecimal,
	'prev_block_hash?': 'string > 0',
	'receipts_agg?': {
		'count?': 'number.integer >= 0',
	},
	'transactions_agg?': {
		'count?': 'number.integer >= 0',
	},
})

export type NearBlocksBlock = typeof nearBlocksBlockWire.infer

export const nearBlocksBlockResponseWire = arktype({
	blocks: nearBlocksBlockWire.array(),
})

export type NearBlocksBlockResponse = typeof nearBlocksBlockResponseWire.infer

export const nearBlocksActionWire = arktype({
	action: 'string > 0',
	'args?': arktype('string').or('null'),
	'deposit?': nearBlocksNonnegativeIntegerWire,
	'fee?': nearBlocksNonnegativeIntegerWire,
	'method?': arktype('string > 0').or('null'),
})

export type NearBlocksAction = typeof nearBlocksActionWire.infer

export const nearBlocksTransactionWire = arktype({
	actions: nearBlocksActionWire.array(),
	'actions_agg?': {
		'deposit?': nearBlocksNonnegativeIntegerWire,
		'gas_attached?': nearBlocksNonnegativeIntegerWire,
	},
	'block?': {
		'block_height?': nearBlocksNonnegativeIntegerWire,
	},
	block_timestamp: nearBlocksUnsignedDecimal,
	included_in_block_hash: 'string > 0',
	'nonce?': nearBlocksNonnegativeIntegerWire,
	'outcomes?': {
		'status?': 'boolean | null',
	},
	'outcomes_agg?': {
		'gas_used?': nearBlocksNonnegativeIntegerWire,
		'transaction_fee?': nearBlocksNonnegativeIntegerWire,
	},
	'receipt_conversion_gas_burnt?': nearBlocksUnsignedDecimal,
	'receipt_conversion_tokens_burnt?': nearBlocksUnsignedDecimal,
	receiver_account_id: 'string > 0',
	'shard_id?': nearBlocksNonnegativeIntegerWire,
	signer_account_id: 'string > 0',
	transaction_hash: 'string > 0',
})

export type NearBlocksTransaction = typeof nearBlocksTransactionWire.infer

export const nearBlocksTransactionResponseWire = arktype({
	txns: nearBlocksTransactionWire.array(),
})

export type NearBlocksTransactionResponse = typeof nearBlocksTransactionResponseWire.infer

export const nearBlocksV3ErrorWire = arktype({
	message: 'string > 0',
	'path?': 'string',
})

export type NearBlocksV3Error = typeof nearBlocksV3ErrorWire.infer

export const nearBlocksV3AccountBalanceWire = arktype({
	account_id: 'string > 0',
	amount: nearBlocksUnsignedDecimal,
	amount_staked: nearBlocksUnsignedDecimal,
	storage_usage: nearBlocksUnsignedDecimal,
})

export type NearBlocksV3AccountBalance = typeof nearBlocksV3AccountBalanceWire.infer

export const nearBlocksV3TransactionWire = arktype({
	actions: arktype({
		action: 'string > 0',
		'method?': arktype('string > 0').or('null'),
	}).array(),
	actions_agg: {
		deposit: nearBlocksUnsignedDecimal,
		'gas_attached?': nearBlocksUnsignedDecimal,
	},
	block: {
		block_hash: 'string > 0',
		block_height: nearBlocksUnsignedDecimal,
		block_timestamp: nearBlocksUnsignedDecimal,
	},
	'block_timestamp?': nearBlocksUnsignedDecimal,
	index_in_chunk: 'number.integer >= 0',
	outcomes: {
		status: 'boolean',
		'status_key?': 'string > 0',
	},
	outcomes_agg: {
		'gas_used?': nearBlocksUnsignedDecimal,
		transaction_fee: nearBlocksUnsignedDecimal,
	},
	'receipt_conversion_gas_burnt?': nearBlocksUnsignedDecimal,
	'receipt_conversion_tokens_burnt?': nearBlocksUnsignedDecimal,
	receiver_account_id: 'string > 0',
	shard_id: 'number.integer >= 0',
	signer_account_id: 'string > 0',
	transaction_hash: 'string > 0',
})

export type NearBlocksV3Transaction = typeof nearBlocksV3TransactionWire.infer

export const nearBlocksV3AccountBalanceResponseWire = arktype({
	data: nearBlocksV3AccountBalanceWire.or('null'),
	'errors?': nearBlocksV3ErrorWire.array(),
	'meta?': {
		'next_page?': 'string > 0',
		'prev_page?': 'string > 0',
	},
})

export const nearBlocksV3TransactionPageResponseWire = arktype({
	data: nearBlocksV3TransactionWire.array().or('null'),
	'errors?': nearBlocksV3ErrorWire.array(),
	'meta?': {
		'next_page?': 'string > 0',
		'prev_page?': 'string > 0',
	},
})

export type NearBlocksV3Response<_Data> = {
	data: _Data | null
	errors?: NearBlocksV3Error[]
	meta?: {
		next_page?: string
		prev_page?: string
	}
}

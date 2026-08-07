import { type } from 'arktype'


const nonNegativeInteger = type('number.integer >= 0')
const nonEmptyString = type('string > 0')


export const MoneroRpcBlockHeader = type({
	block_size: nonNegativeInteger,
	block_weight: nonNegativeInteger,
	cumulative_difficulty: nonNegativeInteger,
	cumulative_difficulty_top64: nonNegativeInteger,
	depth: nonNegativeInteger,
	difficulty: nonNegativeInteger,
	difficulty_top64: nonNegativeInteger,
	hash: nonEmptyString,
	height: nonNegativeInteger,
	long_term_weight: nonNegativeInteger,
	major_version: nonNegativeInteger,
	minor_version: nonNegativeInteger,
	nonce: nonNegativeInteger,
	num_txes: nonNegativeInteger,
	orphan_status: 'boolean',
	pow_hash: 'string',
	prev_hash: nonEmptyString,
	reward: nonNegativeInteger,
	timestamp: nonNegativeInteger,
})

export type MoneroRpcBlockHeader = typeof MoneroRpcBlockHeader.infer

export const MoneroRpcBlock = type({
	blob: nonEmptyString,
	block_header: MoneroRpcBlockHeader,
	'json?': 'string',
	miner_tx_hash: nonEmptyString,
	'tx_hashes?': 'string[]',
})

export type MoneroRpcBlock = typeof MoneroRpcBlock.infer

export const MoneroRpcInfo = type({
	'adjusted_time?': nonNegativeInteger,
	alt_blocks_count: nonNegativeInteger,
	'block_size_limit?': nonNegativeInteger,
	'block_size_median?': nonNegativeInteger,
	'block_weight_limit?': nonNegativeInteger,
	'block_weight_median?': nonNegativeInteger,
	'bootstrap_daemon_address?': 'string',
	'busy_syncing?': 'boolean',
	'credits?': nonNegativeInteger,
	cumulative_difficulty: nonNegativeInteger,
	'cumulative_difficulty_top64?': nonNegativeInteger,
	'database_size?': nonNegativeInteger,
	difficulty: nonNegativeInteger,
	'difficulty_top64?': nonNegativeInteger,
	'free_space?': nonNegativeInteger,
	grey_peerlist_size: nonNegativeInteger,
	height: nonNegativeInteger,
	'height_without_bootstrap?': nonNegativeInteger,
	incoming_connections_count: nonNegativeInteger,
	mainnet: 'boolean',
	nettype: nonEmptyString,
	offline: 'boolean',
	outgoing_connections_count: nonNegativeInteger,
	'rpc_connections_count?': nonNegativeInteger,
	stagenet: 'boolean',
	'start_time?': nonNegativeInteger,
	status: nonEmptyString,
	synchronized: 'boolean',
	target: nonNegativeInteger,
	target_height: nonNegativeInteger,
	testnet: 'boolean',
	top_block_hash: nonEmptyString,
	tx_count: nonNegativeInteger,
	tx_pool_size: nonNegativeInteger,
	untrusted: 'boolean',
	'update_available?': 'boolean',
	version: nonEmptyString,
	was_bootstrap_ever_used: 'boolean',
	white_peerlist_size: nonNegativeInteger,
	'wide_cumulative_difficulty?': 'string',
	'wide_difficulty?': 'string',
})

export type MoneroRpcInfo = typeof MoneroRpcInfo.infer

export const MoneroRpcDecodedTransaction = type({
	version: 'number',
	unlock_time: 'number',
	vin: type({
		'gen?': {
			height: 'number',
		},
		'key?': {
			amount: 'number',
			key_offsets: 'number[]',
			k_image: 'string',
		},
	}).array(),
	vout: type({
		amount: 'number',
		target: {
			'key?': 'string',
			'tagged_key?': {
				key: 'string',
				view_tag: 'string',
			},
		},
	}).array(),
	'rct_signatures?': {
		'txnFee?': 'number | string',
		'outPk?': type({
			'mask?': 'string',
		}).array(),
	},
})

export type MoneroRpcDecodedTransaction = typeof MoneroRpcDecodedTransaction.infer

export type MoneroRpcTransactionInput = MoneroRpcDecodedTransaction['vin'][number]

export type MoneroRpcTransactionOutput = MoneroRpcDecodedTransaction['vout'][number]

export const MoneroRpcTransactionWire = type({
	as_hex: 'string',
	'as_json?': 'string',
	block_height: 'number',
	block_timestamp: 'number',
	double_spend_seen: 'boolean',
	in_pool: 'boolean',
	output_indices: 'number[]',
	tx_hash: 'string',
})

export type MoneroRpcTransactionWire = typeof MoneroRpcTransactionWire.infer

export type MoneroRpcTransaction = MoneroRpcTransactionWire & {
	decoded_json?: MoneroRpcDecodedTransaction
}

export const MoneroRpcOut = type({
	height: nonNegativeInteger,
	key: nonEmptyString,
	mask: nonEmptyString,
	unlocked: 'boolean',
	'txid?': 'string',
})

export type MoneroRpcOut = typeof MoneroRpcOut.infer

export const MoneroRpcOuts = type({
	outs: MoneroRpcOut.array(),
	status: nonEmptyString,
	'untrusted?': 'boolean',
	'credits?': nonNegativeInteger,
	'top_hash?': 'string',
})

export type MoneroRpcOuts = typeof MoneroRpcOuts.infer

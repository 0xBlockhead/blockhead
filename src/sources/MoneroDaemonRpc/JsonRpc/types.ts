import { type } from 'arktype'

export type MoneroRpcBlockHeader = {
	block_size: number
	block_weight: number
	cumulative_difficulty: number
	cumulative_difficulty_top64: number
	depth: number
	difficulty: number
	difficulty_top64: number
	hash: string
	height: number
	long_term_weight: number
	major_version: number
	minor_version: number
	nonce: number
	num_txes: number
	orphan_status: boolean
	pow_hash: string
	prev_hash: string
	reward: number
	timestamp: number
}

export type MoneroRpcBlock = {
	blob: string
	block_header: MoneroRpcBlockHeader
	json?: string
	miner_tx_hash: string
	tx_hashes?: string[]
}

export type MoneroRpcInfo = {
	adjusted_time?: number
	alt_blocks_count: number
	block_size_limit?: number
	block_size_median?: number
	block_weight_limit?: number
	block_weight_median?: number
	bootstrap_daemon_address?: string
	busy_syncing?: boolean
	credits?: number
	cumulative_difficulty: number
	cumulative_difficulty_top64?: number
	database_size?: number
	difficulty: number
	difficulty_top64?: number
	free_space?: number
	grey_peerlist_size: number
	height: number
	height_without_bootstrap?: number
	incoming_connections_count: number
	mainnet: boolean
	nettype: string
	offline: boolean
	outgoing_connections_count: number
	rpc_connections_count?: number
	stagenet: boolean
	start_time?: number
	status: string
	synchronized: boolean
	target: number
	target_height: number
	testnet: boolean
	top_block_hash: string
	tx_count: number
	tx_pool_size: number
	untrusted: boolean
	update_available?: boolean
	version: string
	was_bootstrap_ever_used: boolean
	white_peerlist_size: number
	wide_cumulative_difficulty?: string
	wide_difficulty?: string
}

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

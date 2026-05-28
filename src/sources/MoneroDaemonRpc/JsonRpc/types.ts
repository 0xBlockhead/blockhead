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
	tx_hashes: string[]
}

export type MoneroRpcTransaction = {
	as_hex: string
	as_json?: string
	decoded_json?: MoneroRpcDecodedTransaction
	block_height: number
	block_timestamp: number
	double_spend_seen: boolean
	in_pool: boolean
	output_indices: number[]
	tx_hash: string
}

export type MoneroRpcDecodedTransaction = {
	version: number
	unlock_time: number
	vin: MoneroRpcTransactionInput[]
	vout: MoneroRpcTransactionOutput[]
	rct_signatures?: {
		txnFee?: number | string
		outPk?: {
			mask?: string
		}[]
	}
}

export type MoneroRpcTransactionInput = {
	gen?: {
		height: number
	}
	key?: {
		amount: number
		key_offsets: number[]
		k_image: string
	}
}

export type MoneroRpcTransactionOutput = {
	amount: number
	target: {
		key?: string
		tagged_key?: {
			key: string
			view_tag: string
		}
	}
}

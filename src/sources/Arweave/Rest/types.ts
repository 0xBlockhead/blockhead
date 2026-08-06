export type ArweaveTransactionTagWire = {
	name: string
	value: string
}

export type ArweaveTransactionWire = {
	format: number
	id: string
	last_tx: string
	owner: string
	tags: ArweaveTransactionTagWire[]
	target: string
	quantity: string
	data: string
	data_size: string
	data_root: string
	reward: string
	signature: string
}

export type ArweaveTransactionStatus = {
	block_height: number
	block_indep_hash: string
	number_of_confirmations: number
}

/** @see https://docs.arweave.org/developers/arweave-node-server/http-api#network-info */
export type ArweaveNetworkInfoWire = {
	network: string
	version: number
	release: number
	height: number
	current: string
	blocks: number
	peers: number
	queue_length: number
	node_state_latency?: number
}

/**
 * Gateway block object (request `X-Block-Format: 2`).
 * @see https://docs.arweave.org/developers/arweave-node-server/http-api#get-block-by-hash-id
 * @see https://docs.arweave.org/developers/arweave-node-server/http-api#get-block-by-height
 */
export type ArweaveBlockWire = {
	indep_hash: string
	previous_block: string
	timestamp: number
	height: number
	txs: string[]
	tx_root?: string
	wallet_list?: string
	reward_addr?: string
	reward_pool?: string | number
	weave_size?: string | number
	block_size?: string | number
	cumulative_diff?: string | number
	hash_list_merkle?: string
}

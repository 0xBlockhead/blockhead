import { type as arktype } from 'arktype'


const base64Url = arktype('/^[A-Za-z0-9_-]+$/')
const base64UrlId = arktype('/^[A-Za-z0-9_-]{43}$/')
const blockHash = arktype('/^[A-Za-z0-9_-]{64}$/')
const unsignedDecimal = arktype('/^(0|[1-9][0-9]*)$/')
const nonNegativeSafeInteger = arktype('number.integer >= 0')


export const arweaveTransactionTagWire = arktype({
	name: base64Url,
	value: base64Url,
})

export const arweaveTransactionWire = arktype({
	format: 'number.integer >= 1',
	id: base64UrlId,
	last_tx: 'string',
	owner: base64Url,
	tags: arweaveTransactionTagWire.array(),
	target: 'string',
	quantity: unsignedDecimal,
	data: 'string',
	data_size: unsignedDecimal,
	data_root: 'string',
	reward: unsignedDecimal,
	signature: 'string > 0',
})

export const arweaveTransactionStatusWire = arktype({
	block_height: nonNegativeSafeInteger,
	block_indep_hash: blockHash,
	number_of_confirmations: nonNegativeSafeInteger,
})

/** @see https://docs.arweave.org/developers/arweave-node-server/http-api#network-info */
export const arweaveNetworkInfoWire = arktype({
	network: 'string > 0',
	version: 'number.integer',
	release: 'number.integer',
	height: nonNegativeSafeInteger,
	current: blockHash,
	blocks: nonNegativeSafeInteger,
	peers: nonNegativeSafeInteger,
	queue_length: nonNegativeSafeInteger,
	'node_state_latency?': nonNegativeSafeInteger,
})

/**
 * Gateway block object (request `X-Block-Format: 2`).
 * @see https://docs.arweave.org/developers/arweave-node-server/http-api#get-block-by-hash-id
 * @see https://docs.arweave.org/developers/arweave-node-server/http-api#get-block-by-height
 */
export const arweaveBlockWire = arktype({
	indep_hash: blockHash,
	previous_block: 'string',
	timestamp: nonNegativeSafeInteger,
	height: nonNegativeSafeInteger,
	txs: base64UrlId.array(),
	'tx_root?': 'string',
	'wallet_list?': 'string',
	'reward_addr?': 'string',
	'reward_pool?': arktype('string | number'),
	'weave_size?': arktype('string | number'),
	'block_size?': arktype('string | number'),
	'cumulative_diff?': arktype('string | number'),
	'hash_list_merkle?': 'string',
})

/** `GET /tx/{id}/offset` — weave byte offset + size. */
export const arweaveTransactionOffsetWire = arktype({
	offset: unsignedDecimal,
	size: unsignedDecimal,
})

export type ArweaveTransactionTagWire = typeof arweaveTransactionTagWire.infer
export type ArweaveTransactionWire = typeof arweaveTransactionWire.infer
export type ArweaveTransactionStatus = typeof arweaveTransactionStatusWire.infer
export type ArweaveNetworkInfoWire = typeof arweaveNetworkInfoWire.infer
export type ArweaveBlockWire = typeof arweaveBlockWire.infer
export type ArweaveTransactionOffsetWire = typeof arweaveTransactionOffsetWire.infer

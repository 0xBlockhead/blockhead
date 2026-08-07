import { type } from 'arktype'

// https://docs.envio.dev/docs/HyperSync-LLM/hypersync-complete
// https://docs.envio.dev/docs/HyperSync/hypersync-curl-examples

const zeroExHash32 = type('/^0x[0-9a-fA-F]{64}$/')
const zeroExAddress20 = type('/^0x[0-9a-fA-F]{40}$/')
const nonNegativeInteger = type('number.integer >= 0')
const quantityHex = type('/^0x[0-9a-fA-F]+$/')

/** `GET /height` — current HyperSync archive tip. */
export const EnvioHyperSyncHeightResponse = type({
	height: nonNegativeInteger,
})

export type EnvioHyperSyncHeightResponse = typeof EnvioHyperSyncHeightResponse.infer

export const EnvioHyperSyncBlock = type({
	number: nonNegativeInteger,
	hash: zeroExHash32,
	parent_hash: zeroExHash32,
	timestamp: nonNegativeInteger,
	miner: zeroExAddress20,
	gas_used: quantityHex,
	gas_limit: quantityHex,
	'base_fee_per_gas?': quantityHex,
	'blob_gas_used?': quantityHex,
	'excess_blob_gas?': quantityHex,
})

export type EnvioHyperSyncBlock = typeof EnvioHyperSyncBlock.infer

export const EnvioHyperSyncTransaction = type({
	block_number: nonNegativeInteger,
	hash: zeroExHash32,
})

export type EnvioHyperSyncTransaction = typeof EnvioHyperSyncTransaction.infer

export const EnvioHyperSyncRollbackGuard = type({
	block_number: nonNegativeInteger,
	timestamp: type('number.integer'),
	hash: zeroExHash32,
	first_block_number: nonNegativeInteger,
	first_parent_hash: zeroExHash32,
})

export type EnvioHyperSyncRollbackGuard = typeof EnvioHyperSyncRollbackGuard.infer

export const EnvioHyperSyncBlockRangeResponse = type({
	'archive_height?': nonNegativeInteger,
	next_block: nonNegativeInteger,
	total_execution_time: type('number >= 0'),
	data: {
		blocks: EnvioHyperSyncBlock.array(),
		transactions: EnvioHyperSyncTransaction.array(),
	},
	'rollback_guard?': EnvioHyperSyncRollbackGuard.or('null'),
})

export type EnvioHyperSyncBlockRangeResponse = typeof EnvioHyperSyncBlockRangeResponse.infer

export type EnvioHyperSyncBlockRangeRequest = {
	from_block: number
	to_block: number
	include_all_blocks: true
	field_selection: {
		block: readonly [
			'number',
			'hash',
			'parent_hash',
			'timestamp',
			'miner',
			'gas_used',
			'gas_limit',
			'base_fee_per_gas',
			'blob_gas_used',
			'excess_blob_gas',
		]
		transaction: readonly [
			'block_number',
			'hash',
		]
	}
}

export enum EnvioHyperSyncResolution {
	Complete = 'Complete',
	Empty = 'Empty',
	Partial = 'Partial',
	Reorg = 'Reorg',
}

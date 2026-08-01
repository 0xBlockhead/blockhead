import { type } from 'arktype'

// https://docs.envio.dev/docs/HyperSync-LLM/hypersync-complete
export const EnvioHyperSyncBlock = type({
	number: 'number.integer >= 0',
	hash: 'string',
	parent_hash: 'string',
	timestamp: 'number.integer >= 0',
	gas_used: 'string',
	gas_limit: 'string',
	'base_fee_per_gas?': 'string',
	'blob_gas_used?': 'string',
	'excess_blob_gas?': 'string',
})

export type EnvioHyperSyncBlock = typeof EnvioHyperSyncBlock.infer

export const EnvioHyperSyncTransaction = type({
	block_number: 'number.integer >= 0',
	hash: 'string',
})

export type EnvioHyperSyncTransaction = typeof EnvioHyperSyncTransaction.infer

export const EnvioHyperSyncRollbackGuard = type({
	block_number: 'number.integer >= 0',
	timestamp: 'number.integer',
	hash: 'string',
	first_block_number: 'number.integer >= 0',
	first_parent_hash: 'string',
})

export type EnvioHyperSyncRollbackGuard = typeof EnvioHyperSyncRollbackGuard.infer

export const EnvioHyperSyncBlockRangeResponse = type({
	'archive_height?': 'number.integer >= 0',
	next_block: 'number.integer >= 0',
	total_execution_time: 'number >= 0',
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

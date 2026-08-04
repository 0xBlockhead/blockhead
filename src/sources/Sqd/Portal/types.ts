import { type } from 'arktype'

// https://docs.sqd.dev/en/api/evm/introduction
export const SqdPortalEvmBlock = type({
	header: {
		number: 'number.integer >= 0',
		hash: 'string',
		parentHash: 'string',
		timestamp: 'number.integer >= 0',
		miner: 'string',
		gasUsed: 'string',
		gasLimit: 'string',
		'baseFeePerGas?': 'string',
		'blobGasUsed?': 'string | null',
		'excessBlobGas?': 'string | null',
	},
	transactions: type({
		hash: 'string',
	}).array(),
})

export type SqdPortalEvmBlock = typeof SqdPortalEvmBlock.infer

export type SqdPortalEvmBlockRequest = {
	type: 'evm'
	fromBlock: number
	toBlock: number
	parentBlockHash?: string
	includeAllBlocks: true
	fields: {
		block: {
			number: true
			hash: true
			parentHash: true
			timestamp: true
			miner: true
			gasUsed: true
			gasLimit: true
			baseFeePerGas: true
			blobGasUsed: true
			excessBlobGas: true
		}
		transaction: {
			hash: true
		}
	}
	transactions: readonly Record<never, never>[]
}

export type SqdPortalFinalizedHead = {
	number: number
	hash: string
}

export const SqdPortalReorg = type({
	previousBlocks: type({
		number: 'number.integer >= 0',
		hash: 'string',
	}).array(),
})

export type SqdPortalReorg = typeof SqdPortalReorg.infer

export enum SqdPortalResolution {
	Complete = 'Complete',
	Empty = 'Empty',
	Partial = 'Partial',
	Reorg = 'Reorg',
}

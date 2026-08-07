import { type } from 'arktype'

// https://docs.sqd.dev/en/api/evm/introduction
// https://docs.sqd.dev/en/api/evm/head
// https://docs.sqd.dev/en/api/evm/finalized-head

const zeroExHash32 = type('/^0x[0-9a-fA-F]{64}$/')
const zeroExAddress20 = type('/^0x[0-9a-fA-F]{40}$/')
const nonNegativeInteger = type('number.integer >= 0')
const quantityHex = type('/^0x[0-9a-fA-F]+$/')

/** `GET /head` and `GET /finalized-head` — highest (finalized) block in the dataset. */
export const SqdPortalBlockHead = type({
	number: nonNegativeInteger,
	hash: zeroExHash32,
})

export type SqdPortalBlockHead = typeof SqdPortalBlockHead.infer

export const SqdPortalEvmBlock = type({
	header: {
		number: nonNegativeInteger,
		hash: zeroExHash32,
		parentHash: zeroExHash32,
		timestamp: nonNegativeInteger,
		miner: zeroExAddress20,
		gasUsed: quantityHex,
		gasLimit: quantityHex,
		'baseFeePerGas?': quantityHex,
		'blobGasUsed?': quantityHex.or('null'),
		'excessBlobGas?': quantityHex.or('null'),
	},
	transactions: type({
		hash: zeroExHash32,
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

export type SqdPortalFinalizedHead = SqdPortalBlockHead

export const SqdPortalReorg = type({
	previousBlocks: type({
		number: nonNegativeInteger,
		hash: zeroExHash32,
	}).array(),
})

export type SqdPortalReorg = typeof SqdPortalReorg.infer

export enum SqdPortalResolution {
	Complete = 'Complete',
	Empty = 'Empty',
	Partial = 'Partial',
	Reorg = 'Reorg',
}

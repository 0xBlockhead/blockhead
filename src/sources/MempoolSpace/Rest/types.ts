import { type as arktype } from 'arktype'

export const mempoolSpaceMiningHashrateWire = arktype({
	hashrates: arktype({
		timestamp: 'number.integer >= 0',
		avgHashrate: 'number >= 0',
	}).array(),
	difficulty: 'unknown[]',
	currentHashrate: 'number >= 0',
	currentDifficulty: 'number >= 0',
})

export type MempoolSpaceMempoolStats = {
	count: number
	vsize: number
	total_fee: number
}

export type MempoolSpaceRecommendedFees = {
	fastestFee: number
	halfHourFee: number
	hourFee: number
	economyFee: number
	minimumFee: number
}

export type MempoolSpaceAddress = {
	address: string
	chain_stats: {
		funded_txo_count: number
		funded_txo_sum: number
		spent_txo_count: number
		spent_txo_sum: number
		tx_count: number
	}
	mempool_stats: {
		funded_txo_count: number
		funded_txo_sum: number
		spent_txo_count: number
		spent_txo_sum: number
		tx_count: number
	}
}

export type MempoolSpaceAddressUtxo = {
	txid: string
	vout: number
	status: {
		confirmed: boolean
		block_height?: number
		block_hash?: string
		block_time?: number
	}
	value: number
}

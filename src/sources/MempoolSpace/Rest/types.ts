import { type as arktype } from 'arktype'

export const mempoolSpaceTipHeightWire = arktype(`0 <= number.integer <= ${Number.MAX_SAFE_INTEGER}`)

export const mempoolSpaceMiningHashrateWire = arktype({
	hashrates: arktype({
		timestamp: '0 <= number.integer <= 9007199254740',
		avgHashrate: 'number >= 0',
	}).array(),
	difficulty: 'unknown[]',
	currentHashrate: 'number >= 0',
	currentDifficulty: 'number >= 0',
})

/**
 * `/api/v1/mining/difficulty-adjustments/:interval` rows are
 * `[blockTimeSeconds, blockHeight, difficulty, adjustmentRatio]`.
 *
 * @see https://mempool.space/docs/api/rest#get-difficulty-adjustments
 * @see https://github.com/mempool/mempool/blob/c863f02ae6abff3699d42b3ff5ae50a11240748f/backend/src/api/mining/mining.ts
 */
export const mempoolSpaceDifficultyAdjustmentHistoryRowWire = arktype([
	'0 <= number.integer <= 9007199254740',
	`0 <= number.integer <= ${Number.MAX_SAFE_INTEGER}`,
	'number >= 0',
	'number >= 0',
])

export const mempoolSpaceDifficultyAdjustmentHistoryWire = mempoolSpaceDifficultyAdjustmentHistoryRowWire.array()

/**
 * `/api/v1/difficulty-adjustment` current difficulty-adjustment window.
 * @see https://mempool.space/docs/api/rest#get-difficulty-adjustment
 */
export const mempoolSpaceDifficultyAdjustmentWire = arktype({
	progressPercent: '0 <= number <= 100',
	difficultyChange: '-75 <= number <= 300',
	estimatedRetargetDate: 'number >= 0',
	remainingBlocks: 'number.integer >= 0',
	remainingTime: 'number >= 0',
	previousRetarget: '-75 <= number <= 300',
	previousTime: 'number >= 0',
	nextRetargetHeight: 'number.integer >= 0',
	timeAvg: 'number >= 0',
	adjustedTimeAvg: 'number >= 0',
	timeOffset: 'number',
	expectedBlocks: 'number >= 0',
})

/**
 * `/api/v1/mining/pools` pool catalog row: name, slug, and pool catalog id.
 * @see https://mempool.space/docs/api/rest#get-mining-pools
 */
export const mempoolSpaceMiningPoolSummaryWire = arktype({
	name: 'string > 0',
	slug: 'string > 0',
	unique_id: 'number.integer >= 0',
})

export const mempoolSpaceMiningPoolsWire = mempoolSpaceMiningPoolSummaryWire.array()

/**
 * `/api/v1/mining/pool/:slug` pool detail envelope.
 * @see https://mempool.space/docs/api/rest#get-mining-pool
 */
export const mempoolSpaceMiningPoolWire = arktype({
	pool: {
		id: 'number.integer >= 0',
		name: 'string > 0',
		link: 'string > 0',
		addresses: 'string[]',
		regexes: 'string[]',
		slug: 'string > 0',
		unique_id: 'number.integer >= 0',
	},
	blockCount: {
		all: 'number.integer >= 0',
		'24h': 'number.integer >= 0',
		'1w': 'number.integer >= 0',
	},
	blockShare: {
		all: 'number >= 0',
		'24h': 'number >= 0',
		'1w': 'number >= 0',
	},
	estimatedHashrate: 'number >= 0',
	reportedHashrate: arktype('number >= 0').or(arktype('null')),
	avgBlockHealth: arktype('number >= 0').or(arktype('null')),
	totalReward: 'string > 0',
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

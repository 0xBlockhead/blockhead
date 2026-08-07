/**
 * MakeInfinite SQL wire (`POST /v1/sql`).
 * @see https://docs.spaceandtime.io/
 */

import { type as arktype } from 'arktype'


export const makeInfiniteTable = 'ETHEREUM.BLOCKS' as const

/** Non-negative integer wire — SQL drivers emit number or digit string. */
const sqlNonNegativeIntegerWire = (
	arktype('number.integer >= 0')
		.or(arktype('/^[0-9]+$/'))
)

export const makeInfiniteActivityDayAggregateRowWire = arktype({
	BLOCK_COUNT: sqlNonNegativeIntegerWire,
	TRANSACTION_COUNT: sqlNonNegativeIntegerWire,
	END_BLOCK_NUMBER: sqlNonNegativeIntegerWire,
	INDEXED_THROUGH_TIMESTAMP: 'string > 0',
}).onUndeclaredKey('delete')

export type MakeInfiniteActivityDayAggregateRow = typeof makeInfiniteActivityDayAggregateRowWire.infer

/** Successful SQL responses are a JSON array of row objects (empty when HAVING filters all rows). */
export const makeInfiniteSqlResponseWire = makeInfiniteActivityDayAggregateRowWire.array()

export type MakeInfiniteSqlResponse = typeof makeInfiniteSqlResponseWire.infer

export type MakeInfiniteSqlRequest = {
	sqlText: string
	biscuits?: readonly string[]
}

export type MakeInfiniteActivityDayAggregate = {
	blockCount: number
	transactionCount: number
	endBlockNumber: number
	indexedThroughTimestampMs: number
}

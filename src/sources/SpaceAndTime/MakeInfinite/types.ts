export const makeInfiniteTable = 'ETHEREUM.BLOCKS' as const

export type MakeInfiniteSqlRequest = {
	sqlText: string
	biscuits?: readonly string[]
}

export type MakeInfiniteActivityDayAggregateRow = {
	BLOCK_COUNT: number | string
	TRANSACTION_COUNT: number | string
	END_BLOCK_NUMBER: number | string
	INDEXED_THROUGH_TIMESTAMP: string
}

import { fetchFailedMessage } from '$/lib/http.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/SpaceAndTime/bindings.ts'
import {
	makeInfiniteSqlResponseWire,
	makeInfiniteTable,
	type MakeInfiniteActivityDayAggregate,
	type MakeInfiniteSqlRequest,
} from '$/sources/SpaceAndTime/MakeInfinite/types.ts'

const millisecondsPerUtcDay = 86_400_000
const binding = bindings[Source.SpaceAndTime_MakeInfinite][0]

const utcSqlTimestamp = (timestampMs: number) => (
	new Date(timestampMs).toISOString().slice(0, 19).replace('T', ' ')
)

const assertSqlResponse = (
	response: unknown
) => {
	try {
		return makeInfiniteSqlResponseWire.assert(response)
	} catch {
		throw new Error('SpaceAndTime_MakeInfinite: invalid SQL response envelope')
	}
}

const nonNegativeSafeInteger = (
	value: number | string,
	fieldName: string
) => {
	const parsed = Number(value)
	if (!Number.isSafeInteger(parsed) || parsed < 0)
		throw new Error(`SpaceAndTime_MakeInfinite: malformed ${fieldName}`)

	return parsed
}

const indexedThroughTimestampMs = (
	indexedThroughTimestamp: string
) => {
	const parsed = Date.parse(
		indexedThroughTimestamp.includes('T') ?
			indexedThroughTimestamp
		:
			`${indexedThroughTimestamp.replace(' ', 'T')}Z`
	)
	if (!Number.isFinite(parsed) || parsed < 0)
		throw new Error('SpaceAndTime_MakeInfinite: malformed indexed cursor')

	return parsed
}

const sqlForCompletedUtcDay = (dayStartTimestampMs: number) => {
	const dayEndTimestampMs = dayStartTimestampMs + millisecondsPerUtcDay
	const dayStart = utcSqlTimestamp(dayStartTimestampMs)
	const dayEnd = utcSqlTimestamp(dayEndTimestampMs)

	return `SELECT COUNT(*) AS BLOCK_COUNT, SUM(TRANSACTION_COUNT) AS TRANSACTION_COUNT, MAX(BLOCK_NUMBER) AS END_BLOCK_NUMBER, (SELECT MAX(TIME_STAMP) FROM ${makeInfiniteTable}) AS INDEXED_THROUGH_TIMESTAMP FROM ${makeInfiniteTable} WHERE TIME_STAMP >= '${dayStart}' AND TIME_STAMP < '${dayEnd}' HAVING COUNT(*) > 0`
}

export const getActivityDay = async ({
	dayStartTimestampMs,
	table = makeInfiniteTable,
}: {
	dayStartTimestampMs: number
	table?: string
}): Promise<MakeInfiniteActivityDayAggregate | undefined> => {
	if (table !== makeInfiniteTable)
		throw new Error(`SpaceAndTime_MakeInfinite: unsupported table ${table}`)
	if (
		!Number.isSafeInteger(dayStartTimestampMs)
		|| dayStartTimestampMs < 0
		|| dayStartTimestampMs % millisecondsPerUtcDay !== 0
		|| dayStartTimestampMs > Number.MAX_SAFE_INTEGER - millisecondsPerUtcDay
	)
		throw new Error(`SpaceAndTime_MakeInfinite: invalid UTC day ${dayStartTimestampMs}`)

	const request = {
		sqlText: sqlForCompletedUtcDay(dayStartTimestampMs),
	} satisfies MakeInfiniteSqlRequest
	const response = await sourceFetch(
		binding,
		new URL('/v1/sql', firstHttpUrlForBinding(binding)).toString(),
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(request),
		}
	)
	if (!response.ok)
		throw new Error(await fetchFailedMessage('SpaceAndTime_MakeInfinite SQL', response))

	const [row] = assertSqlResponse(await response.json())
	if (row == null)
		return undefined

	return {
		blockCount: nonNegativeSafeInteger(row.BLOCK_COUNT, 'block count'),
		transactionCount: nonNegativeSafeInteger(row.TRANSACTION_COUNT, 'transaction count'),
		endBlockNumber: nonNegativeSafeInteger(row.END_BLOCK_NUMBER, 'end block number'),
		indexedThroughTimestampMs: indexedThroughTimestampMs(row.INDEXED_THROUGH_TIMESTAMP),
	}
}

import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import authFailure from '$/sources/SpaceAndTime/MakeInfinite/fixtures/auth-failure.json'
import completedDay from '$/sources/SpaceAndTime/MakeInfinite/fixtures/completed-day.json'
import empty from '$/sources/SpaceAndTime/MakeInfinite/fixtures/empty.json'
import errorObject from '$/sources/SpaceAndTime/MakeInfinite/fixtures/error-object.json'
import nullAggregate from '$/sources/SpaceAndTime/MakeInfinite/fixtures/null-aggregate.json'
import unsupportedTable from '$/sources/SpaceAndTime/MakeInfinite/fixtures/unsupported-table.json'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://proxy.api.makeinfinite.dev',
	sourceFetch,
}))

const { getActivityDay } = await import('$/sources/SpaceAndTime/MakeInfinite/queries.ts')

const completedDayStartTimestampMs = Date.parse('2026-07-15T00:00:00.000Z')

describe('MakeInfinite SQL query boundary', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('maps a completed UTC day aggregate through the arktype SQL envelope', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(completedDay))

		await expect(getActivityDay({
			dayStartTimestampMs: completedDayStartTimestampMs,
		})).resolves.toEqual({
			blockCount: 12345,
			transactionCount: 67890,
			endBlockNumber: 22900000,
			indexedThroughTimestampMs: Date.parse('2026-07-16T00:03:11.000Z'),
		})
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body)).toEqual({
			sqlText: expect.stringContaining('FROM ETHEREUM.BLOCKS'),
		})
		expect(sourceFetch.mock.calls[0][0]).toMatchObject({
			source: Source.SpaceAndTime_MakeInfinite,
		})
		expect(sourceFetch.mock.calls[0][1]).toBe('https://proxy.api.makeinfinite.dev/v1/sql')
	})

	it('accepts digit-string aggregate columns', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json([{
			BLOCK_COUNT: '12345',
			TRANSACTION_COUNT: '67890',
			END_BLOCK_NUMBER: '22900000',
			INDEXED_THROUGH_TIMESTAMP: '2026-07-16T00:03:11Z',
		}]))

		await expect(getActivityDay({
			dayStartTimestampMs: completedDayStartTimestampMs,
		})).resolves.toEqual({
			blockCount: 12345,
			transactionCount: 67890,
			endBlockNumber: 22900000,
			indexedThroughTimestampMs: Date.parse('2026-07-16T00:03:11.000Z'),
		})
	})

	it('returns undefined for an empty SQL array', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(empty))

		await expect(getActivityDay({
			dayStartTimestampMs: completedDayStartTimestampMs,
		})).resolves.toBeUndefined()
	})

	it('fail-closes HTTP 200 error objects instead of soft-empty days', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(errorObject))

		await expect(getActivityDay({
			dayStartTimestampMs: completedDayStartTimestampMs,
		})).rejects.toThrow('invalid SQL response envelope')
	})

	it('fail-closes null SQL aggregates instead of coercing to zero', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(nullAggregate))

		await expect(getActivityDay({
			dayStartTimestampMs: completedDayStartTimestampMs,
		})).rejects.toThrow('invalid SQL response envelope')
	})

	it('fail-closes negative aggregate counts', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json([{
			BLOCK_COUNT: -1,
			TRANSACTION_COUNT: 1,
			END_BLOCK_NUMBER: 1,
			INDEXED_THROUGH_TIMESTAMP: '2026-07-16T00:03:11Z',
		}]))

		await expect(getActivityDay({
			dayStartTimestampMs: completedDayStartTimestampMs,
		})).rejects.toThrow('invalid SQL response envelope')
	})

	it('fail-closes malformed indexed cursors after shape validation', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json([{
			BLOCK_COUNT: 1,
			TRANSACTION_COUNT: 1,
			END_BLOCK_NUMBER: 1,
			INDEXED_THROUGH_TIMESTAMP: 'not-a-timestamp',
		}]))

		await expect(getActivityDay({
			dayStartTimestampMs: completedDayStartTimestampMs,
		})).rejects.toThrow('malformed indexed cursor')
	})

	it('authentication failure', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(authFailure, { status: 401 }))

		await expect(getActivityDay({
			dayStartTimestampMs: completedDayStartTimestampMs,
		})).rejects.toThrow('SpaceAndTime_MakeInfinite SQL')
	})

	it('unsupported table', async () => {
		await expect(getActivityDay({
			dayStartTimestampMs: completedDayStartTimestampMs,
			table: unsupportedTable.table,
		})).rejects.toThrow('unsupported table')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('rejects QueryRouter evidence', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(completedDay))
		const result = await getActivityDay({
			dayStartTimestampMs: completedDayStartTimestampMs,
		})
		const sqlText = JSON.parse(sourceFetch.mock.calls[0][2].body).sqlText as string

		expect(result?.indexedThroughTimestampMs).toBe(Date.parse('2026-07-16T00:03:11.000Z'))
		expect(sqlText).not.toContain('QueryRouter')
		expect(sqlText).not.toContain('proof')
	})
})

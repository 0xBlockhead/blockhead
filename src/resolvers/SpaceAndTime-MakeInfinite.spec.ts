import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { createResolverContext } from '../../tests/resolverContext.ts'

import authFailure from '$/sources/SpaceAndTime/MakeInfinite/fixtures/auth-failure.json'
import completedDay from '$/sources/SpaceAndTime/MakeInfinite/fixtures/completed-day.json'
import empty from '$/sources/SpaceAndTime/MakeInfinite/fixtures/empty.json'
import errorObject from '$/sources/SpaceAndTime/MakeInfinite/fixtures/error-object.json'
import incompleteDay from '$/sources/SpaceAndTime/MakeInfinite/fixtures/incomplete-day.json'
import nullAggregate from '$/sources/SpaceAndTime/MakeInfinite/fixtures/null-aggregate.json'
import staleCursor from '$/sources/SpaceAndTime/MakeInfinite/fixtures/stale-cursor.json'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://proxy.api.makeinfinite.dev',
	sourceFetch,
}))

const {
	default: spaceAndTimeMakeInfiniteResolvers,
	resolveNetworkActivityDay,
} = await import('$/resolvers/SpaceAndTime-MakeInfinite.ts')
const networkActivityDaysResolver = spaceAndTimeMakeInfiniteResolvers.resolvers[0]
const networkActivityDayResolver = spaceAndTimeMakeInfiniteResolvers.resolvers[1]

const network = {
	caip2: {
		namespace: 'eip155',
		reference: '1',
	},
}
const slugNetwork = {
	slug: 'ethereum',
}
const completedDayStartTimestampMs = Date.parse('2026-07-15T00:00:00.000Z')
const priorCompletedDayStartTimestampMs = Date.parse('2026-07-14T00:00:00.000Z')
const currentUtcDayStartTimestampMs = Date.parse('2026-07-16T00:00:00.000Z')
const completedDayNowMs = Date.parse('2026-07-16T12:00:00.000Z')
const listContext = {
	...createResolverContext(),
	pagination: {
		limit: 2,
	},
}

describe('MakeInfinite source and resolver slice', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('completed UTC day aggregate', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(completedDay))

		await expect(resolveNetworkActivityDay({
			network,
			dayStartTimestampMs: completedDayStartTimestampMs,
			nowMs: completedDayNowMs,
		})).resolves.toEqual({
			$network: network,
			dayStartTimestampMs: completedDayStartTimestampMs,
			source: 'SpaceAndTime_MakeInfinite',
			blockCount: 12345,
			transactionCount: 67890,
			endBlockNumber: 22900000,
			indexedThroughTimestampMs: Date.parse('2026-07-16T00:03:11.000Z'),
			resolvedAtMs: completedDayNowMs,
			trustModel: 'OptimisticProviderResult',
		})
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body)).toEqual({
			sqlText: expect.stringContaining('FROM ETHEREUM.BLOCKS'),
		})
		expect(sourceFetch.mock.calls[0][0]).toMatchObject({
			source: Source.SpaceAndTime_MakeInfinite,
		})
		expect(sourceFetch.mock.calls[0][1]).toBe('https://proxy.api.makeinfinite.dev/v1/sql')
		expect(sourceFetch.mock.calls[0][2].headers).toEqual({
			'content-type': 'application/json',
		})
	})

	it('materializes recent completed days as fully prefetched parent rows', async () => {
		sourceFetch
			.mockResolvedValueOnce(Response.json(completedDay))
			.mockResolvedValueOnce(Response.json([{
				BLOCK_COUNT: 100,
				TRANSACTION_COUNT: 200,
				END_BLOCK_NUMBER: 22890000,
				INDEXED_THROUGH_TIMESTAMP: '2026-07-16 00:03:11',
			}]))
		const dateNow = vi.spyOn(Date, 'now').mockReturnValue(completedDayNowMs)

		const activityDays = await networkActivityDaysResolver.resolve.Caip2.resolve(
			network,
			listContext
		)
		expect(activityDays).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					dayStartTimestampMs: completedDayStartTimestampMs,
					source: Source.SpaceAndTime_MakeInfinite,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'blockCount')]: 12345,
					[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'transactionCount')]: 67890,
					[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'endBlockNumber')]: 22900000,
					[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'indexedThroughTimestampMs')]: Date.parse('2026-07-16T00:03:11.000Z'),
					[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'resolvedAtMs')]: completedDayNowMs,
					[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'trustModel')]: 'OptimisticProviderResult',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					dayStartTimestampMs: priorCompletedDayStartTimestampMs,
					source: Source.SpaceAndTime_MakeInfinite,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'blockCount')]: 100,
					[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'transactionCount')]: 200,
					[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'endBlockNumber')]: 22890000,
					[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'indexedThroughTimestampMs')]: Date.parse('2026-07-16T00:03:11.000Z'),
					[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'resolvedAtMs')]: completedDayNowMs,
					[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'trustModel')]: 'OptimisticProviderResult',
				},
			},
		])
		expect(networkActivityDaysResolver.projections.Evm.$$activityDays(activityDays)).toBe(activityDays)
		expect(sourceFetch).toHaveBeenCalledTimes(2)
		dateNow.mockRestore()
	})

	it('preserves a Slug network selector through activity-day leftovers', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(completedDay))
		const dateNow = vi.spyOn(Date, 'now').mockReturnValue(completedDayNowMs)

		const activityDays = await networkActivityDaysResolver.resolve.Slug.resolve(
			slugNetwork,
			{
				...listContext,
				pagination: {
					limit: 1,
				},
			}
		)
		expect(activityDays).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: slugNetwork,
				dayStartTimestampMs: completedDayStartTimestampMs,
				source: Source.SpaceAndTime_MakeInfinite,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'blockCount')]: 12345,
				[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'transactionCount')]: 67890,
				[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'endBlockNumber')]: 22900000,
				[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'indexedThroughTimestampMs')]: Date.parse('2026-07-16T00:03:11.000Z'),
				[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'resolvedAtMs')]: completedDayNowMs,
				[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'trustModel')]: 'OptimisticProviderResult',
			},
		}])
		dateNow.mockRestore()
	})

	it('omits empty completed days from the recent parent list', async () => {
		sourceFetch
			.mockResolvedValueOnce(Response.json(empty))
			.mockResolvedValueOnce(Response.json(completedDay))
		const dateNow = vi.spyOn(Date, 'now').mockReturnValue(completedDayNowMs)

		await expect(networkActivityDaysResolver.resolve.Caip2.resolve(
			network,
			listContext
		)).resolves.toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				dayStartTimestampMs: priorCompletedDayStartTimestampMs,
				source: Source.SpaceAndTime_MakeInfinite,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'blockCount')]: 12345,
				[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'transactionCount')]: 67890,
				[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'endBlockNumber')]: 22900000,
				[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'indexedThroughTimestampMs')]: Date.parse('2026-07-16T00:03:11.000Z'),
				[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'resolvedAtMs')]: completedDayNowMs,
				[entityFieldAddressKey(EntityType.Network_Activity_Day, [], 'trustModel')]: 'OptimisticProviderResult',
			},
		}])
		expect(sourceFetch).toHaveBeenCalledTimes(2)
		dateNow.mockRestore()
	})

	it('excludes incomplete UTC day', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(incompleteDay))

		await expect(resolveNetworkActivityDay({
			network,
			dayStartTimestampMs: currentUtcDayStartTimestampMs,
			nowMs: completedDayNowMs,
		})).rejects.toThrow('incomplete UTC day')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('empty result', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(empty))

		await expect(resolveNetworkActivityDay({
			network,
			dayStartTimestampMs: completedDayStartTimestampMs,
			nowMs: completedDayNowMs,
		})).resolves.toBeUndefined()
	})

	it('resolves an empty completed day as zero parent rows', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(empty))
		const dateNow = vi.spyOn(Date, 'now').mockReturnValue(completedDayNowMs)

		await expect(networkActivityDaysResolver.resolve.Caip2.resolve(
			network,
			{
				...listContext,
				pagination: {
					limit: 1,
				},
			}
		)).resolves.toEqual([])
		expect(sourceFetch).toHaveBeenCalledTimes(1)
		dateNow.mockRestore()
	})

	it('rejects non-Ethereum-mainnet parents before provider I/O', async () => {
		await expect(networkActivityDaysResolver.resolve.Caip2.resolve(
			{
				caip2: {
					namespace: 'eip155',
					reference: '10',
				},
			},
			listContext
		)).rejects.toThrow('unsupported network eip155:10')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('preserves parent authentication failures instead of soft-empty rows', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(authFailure, { status: 401 }))
		const dateNow = vi.spyOn(Date, 'now').mockReturnValue(completedDayNowMs)

		await expect(networkActivityDaysResolver.resolve.Caip2.resolve(
			network,
			{
				...listContext,
				pagination: {
					limit: 1,
				},
			}
		)).rejects.toThrow('SpaceAndTime_MakeInfinite SQL')
		dateNow.mockRestore()
	})

	it('hard-fails HTTP 200 error objects instead of soft-empty days', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(errorObject))

		await expect(resolveNetworkActivityDay({
			network,
			dayStartTimestampMs: completedDayStartTimestampMs,
			nowMs: completedDayNowMs,
		})).rejects.toThrow('invalid SQL response envelope')
	})

	it('hard-fails null SQL aggregates instead of coercing to zero', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(nullAggregate))

		await expect(resolveNetworkActivityDay({
			network,
			dayStartTimestampMs: completedDayStartTimestampMs,
			nowMs: completedDayNowMs,
		})).rejects.toThrow('invalid SQL response envelope')
	})

	it('materializes schema-shaped Network_Activity_Day fields from the entity resolver', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(completedDay))

		const activityDay = await networkActivityDayResolver.resolve.NetworkDayStartTimestampMsSource.resolve({
			$network: network,
			dayStartTimestampMs: completedDayStartTimestampMs,
			source: Source.SpaceAndTime_MakeInfinite,
		})
		expect(activityDay).toMatchObject({
			$network: network,
			dayStartTimestampMs: completedDayStartTimestampMs,
			source: Source.SpaceAndTime_MakeInfinite,
			blockCount: 12345,
			transactionCount: 67890,
			endBlockNumber: 22900000,
			indexedThroughTimestampMs: Date.parse('2026-07-16T00:03:11.000Z'),
			trustModel: 'OptimisticProviderResult',
		})
		expect(networkActivityDayResolver.projections.blockCount(activityDay)).toBe(12345)
		expect(networkActivityDayResolver.projections.transactionCount(activityDay)).toBe(67890)
		expect(networkActivityDayResolver.projections.endBlockNumber(activityDay)).toBe(22900000)
		expect(networkActivityDayResolver.projections.indexedThroughTimestampMs(activityDay)).toBe(Date.parse('2026-07-16T00:03:11.000Z'))
		expect(networkActivityDayResolver.projections.trustModel(activityDay)).toBe('OptimisticProviderResult')
	})

	it('stale indexed cursor', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(staleCursor))

		await expect(resolveNetworkActivityDay({
			network,
			dayStartTimestampMs: completedDayStartTimestampMs,
			nowMs: completedDayNowMs,
		})).rejects.toThrow('stale indexed cursor')
	})

	it('preserves stale parent results as failures rather than partial rows', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(staleCursor))
		const dateNow = vi.spyOn(Date, 'now').mockReturnValue(completedDayNowMs)

		await expect(networkActivityDaysResolver.resolve.Caip2.resolve(
			network,
			{
				...listContext,
				pagination: {
					limit: 1,
				},
			}
		)).rejects.toThrow('stale indexed cursor')
		dateNow.mockRestore()
	})
})

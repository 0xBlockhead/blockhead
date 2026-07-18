import { beforeEach, describe, expect, it, vi } from 'vitest'

import authFailure from '$/sources/SpaceAndTime/MakeInfinite/fixtures/auth-failure.json'
import completedDay from '$/sources/SpaceAndTime/MakeInfinite/fixtures/completed-day.json'
import empty from '$/sources/SpaceAndTime/MakeInfinite/fixtures/empty.json'
import incompleteDay from '$/sources/SpaceAndTime/MakeInfinite/fixtures/incomplete-day.json'
import staleCursor from '$/sources/SpaceAndTime/MakeInfinite/fixtures/stale-cursor.json'
import unsupportedTable from '$/sources/SpaceAndTime/MakeInfinite/fixtures/unsupported-table.json'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { SourceProvider as Provider } from '$/sources/SourceProvider.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://proxy.api.makeinfinite.dev',
	sourceFetch,
}))

const { getActivityDay } = await import('$/sources/SpaceAndTime/MakeInfinite/queries.ts')
const { resolveNetworkActivityDay } = await import('$/resolvers/SpaceAndTime-MakeInfinite.ts')

const binding = {
	provider: Provider.A2a,
	source: Source.A2aWellKnown_Http,
	target: {
		kind: SourceTargetKind.Caip2Network,
		key: 'eip155:1',
	},
	endpoints: [{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://proxy.api.makeinfinite.dev',
		origin: 'https://proxy.api.makeinfinite.dev',
		corsEnabled: false,
	}],
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.RestJson,
	operationGroups: [SourceOperationGroup.GenericRead],
	delivery: SourceDelivery.HttpProxy,
	credentials: [{
		scope: SourceCredentialScope.RuntimeSecret,
		envKey: 'MAKEINFINITE_API_KEY',
		injection: {
			header: {
				name: 'apikey',
			},
		},
	}],
	proxyId: 'makeinfinite-test',
} as const satisfies SourceBinding

const network = {
	caip2: {
		namespace: 'eip155',
		reference: '1',
	},
}
const completedDayStartTimestampMs = Date.parse('2026-07-15T00:00:00.000Z')
const currentUtcDayStartTimestampMs = Date.parse('2026-07-16T00:00:00.000Z')
const completedDayNowMs = Date.parse('2026-07-16T12:00:00.000Z')

describe('MakeInfinite source and resolver slice', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	it('completed UTC day aggregate', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(completedDay))

		await expect(resolveNetworkActivityDay({
			binding,
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
		expect(sourceFetch.mock.calls[0][0]).toBe(binding)
		expect(sourceFetch.mock.calls[0][1]).toBe('https://proxy.api.makeinfinite.dev/v1/sql')
		expect(sourceFetch.mock.calls[0][2].headers).toEqual({
			'content-type': 'application/json',
		})
		expect(sourceFetch.mock.calls[0][0]).toMatchObject({
			target: {
				kind: SourceTargetKind.Caip2Network,
				key: 'eip155:1',
			},
			delivery: SourceDelivery.HttpProxy,
			credentials: [{
				scope: SourceCredentialScope.RuntimeSecret,
				envKey: 'MAKEINFINITE_API_KEY',
				injection: {
					header: {
						name: 'apikey',
					},
				},
			}],
			proxyId: 'makeinfinite-test',
		})
	})

	it('excludes incomplete UTC day', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(incompleteDay))

		await expect(resolveNetworkActivityDay({
			binding,
			network,
			dayStartTimestampMs: currentUtcDayStartTimestampMs,
			nowMs: completedDayNowMs,
		})).rejects.toThrow('incomplete UTC day')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('empty result', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(empty))

		await expect(resolveNetworkActivityDay({
			binding,
			network,
			dayStartTimestampMs: completedDayStartTimestampMs,
			nowMs: completedDayNowMs,
		})).resolves.toBeUndefined()
	})

	it('authentication failure', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(authFailure, { status: 401 }))

		await expect(getActivityDay({
			binding,
			dayStartTimestampMs: completedDayStartTimestampMs,
		})).rejects.toThrow('MakeInfinite SQL')
	})

	it('stale indexed cursor', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(staleCursor))

		await expect(resolveNetworkActivityDay({
			binding,
			network,
			dayStartTimestampMs: completedDayStartTimestampMs,
			nowMs: completedDayNowMs,
		})).rejects.toThrow('stale indexed cursor')
	})

	it('unsupported table', async () => {
		await expect(getActivityDay({
			binding,
			dayStartTimestampMs: completedDayStartTimestampMs,
			table: unsupportedTable.table,
		})).rejects.toThrow('unsupported table')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('rejects QueryRouter evidence', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(completedDay))
		const result = await getActivityDay({
			binding,
			dayStartTimestampMs: completedDayStartTimestampMs,
		})
		const sqlText = JSON.parse(sourceFetch.mock.calls[0][2].body).sqlText as string

		expect(result?.indexedThroughTimestampMs).toBe(Date.parse('2026-07-16T00:03:11.000Z'))
		expect(sqlText).not.toContain('QueryRouter')
		expect(sqlText).not.toContain('proof')
	})
})

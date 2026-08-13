import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceFetch,
}))

import localInternal from '$/resolvers/Local.ts'
import { readNormalizedLocalInternal } from '$/resolvers/Local/Internal/catalog.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { XmtpConversationConsentState } from '$/schema/XmtpConversationConsentState.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/MempoolSpace/bindings.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'


const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const resolver = (
	entityType: EntityType,
	selectorName: string,
	projectionName: string
) => {
	const found = localInternal.resolvers.find((candidate) => (
		candidate.entityType === entityType
		&& selectorName in candidate.resolve
		&& projectionName in candidate.projections
	))
	if (found == null)
		throw new Error(`Missing ${entityType}.${selectorName}.${projectionName} Local resolver`)

	return found
}


describe('Local catalog enrollment policy', () => {
	it('does not declare a BlockheadAccount Local resolver', () => {
		expect(localInternal.resolvers.some((candidate) => (
			candidate.entityType === EntityType.BlockheadAccount
		))).toBe(false)
		expect(readNormalizedLocalInternal()).not.toHaveProperty('blockheadAccounts')
	})
})


describe('Local source capability observations', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('materializes a source-owned availability observation with resolver breadth', async () => {
		sourceFetch.mockResolvedValue(new Response(null, {
			status: 200,
			headers: {
				'x-ratelimit-remaining': '499',
				'x-ratelimit-reset': '1800000000',
			},
		}))
		const timestampsResolver = resolver(
			EntityType.BlockheadSource,
			'Id',
			'$$timestamps'
		)
		const timestampResolver = resolver(
			EntityType.BlockheadSource_Timestamp,
			'SourceTimestampMs',
			'resolverCount'
		)
		const observations = await timestampsResolver.resolve.Id.resolve({
			id: Source.MempoolSpace_Rest,
		}, context)
		const observation = observations[0]
		if (observation == null)
			throw new Error('Local source capability observation is missing')

		expect(observation[EntityMetaKey.Selector]).toMatchObject({
			$source: {
				id: Source.MempoolSpace_Rest,
			},
		})
		expect(observation[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.BlockheadSource_Timestamp, [], 'enabled')]: true,
			[entityFieldAddressKey(EntityType.BlockheadSource_Timestamp, [], 'health')]: 'All 1 HTTP endpoints available',
			[entityFieldAddressKey(EntityType.BlockheadSource_Timestamp, [], 'statusCode')]: 200,
			[entityFieldAddressKey(EntityType.BlockheadSource_Timestamp, [], 'rateLimitRemaining')]: 499,
			[entityFieldAddressKey(EntityType.BlockheadSource_Timestamp, [], 'rateLimitResetMs')]: 1_800_000_000_000,
		})
		const detail = await timestampResolver.resolve.SourceTimestampMs.resolve(
			observation[EntityMetaKey.Selector],
			context
		)
		expect(timestampResolver.projections.enabled(detail)).toBe(true)
		expect(timestampResolver.projections.health(detail)).toBe('All 1 HTTP endpoints available')
		expect(timestampResolver.projections.latencyMs(detail)).toBeGreaterThanOrEqual(0)
		expect(timestampResolver.projections.statusCode(detail)).toBe(200)
		expect(timestampResolver.projections.rateLimitRemaining(detail)).toBe(499)
		expect(timestampResolver.projections.rateLimitResetMs(detail)).toBe(1_800_000_000_000)
		expect(timestampResolver.projections.resolverCount(detail)).toBeGreaterThan(0)
		expect(timestampResolver.projections.error(detail)).toBeUndefined()
	})

	it('retains endpoint-specific health on the native endpoint owner', async () => {
		sourceFetch.mockResolvedValue(new Response(null, {
			status: 429,
			headers: {
				'x-ratelimit-remaining': '0',
			},
		}))
		const found = resolver(
			EntityType.BlockheadSourceEndpoint,
			'SourceBindingIdEndpointIndex',
			'$$timestamps'
		)
		const observations = await found.resolve.SourceBindingIdEndpointIndex.resolve({
			$source: {
				id: Source.MempoolSpace_Rest,
			},
			bindingId: sourceBindingId(bindings[Source.MempoolSpace_Rest][0]),
			endpointIndex: 0,
		}, context)
		const observation = observations[0]
		if (observation == null)
			throw new Error('Local source endpoint observation is missing')

		expect(observation[EntityMetaKey.Selector]).toMatchObject({
			$endpoint: {
				$source: {
					id: Source.MempoolSpace_Rest,
				},
				bindingId: sourceBindingId(bindings[Source.MempoolSpace_Rest][0]),
				endpointIndex: 0,
			},
		})
		expect(observation[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.BlockheadSourceEndpoint_Timestamp, [], 'available')]: false,
			[entityFieldAddressKey(EntityType.BlockheadSourceEndpoint_Timestamp, [], 'reachable')]: true,
			[entityFieldAddressKey(EntityType.BlockheadSourceEndpoint_Timestamp, [], 'statusCode')]: 429,
			[entityFieldAddressKey(EntityType.BlockheadSourceEndpoint_Timestamp, [], 'rateLimitRemaining')]: 0,
		})
	})

	it('retains a reachable non-success status without calling it available', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(null, { status: 401 }))
		const found = resolver(
			EntityType.BlockheadSource_Timestamp,
			'SourceTimestampMs',
			'statusCode'
		)
		const observation = await found.resolve.SourceTimestampMs.resolve({
			$source: {
				id: Source.MempoolSpace_Rest,
			},
			timestampMs: 1,
		}, context)

		expect(found.projections.enabled(observation)).toBe(true)
		expect(found.projections.health(observation)).toBe('1 of 1 HTTP endpoints reachable')
		expect(found.projections.statusCode(observation)).toBe(401)
	})

	it('separates endpoint failure from resolver availability', async () => {
		sourceFetch.mockRejectedValueOnce(new Error('connection refused'))
		const found = resolver(
			EntityType.BlockheadSource_Timestamp,
			'SourceTimestampMs',
			'statusCode'
		)
		const observation = await found.resolve.SourceTimestampMs.resolve({
			$source: {
				id: Source.MempoolSpace_Rest,
			},
			timestampMs: 1,
		}, context)

		expect(found.projections.enabled(observation)).toBe(true)
		expect(found.projections.health(observation)).toBe('0 of 1 HTTP endpoints reachable')
		expect(found.projections.statusCode(observation)).toBeUndefined()
		expect(found.projections.error(observation)).toContain('connection refused')
		expect(found.projections.resolverCount(observation)).toBeGreaterThan(0)
	})

	it('aggregates every concrete endpoint and preserves partial availability', async () => {
		sourceFetch
			.mockResolvedValueOnce(new Response(null, {
				status: 200,
				headers: {
					'x-ratelimit-remaining': '40',
					'x-ratelimit-reset': '1800000100',
				},
			}))
			.mockRejectedValueOnce(new Error('secondary endpoint refused'))
		const found = resolver(
			EntityType.BlockheadSource_Timestamp,
			'SourceTimestampMs',
			'health'
		)
		const observation = await found.resolve.SourceTimestampMs.resolve({
			$source: {
				id: Source.Nodely,
			},
			timestampMs: 1,
		}, context)

		expect(found.projections.enabled(observation)).toBe(true)
		expect(found.projections.health(observation)).toBe('1 of 2 HTTP endpoints available')
		expect(found.projections.error(observation)).toContain('secondary endpoint refused')
		expect(found.projections.statusCode(observation)).toBeUndefined()
		expect(found.projections.rateLimitRemaining(observation)).toBe(40)
		expect(sourceFetch).toHaveBeenCalledTimes(2)
	})

	it('labels non-HTTP sources as capability-only instead of inventing an endpoint probe', async () => {
		sourceFetch.mockClear()
		const found = resolver(
			EntityType.BlockheadSource_Timestamp,
			'SourceTimestampMs',
			'health'
		)
		const observation = await found.resolve.SourceTimestampMs.resolve({
			$source: {
				id: Source.NostrRelay_WebSocket,
			},
			timestampMs: 1,
		}, context)

		expect(found.projections.enabled(observation)).toBe(true)
		expect(found.projections.health(observation)).toBe('Resolver module available; no HTTP health probe')
		expect(found.projections.statusCode(observation)).toBeUndefined()
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('rejects source identities outside the registered source denominator', async () => {
		const found = resolver(
			EntityType.BlockheadSource,
			'Id',
			'$$timestamps'
		)
		await expect(found.resolve.Id.resolve({
			id: 'not-a-source',
		}, context)).rejects.toThrow('Local_Internal: unsupported Blockhead source not-a-source')
	})
})


describe('Local XmtpConversation catalog facets', () => {
	beforeAll(() => {
		readNormalizedLocalInternal()
	})

	it('resolves seeded conversation identity fields by Id', async () => {
		const found = resolver(
			EntityType.XmtpConversation,
			'Id',
			'topic'
		)
		await expect(found.resolve.Id.resolve({
			id: 'e2e-probe-conversation',
		}, context)).resolves.toEqual({
			peerInboxId: 'e2e-probe-peer',
			topic: 'e2e-probe-topic',
			createdAtMs: 1_700_000_000_000,
			consentState: XmtpConversationConsentState.Allowed,
		})
	})

	it('lists $$xmtpConversations from _Global', async () => {
		const found = resolver(
			EntityType._Global,
			'Scope',
			'$$xmtpConversations'
		)
		await expect(found.resolve.Scope.resolve(
			{ scope: '$$xmtpConversations' },
			context
		)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: { id: 'e2e-probe-conversation' },
			},
		])
	})

	it('lists $$xmtpConversations from XmtpNetwork', async () => {
		const found = resolver(
			EntityType.XmtpNetwork,
			'Scope',
			'$$xmtpConversations'
		)
		await expect(found.resolve.Scope.resolve(
			{ scope: '$$xmtpConversations' },
			context
		)).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: { id: 'e2e-probe-conversation' },
			},
		])
	})

	it('fails closed when the conversation is absent from the local catalog', async () => {
		const found = resolver(
			EntityType.XmtpConversation,
			'Id',
			'topic'
		)
		await expect(found.resolve.Id.resolve({
			id: 'missing-conversation',
		}, context)).rejects.toThrow('Local_Internal: XmtpConversation not present in local catalog')
	})
})

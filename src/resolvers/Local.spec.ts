import { beforeAll, describe, expect, it } from 'vitest'

import localInternal from '$/resolvers/Local.ts'
import { readNormalizedLocalInternal } from '$/resolvers/Local/Internal/catalog.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { XmtpConversationConsentState } from '$/schema/XmtpConversationConsentState.ts'
import { Source } from '$/sources/Source.ts'


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
	it('materializes a source-owned availability observation with resolver breadth', async () => {
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
			[entityFieldAddressKey(EntityType.BlockheadSource_Timestamp, [], 'health')]: 'Resolver module available',
		})
		const detail = await timestampResolver.resolve.SourceTimestampMs.resolve(
			observation[EntityMetaKey.Selector],
			context
		)
		expect(timestampResolver.projections.enabled(detail)).toBe(true)
		expect(timestampResolver.projections.health(detail)).toBe('Resolver module available')
		expect(timestampResolver.projections.latencyMs(detail)).toBeGreaterThanOrEqual(0)
		expect(timestampResolver.projections.resolverCount(detail)).toBeGreaterThan(0)
		expect(timestampResolver.projections.error(detail)).toBeUndefined()
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

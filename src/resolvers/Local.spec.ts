import { beforeAll, describe, expect, it } from 'vitest'

import localInternal from '$/resolvers/Local.ts'
import { readNormalizedLocalInternal } from '$/resolvers/Local/Internal/catalog.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { XmtpConversationConsentState } from '$/schema/XmtpConversationConsentState.ts'


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

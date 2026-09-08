import type { ClientContext } from '$/client/$client.svelte.ts'
import {
	actionAuthorityRequestEnvelopeHash,
	authorityDecision,
	authorityRequestEnvelope,
	dispatchAddress,
	dispatchEvidence,
	type ActionAuthorityRequestEnvelope,
	type ActionDispatchEvidence,
} from '$/actions/execution.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Hash32 } from '$/schema/ZeroExHex.ts'
import { schema } from '$/schema/index.ts'
import { type } from 'arktype'
import type { PersistedScannedRow } from '@tanstack/db-sqlite-persistence-core'


const submittedAt = type('number')

type AuthorityDispatchField =
	| {
		fieldName: 'address'
		value: typeof dispatchAddress.infer
	}
	| {
		fieldName: 'decision'
		value: typeof authorityDecision.infer
	}
	| {
		fieldName: 'envelope'
		value: ActionAuthorityRequestEnvelope
	}
	| {
		fieldName: 'envelopeHash'
		value: typeof Hash32.infer
	}
	| {
		fieldName: 'evidence'
		value: ActionDispatchEvidence
	}
	| {
		fieldName: 'submittedAt'
		value: number
	}

type AuthorityRequestEnvelope = {
	selectorKey: string
	envelope: ActionAuthorityRequestEnvelope
}

type AuthorityRequestEnvelopeHash = {
	selectorKey: string
	envelopeHash: typeof Hash32.infer
}

export type AuthorityDispatchGraph = {
	occurrences: Array<{
		selectorKey: string
		source: string
	}>
	authorityRequests: Array<{
		selectorKey: string
		source: string
	}>
	walletRequests: Array<{
		selectorKey: string
		source: string
	}>
	timestamps: Array<{
		selectorKey: string
		source: string
	}>
	authorityRequestBindings: Array<{
		occurrenceSelectorKey: string
		authorityRequestValueKey: string
		matches: boolean
	}>
	envelopeHashBindings: Array<{
		authorityRequestSelectorKey: string
		envelopeHash: typeof Hash32.infer
		computedEnvelopeHash?: typeof Hash32.infer
		matches: boolean
	}>
	fields: AuthorityDispatchField[]
}

const entityReferenceValueKey = (selectorKey: string) => `Entity:${selectorKey}`

const persistedEntityRow = type({
	[EntityMetaKey.SelectorKey]: 'string',
	[EntityMetaKey.Source]: 'string',
}).onUndeclaredKey('delete')

const persistedAuthorityEnvelopeRow = type({
	[EntityMetaKey.ParentSelectorKey]: 'string',
	[EntityMetaKey.Value]: authorityRequestEnvelope,
}).onUndeclaredKey('delete')

const persistedAuthorityEnvelopeHashRow = type({
	[EntityMetaKey.ParentSelectorKey]: 'string',
	[EntityMetaKey.Value]: Hash32,
}).onUndeclaredKey('delete')

const persistedAuthorityDecisionRow = type({
	[EntityMetaKey.Value]: authorityDecision,
}).onUndeclaredKey('delete')

const persistedOccurrenceAddressRow = type({
	[EntityMetaKey.Value]: dispatchAddress,
}).onUndeclaredKey('delete')

const persistedOccurrenceAuthorityRequestRow = type({
	[EntityMetaKey.ParentSelectorKey]: 'string',
	valueKey: 'string',
}).onUndeclaredKey('delete')

const persistedOccurrenceEvidenceRow = type({
	[EntityMetaKey.Value]: dispatchEvidence,
}).onUndeclaredKey('delete')

const persistedWalletRequestSubmittedAtRow = type({
	[EntityMetaKey.Value]: submittedAt,
}).onUndeclaredKey('delete')

export type PersistedRowScanner = (
	collectionId: string,
	schemaVersion: number
) => Promise<PersistedScannedRow[]>

export const authorityRequestEnvelopeHashBindings = (
	envelopes: readonly AuthorityRequestEnvelope[],
	hashes: readonly AuthorityRequestEnvelopeHash[]
) => {
	const envelopeBySelectorKey = new Map(envelopes.map((envelope) => [
		envelope.selectorKey,
		envelope.envelope,
	]))

	return hashes.map(({ selectorKey, envelopeHash }) => {
		const envelope = envelopeBySelectorKey.get(selectorKey)
		const computedEnvelopeHash = envelope == null ? undefined : actionAuthorityRequestEnvelopeHash(envelope)
		return {
			authorityRequestSelectorKey: selectorKey,
			envelopeHash,
			...(computedEnvelopeHash != null && { computedEnvelopeHash }),
			matches: computedEnvelopeHash === envelopeHash,
		}
	})
}

export const authorityDispatchGraph = async (
	appClient: Pick<
		ClientContext<typeof schema>,
		| 'entityCollections'
		| 'entityFieldCollections'
		| 'schemaVersion'
	>,
	scanPersistedRows: PersistedRowScanner
): Promise<AuthorityDispatchGraph> => {
	const scanRows = (collectionId: string) => (
		scanPersistedRows(collectionId, appClient.schemaVersion)
	)
	const entityRows = async (entityType: EntityType) => (
		await scanRows(appClient.entityCollections[entityType].id)
	).map(({ value }) => {
		const row = persistedEntityRow.assert(value)
		return {
			selectorKey: row[EntityMetaKey.SelectorKey],
			source: row[EntityMetaKey.Source],
		}
	})
	const fieldCollectionId = (entityType: EntityType, fieldName: string) => (
		appClient.entityFieldCollections[entityType][
			entityFieldAddressKey(entityType, [], fieldName)
		].id
	)
	const [
		occurrences,
		authorityRequests,
		walletRequests,
		timestamps,
		envelopes,
		hashes,
		decisions,
		addresses,
		authorityRequestBindings,
		evidence,
		submittedAtRows,
	] = await Promise.all([
		entityRows(EntityType.BlockheadActionDispatchOccurrence),
		entityRows(EntityType.BlockheadActionAuthorityRequest),
		entityRows(EntityType.BlockheadWalletRequest),
		entityRows(EntityType.BlockheadWalletRequest_Timestamp),
		scanRows(fieldCollectionId(EntityType.BlockheadActionAuthorityRequest, 'envelope'))
			.then((rows) => rows.map(({ value }) => persistedAuthorityEnvelopeRow.assert(value))),
		scanRows(fieldCollectionId(EntityType.BlockheadActionAuthorityRequest, 'envelopeHash'))
			.then((rows) => rows.map(({ value }) => persistedAuthorityEnvelopeHashRow.assert(value))),
		scanRows(fieldCollectionId(EntityType.BlockheadActionAuthorityRequest, 'decision'))
			.then((rows) => rows.map(({ value }) => persistedAuthorityDecisionRow.assert(value))),
		scanRows(fieldCollectionId(EntityType.BlockheadActionDispatchOccurrence, 'address'))
			.then((rows) => rows.map(({ value }) => persistedOccurrenceAddressRow.assert(value))),
		scanRows(fieldCollectionId(EntityType.BlockheadActionDispatchOccurrence, '$authorityRequest'))
			.then((rows) => rows.map(({ value }) => persistedOccurrenceAuthorityRequestRow.assert(value))),
		scanRows(fieldCollectionId(EntityType.BlockheadActionDispatchOccurrence, 'evidence'))
			.then((rows) => rows.map(({ value }) => persistedOccurrenceEvidenceRow.assert(value))),
		scanRows(fieldCollectionId(EntityType.BlockheadWalletRequest, 'submittedAt'))
			.then((rows) => rows.map(({ value }) => persistedWalletRequestSubmittedAtRow.assert(value))),
	])
	const authorityRequestValueKeys = new Set(authorityRequests.map(({ selectorKey }) => (
		entityReferenceValueKey(selectorKey)
	)))
	const fields: AuthorityDispatchField[] = [
		...envelopes.map((row): AuthorityDispatchField => ({
			fieldName: 'envelope',
			value: row[EntityMetaKey.Value],
		})),
		...hashes.map((row): AuthorityDispatchField => ({
			fieldName: 'envelopeHash',
			value: row[EntityMetaKey.Value],
		})),
		...decisions.map((row): AuthorityDispatchField => ({
			fieldName: 'decision',
			value: row[EntityMetaKey.Value],
		})),
		...addresses.map((row): AuthorityDispatchField => ({
			fieldName: 'address',
			value: row[EntityMetaKey.Value],
		})),
		...evidence.map((row): AuthorityDispatchField => ({
			fieldName: 'evidence',
			value: row[EntityMetaKey.Value],
		})),
		...submittedAtRows.map((row): AuthorityDispatchField => ({
			fieldName: 'submittedAt',
			value: row[EntityMetaKey.Value],
		})),
	]

	return {
		occurrences,
		authorityRequests,
		walletRequests,
		timestamps,
		authorityRequestBindings: authorityRequestBindings.map((row) => ({
			occurrenceSelectorKey: row[EntityMetaKey.ParentSelectorKey],
			authorityRequestValueKey: row.valueKey,
			matches: authorityRequestValueKeys.has(row.valueKey),
		})),
		envelopeHashBindings: authorityRequestEnvelopeHashBindings(
			envelopes.map((row) => ({
				selectorKey: row[EntityMetaKey.ParentSelectorKey],
				envelope: row[EntityMetaKey.Value],
			})),
			hashes.map((row) => ({
				selectorKey: row[EntityMetaKey.ParentSelectorKey],
				envelopeHash: row[EntityMetaKey.Value],
			}))
		),
		fields,
	}
}

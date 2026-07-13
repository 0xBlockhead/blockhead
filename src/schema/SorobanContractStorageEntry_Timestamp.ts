// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SorobanContractStorageEntry_TimestampSelector {
	EntryLedgerSequenceSource = 'EntryLedgerSequenceSource',
}
export const SorobanContractStorageEntry_Timestamp = entity({
	entityType: EntityType.SorobanContractStorageEntry_Timestamp,
	labels: {
		singular: 'soroban contract storage entry timestamp',
		plural: 'soroban contract storage entry observations',
	},
})({
	$entry: {
		label: 'entry',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SorobanContractStorageEntry,
		cardinality: EntityFieldCardinality.One,
	},
	ledgerSequence: {
		label: 'ledger sequence',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	observedAtMs: {
		label: 'observed AT ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		label: 'Value',
		description: 'The source-domain value.',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueXdr: {
		label: 'value xdr',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	durability: {
		label: 'durability',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastModifiedLedger: {
		label: 'last modified ledger',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	liveUntilLedger: {
		label: 'live until ledger',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	found: {
		label: 'found',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		EntryLedgerSequenceSource: [
			'$entry',
			'ledgerSequence',
			'source',
		],
	},
})

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SorobanContractStorageEntry_TimestampSelector {
	EntryLedgerSequenceSource = 'EntryLedgerSequenceSource',
}
export default {
	entityType: EntityType.SorobanContractStorageEntry_Timestamp,
	label: 'soroban contract storage entry timestamp',
	labelPlural: 'soroban contract storage entry observations',
	selectors: [
		{
			name: SorobanContractStorageEntry_TimestampSelector.EntryLedgerSequenceSource,
			fields: [
				'$entry',
				'ledgerSequence',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$entry',
				label: 'entry',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.SorobanContractStorageEntry,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'ledgerSequence',
				label: 'ledger sequence',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'observedAtMs',
				label: 'observed AT ms',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'value',
				label: 'Value',
				description: 'The source-domain value.',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'valueXdr',
				label: 'value xdr',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'durability',
				label: 'durability',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'lastModifiedLedger',
				label: 'last modified ledger',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'liveUntilLedger',
				label: 'live until ledger',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'found',
				label: 'found',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

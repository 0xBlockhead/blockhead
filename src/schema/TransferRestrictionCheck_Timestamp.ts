// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TransferRestrictionCheck_TimestampSelector {
	RestrictionTimestampMsSourceSubjectKey = 'RestrictionTimestampMsSourceSubjectKey',
}
export default {
	entityType: EntityType.TransferRestrictionCheck_Timestamp,
	label: 'transfer restriction check timestamp',
	labelPlural: 'transfer restriction check observations',
	selectors: [
		{
			name: TransferRestrictionCheck_TimestampSelector.RestrictionTimestampMsSourceSubjectKey,
			fields: [
				'$restriction',
				'timestampMs',
				'source',
				'subjectKey',
			],
		},
	],
	fields: [
		{
			name: '$restriction',
			label: 'restriction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TransferRestriction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
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
			name: 'subjectKey',
			label: 'subject key',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$account',
			label: 'account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Account,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'amount',
			label: 'amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'canTransfer',
			label: 'can transfer',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'reason',
			label: 'reason',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ledgerCoordinateKind',
			label: 'ledger coordinate kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ledgerCoordinateValue',
			label: 'ledger coordinate value',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'validFromMs',
			label: 'valid from ms',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'validToMs',
			label: 'valid to ms',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

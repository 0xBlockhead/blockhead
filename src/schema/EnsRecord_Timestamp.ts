// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EnsRecord_TimestampSelector {
	RecordTimestampMsSource = 'RecordTimestampMsSource',
}
export default {
	entityType: EntityType.EnsRecord_Timestamp,
	label: 'ENS record observation',
	labelPlural: 'ENS record observations',
	selectors: [
		{
			name: EnsRecord_TimestampSelector.RecordTimestampMsSource,
			fields: [
				'$record',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$record',
			label: 'Record',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EnsRecord,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'value',
			label: 'Value',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

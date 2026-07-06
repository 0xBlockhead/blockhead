// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SuiDynamicFieldEdge_TimestampSelector {
	EdgeCheckpointSequenceSource = 'EdgeCheckpointSequenceSource',
}
export default {
	entityType: EntityType.SuiDynamicFieldEdge_Timestamp,
	label: 'sui dynamic field edge timestamp',
	labelPlural: 'sui dynamic field edge observations',
	selectors: [
		{
			name: SuiDynamicFieldEdge_TimestampSelector.EdgeCheckpointSequenceSource,
			fields: [
				'$edge',
				'checkpointSequence',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$edge',
			label: 'edge',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.SuiDynamicFieldEdge,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'checkpointSequence',
			label: 'checkpoint sequence',
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
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'fieldType',
			label: 'field type',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'childObjectType',
			label: 'child object type',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'deleted',
			label: 'deleted',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

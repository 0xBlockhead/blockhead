// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum GitRefObservation_TimestampSelector {
	RefTimestampMsSource = 'RefTimestampMsSource',
}
export default {
	entityType: EntityType.GitRefObservation_Timestamp,
	label: 'Git ref observation timestamp',
	labelPlural: 'Git ref observations',
	selectors: [
		{
			name: GitRefObservation_TimestampSelector.RefTimestampMsSource,
			fields: [
				'$ref',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$ref',
			label: 'ref',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.GitRef,
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
			name: 'targetObjectId',
			label: 'target object ID',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'peeledObjectId',
			label: 'peeled object ID',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'advertised',
			label: 'advertised',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'protection',
			label: 'protection',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TezosBigMap_TimestampSelector {
	BigMapLevelSource = 'BigMapLevelSource',
}
export default {
	entityType: EntityType.TezosBigMap_Timestamp,
	label: 'tezos big map timestamp',
	labelPlural: 'tezos big map observations',
	selectors: [
		{
			name: TezosBigMap_TimestampSelector.BigMapLevelSource,
			fields: [
				'$bigMap',
				'level',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$bigMap',
				label: 'big map',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TezosBigMap,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'level',
				label: 'level',
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
				name: 'active',
				label: 'active',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'keyCount',
				label: 'key count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'updateCount',
				label: 'update count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

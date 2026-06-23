import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum TezosBigMapKey_TimestampSelector {
	BigMapKeyLevelSource = '$bigMapKey+level+source',
}
export default {
	entityType: EntityType.TezosBigMapKey_Timestamp,
	label: 'tezos big map key timestamp',
	labelPlural: 'tezos big map key observations',
	selectors: [
		{
			name: TezosBigMapKey_TimestampSelector.BigMapKeyLevelSource,
			fields: [
				'$bigMapKey',
				'level',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$bigMapKey',
			label: 'big map key',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TezosBigMapKey,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'level',
			label: 'level',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'key',
			label: 'key',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'value',
			label: 'Value',
			description: 'The source-domain value.',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'firstLevel',
			label: 'first level',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastLevel',
			label: 'last level',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'updateCount',
			label: 'update count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'active',
			label: 'active',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

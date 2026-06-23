import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum TezosBigMapDiffSelector {
	OperationBigMapIdKeyHash = '$operation+bigMapId+keyHash',
}
export default {
	entityType: EntityType.TezosBigMapDiff,
	label: 'tezos big map diff',
	labelPlural: 'tezos big map diffs',
	selectors: [
		{
			name: TezosBigMapDiffSelector.OperationBigMapIdKeyHash,
			fields: [
				'$operation',
				'bigMapId',
				'keyHash',
			],
		},
	],
	fields: [
		{
			name: '$operation',
			label: 'operation',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TezosOperation,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'bigMapId',
			label: 'big map ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'keyHash',
			label: 'key hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'action',
			label: 'action',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
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
			name: '$bigMap',
			label: 'big map',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TezosBigMap,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

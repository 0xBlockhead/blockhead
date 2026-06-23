import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum TezosBakingRight_TimestampSelector {
	RightTimestampMsSource = '$right+timestampMs+source',
}
export default {
	entityType: EntityType.TezosBakingRight_Timestamp,
	label: 'tezos baking right timestamp',
	labelPlural: 'tezos baking right observations',
	selectors: [
		{
			name: TezosBakingRight_TimestampSelector.RightTimestampMsSource,
			fields: [
				'$right',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$right',
			label: 'right',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TezosBakingRight,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
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
			name: 'status',
			label: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'estimatedTimeMs',
			label: 'estimated time ms',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$block',
			label: 'block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.TezosBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

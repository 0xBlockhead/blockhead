import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum EvmRollup_TimestampSelector {
	RollupTimestampMsSource = '$rollup+timestampMs+source',
}
export default {
	entityType: EntityType.EvmRollup_Timestamp,
	label: 'EVM rollup timestamp',
	labelPlural: 'EVM rollup observations',
	selectors: [
		{
			name: EvmRollup_TimestampSelector.RollupTimestampMsSource,
			fields: [
				'$rollup',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$rollup',
			label: 'rollup',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmRollup,
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
			name: 'isArchived',
			label: 'is archived',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'isUpcoming',
			label: 'is upcoming',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'isUnderReview',
			label: 'is under review',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'listingStage',
			label: 'listing stage',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sourceUpdatedAt',
			label: 'source updated AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmRollup_TimestampSelector {
	RollupTimestampMsSource = 'RollupTimestampMsSource',
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
				label: 'Rollup',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmRollup,
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
				name: 'isArchived',
				label: 'Archived',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'isUpcoming',
				label: 'Upcoming',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'isUnderReview',
				label: 'Under review',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'listingStage',
				label: 'Listing stage',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'sourceUpdatedAt',
				label: 'Source updated at',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EvmRollup_TimestampSelector {
	RollupTimestampMsSource = 'RollupTimestampMsSource',
}
export const EvmRollup_Timestamp = entity({
	entityType: EntityType.EvmRollup_Timestamp,
	labels: {
		singular: 'EVM rollup timestamp',
		plural: 'EVM rollup observations',
	},
})({
	$rollup: {
		label: 'Rollup',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmRollup,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	isArchived: {
		label: 'Archived',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isUpcoming: {
		label: 'Upcoming',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isUnderReview: {
		label: 'Under review',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	listingStage: {
		label: 'Listing stage',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceUpdatedAt: {
		label: 'Source updated at',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		RollupTimestampMsSource: [
			'$rollup',
			'timestampMs',
			'source',
		],
	},
})

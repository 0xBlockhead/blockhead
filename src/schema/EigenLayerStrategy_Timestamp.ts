// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EigenLayerStrategy_TimestampSelector {
	StrategyTimestampMsSource = 'StrategyTimestampMsSource',
}
export const EigenLayerStrategy_Timestamp = entity({
	entityType: EntityType.EigenLayerStrategy_Timestamp,
	labels: {
		singular: 'eigen layer strategy timestamp',
		plural: 'eigen layer strategy observations',
	},
})({
	$strategy: {
		label: 'strategy',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EigenLayerStrategy,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	blockNumber: {
		label: 'Block number',
		description: 'The block height or number in its network.',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalShares: {
		label: 'total shares',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalUnderlying: {
		label: 'total underlying',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stakerCount: {
		label: 'staker count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	delegationCount: {
		label: 'delegation count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		StrategyTimestampMsSource: [
			'$strategy',
			'timestampMs',
			'source',
		],
	},
})

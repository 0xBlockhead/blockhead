// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EigenLayerStrategy_TimestampSelector {
	StrategyTimestampMsSource = 'StrategyTimestampMsSource',
}
export default {
	entityType: EntityType.EigenLayerStrategy_Timestamp,
	label: 'eigen layer strategy timestamp',
	labelPlural: 'eigen layer strategy observations',
	selectors: [
		{
			name: EigenLayerStrategy_TimestampSelector.StrategyTimestampMsSource,
			fields: [
				'$strategy',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$strategy',
				label: 'strategy',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EigenLayerStrategy,
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
				name: 'blockNumber',
				label: 'Block number',
				description: 'The block height or number in its network.',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'totalShares',
				label: 'total shares',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'totalUnderlying',
				label: 'total underlying',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'stakerCount',
				label: 'staker count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'delegationCount',
				label: 'delegation count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

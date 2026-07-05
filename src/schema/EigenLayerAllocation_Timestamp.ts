// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum EigenLayerAllocation_TimestampSelector {
	OperatorAvsStrategyTimestampMsSource = 'OperatorAvsStrategyTimestampMsSource',
}
export default {
	entityType: EntityType.EigenLayerAllocation_Timestamp,
	label: 'eigen layer allocation timestamp',
	labelPlural: 'eigen layer allocation observations',
	selectors: [
		{
			name: EigenLayerAllocation_TimestampSelector.OperatorAvsStrategyTimestampMsSource,
			fields: [
				'$operator',
				'$avs',
				'$strategy',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$operator',
				label: 'operator',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EigenLayerOperator,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$avs',
				label: 'AVS',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EigenLayerAvs,
				cardinality: EntityFieldCardinality.One,
		},
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
				name: 'allocationMagnitude',
				label: 'allocation magnitude',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'allocatedShares',
				label: 'allocated shares',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'slashableUntilMs',
				label: 'slashable until ms',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'registrationStatus',
				label: 'registration status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'operatorSetId',
				label: 'operator set ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'quorumNumbers',
				label: 'quorum numbers',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

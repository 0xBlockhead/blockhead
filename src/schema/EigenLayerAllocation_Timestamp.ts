// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EigenLayerAllocation_Timestamp,
	labels: {
		singular: 'eigen layer allocation timestamp',
		plural: 'eigen layer allocation observations',
	},
})({
	$operator: {
		label: 'operator',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EigenLayerOperator,
		cardinality: EntityFieldCardinality.One,
	},
	$avs: {
		label: 'AVS',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EigenLayerAvs,
		cardinality: EntityFieldCardinality.One,
	},
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
	allocationMagnitude: {
		label: 'allocation magnitude',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	allocatedShares: {
		label: 'allocated shares',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slashableUntilMs: {
		label: 'slashable until ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registrationStatus: {
		label: 'registration status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	operatorSetId: {
		label: 'operator set ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	quorumNumbers: {
		label: 'quorum numbers',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		OperatorAvsStrategyTimestampMsSource: [
			'$operator',
			'$avs',
			'$strategy',
			'timestampMs',
			'source',
		],
	},
})

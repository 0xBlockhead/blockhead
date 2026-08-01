// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.EigenLayerOperator,
		cardinality: EntityFieldCardinality.One,
	},
	$avs: {
		label: 'AVS',
		entityType: EntityType.EigenLayerAvs,
		cardinality: EntityFieldCardinality.One,
	},
	$strategy: {
		label: 'strategy',
		entityType: EntityType.EigenLayerStrategy,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	allocationMagnitude: {
		label: 'allocation magnitude',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	allocatedShares: {
		label: 'allocated shares',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slashableUntilMs: {
		label: 'slashable until ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registrationStatus: {
		label: 'registration status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	operatorSetId: {
		label: 'operator set ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	quorumNumbers: {
		label: 'quorum numbers',
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

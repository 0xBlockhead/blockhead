// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EigenLayerDelegation_Timestamp,
	labels: {
		singular: 'eigen layer delegation timestamp',
		plural: 'eigen layer delegation observations',
	},
})({
	$staker: {
		label: 'staker',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$operator: {
		label: 'operator',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EigenLayerOperator,
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
	delegatedShares: {
		label: 'delegated shares',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	underlyingTokenAmount: {
		label: 'underlying token amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	depositRoot: {
		label: 'deposit root',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	withdrawalRoot: {
		label: 'withdrawal root',
		type: EntityFieldType.Primitive,
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	withdrawalQueued: {
		label: 'withdrawal queued',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	withdrawalCompleted: {
		label: 'withdrawal completed',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		StakerOperatorStrategyTimestampMsSource: [
			'$staker',
			'$operator',
			'$strategy',
			'timestampMs',
			'source',
		],
	},
})

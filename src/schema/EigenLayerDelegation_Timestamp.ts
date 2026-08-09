// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$operator: {
		entityType: EntityType.EigenLayerOperator,
		cardinality: EntityFieldCardinality.One,
	},
	$strategy: {
		entityType: EntityType.EigenLayerStrategy,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	delegatedShares: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	underlyingTokenAmount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	depositRoot: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	withdrawalRoot: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	withdrawalQueued: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	withdrawalCompleted: {
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

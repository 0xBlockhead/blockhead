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
		label: 'staker',
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.One,
	},
	$operator: {
		label: 'operator',
		entityType: EntityType.EigenLayerOperator,
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
	delegatedShares: {
		label: 'delegated shares',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	underlyingTokenAmount: {
		label: 'underlying token amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	depositRoot: {
		label: 'deposit root',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	withdrawalRoot: {
		label: 'withdrawal root',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	withdrawalQueued: {
		label: 'withdrawal queued',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	withdrawalCompleted: {
		label: 'withdrawal completed',
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

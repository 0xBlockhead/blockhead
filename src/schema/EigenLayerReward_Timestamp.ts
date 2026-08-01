// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EigenLayerReward_Timestamp,
	labels: {
		singular: 'eigen layer reward timestamp',
		plural: 'eigen layer reward observations',
	},
})({
	$earner: {
		label: 'earner',
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.One,
	},
	rewardContextKey: {
		label: 'reward context key',
		primitiveType: type('string'),
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
	$strategy: {
		label: 'strategy',
		entityType: EntityType.EigenLayerStrategy,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$operator: {
		label: 'operator',
		entityType: EntityType.EigenLayerOperator,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$avs: {
		label: 'AVS',
		entityType: EntityType.EigenLayerAvs,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardToken: {
		label: 'reward token',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardAmount: {
		label: 'reward amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cumulativeClaimed: {
		label: 'cumulative claimed',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	merkleRoot: {
		label: 'merkle root',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	claimProof: {
		label: 'claim proof',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	proofRequested: {
		label: 'proof requested',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		EarnerRewardContextKeyTimestampMsSource: [
			'$earner',
			'rewardContextKey',
			'timestampMs',
			'source',
		],
	},
})

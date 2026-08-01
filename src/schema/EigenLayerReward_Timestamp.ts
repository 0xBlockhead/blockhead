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
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.One,
	},
	rewardContextKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$strategy: {
		entityType: EntityType.EigenLayerStrategy,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$operator: {
		entityType: EntityType.EigenLayerOperator,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$avs: {
		entityType: EntityType.EigenLayerAvs,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardToken: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardAmount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cumulativeClaimed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	merkleRoot: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	claimProof: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	proofRequested: {
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

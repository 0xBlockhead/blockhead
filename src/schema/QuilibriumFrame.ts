// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.QuilibriumFrame,
	labels: {
		singular: 'quilibrium frame',
		plural: 'quilibrium frames',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	frameNumber: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	shardKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	frameHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	difficulty: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$shard: {
		entityType: EntityType.QuilibriumShard,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$prover: {
		entityType: EntityType.QuilibriumProver,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkFrameNumberShardKey: [
			'$network',
			'frameNumber',
			'shardKey',
		],
	},
})

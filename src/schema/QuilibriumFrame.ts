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
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	frameNumber: {
		label: 'frame number',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	shardKey: {
		label: 'shard key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	frameHash: {
		label: 'frame hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	difficulty: {
		label: 'difficulty',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$shard: {
		label: 'shard',
		entityType: EntityType.QuilibriumShard,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$prover: {
		label: 'prover',
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

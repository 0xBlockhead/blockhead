// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.QuilibriumShard,
	labels: {
		singular: 'quilibrium shard',
		plural: 'quilibrium shards',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	shardKey: {
		label: 'shard key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	shardKind: {
		label: 'shard kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$applicationAccount: {
		label: 'application account',
		entityType: EntityType.QuilibriumAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$frames: {
		label: 'frames',
		entityType: EntityType.QuilibriumFrame,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkShardKey: [
			'$network',
			'shardKey',
		],
	},
})

// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	shardKey: {
		label: 'shard key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	shardKind: {
		label: 'shard kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$applicationAccount: {
		label: 'application account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.QuilibriumAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$frames: {
		label: 'frames',
		type: EntityFieldType.EntitiesReference,
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

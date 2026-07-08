// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum QuilibriumShardSelector {
	NetworkShardKey = 'NetworkShardKey',
}
export const QuilibriumShard = entity({
	entityType: EntityType.QuilibriumShard,
	label: 'quilibrium shard',
	labelPlural: 'quilibrium shards',
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

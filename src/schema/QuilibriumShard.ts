// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum QuilibriumShardSelector {
	NetworkShardKey = 'NetworkShardKey',
}
export default {
	entityType: EntityType.QuilibriumShard,
	label: 'quilibrium shard',
	labelPlural: 'quilibrium shards',
	selectors: [
		{
			name: QuilibriumShardSelector.NetworkShardKey,
			fields: [
				'$network',
				'shardKey',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'shardKey',
			label: 'shard key',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'shardKind',
			label: 'shard kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$applicationAccount',
			label: 'application account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.QuilibriumAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$frames',
			label: 'frames',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.QuilibriumFrame,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

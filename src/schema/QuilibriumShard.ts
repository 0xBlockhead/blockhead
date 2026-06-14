import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum QuilibriumShardSelector {
	NetworkShardKey = 'networkShardKey',
}

export default {
	entityType: EntityType.QuilibriumShard,

	label: 'Quilibrium Shard',
	labelPlural: 'Quilibrium Shards',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'shardKey',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'shardKind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$applicationAccount',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.QuilibriumAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

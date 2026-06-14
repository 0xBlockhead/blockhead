import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum QuilibriumFrameSelector {
	NetworkFrameNumberShardKey = 'networkFrameNumberShardKey',
}

export default {
	entityType: EntityType.QuilibriumFrame,

	label: 'Quilibrium Frame',
	labelPlural: 'Quilibrium Frames',

	selectors: [
		{
			name: QuilibriumFrameSelector.NetworkFrameNumberShardKey,
			fields: [
				'$network',
				'frameNumber',
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
			name: 'frameNumber',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'shardKey',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'frameHash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$shard',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.QuilibriumShard,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$prover',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.QuilibriumProver,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

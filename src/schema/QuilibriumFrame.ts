// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum QuilibriumFrameSelector {
	NetworkFrameNumberShardKey = 'NetworkFrameNumberShardKey',
}
export default {
	entityType: EntityType.QuilibriumFrame,
	label: 'quilibrium frame',
	labelPlural: 'quilibrium frames',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'frameNumber',
			label: 'frame number',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
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
			name: 'frameHash',
			label: 'frame hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'difficulty',
			label: 'difficulty',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$shard',
			label: 'shard',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.QuilibriumShard,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$prover',
			label: 'prover',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.QuilibriumProver,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

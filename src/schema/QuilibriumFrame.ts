// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum QuilibriumFrameSelector {
	NetworkFrameNumberShardKey = 'NetworkFrameNumberShardKey',
}
export const QuilibriumFrame = entity({
	entityType: EntityType.QuilibriumFrame,
	label: 'quilibrium frame',
	labelPlural: 'quilibrium frames',
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	frameNumber: {
		label: 'frame number',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	shardKey: {
		label: 'shard key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	frameHash: {
		label: 'frame hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	difficulty: {
		label: 'difficulty',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$shard: {
		label: 'shard',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.QuilibriumShard,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$prover: {
		label: 'prover',
		type: EntityFieldType.EntityReference,
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

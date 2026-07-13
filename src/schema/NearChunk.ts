// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NearChunkSelector {
	NetworkChunkHash = 'NetworkChunkHash',
}
export const NearChunk = entity({
	entityType: EntityType.NearChunk,
	labels: {
		singular: 'near chunk',
		plural: 'near chunks',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	chunkHash: {
		label: 'Chunk hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		label: 'Block',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.NearBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	shardId: {
		label: 'Shard ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	gasUsed: {
		label: 'Gas used',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
	$$transactions: {
		label: 'Transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.NearTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.NearRpc_JsonRpc,
		],
	},
})({
	selectors: {
		NetworkChunkHash: [
			'$network',
			'chunkHash',
		],
	},
})

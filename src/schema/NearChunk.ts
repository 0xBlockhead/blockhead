// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NearChunkSelector {
	NetworkChunkHash = 'NetworkChunkHash',
}
export default {
	entityType: EntityType.NearChunk,
	label: 'near chunk',
	labelPlural: 'near chunks',
	selectors: [
		{
			name: NearChunkSelector.NetworkChunkHash,
			fields: [
				'$network',
				'chunkHash',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'chunkHash',
			label: 'Chunk hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$block',
			label: 'Block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NearBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'shardId',
			label: 'Shard ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: 'gasUsed',
			label: 'Gas used',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
		{
			name: '$$transactions',
			label: 'Transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NearTransaction,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.NearRpc_JsonRpc,
			],
		},
	],
} as const satisfies EntityDefinition

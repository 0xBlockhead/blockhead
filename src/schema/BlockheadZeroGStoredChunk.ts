// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadZeroGStoredChunkSelector {
	NodeStateDataRootChunkIndex = 'NodeStateDataRootChunkIndex',
}
export default {
	entityType: EntityType.BlockheadZeroGStoredChunk,
	label: 'blockhead zero g stored chunk',
	labelPlural: 'blockhead zero g stored chunks',
	selectors: [
		{
			name: BlockheadZeroGStoredChunkSelector.NodeStateDataRootChunkIndex,
			fields: [
				'$nodeState',
				'dataRoot',
				'chunkIndex',
			],
		},
	],
	fields: [
		{
			name: '$nodeState',
			label: 'node state',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadZeroGStorageNodeState,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'dataRoot',
			label: 'data root',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'chunkIndex',
			label: 'chunk index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$dataBlob',
			label: 'data blob',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGDataBlob,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$publicChunk',
			label: 'public chunk',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGDataChunk,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'chunkRoot',
			label: 'chunk root',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sizeBytes',
			label: 'size bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'filePath',
			label: 'file path',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'present',
			label: 'present',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'lastCheckedAt',
			label: 'last checked AT',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

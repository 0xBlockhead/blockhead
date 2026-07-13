// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadZeroGStoredChunkSelector {
	NodeStateDataRootChunkIndex = 'NodeStateDataRootChunkIndex',
}
export const BlockheadZeroGStoredChunk = entity({
	entityType: EntityType.BlockheadZeroGStoredChunk,
	labels: {
		singular: 'blockhead zero g stored chunk',
		plural: 'blockhead zero g stored chunks',
	},
})({
	$nodeState: {
		label: 'node state',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadZeroGStorageNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	dataRoot: {
		label: 'data root',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	chunkIndex: {
		label: 'chunk index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$dataBlob: {
		label: 'data blob',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ZeroGDataBlob,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$publicChunk: {
		label: 'public chunk',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ZeroGDataChunk,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	chunkRoot: {
		label: 'chunk root',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sizeBytes: {
		label: 'size bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	filePath: {
		label: 'file path',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	present: {
		label: 'present',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	lastCheckedAt: {
		label: 'last checked AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NodeStateDataRootChunkIndex: [
			'$nodeState',
			'dataRoot',
			'chunkIndex',
		],
	},
})

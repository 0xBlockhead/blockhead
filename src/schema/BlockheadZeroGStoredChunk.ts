// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadZeroGStoredChunk,
	labels: {
		singular: 'blockhead zero g stored chunk',
		plural: 'blockhead zero g stored chunks',
	},
})({
	$nodeState: {
		label: 'node state',
		entityType: EntityType.BlockheadZeroGStorageNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	dataRoot: {
		label: 'data root',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	chunkIndex: {
		label: 'chunk index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$dataBlob: {
		label: 'data blob',
		entityType: EntityType.ZeroGDataBlob,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$publicChunk: {
		label: 'public chunk',
		entityType: EntityType.ZeroGDataChunk,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	chunkRoot: {
		label: 'chunk root',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sizeBytes: {
		label: 'size bytes',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	filePath: {
		label: 'file path',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	present: {
		label: 'present',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	lastCheckedAt: {
		label: 'last checked AT',
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

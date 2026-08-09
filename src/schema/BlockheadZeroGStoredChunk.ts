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
		entityType: EntityType.BlockheadZeroGStorageNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	dataRoot: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	chunkIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$dataBlob: {
		entityType: EntityType.ZeroGDataBlob,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$publicChunk: {
		entityType: EntityType.ZeroGDataChunk,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	chunkRoot: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sizeBytes: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	filePath: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	present: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	lastCheckedAt: {
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

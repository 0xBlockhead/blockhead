// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ZeroGDataChunk,
	labels: {
		singular: 'zero g data chunk',
		plural: 'zero g data chunks',
	},
})({
	$dataBlob: {
		label: 'data blob',
		entityType: EntityType.ZeroGDataBlob,
		cardinality: EntityFieldCardinality.One,
	},
	chunkIndex: {
		label: 'chunk index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
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
})({
	selectors: {
		ZeroGDataBlobChunkIndex: [
			'$dataBlob',
			'chunkIndex',
		],
	},
})

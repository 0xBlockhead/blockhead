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
		entityType: EntityType.ZeroGDataBlob,
		cardinality: EntityFieldCardinality.One,
	},
	chunkIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	chunkRoot: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sizeBytes: {
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

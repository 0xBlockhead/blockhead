// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ZeroGDataBlob,
		cardinality: EntityFieldCardinality.One,
	},
	chunkIndex: {
		label: 'chunk index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
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
})({
	selectors: {
		ZeroGDataBlobChunkIndex: [
			'$dataBlob',
			'chunkIndex',
		],
	},
})

// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ZeroGDataChunkSelector {
	ZeroGDataBlobChunkIndex = 'ZeroGDataBlobChunkIndex',
}
export const ZeroGDataChunk = entity({
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

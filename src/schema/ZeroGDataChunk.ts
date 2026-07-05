// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ZeroGDataChunkSelector {
	ZeroGDataBlobChunkIndex = 'ZeroGDataBlobChunkIndex',
}
export default {
	entityType: EntityType.ZeroGDataChunk,
	label: 'zero g data chunk',
	labelPlural: 'zero g data chunks',
	selectors: [
		{
			name: ZeroGDataChunkSelector.ZeroGDataBlobChunkIndex,
			fields: [
				'$dataBlob',
				'chunkIndex',
			],
		},
	],
	fields: [
		{
				name: '$dataBlob',
				label: 'data blob',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.ZeroGDataBlob,
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
	],
} as const satisfies EntityDefinition

import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum ZeroGDataChunkSelector {
	ZeroGDataBlobChunkIndex = 'zeroGDataBlobChunkIndex',
	DataBlobChunkIndex = '$dataBlob+chunkIndex',
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
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$storageNode',
			label: 'storage node',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGStorageNode,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'chunkRoot',
			label: 'chunk root',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sizeBytes',
			label: 'size bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

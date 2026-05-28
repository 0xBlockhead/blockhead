import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import ZeroGDataBlob from '$/schema/ZeroGDataBlob.ts'

export default {
	entityType: EntityType.ZeroGDataChunk,

	label: '0G data chunk',
	labelPlural: '0G data chunks',

	id: type({
		$dataBlob: ZeroGDataBlob.id,
		chunkIndex: 'number',
	}),

	fields: [
		{
			name: '$storageNode',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGStorageNode,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'chunkRoot',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sizeBytes',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

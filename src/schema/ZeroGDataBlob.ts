import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum ZeroGDataBlobSelector {
	NetworkDataRoot = 'networkDataRoot',
}

export default {
	entityType: EntityType.ZeroGDataBlob,

	label: '0G data blob',
	labelPlural: '0G data blobs',

	selectors: [
		{
			name: ZeroGDataBlobSelector.NetworkDataRoot,
			fields: [
				'$network',
				'dataRoot',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'dataRoot',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$consensusNetwork',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGConsensusNetwork,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$daQuorum',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGDaQuorum,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sizeBytes',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'erasureCodingScheme',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'aggregatedSignature',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$chunks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZeroGDataChunk,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$storageLogEntry',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGStorageLogEntry,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum ZeroGDataBlobSelector {
	NetworkDataRoot = 'networkDataRoot',
}
export default {
	entityType: EntityType.ZeroGDataBlob,
	label: 'zero g data blob',
	labelPlural: 'zero g data blobs',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'dataRoot',
			label: 'data root',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$consensusNetwork',
			label: 'consensus network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGConsensusNetwork,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$daQuorum',
			label: 'da quorum',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGDaQuorum,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sizeBytes',
			label: 'size bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'erasureCodingScheme',
			label: 'erasure coding scheme',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'aggregatedSignature',
			label: 'aggregated signature',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$chunks',
			label: 'chunks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZeroGDataChunk,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$storageLogEntry',
			label: 'storage log entry',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGStorageLogEntry,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

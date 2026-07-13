// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ZeroGDataBlobSelector {
	NetworkDataRoot = 'NetworkDataRoot',
}
export const ZeroGDataBlob = entity({
	entityType: EntityType.ZeroGDataBlob,
	labels: {
		singular: 'zero g data blob',
		plural: 'zero g data blobs',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	dataRoot: {
		label: 'data root',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$consensusNetwork: {
		label: 'consensus network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ZeroGConsensusNetwork,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$daQuorum: {
		label: 'DA quorum',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ZeroGDaQuorum,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sizeBytes: {
		label: 'size bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	erasureCodingScheme: {
		label: 'erasure coding scheme',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	aggregatedSignature: {
		label: 'aggregated signature',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$chunks: {
		label: 'chunks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ZeroGDataChunk,
		cardinality: EntityFieldCardinality.Many,
	},
	$storageLogEntry: {
		label: 'storage log entry',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ZeroGStorageLogEntry,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkDataRoot: [
			'$network',
			'dataRoot',
		],
	},
})

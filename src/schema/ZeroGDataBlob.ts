// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ZeroGDataBlob,
	labels: {
		singular: 'zero g data blob',
		plural: 'zero g data blobs',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	dataRoot: {
		label: 'data root',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$consensusNetwork: {
		label: 'consensus network',
		entityType: EntityType.ZeroGConsensusNetwork,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$daQuorum: {
		label: 'DA quorum',
		entityType: EntityType.ZeroGDaQuorum,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sizeBytes: {
		label: 'size bytes',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	erasureCodingScheme: {
		label: 'erasure coding scheme',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	aggregatedSignature: {
		label: 'aggregated signature',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$chunks: {
		label: 'chunks',
		entityType: EntityType.ZeroGDataChunk,
		cardinality: EntityFieldCardinality.Many,
	},
	$storageLogEntry: {
		label: 'storage log entry',
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

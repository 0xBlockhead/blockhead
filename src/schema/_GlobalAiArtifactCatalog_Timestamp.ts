// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType._GlobalAiArtifactCatalog_Timestamp,
	labels: {
		singular: 'global AI artifact catalog timestamp',
		plural: 'global AI artifact catalog observations',
	},
})({
	$catalog: {
		label: 'catalog',
		entityType: EntityType._GlobalAiArtifactCatalog,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sourceReportedArtifactCount: {
		label: 'sourceReportedArtifactCount',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	seededArtifactCount: {
		label: 'seededArtifactCount',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceReportedDocumentCount: {
		label: 'sourceReportedDocumentCount',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	seededDocumentCount: {
		label: 'seededDocumentCount',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ociManifestCount: {
		label: 'ociManifestCount',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spdxDocumentCount: {
		label: 'spdxDocumentCount',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cycloneDxDocumentCount: {
		label: 'cycloneDxDocumentCount',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	croissantDocumentCount: {
		label: 'croissantDocumentCount',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mlflowModelCount: {
		label: 'mlflowModelCount',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	onnxModelCount: {
		label: 'onnxModelCount',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	declaredEndpointCount: {
		label: 'declaredEndpointCount',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	reachableEndpointCount: {
		label: 'reachableEndpointCount',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	queryHashAlgorithm: {
		label: 'query hash algorithm',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	queryHash: {
		label: 'query hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastCursor: {
		label: 'last cursor',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'error',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		CatalogTimestampMsSource: [
			'$catalog',
			'timestampMs',
			'source',
		],
	},
})

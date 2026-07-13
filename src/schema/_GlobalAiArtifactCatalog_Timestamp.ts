// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum _GlobalAiArtifactCatalog_TimestampSelector {
	CatalogTimestampMsSource = 'CatalogTimestampMsSource',
}
export const _GlobalAiArtifactCatalog_Timestamp = entity({
	entityType: EntityType._GlobalAiArtifactCatalog_Timestamp,
	labels: {
		singular: 'global AI artifact catalog timestamp',
		plural: 'global AI artifact catalog observations',
	},
})({
	$catalog: {
		label: 'catalog',
		type: EntityFieldType.EntityReference,
		entityType: EntityType._GlobalAiArtifactCatalog,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sourceReportedArtifactCount: {
		label: 'sourceReportedArtifactCount',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	seededArtifactCount: {
		label: 'seededArtifactCount',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceReportedDocumentCount: {
		label: 'sourceReportedDocumentCount',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	seededDocumentCount: {
		label: 'seededDocumentCount',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ociManifestCount: {
		label: 'ociManifestCount',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spdxDocumentCount: {
		label: 'spdxDocumentCount',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	cycloneDxDocumentCount: {
		label: 'cycloneDxDocumentCount',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	croissantDocumentCount: {
		label: 'croissantDocumentCount',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mlflowModelCount: {
		label: 'mlflowModelCount',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	onnxModelCount: {
		label: 'onnxModelCount',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	declaredEndpointCount: {
		label: 'declaredEndpointCount',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	reachableEndpointCount: {
		label: 'reachableEndpointCount',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	queryHashAlgorithm: {
		label: 'query hash algorithm',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	queryHash: {
		label: 'query hash',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastCursor: {
		label: 'last cursor',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'error',
		type: EntityFieldType.Primitive,
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

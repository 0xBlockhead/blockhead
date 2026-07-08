// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum AiDocumentSelector {
	KindContentHash = 'KindContentHash',
	KindArtifact = 'KindArtifact',
	DocumentUrl = 'DocumentUrl',
}
export const AiDocument = entity({
	entityType: EntityType.AiDocument,
	label: 'AI document',
	labelPlural: 'AI documents',
})({
	documentKind: {
		label: 'document kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	contentHashAlgorithm: {
		label: 'content hash algorithm',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contentHash: {
		label: 'content hash',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$artifact: {
		label: 'artifact',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AiArtifact,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	documentUrl: {
		label: 'document URL',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mediaType: {
		label: 'media type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	schemaVersion: {
		label: 'schema version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	conformsTo: {
		label: 'conforms to',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceFormat: {
		label: 'source format',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	declaredSubjectKind: {
		label: 'declared subject kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	declaredSubjectSelector: {
		label: 'declared subject selector',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$claims: {
		label: 'claims',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AiDocumentClaim,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		KindContentHash: [
			'documentKind',
			'contentHashAlgorithm',
			'contentHash',
		],
		KindArtifact: [
			'documentKind',
			'$artifact',
		],
		DocumentUrl: [
			'documentUrl',
		],
	},
})

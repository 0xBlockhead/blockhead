// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AiDocument,
	labels: {
		singular: 'AI document',
		plural: 'AI documents',
	},
})({
	documentKind: {
		label: 'document kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	contentHashAlgorithm: {
		label: 'content hash algorithm',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contentHash: {
		label: 'content hash',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$artifact: {
		label: 'artifact',
		entityType: EntityType.AiArtifact,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	documentUrl: {
		label: 'document URL',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mediaType: {
		label: 'media type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	schemaVersion: {
		label: 'schema version',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	conformsTo: {
		label: 'conforms to',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceFormat: {
		label: 'source format',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	declaredSubjectKind: {
		label: 'declared subject kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	declaredSubjectSelector: {
		label: 'declared subject selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$claims: {
		label: 'claims',
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

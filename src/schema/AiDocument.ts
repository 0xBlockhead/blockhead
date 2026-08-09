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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	contentHashAlgorithm: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contentHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$artifact: {
		entityType: EntityType.AiArtifact,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	documentUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mediaType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	schemaVersion: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	conformsTo: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceFormat: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	declaredSubjectKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	declaredSubjectSelector: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$claims: {
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

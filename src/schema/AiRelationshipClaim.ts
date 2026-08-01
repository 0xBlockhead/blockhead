// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AiRelationshipClaim,
	labels: {
		singular: 'AI relationship claim',
		plural: 'AI relationship claims',
	},
})({
	subjectKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	subjectSelector: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.One,
	},
	relationshipKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	objectKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	objectSelector: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	confidence: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$document: {
		entityType: EntityType.AiDocument,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$documentClaim: {
		entityType: EntityType.AiDocumentClaim,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	evidenceUri: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	evidenceHashAlgorithm: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	evidenceHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signature: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SubjectKindSubjectSelectorRelationshipKindObjectKindObjectSelectorSourceTimestampMs: [
			'subjectKind',
			'subjectSelector',
			'relationshipKind',
			'objectKind',
			'objectSelector',
			'source',
			'timestampMs',
		],
	},
})

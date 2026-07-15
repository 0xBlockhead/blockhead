// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum AiRelationshipClaimSelector {
	SubjectKindSubjectSelectorRelationshipKindObjectKindObjectSelectorSourceTimestampMs = 'SubjectKindSubjectSelectorRelationshipKindObjectKindObjectSelectorSourceTimestampMs',
}
export const AiRelationshipClaim = entity({
	entityType: EntityType.AiRelationshipClaim,
	labels: {
		singular: 'AI relationship claim',
		plural: 'AI relationship claims',
	},
})({
	subjectKind: {
		label: 'subject kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	subjectSelector: {
		label: 'subject selector',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.One,
	},
	relationshipKind: {
		label: 'relationship kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	objectKind: {
		label: 'object kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	objectSelector: {
		label: 'object selector',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	confidence: {
		label: 'confidence',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$document: {
		label: 'document',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AiDocument,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$documentClaim: {
		label: 'document claim',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AiDocumentClaim,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	evidenceUri: {
		label: 'evidence URI',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	evidenceHashAlgorithm: {
		label: 'evidence hash algorithm',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	evidenceHash: {
		label: 'evidence hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signature: {
		label: 'signature',
		type: EntityFieldType.Primitive,
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

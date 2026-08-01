// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AgentIdentityClaim,
	labels: {
		singular: 'agent identity claim',
		plural: 'agent identity claims',
	},
})({
	subjectKind: {
		label: 'subject kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	subjectSelector: {
		label: 'subject selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.One,
	},
	identityKind: {
		label: 'identity kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	objectKind: {
		label: 'object kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	objectSelector: {
		label: 'object selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	confidence: {
		label: 'confidence',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verificationMethod: {
		label: 'verification method',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$document: {
		label: 'document',
		entityType: EntityType.AiDocument,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	evidenceUri: {
		label: 'evidence URI',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	evidenceHashAlgorithm: {
		label: 'evidence hash algorithm',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	evidenceHash: {
		label: 'evidence hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signature: {
		label: 'signature',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SubjectKindSubjectSelectorIdentityKindObjectKindObjectSelectorSourceTimestampMs: [
			'subjectKind',
			'subjectSelector',
			'identityKind',
			'objectKind',
			'objectSelector',
			'source',
			'timestampMs',
		],
	},
})

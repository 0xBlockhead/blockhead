// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AiDocumentClaim,
	labels: {
		singular: 'AI document claim',
		plural: 'AI document claims',
	},
})({
	$document: {
		label: 'document',
		entityType: EntityType.AiDocument,
		cardinality: EntityFieldCardinality.One,
	},
	extractorId: {
		label: 'extractor ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	claimPath: {
		label: 'claim path',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	claimKind: {
		label: 'claim kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	value: {
		label: 'Value',
		description: 'The source-domain value.',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subjectKind: {
		label: 'subject kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subjectSelector: {
		label: 'subject selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metadataKey: {
		label: 'metadata key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	formatObjectId: {
		label: 'format object ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	formatObjectKind: {
		label: 'format object kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	checksumAlgorithm: {
		label: 'checksum algorithm',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	checksumValue: {
		label: 'checksum value',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	relationshipKind: {
		label: 'relationship kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	normalizedSelector: {
		label: 'normalized selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	confidence: {
		label: 'confidence',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		DocumentExtractorIdClaimPath: [
			'$document',
			'extractorId',
			'claimPath',
		],
	},
})

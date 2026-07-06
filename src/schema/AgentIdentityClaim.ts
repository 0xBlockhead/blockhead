// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum AgentIdentityClaimSelector {
	SubjectKindSubjectSelectorIdentityKindObjectKindObjectSelectorSourceTimestampMs = 'SubjectKindSubjectSelectorIdentityKindObjectKindObjectSelectorSourceTimestampMs',
}
export default {
	entityType: EntityType.AgentIdentityClaim,
	label: 'agent identity claim',
	labelPlural: 'agent identity claims',
	selectors: [
		{
			name: AgentIdentityClaimSelector.SubjectKindSubjectSelectorIdentityKindObjectKindObjectSelectorSourceTimestampMs,
			fields: [
				'subjectKind',
				'subjectSelector',
				'identityKind',
				'objectKind',
				'objectSelector',
				'source',
				'timestampMs',
			],
		},
	],
	fields: [
		{
			name: 'subjectKind',
			label: 'subject kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'subjectSelector',
			label: 'subject selector',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'identityKind',
			label: 'identity kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'objectKind',
			label: 'object kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'objectSelector',
			label: 'object selector',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'confidence',
			label: 'confidence',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'verificationMethod',
			label: 'verification method',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$document',
			label: 'document',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AiDocument,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'evidenceUri',
			label: 'evidence URI',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'evidenceHashAlgorithm',
			label: 'evidence hash algorithm',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'evidenceHash',
			label: 'evidence hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'signature',
			label: 'signature',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

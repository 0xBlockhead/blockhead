import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AiDocumentClaimSelector {
	DocumentExtractorIdClaimPath = '$document+extractorId+claimPath',
}
export default {
	entityType: EntityType.AiDocumentClaim,
	label: 'AI document claim',
	labelPlural: 'AI document claims',
	selectors: [
		{
			name: AiDocumentClaimSelector.DocumentExtractorIdClaimPath,
			fields: [
				'$document',
				'extractorId',
				'claimPath',
			],
		},
	],
	fields: [
		{
			name: '$document',
			label: 'document',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AiDocument,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'extractorId',
			label: 'extractor ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'claimPath',
			label: 'claim path',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'claimKind',
			label: 'claim kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'value',
			label: 'Value',
			description: 'The source-domain value.',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'subjectKind',
			label: 'subject kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'subjectSelector',
			label: 'subject selector',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'metadataKey',
			label: 'metadata key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'formatObjectId',
			label: 'format object ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'formatObjectKind',
			label: 'format object kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'checksumAlgorithm',
			label: 'checksum algorithm',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'checksumValue',
			label: 'checksum value',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'relationshipKind',
			label: 'relationship kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'normalizedSelector',
			label: 'normalized selector',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'confidence',
			label: 'confidence',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

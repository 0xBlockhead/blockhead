// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum AiDocumentSelector {
	KindContentHash = 'KindContentHash',
	KindArtifact = 'KindArtifact',
	DocumentUrl = 'DocumentUrl',
}
export default {
	entityType: EntityType.AiDocument,
	label: 'AI document',
	labelPlural: 'AI documents',
	selectors: [
		{
			name: AiDocumentSelector.KindContentHash,
			fields: [
				'documentKind',
				'contentHashAlgorithm',
				'contentHash',
			],
		},
		{
			name: AiDocumentSelector.KindArtifact,
			fields: [
				'documentKind',
				'$artifact',
			],
		},
		{
			name: AiDocumentSelector.DocumentUrl,
			fields: [
				'documentUrl',
			],
		},
	],
	fields: [
		{
			name: 'documentKind',
			label: 'document kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'contentHashAlgorithm',
			label: 'content hash algorithm',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'contentHash',
			label: 'content hash',
			type: EntityFieldType.Primitive,
			primitiveType: (ZeroExHex),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$artifact',
			label: 'artifact',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AiArtifact,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'documentUrl',
			label: 'document URL',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'mediaType',
			label: 'media type',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'schemaVersion',
			label: 'schema version',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'conformsTo',
			label: 'conforms to',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sourceFormat',
			label: 'source format',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'declaredSubjectKind',
			label: 'declared subject kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'declaredSubjectSelector',
			label: 'declared subject selector',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$claims',
			label: 'claims',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AiDocumentClaim,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

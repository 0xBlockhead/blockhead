// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RadicleIdentityDocumentSelector {
	RidRevision = 'RidRevision',
}
export default {
	entityType: EntityType.RadicleIdentityDocument,
	label: 'radicle identity document',
	labelPlural: 'radicle identity documents',
	selectors: [
		{
			name: RadicleIdentityDocumentSelector.RidRevision,
			fields: [
				'rid',
				'revision',
			],
		},
	],
	fields: [
		{
				name: 'rid',
				label: 'rid',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'revision',
				label: 'revision',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'documentHash',
				label: 'document hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'payload',
				label: 'payload',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'signatureThreshold',
				label: 'signature threshold',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'verifiedSignatureCount',
				label: 'verified signature count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'verificationStatus',
				label: 'verification status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$signatures',
				label: 'signatures',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.GitSignature,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$repository',
				label: 'repository',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.RadicleRepository,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

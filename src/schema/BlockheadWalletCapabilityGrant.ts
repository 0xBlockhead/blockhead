// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadWalletCapabilityGrantSelector {
	GrantId = 'GrantId',
}
export default {
	entityType: EntityType.BlockheadWalletCapabilityGrant,
	label: 'blockhead wallet capability grant',
	labelPlural: 'blockhead wallet capability grants',
	selectors: [
		{
			name: BlockheadWalletCapabilityGrantSelector.GrantId,
			fields: [
				'grantId',
			],
		},
	],
	fields: [
		{
				name: 'grantId',
				label: 'grant ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$connection',
				label: 'connection',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadWalletConnection,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$account',
				label: 'account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadWalletAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'authorizationKind',
				label: 'authorization kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'issuer',
				label: 'issuer',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'audience',
				label: 'audience',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'scope',
				label: 'Scope',
				description: 'The fixed scope value that identifies this hub row.',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'methods',
				label: 'methods',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'resources',
				label: 'resources',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'issuedAt',
				label: 'issued AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'notBefore',
				label: 'not before',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'expiresAt',
				label: 'expires AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'revokedAt',
				label: 'revoked AT',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'proofKind',
				label: 'proof kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'proofSummary',
				label: 'proof summary',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'rawGrant',
				label: 'raw grant',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

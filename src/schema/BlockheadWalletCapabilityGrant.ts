// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadWalletCapabilityGrantSelector {
	GrantId = 'GrantId',
}
export const BlockheadWalletCapabilityGrant = entity({
	entityType: EntityType.BlockheadWalletCapabilityGrant,
	labels: {
		singular: 'blockhead wallet capability grant',
		plural: 'blockhead wallet capability grants',
	},
})({
	grantId: {
		label: 'grant ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$connection: {
		label: 'connection',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadWalletConnection,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadWalletAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	authorizationKind: {
		label: 'authorization kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	issuer: {
		label: 'issuer',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	audience: {
		label: 'audience',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.One,
	},
	methods: {
		label: 'methods',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	resources: {
		label: 'resources',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	issuedAt: {
		label: 'issued AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	notBefore: {
		label: 'not before',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	expiresAt: {
		label: 'expires AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	revokedAt: {
		label: 'revoked AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	proofKind: {
		label: 'proof kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	proofSummary: {
		label: 'proof summary',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rawGrant: {
		label: 'raw grant',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		GrantId: [
			'grantId',
		],
	},
})

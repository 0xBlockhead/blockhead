// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadWalletCapabilityGrant,
	labels: {
		singular: 'blockhead wallet capability grant',
		plural: 'blockhead wallet capability grants',
	},
})({
	grantId: {
		label: 'grant ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$connection: {
		label: 'connection',
		entityType: EntityType.BlockheadWalletConnection,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$account: {
		label: 'account',
		entityType: EntityType.Account,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	authorizationKind: {
		label: 'authorization kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	issuer: {
		label: 'issuer',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	audience: {
		label: 'audience',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.One,
	},
	methods: {
		label: 'methods',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	resources: {
		label: 'resources',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	issuedAt: {
		label: 'issued AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	notBefore: {
		label: 'not before',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	expiresAt: {
		label: 'expires AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	revokedAt: {
		label: 'revoked AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	proofKind: {
		label: 'proof kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	proofSummary: {
		label: 'proof summary',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rawGrant: {
		label: 'raw grant',
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

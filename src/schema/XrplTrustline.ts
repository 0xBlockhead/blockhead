// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum XrplTrustlineSelector {
	NetworkAccountCurrencyIssuer = 'NetworkAccountCurrencyIssuer',
}
export const XrplTrustline = entity({
	entityType: EntityType.XrplTrustline,
	labels: {
		singular: 'xrpl trustline',
		plural: 'xrpl trustlines',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.XrplNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	account: {
		label: 'account',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	currency: {
		label: 'currency',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	issuer: {
		label: 'issuer',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.XrplAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$issuerAccount: {
		label: 'issuer account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.XrplAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.XrplTrustline_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAccountCurrencyIssuer: [
			'$network',
			'account',
			'currency',
			'issuer',
		],
	},
})

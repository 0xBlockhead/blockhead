// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TrustedIssuerSelector {
	ProfileIssuerKey = 'ProfileIssuerKey',
}
export const TrustedIssuer = entity({
	entityType: EntityType.TrustedIssuer,
	labels: {
		singular: 'trusted issuer',
		plural: 'trusted issuers',
	},
})({
	$profile: {
		label: 'profile',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.RegulatedAssetProfile,
		cardinality: EntityFieldCardinality.One,
	},
	issuerKey: {
		label: 'issuer key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	issuerSelector: {
		label: 'issuer selector',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.One,
	},
	claimTopics: {
		label: 'claim topics',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ProfileIssuerKey: [
			'$profile',
			'issuerKey',
		],
	},
})

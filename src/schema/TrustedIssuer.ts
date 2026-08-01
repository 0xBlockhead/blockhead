// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TrustedIssuer,
	labels: {
		singular: 'trusted issuer',
		plural: 'trusted issuers',
	},
})({
	$profile: {
		label: 'profile',
		entityType: EntityType.RegulatedAssetProfile,
		cardinality: EntityFieldCardinality.One,
	},
	issuerKey: {
		label: 'issuer key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	issuerSelector: {
		label: 'issuer selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.One,
	},
	claimTopics: {
		label: 'claim topics',
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

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
		entityType: EntityType.RegulatedAssetProfile,
		cardinality: EntityFieldCardinality.One,
	},
	issuerKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	issuerSelector: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.One,
	},
	claimTopics: {
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

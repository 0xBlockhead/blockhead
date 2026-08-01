// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ClaimTopicRequirement,
	labels: {
		singular: 'claim topic requirement',
		plural: 'claim topic requirements',
	},
})({
	$profile: {
		entityType: EntityType.RegulatedAssetProfile,
		cardinality: EntityFieldCardinality.One,
	},
	topicKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	claimTopic: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requiredIssuerSelector: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	countryScope: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ProfileTopicKey: [
			'$profile',
			'topicKey',
		],
	},
})

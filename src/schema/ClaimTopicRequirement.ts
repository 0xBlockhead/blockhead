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
		label: 'profile',
		entityType: EntityType.RegulatedAssetProfile,
		cardinality: EntityFieldCardinality.One,
	},
	topicKey: {
		label: 'topic key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	claimTopic: {
		label: 'claim topic',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requiredIssuerSelector: {
		label: 'required issuer selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	countryScope: {
		label: 'country scope',
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

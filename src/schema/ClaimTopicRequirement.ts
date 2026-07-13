// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ClaimTopicRequirementSelector {
	ProfileTopicKey = 'ProfileTopicKey',
}
export const ClaimTopicRequirement = entity({
	entityType: EntityType.ClaimTopicRequirement,
	labels: {
		singular: 'claim topic requirement',
		plural: 'claim topic requirements',
	},
})({
	$profile: {
		label: 'profile',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.RegulatedAssetProfile,
		cardinality: EntityFieldCardinality.One,
	},
	topicKey: {
		label: 'topic key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	claimTopic: {
		label: 'claim topic',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requiredIssuerSelector: {
		label: 'required issuer selector',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	countryScope: {
		label: 'country scope',
		type: EntityFieldType.Primitive,
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

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ClaimTopicRequirementSelector {
	ProfileTopicKey = 'ProfileTopicKey',
}
export default {
	entityType: EntityType.ClaimTopicRequirement,
	label: 'claim topic requirement',
	labelPlural: 'claim topic requirements',
	selectors: [
		{
			name: ClaimTopicRequirementSelector.ProfileTopicKey,
			fields: [
				'$profile',
				'topicKey',
			],
		},
	],
	fields: [
		{
			name: '$profile',
			label: 'profile',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RegulatedAssetProfile,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'topicKey',
			label: 'topic key',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'claimTopic',
			label: 'claim topic',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'requiredIssuerSelector',
			label: 'required issuer selector',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'countryScope',
			label: 'country scope',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

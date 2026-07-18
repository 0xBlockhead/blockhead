// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum LensAccountSelector {
	Address = 'Address',
	LocalName = 'LocalName',
	LegacyProfileId = 'LegacyProfileId',
}
export const LensAccount = entity({
	entityType: EntityType.LensAccount,
	labels: {
		singular: 'Lens account',
		plural: 'Lens accounts',
	},
})({
	address: {
		label: 'Address',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.One,
	},
	localName: {
		label: 'Local name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	legacyProfileId: {
		label: 'Legacy profile ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	displayName: {
		label: 'Display name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bio: {
		label: 'Bio',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	owner: {
		label: 'Owner',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	score: {
		label: 'Score',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isMemberOf: {
		label: 'Memberships',
		type: EntityFieldType.Primitive,
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	iconUrl: {
		label: 'Icon URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$icon: {
		label: 'Icon',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LensAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$posts: {
		label: 'Posts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LensPost,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Lens_Graphql,
		],
	},
})({
	selectors: {
		Address: [
			'address',
		],
		LocalName: [
			'localName',
		],
		LegacyProfileId: [
			'legacyProfileId',
		],
	},
})

// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LensAccount,
	labels: {
		singular: 'Lens account',
		plural: 'Lens accounts',
	},
})({
	address: {
		label: 'Address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.One,
	},
	localName: {
		label: 'Local name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	legacyProfileId: {
		label: 'Legacy profile ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	displayName: {
		label: 'Display name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bio: {
		label: 'Bio',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	owner: {
		label: 'Owner',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	score: {
		label: 'Score',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isMemberOf: {
		label: 'Memberships',
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	iconUrl: {
		label: 'Icon URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$icon: {
		label: 'Icon',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType.LensAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$posts: {
		label: 'Posts',
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

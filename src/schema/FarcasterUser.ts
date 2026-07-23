// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum FarcasterUserSelector {
	Fid = 'Fid',
}
export const FarcasterUser = entity({
	entityType: EntityType.FarcasterUser,
	labels: {
		singular: 'Farcaster user',
		plural: 'Farcaster users',
	},
})({
	fid: {
		label: 'FID',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	username: {
		label: 'Username',
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
	bio: {
		label: 'Bio',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	url: {
		label: 'URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$primaryEvmAccount: {
		label: 'Primary EVM account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$verifiedAddresses: {
		label: 'Verified addresses',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.FarcasterVerifiedAddress,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.FarcasterUser_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$casts: {
		label: 'Casts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.FarcasterCast,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Neynar_Rest,
			Source.Snapchain_Rest,
		],
	},
})({
	selectors: {
		Fid: [
			'fid',
		],
	},
})

// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadFarcasterConnectionAuthMethod {
	Custody = 'custody',
	AuthAddress = 'authAddress',
}
export enum BlockheadFarcasterAccountConnectionSelector {
	Fid = 'Fid',
}
export const BlockheadFarcasterAccountConnection = entity({
	entityType: EntityType.BlockheadFarcasterAccountConnection,
	labels: {
		singular: 'Blockhead Farcaster account connection',
		plural: 'Blockhead Farcaster account connections',
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
	verifications: {
		label: 'Verifications',
		type: EntityFieldType.Primitive,
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	custody: {
		label: 'Custody',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	authMethod: {
		label: 'Auth method',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(BlockheadFarcasterConnectionAuthMethod)),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signedAt: {
		label: 'Signed',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		Fid: [
			'fid',
		],
	},
})

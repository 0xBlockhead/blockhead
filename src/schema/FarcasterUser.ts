// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum FarcasterUserSelector {
	Fid = 'Fid',
}
export default {
	entityType: EntityType.FarcasterUser,
	label: 'Farcaster user',
	labelPlural: 'Farcaster users',
	selectors: [
		{
			name: FarcasterUserSelector.Fid,
			fields: [
				'fid',
			],
		},
	],
	fields: [
		{
			name: 'fid',
			label: 'FID',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'username',
			label: 'Username',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'displayName',
			label: 'Display name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'iconUrl',
			label: 'Icon URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$icon',
			label: 'Icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'bio',
			label: 'Bio',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'url',
			label: 'URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$primaryEvmAccount',
			label: 'Primary EVM account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$verifiedAddresses',
			label: 'Verified addresses',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterVerifiedAddress,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterUser_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$casts',
			label: 'Casts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterCast,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Snapchain_Rest,
			],
		},
	],
} as const satisfies EntityDefinition

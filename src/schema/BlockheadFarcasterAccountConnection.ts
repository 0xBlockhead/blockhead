// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadFarcasterConnectionAuthMethod {
	Custody = 'custody',
	AuthAddress = 'authAddress',
}
export enum BlockheadFarcasterAccountConnectionSelector {
	Fid = 'Fid',
}
export default {
	entityType: EntityType.BlockheadFarcasterAccountConnection,
	label: 'Blockhead Farcaster account connection',
	labelPlural: 'Blockhead Farcaster account connections',
	selectors: [
		{
			name: BlockheadFarcasterAccountConnectionSelector.Fid,
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
				name: 'verifications',
				label: 'Verifications',
				type: EntityFieldType.Primitive,
				primitiveType: type('string').array(),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'custody',
				label: 'Custody',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'authMethod',
				label: 'Auth method',
				type: EntityFieldType.Primitive,
				primitiveType: type.enumerated(...Object.values(BlockheadFarcasterConnectionAuthMethod)),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'signedAt',
				label: 'Signed',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

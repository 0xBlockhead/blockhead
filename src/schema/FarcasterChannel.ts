// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum FarcasterChannelSelector {
	Id = 'Id',
}
export default {
	entityType: EntityType.FarcasterChannel,
	label: 'Farcaster channel',
	labelPlural: 'Farcaster channels',
	selectors: [
		{
			name: FarcasterChannelSelector.Id,
			fields: [
				'id',
			],
		},
	],
	fields: [
		{
			name: 'id',
			label: 'ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'url',
			label: 'URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'description',
			label: 'Description',
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
			name: 'headerImageUrl',
			label: 'Header image URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$headerImage',
			label: 'Header image',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$lead',
			label: 'Lead',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterUser,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$moderator',
			label: 'Moderator',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterUser,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$moderators',
			label: 'Moderators',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterUser,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'createdAt',
			label: 'Created',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterChannel_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'pinnedCastHash',
			label: 'Pinned cast hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'publicCasting',
			label: 'Public casting',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'externalLinkTitle',
			label: 'External link title',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'externalLinkUrl',
			label: 'External link URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'followedAt',
			label: 'Followed',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$casts',
			label: 'Casts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterCast,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Farcaster_Rest,
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
			],
		},
	],
} as const satisfies EntityDefinition

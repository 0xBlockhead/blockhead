// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum FarcasterFeedSelector {
	Variant = 'Variant',
	ByUser = 'ByUser',
	ByChannel = 'ByChannel',
	Following = 'Following',
}
export default {
	entityType: EntityType.FarcasterFeed,
	label: 'Farcaster feed',
	labelPlural: 'Farcaster feeds',
	selectors: [
		{
			name: FarcasterFeedSelector.Variant,
			fields: [
				'variant',
			],
		},
		{
			name: FarcasterFeedSelector.ByUser,
			fields: [
				'variant',
				'fid',
			],
		},
		{
			name: FarcasterFeedSelector.ByChannel,
			fields: [
				'variant',
				'channelId',
			],
		},
		{
			name: FarcasterFeedSelector.Following,
			fields: [
				'variant',
				'viewerFid',
			],
		},
	],
	fields: [
		{
				name: 'variant',
				label: 'Variant',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'fid',
				label: 'FID',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'channelId',
				label: 'Channel ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'viewerFid',
				label: 'Viewer FID',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'label',
				label: 'Label',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$$entries',
				label: 'Entries',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.FarcasterCast,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Neynar_Rest,
					Source.Farcaster_Rest,
					Source.Snapchain_Rest,
				],
		},
	],
} as const satisfies EntityDefinition

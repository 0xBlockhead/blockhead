import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum FarcasterFeedSelector {
	Trending = 'trending',
	ByUser = 'byUser',
	ByChannel = 'byChannel',
	Following = 'following',
}

export default {
	entityType: EntityType.FarcasterFeed,

	label: 'Farcaster Feed',
	labelPlural: 'Farcaster Feeds',

	selectors: [
		{
			name: FarcasterFeedSelector.Trending,
			fields: ['variant'],
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
			type: EntityFieldType.Primitive,
			primitiveType: type("'trending' | 'byUser' | 'byChannel' | 'following'"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'fid',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'channelId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'viewerFid',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'label',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$entries',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterCast,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

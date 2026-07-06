// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum YoutubeChannelSelector {
	ChannelId = 'ChannelId',
}
export default {
	entityType: EntityType.YoutubeChannel,
	label: 'YouTube channel',
	labelPlural: 'YouTube channels',
	selectors: [
		{
			name: YoutubeChannelSelector.ChannelId,
			fields: [
				'channelId',
			],
		},
	],
	fields: [
		{
			name: 'channelId',
			label: 'Channel ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'title',
			label: 'Title',
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
			name: 'publishedAt',
			label: 'Published',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'publishedAtMs',
			label: 'Published',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'customUrl',
			label: 'Custom URL',
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
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YoutubeChannel_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
		},
		{
			name: '$$videos',
			label: 'Videos',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YoutubeVideo,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
		},
		{
			name: '$$playlists',
			label: 'Playlists',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YoutubePlaylist,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
		},
	],
} as const satisfies EntityDefinition

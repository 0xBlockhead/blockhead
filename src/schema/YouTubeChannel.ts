import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum YouTubeChannelSelector {
	ChannelId = 'channelId',
}

export default {
	entityType: EntityType.YouTubeChannel,

	label: 'YouTube channel',
	labelPlural: 'YouTube channels',

	selectors: [
		{
			name: YouTubeChannelSelector.ChannelId,
			fields: [
				'channelId',
			],
		},
	],

	fields: [
		{
			name: 'channelId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'title',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'description',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YouTubeChannel_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'publishedAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'publishedAtMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'customUrl',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$videos',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YouTubeVideo,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$playlists',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YouTubePlaylist,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum YouTubeChannelSelector {
	ChannelId = 'channelId',
}
export default {
	entityType: EntityType.YouTubeChannel,
	label: 'you tube channel',
	labelPlural: 'you tube channels',
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
			label: 'channel ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'publishedAt',
			label: 'published AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'publishedAtMs',
			label: 'published AT ms',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'title',
			label: 'title',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'description',
			label: 'Description',
			description: 'A human-readable description from the source domain.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'customUrl',
			label: 'custom URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$icon',
			label: 'icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YouTubeChannel_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$videos',
			label: 'videos',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YouTubeVideo,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$playlists',
			label: 'playlists',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YouTubePlaylist,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

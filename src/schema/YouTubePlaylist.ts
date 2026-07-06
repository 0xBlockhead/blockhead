// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum YoutubePlaylistSelector {
	PlaylistId = 'PlaylistId',
}
export default {
	entityType: EntityType.YoutubePlaylist,
	label: 'YouTube playlist',
	labelPlural: 'YouTube playlists',
	selectors: [
		{
			name: YoutubePlaylistSelector.PlaylistId,
			fields: [
				'playlistId',
			],
		},
	],
	fields: [
		{
			name: 'playlistId',
			label: 'Playlist ID',
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
			name: '$channel',
			label: 'Channel',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.YoutubeChannel,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YoutubePlaylist_Timestamp,
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
				Source.Constants_Internal,
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
		},
	],
} as const satisfies EntityDefinition

import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum YouTubePlaylistSelector {
	PlaylistId = 'playlistId',
}

export default {
	entityType: EntityType.YouTubePlaylist,

	label: 'YouTube playlist',
	labelPlural: 'YouTube playlists',

	selectors: [
		{
			name: YouTubePlaylistSelector.PlaylistId,
			fields: [
				'playlistId',
			],
		},
	],

	fields: [
		{
			name: 'playlistId',
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
			entityType: EntityType.YouTubePlaylist_Timestamp,
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
			name: '$channel',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.YouTubeChannel,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$videos',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YouTubeVideo,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum YoutubePlaylistSelector {
	PlaylistId = 'PlaylistId',
}
export const YoutubePlaylist = entity({
	entityType: EntityType.YoutubePlaylist,
	labels: {
		singular: 'YouTube playlist',
		plural: 'YouTube playlists',
	},
})({
	playlistId: {
		label: 'Playlist ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	title: {
		label: 'Title',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	publishedAt: {
		label: 'Published',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	publishedAtMs: {
		label: 'Published',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$channel: {
		label: 'Channel',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.YoutubeChannel,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.YoutubePlaylist_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Youtube_Rest,
			Source.Piped_Rest,
		],
	},
	$$videos: {
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
})({
	selectors: {
		PlaylistId: [
			'playlistId',
		],
	},
})

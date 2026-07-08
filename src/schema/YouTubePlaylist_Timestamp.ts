// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum YoutubePlaylist_TimestampSelector {
	YoutubePlaylistTimestampMs = 'YoutubePlaylistTimestampMs',
}
export const YoutubePlaylist_Timestamp = entity({
	entityType: EntityType.YoutubePlaylist_Timestamp,
	label: 'YouTube playlist observation',
	labelPlural: 'YouTube playlist observations',
})({
	$playlist: {
		label: 'Playlist',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.YoutubePlaylist,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	itemCount: {
		label: 'Items',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		YoutubePlaylistTimestampMs: [
			'$playlist',
			'timestampMs',
		],
	},
})

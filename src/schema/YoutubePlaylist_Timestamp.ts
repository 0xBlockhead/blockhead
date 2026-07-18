// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum YoutubePlaylist_TimestampSelector {
	YoutubePlaylistTimestampMsSource = 'YoutubePlaylistTimestampMsSource',
}
export const YoutubePlaylist_Timestamp = entity({
	entityType: EntityType.YoutubePlaylist_Timestamp,
	labels: {
		singular: 'YouTube playlist observation',
		plural: 'YouTube playlist observations',
	},
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
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
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
		YoutubePlaylistTimestampMsSource: [
			'$playlist',
			'timestampMs',
			'source',
		],
	},
})

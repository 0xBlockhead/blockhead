// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum YoutubePlaylist_TimestampSelector {
	YoutubePlaylistTimestampMs = 'YoutubePlaylistTimestampMs',
}
export default {
	entityType: EntityType.YoutubePlaylist_Timestamp,
	label: 'YouTube playlist observation',
	labelPlural: 'YouTube playlist observations',
	selectors: [
		{
			name: YoutubePlaylist_TimestampSelector.YoutubePlaylistTimestampMs,
			fields: [
				'$playlist',
				'timestampMs',
			],
		},
	],
	fields: [
		{
				name: '$playlist',
				label: 'Playlist',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.YoutubePlaylist,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'itemCount',
				label: 'Items',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

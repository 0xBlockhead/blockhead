import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import YouTubePlaylist from '$/schema/YouTubePlaylist.ts'
import { Source } from '$/sources/Source.ts'

export enum YouTubePlaylist_TimestampSelector {
	YouTubePlaylistTimestampMs = 'youTubePlaylistTimestampMs',
}

export default {
	entityType: EntityType.YouTubePlaylist_Timestamp,

	label: 'YouTube playlist snapshot',
	labelPlural: 'YouTube playlist snapshots',

	selectors: [
		{
			name: YouTubePlaylist_TimestampSelector.YouTubePlaylistTimestampMs,
			fields: [
				'$playlist',
				'timestampMs',
			],
		},
	],

	fields: [
		{
			name: '$playlist',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.YouTubePlaylist,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'itemCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

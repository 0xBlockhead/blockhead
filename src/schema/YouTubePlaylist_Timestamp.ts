import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum YouTubePlaylist_TimestampSelector {
	YouTubePlaylistTimestampMs = 'youTubePlaylistTimestampMs',
	PlaylistTimestampMs = '$playlist+timestampMs',
}
export default {
	entityType: EntityType.YouTubePlaylist_Timestamp,
	label: 'you tube playlist timestamp',
	labelPlural: 'you tube playlist observations',
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
			label: 'playlist',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.YouTubePlaylist,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'itemCount',
			label: 'item count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

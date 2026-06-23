import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum _GlobalYouTubeNetworkSelector {
	Scope = 'scope',
}
export default {
	entityType: EntityType._GlobalYouTubeNetwork,
	label: 'global you tube network',
	labelPlural: 'global you tube networks',
	selectors: [
		{
			name: _GlobalYouTubeNetworkSelector.Scope,
			fields: [
				'scope',
			],
		},
	],
	fields: [
		{
			name: 'scope',
			label: 'Scope',
			description: 'The fixed scope value that identifies this hub row.',
			type: EntityFieldType.Primitive,
			primitiveType: type("'_GlobalYouTubeNetwork'"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$sourceWindowChannels',
			label: 'source window channels',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YouTubeChannel,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$sourceWindowVideos',
			label: 'source window videos',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YouTubeVideo,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$sourceWindowPlaylists',
			label: 'source window playlists',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YouTubePlaylist,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType._GlobalYouTubeNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

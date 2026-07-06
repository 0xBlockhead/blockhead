// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum _GlobalYoutubeNetworkSelector {
	Scope = 'Scope',
}
export default {
	entityType: EntityType._GlobalYoutubeNetwork,
	label: 'YouTube network',
	labelPlural: 'YouTube networks',
	selectors: [
		{
			name: _GlobalYoutubeNetworkSelector.Scope,
			fields: [
				'scope',
			],
		},
	],
	fields: [
		{
			name: 'scope',
			label: 'Scope',
			description: 'The fixed scope value that identifies this global hub row.',
			type: EntityFieldType.Primitive,
			primitiveType: type.unit('_GlobalYoutubeNetwork'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$sourceWindowChannels',
			label: 'Channels',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YoutubeChannel,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.Youtube_Rest,
			],
		},
		{
			name: '$$sourceWindowVideos',
			label: 'Videos',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YoutubeVideo,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.Youtube_Rest,
			],
		},
		{
			name: '$$sourceWindowPlaylists',
			label: 'Playlists',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.YoutubePlaylist,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.Youtube_Rest,
			],
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType._GlobalYoutubeNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

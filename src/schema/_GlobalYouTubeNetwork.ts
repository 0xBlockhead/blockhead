// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum _GlobalYoutubeNetworkSelector {
	Scope = 'Scope',
}
export const _GlobalYoutubeNetwork = entity({
	entityType: EntityType._GlobalYoutubeNetwork,
	label: 'YouTube network',
	labelPlural: 'YouTube networks',
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this global hub row.',
		type: EntityFieldType.Primitive,
		primitiveType: type.unit('_GlobalYoutubeNetwork'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedChannels: {
		label: 'Channels',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.YoutubeChannel,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.Youtube_Rest,
		],
	},
	$$observedVideos: {
		label: 'Videos',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.YoutubeVideo,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.Youtube_Rest,
		],
	},
	$$observedPlaylists: {
		label: 'Playlists',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.YoutubePlaylist,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.Youtube_Rest,
		],
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType._GlobalYoutubeNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})

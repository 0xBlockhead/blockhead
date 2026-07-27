// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType._GlobalYoutubeNetwork,
	labels: {
		singular: 'YouTube network',
		plural: 'YouTube networks',
	},
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this global hub row.',
		type: EntityFieldType.Primitive,
		primitiveType: type.unit('_GlobalYoutubeNetwork'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedChannels: {
		label: 'Channels represented in the bounded popular chart',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.YoutubeChannel,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.Youtube_Rest,
			Source.Piped_Rest,
		],
	},
	$$observedVideos: {
		label: 'Bounded popular videos',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.YoutubeVideo,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.Youtube_Rest,
			Source.Piped_Rest,
		],
	},
	$$observedPlaylists: {
		label: 'Playlists from bounded channel discovery seeds',
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

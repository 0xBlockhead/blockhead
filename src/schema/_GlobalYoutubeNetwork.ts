// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type.unit('_GlobalYoutubeNetwork'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedChannels: {
		label: 'Channels represented in the bounded popular chart',
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
		entityType: EntityType.YoutubePlaylist,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.Youtube_Rest,
		],
	},
	$$timestamps: {
		label: 'Observations',
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

// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const constantsInternalYoutubeRestPipedRestSources = [
	Source.Constants_Internal,
	Source.Youtube_Rest,
	Source.Piped_Rest,
] as const

export default entity({
	entityType: EntityType._GlobalYoutubeNetwork,
	labels: {
		singular: 'YouTube network',
		plural: 'YouTube networks',
	},
})({
	scope: {
		primitiveType: type.unit('_GlobalYoutubeNetwork'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedChannels: {
		entityType: EntityType.YoutubeChannel,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: constantsInternalYoutubeRestPipedRestSources,
	},
	$$observedVideos: {
		entityType: EntityType.YoutubeVideo,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: constantsInternalYoutubeRestPipedRestSources,
	},
	$$observedPlaylists: {
		entityType: EntityType.YoutubePlaylist,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.Youtube_Rest,
		],
	},
	$$timestamps: {
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

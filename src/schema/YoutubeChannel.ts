// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const youtubeRestPipedRestSources = [
	Source.Youtube_Rest,
	Source.Piped_Rest,
] as const

export default entity({
	entityType: EntityType.YoutubeChannel,
	labels: {
		singular: 'YouTube channel',
		plural: 'YouTube channels',
	},
})({
	channelId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	title: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	publishedAt: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	publishedAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	customUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$icon: {
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.YoutubeChannel_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: youtubeRestPipedRestSources,
	},
	$$videos: {
		entityType: EntityType.YoutubeVideo,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: youtubeRestPipedRestSources,
	},
	$$playlists: {
		entityType: EntityType.YoutubePlaylist,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: youtubeRestPipedRestSources,
	},
})({
	selectors: {
		ChannelId: [
			'channelId',
		],
	},
})

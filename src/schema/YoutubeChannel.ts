// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.YoutubeChannel,
	labels: {
		singular: 'YouTube channel',
		plural: 'YouTube channels',
	},
})({
	channelId: {
		label: 'Channel ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	title: {
		label: 'Title',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	publishedAt: {
		label: 'Published',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	publishedAtMs: {
		label: 'Published',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	customUrl: {
		label: 'Custom URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$icon: {
		label: 'Icon',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType.YoutubeChannel_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Youtube_Rest,
			Source.Piped_Rest,
		],
	},
	$$videos: {
		label: 'Videos',
		entityType: EntityType.YoutubeVideo,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Youtube_Rest,
			Source.Piped_Rest,
		],
	},
	$$playlists: {
		label: 'Playlists',
		entityType: EntityType.YoutubePlaylist,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Youtube_Rest,
			Source.Piped_Rest,
		],
	},
})({
	selectors: {
		ChannelId: [
			'channelId',
		],
	},
})

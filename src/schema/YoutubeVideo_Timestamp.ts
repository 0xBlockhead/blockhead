// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.YoutubeVideo_Timestamp,
	labels: {
		singular: 'YouTube video observation',
		plural: 'YouTube video observations',
	},
})({
	$video: {
		label: 'Video',
		entityType: EntityType.YoutubeVideo,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	viewCount: {
		label: 'Views',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	likeCount: {
		label: 'Likes',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	commentCount: {
		label: 'Comments',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		YoutubeVideoTimestampMsSource: [
			'$video',
			'timestampMs',
			'source',
		],
	},
})

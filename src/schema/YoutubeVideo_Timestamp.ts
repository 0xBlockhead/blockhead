// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum YoutubeVideo_TimestampSelector {
	YoutubeVideoTimestampMs = 'YoutubeVideoTimestampMs',
}
export const YoutubeVideo_Timestamp = entity({
	entityType: EntityType.YoutubeVideo_Timestamp,
	labels: {
		singular: 'YouTube video observation',
		plural: 'YouTube video observations',
	},
})({
	$video: {
		label: 'Video',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.YoutubeVideo,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	viewCount: {
		label: 'Views',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	likeCount: {
		label: 'Likes',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	commentCount: {
		label: 'Comments',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		YoutubeVideoTimestampMs: [
			'$video',
			'timestampMs',
		],
	},
})

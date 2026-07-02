// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum YoutubeVideo_TimestampSelector {
	YoutubeVideoTimestampMs = 'YoutubeVideoTimestampMs',
}
export default {
	entityType: EntityType.YoutubeVideo_Timestamp,
	label: 'YouTube video observation',
	labelPlural: 'YouTube video observations',
	selectors: [
		{
			name: YoutubeVideo_TimestampSelector.YoutubeVideoTimestampMs,
			fields: [
				'$video',
				'timestampMs',
			],
		},
	],
	fields: [
		{
				name: '$video',
				label: 'Video',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.YoutubeVideo,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'viewCount',
				label: 'Views',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'likeCount',
				label: 'Likes',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'commentCount',
				label: 'Comments',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

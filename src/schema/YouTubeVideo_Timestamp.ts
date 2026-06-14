import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import YouTubeVideo from '$/schema/YouTubeVideo.ts'
import { Source } from '$/sources/Source.ts'

export enum YouTubeVideo_TimestampSelector {
	YouTubeVideoTimestampMs = 'youTubeVideoTimestampMs',
}

export default {
	entityType: EntityType.YouTubeVideo_Timestamp,

	label: 'YouTube video snapshot',
	labelPlural: 'YouTube video snapshots',

	selectors: [
		{
			name: YouTubeVideo_TimestampSelector.YouTubeVideoTimestampMs,
			fields: [
				'$video',
				'timestampMs',
			],
		},
	],

	fields: [
		{
			name: '$video',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.YouTubeVideo,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'viewCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
		},
		{
			name: 'likeCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
		},
		{
			name: 'commentCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

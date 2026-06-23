import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum YouTubeVideo_TimestampSelector {
	YouTubeVideoTimestampMs = 'youTubeVideoTimestampMs',
	VideoTimestampMs = '$video+timestampMs',
}
export default {
	entityType: EntityType.YouTubeVideo_Timestamp,
	label: 'you tube video timestamp',
	labelPlural: 'you tube video observations',
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
			label: 'video',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.YouTubeVideo,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'viewCount',
			label: 'view count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'likeCount',
			label: 'like count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'commentCount',
			label: 'comment count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum YouTubeChannel_TimestampSelector {
	YouTubeChannelTimestampMs = 'youTubeChannelTimestampMs',
	ChannelTimestampMs = '$channel+timestampMs',
}
export default {
	entityType: EntityType.YouTubeChannel_Timestamp,
	label: 'you tube channel timestamp',
	labelPlural: 'you tube channel observations',
	selectors: [
		{
			name: YouTubeChannel_TimestampSelector.YouTubeChannelTimestampMs,
			fields: [
				'$channel',
				'timestampMs',
			],
		},
	],
	fields: [
		{
			name: '$channel',
			label: 'channel',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.YouTubeChannel,
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
			name: 'subscriberCount',
			label: 'subscriber count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'videoCount',
			label: 'video count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'viewCount',
			label: 'view count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

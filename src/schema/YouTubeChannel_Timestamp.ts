import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import YouTubeChannel from '$/schema/YouTubeChannel.ts'
import { Source } from '$/sources/Source.ts'

export enum YouTubeChannel_TimestampSelector {
	YouTubeChannelTimestampMs = 'youTubeChannelTimestampMs',
}

export default {
	entityType: EntityType.YouTubeChannel_Timestamp,

	label: 'YouTube channel snapshot',
	labelPlural: 'YouTube channel snapshots',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.YouTubeChannel,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'subscriberCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
		},
		{
			name: 'videoCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
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
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

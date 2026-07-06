// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum YoutubeChannel_TimestampSelector {
	YoutubeChannelTimestampMs = 'YoutubeChannelTimestampMs',
}
export default {
	entityType: EntityType.YoutubeChannel_Timestamp,
	label: 'YouTube channel observation',
	labelPlural: 'YouTube channel observations',
	selectors: [
		{
			name: YoutubeChannel_TimestampSelector.YoutubeChannelTimestampMs,
			fields: [
				'$channel',
				'timestampMs',
			],
		},
	],
	fields: [
		{
			name: '$channel',
			label: 'Channel',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.YoutubeChannel,
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
			name: 'subscriberCount',
			label: 'Subscribers',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'videoCount',
			label: 'Videos',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'viewCount',
			label: 'Views',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

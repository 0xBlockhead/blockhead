import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import RedditLink from '$/schema/RedditLink.ts'
import { Source } from '$/sources/Source.ts'

export enum RedditLink_TimestampSelector {
	RedditLinkTimestampMs = 'redditLinkTimestampMs',
}

export default {
	entityType: EntityType.RedditLink_Timestamp,

	label: 'Reddit post snapshot',
	labelPlural: 'Reddit post snapshots',

	selectors: [
		{
			name: RedditLink_TimestampSelector.RedditLinkTimestampMs,
			fields: [
				'$link',
				'timestampMs',
			],
		},
	],

	fields: [
		{
			name: '$link',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RedditLink,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'score',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Reddit_Rest,
				Source.Reddit_PublicJson,
			],
		},
		{
			name: 'commentCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Reddit_Rest,
				Source.Reddit_PublicJson,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

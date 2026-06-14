import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import XPost from '$/schema/XPost.ts'
import { Source } from '$/sources/Source.ts'

export enum XPost_TimestampSelector {
	XPostTimestampMs = 'xPostTimestampMs',
}

export default {
	entityType: EntityType.XPost_Timestamp,

	label: 'X post snapshot',
	labelPlural: 'X post snapshots',

	selectors: [
		{
			name: XPost_TimestampSelector.XPostTimestampMs,
			fields: [
				'$post',
				'timestampMs',
			],
		},
	],

	fields: [
		{
			name: '$post',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.XPost,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'likeCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.X_Rest,
				Source.X_FxEmbed_Rest,
			],
		},
		{
			name: 'retweetCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.X_Rest,
				Source.X_FxEmbed_Rest,
			],
		},
		{
			name: 'replyCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.X_Rest,
				Source.X_FxEmbed_Rest,
			],
		},
		{
			name: 'quoteCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.X_Rest,
				Source.X_FxEmbed_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

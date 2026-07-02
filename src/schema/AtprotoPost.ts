// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum AtprotoPostSelector {
	Uri = 'Uri',
}
export default {
	entityType: EntityType.AtprotoPost,
	label: 'AT Protocol post',
	labelPlural: 'AT Protocol posts',
	description: 'A Bluesky feed post record addressed by an at-URI inside an actor repository. Text, author, reply edges, labels, languages, and engagement counts resolve through appview sources.',
	selectors: [
		{
			name: AtprotoPostSelector.Uri,
			fields: [
				'uri',
			],
		},
	],
	fields: [
		{
				name: 'uri',
				label: 'URI',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$author',
				label: 'Author',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AtprotoActor,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'text',
				label: 'Text',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'createdAt',
				label: 'Created',
				description: 'The time when the post record was created according to the source.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'indexedAt',
				label: 'Indexed',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'langs',
				label: 'Languages',
				type: EntityFieldType.Primitive,
				primitiveType: type('string').array(),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'selfLabelValues',
				label: 'Self labels',
				type: EntityFieldType.Primitive,
				primitiveType: type('string').array(),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$parent',
				label: 'Reply parent',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AtprotoPost,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$root',
				label: 'Thread root',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AtprotoPost,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$thread',
				label: 'Thread',
				labelPlural: 'Thread posts',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AtprotoPost,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Atproto_Xrpc,
				],
		},
		{
				name: '$$timestamps',
				label: 'Metric observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AtprotoPost_Timestamp,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Atproto_Xrpc,
				],
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum AtprotoPostSelector {
	Uri = 'Uri',
}
export const AtprotoPost = entity({
	entityType: EntityType.AtprotoPost,
	label: 'AT Protocol post',
	labelPlural: 'AT Protocol posts',
	description: 'A Bluesky feed post record addressed by an at-URI inside an actor repository. Text, author, reply edges, labels, languages, and engagement counts resolve through appview sources.',
})({
	uri: {
		label: 'URI',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$author: {
		label: 'Author',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AtprotoActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	text: {
		label: 'Text',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the post record was created according to the source.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	indexedAt: {
		label: 'Indexed',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	langs: {
		label: 'Languages',
		type: EntityFieldType.Primitive,
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	selfLabelValues: {
		label: 'Self labels',
		type: EntityFieldType.Primitive,
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$parent: {
		label: 'Reply parent',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AtprotoPost,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$root: {
		label: 'Thread root',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AtprotoPost,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$thread: {
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AtprotoPost,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Atproto_Xrpc,
		],
	},
	$$timestamps: {
		label: 'Metric observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AtprotoPost_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Atproto_Xrpc,
		],
	},
})({
	selectors: {
		Uri: [
			'uri',
		],
	},
})

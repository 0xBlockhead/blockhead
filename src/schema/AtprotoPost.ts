// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AtprotoPost,
	labels: {
		singular: 'AT Protocol post',
		plural: 'AT Protocol posts',
	},
	description: 'A Bluesky feed post record addressed by an at-URI inside an actor repository. Text, author, reply edges, labels, languages, and engagement counts resolve through appview sources.',
})({
	uri: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$author: {
		entityType: EntityType.AtprotoActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	text: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	indexedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	langs: {
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	selfLabelValues: {
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$parent: {
		entityType: EntityType.AtprotoPost,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$root: {
		entityType: EntityType.AtprotoPost,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$thread: {
		entityType: EntityType.AtprotoPost,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Atproto_Xrpc,
		],
	},
	$$timestamps: {
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

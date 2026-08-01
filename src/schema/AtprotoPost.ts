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
		label: 'URI',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$author: {
		label: 'Author',
		entityType: EntityType.AtprotoActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	text: {
		label: 'Text',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the post record was created according to the source.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	indexedAt: {
		label: 'Indexed',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	langs: {
		label: 'Languages',
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	selfLabelValues: {
		label: 'Self labels',
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$parent: {
		label: 'Reply parent',
		entityType: EntityType.AtprotoPost,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$root: {
		label: 'Thread root',
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
		label: 'Metric observations',
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

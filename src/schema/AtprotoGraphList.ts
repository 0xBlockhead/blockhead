// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AtprotoGraphList,
	labels: {
		singular: 'AT Protocol graph list',
		plural: 'AT Protocol graph lists',
	},
	description: 'A current AppView graph-list declaration addressed by its stable app.bsky.graph.list AT URI.',
})({
	uri: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	cid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$creator: {
		entityType: EntityType.AtprotoActor,
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	purpose: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	description: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	listItemCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	indexedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		Uri: [
			'uri',
		],
	},
})

// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AtprotoFeedGenerator,
	labels: {
		singular: 'AT Protocol feed generator',
		plural: 'AT Protocol feed generators',
	},
	description: 'A feed-generator declaration addressed by its stable app.bsky.feed.generator AT URI. Appview fields describe the currently indexed declaration and service status; they do not claim mutation history.',
})({
	uri: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	cid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	did: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$creator: {
		entityType: EntityType.AtprotoActor,
		cardinality: EntityFieldCardinality.One,
	},
	displayName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	description: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$avatar: {
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	likeCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	acceptsInteractions: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contentMode: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	indexedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	isOnline: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
	isValid: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		Uri: [
			'uri',
		],
	},
})

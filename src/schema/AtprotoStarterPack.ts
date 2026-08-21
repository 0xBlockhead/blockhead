// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AtprotoStarterPack,
	labels: {
		singular: 'AT Protocol starter pack',
		plural: 'AT Protocol starter packs',
	},
	description: 'A current AppView starter-pack declaration addressed by its stable app.bsky.graph.starterpack AT URI.',
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
	$list: {
		entityType: EntityType.AtprotoGraphList,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	joinedWeekCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	joinedAllTimeCount: {
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

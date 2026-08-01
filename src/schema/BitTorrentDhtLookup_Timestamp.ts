// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BitTorrentDhtLookup_Timestamp,
	labels: {
		singular: 'bit torrent DHT lookup timestamp',
		plural: 'bit torrent DHT lookup observations',
	},
})({
	infoHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	observerKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	queriedNodeCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	responsiveNodeCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	peerCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	closestNodeIds: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		InfoHashObserverKeyTimestampMs: [
			'infoHash',
			'observerKey',
			'timestampMs',
		],
	},
})

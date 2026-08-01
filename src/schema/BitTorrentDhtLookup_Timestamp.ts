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
		label: 'info hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	observerKey: {
		label: 'observer key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	queriedNodeCount: {
		label: 'queried node count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	responsiveNodeCount: {
		label: 'responsive node count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	peerCount: {
		label: 'peer count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	closestNodeIds: {
		label: 'closest node ids',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	status: {
		label: 'status',
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

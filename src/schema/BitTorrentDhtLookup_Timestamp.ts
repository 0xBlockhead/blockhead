// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BitTorrentDhtLookup_TimestampSelector {
	InfoHashObserverKeyTimestampMs = 'InfoHashObserverKeyTimestampMs',
}
export const BitTorrentDhtLookup_Timestamp = entity({
	entityType: EntityType.BitTorrentDhtLookup_Timestamp,
	labels: {
		singular: 'bit torrent DHT lookup timestamp',
		plural: 'bit torrent DHT lookup observations',
	},
})({
	infoHash: {
		label: 'info hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	observerKey: {
		label: 'observer key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	queriedNodeCount: {
		label: 'queried node count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	responsiveNodeCount: {
		label: 'responsive node count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	peerCount: {
		label: 'peer count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	closestNodeIds: {
		label: 'closest node ids',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	status: {
		label: 'status',
		type: EntityFieldType.Primitive,
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

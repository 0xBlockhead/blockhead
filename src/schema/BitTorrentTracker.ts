// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BitTorrentTrackerSelector {
	TrackerUrl = 'TrackerUrl',
}
export const BitTorrentTracker = entity({
	entityType: EntityType.BitTorrentTracker,
	labels: {
		singular: 'bit torrent tracker',
		plural: 'bit torrent trackers',
	},
})({
	trackerUrl: {
		label: 'tracker URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	trackerKind: {
		label: 'tracker kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$announces: {
		label: 'announces',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BitTorrentAnnounce_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$scrapes: {
		label: 'scrapes',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BitTorrentTrackerScrape_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		TrackerUrl: [
			'trackerUrl',
		],
	},
})

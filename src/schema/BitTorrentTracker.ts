// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BitTorrentTracker,
	labels: {
		singular: 'bit torrent tracker',
		plural: 'bit torrent trackers',
	},
})({
	trackerUrl: {
		label: 'tracker URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	trackerKind: {
		label: 'tracker kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$announces: {
		label: 'announces',
		entityType: EntityType.BitTorrentAnnounce_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$scrapes: {
		label: 'scrapes',
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

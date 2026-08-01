// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BitTorrentTrackerScrape_Timestamp,
	labels: {
		singular: 'bit torrent tracker scrape timestamp',
		plural: 'bit torrent tracker scrape observations',
	},
})({
	$tracker: {
		label: 'tracker',
		entityType: EntityType.BitTorrentTracker,
		cardinality: EntityFieldCardinality.One,
	},
	infoHash: {
		label: 'info hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	complete: {
		label: 'complete',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	downloaded: {
		label: 'downloaded',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	incomplete: {
		label: 'incomplete',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	error: {
		label: 'error',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TrackerInfoHashTimestampMsSource: [
			'$tracker',
			'infoHash',
			'timestampMs',
			'source',
		],
	},
})

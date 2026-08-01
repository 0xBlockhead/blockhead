// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.YoutubePlaylist_Timestamp,
	labels: {
		singular: 'YouTube playlist observation',
		plural: 'YouTube playlist observations',
	},
})({
	$playlist: {
		entityType: EntityType.YoutubePlaylist,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	itemCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		YoutubePlaylistTimestampMsSource: [
			'$playlist',
			'timestampMs',
			'source',
		],
	},
})

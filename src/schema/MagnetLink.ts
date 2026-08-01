// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.MagnetLink,
	labels: {
		singular: 'magnet link',
		plural: 'magnet links',
	},
})({
	magnetUri: {
		label: 'magnet URI',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	infoHash: {
		label: 'info hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	displayName: {
		label: 'display name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	exactLength: {
		label: 'exact length',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	trackers: {
		label: 'trackers',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	webSeeds: {
		label: 'Web seeds',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	acceptableSources: {
		label: 'acceptable sources',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	$torrent: {
		label: 'torrent',
		entityType: EntityType.BitTorrentMetainfo,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$resolutionTimestamps: {
		label: 'resolution timestamps',
		entityType: EntityType.MagnetResolution_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		MagnetUri: [
			'magnetUri',
		],
	},
})

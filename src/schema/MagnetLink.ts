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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	infoHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	displayName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	exactLength: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	trackers: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	webSeeds: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	acceptableSources: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	$torrent: {
		entityType: EntityType.BitTorrentMetainfo,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$resolutionTimestamps: {
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

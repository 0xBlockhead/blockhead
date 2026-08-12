// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
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
		defaultSources: [
			Source.MagnetUri_Uri,
		],
	},
	infoHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MagnetUri_Uri,
		],
	},
	displayName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MagnetUri_Uri,
		],
	},
	exactLength: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MagnetUri_Uri,
		],
	},
	trackers: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MagnetUri_Uri,
		],
	},
	webSeeds: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MagnetUri_Uri,
		],
	},
	acceptableSources: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.MagnetUri_Uri,
		],
	},
	$torrent: {
		entityType: EntityType.BitTorrentMetainfo,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.MagnetUri_Uri,
		],
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

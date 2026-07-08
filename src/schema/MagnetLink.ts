// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum MagnetLinkSelector {
	MagnetUri = 'MagnetUri',
}
export const MagnetLink = entity({
	entityType: EntityType.MagnetLink,
	label: 'magnet link',
	labelPlural: 'magnet links',
})({
	magnetUri: {
		label: 'magnet URI',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	infoHash: {
		label: 'info hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	displayName: {
		label: 'display name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	exactLength: {
		label: 'exact length',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	trackers: {
		label: 'trackers',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	webSeeds: {
		label: 'Web seeds',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	acceptableSources: {
		label: 'acceptable sources',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	$torrent: {
		label: 'torrent',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BitTorrentMetainfo,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$resolutionTimestamps: {
		label: 'resolution timestamps',
		type: EntityFieldType.EntitiesReference,
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

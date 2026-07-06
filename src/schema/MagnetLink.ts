// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum MagnetLinkSelector {
	MagnetUri = 'MagnetUri',
}
export default {
	entityType: EntityType.MagnetLink,
	label: 'magnet link',
	labelPlural: 'magnet links',
	selectors: [
		{
			name: MagnetLinkSelector.MagnetUri,
			fields: [
				'magnetUri',
			],
		},
	],
	fields: [
		{
			name: 'magnetUri',
			label: 'magnet URI',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'infoHash',
			label: 'info hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'displayName',
			label: 'display name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'exactLength',
			label: 'exact length',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'trackers',
			label: 'trackers',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'webSeeds',
			label: 'Web seeds',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'acceptableSources',
			label: 'acceptable sources',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$torrent',
			label: 'torrent',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BitTorrentMetainfo,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$resolutionTimestamps',
			label: 'resolution timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MagnetResolution_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

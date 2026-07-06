// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BitTorrentAnnounce_TimestampSelector {
	TorrentTrackerTimestampMsSource = 'TorrentTrackerTimestampMsSource',
}
export default {
	entityType: EntityType.BitTorrentAnnounce_Timestamp,
	label: 'bit torrent announce timestamp',
	labelPlural: 'bit torrent announce observations',
	selectors: [
		{
			name: BitTorrentAnnounce_TimestampSelector.TorrentTrackerTimestampMsSource,
			fields: [
				'$torrent',
				'$tracker',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$torrent',
			label: 'torrent',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BitTorrentMetainfo,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$tracker',
			label: 'tracker',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BitTorrentTracker,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'seeders',
			label: 'seeders',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'leechers',
			label: 'leechers',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'downloaded',
			label: 'downloaded',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'intervalSec',
			label: 'interval sec',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'status',
			label: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'error',
			label: 'error',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

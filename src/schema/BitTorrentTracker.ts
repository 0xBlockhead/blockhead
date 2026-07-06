// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BitTorrentTrackerSelector {
	TrackerUrl = 'TrackerUrl',
}
export default {
	entityType: EntityType.BitTorrentTracker,
	label: 'bit torrent tracker',
	labelPlural: 'bit torrent trackers',
	selectors: [
		{
			name: BitTorrentTrackerSelector.TrackerUrl,
			fields: [
				'trackerUrl',
			],
		},
	],
	fields: [
		{
			name: 'trackerUrl',
			label: 'tracker URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'trackerKind',
			label: 'tracker kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$announces',
			label: 'announces',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BitTorrentAnnounce_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$scrapes',
			label: 'scrapes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BitTorrentTrackerScrape_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

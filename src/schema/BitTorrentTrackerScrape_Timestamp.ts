// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BitTorrentTrackerScrape_TimestampSelector {
	TrackerInfoHashTimestampMsSource = 'TrackerInfoHashTimestampMsSource',
}
export default {
	entityType: EntityType.BitTorrentTrackerScrape_Timestamp,
	label: 'bit torrent tracker scrape timestamp',
	labelPlural: 'bit torrent tracker scrape observations',
	selectors: [
		{
			name: BitTorrentTrackerScrape_TimestampSelector.TrackerInfoHashTimestampMsSource,
			fields: [
				'$tracker',
				'infoHash',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$tracker',
				label: 'tracker',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BitTorrentTracker,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'infoHash',
				label: 'info hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
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
				name: 'complete',
				label: 'complete',
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
				name: 'incomplete',
				label: 'incomplete',
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

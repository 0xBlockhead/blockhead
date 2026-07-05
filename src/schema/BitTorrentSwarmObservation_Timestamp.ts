// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BitTorrentSwarmObservation_TimestampSelector {
	TorrentTimestampMsSource = 'TorrentTimestampMsSource',
}
export default {
	entityType: EntityType.BitTorrentSwarmObservation_Timestamp,
	label: 'bit torrent swarm observation timestamp',
	labelPlural: 'bit torrent swarm observations',
	selectors: [
		{
			name: BitTorrentSwarmObservation_TimestampSelector.TorrentTimestampMsSource,
			fields: [
				'$torrent',
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
				name: 'peerCount',
				label: 'peer count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'seedCount',
				label: 'seed count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'completedCount',
				label: 'completed count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'availability',
				label: 'availability',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

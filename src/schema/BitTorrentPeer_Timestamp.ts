// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BitTorrentPeer_TimestampSelector {
	TorrentPeerIdTimestampMsSource = 'TorrentPeerIdTimestampMsSource',
}
export default {
	entityType: EntityType.BitTorrentPeer_Timestamp,
	label: 'bit torrent peer timestamp',
	labelPlural: 'bit torrent peer observations',
	selectors: [
		{
			name: BitTorrentPeer_TimestampSelector.TorrentPeerIdTimestampMsSource,
			fields: [
				'$torrent',
				'peerId',
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
			name: 'peerId',
			label: 'peer ID',
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
			name: 'address',
			label: 'Address',
			description: 'The address or account identifier used by the source protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'port',
			label: 'port',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'client',
			label: 'client',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'completedPercent',
			label: 'completed percent',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'supportsDht',
			label: 'supports DHT',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'supportsPex',
			label: 'supports pex',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

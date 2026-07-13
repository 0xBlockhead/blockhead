// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadBitTorrentClientState_TimestampSelector {
	ClientStateTimestampMsSource = 'ClientStateTimestampMsSource',
}
export const BlockheadBitTorrentClientState_Timestamp = entity({
	entityType: EntityType.BlockheadBitTorrentClientState_Timestamp,
	labels: {
		singular: 'blockhead bit torrent client state timestamp',
		plural: 'blockhead bit torrent client state observations',
	},
})({
	$clientState: {
		label: 'client state',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadBitTorrentClientState,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	clientVersion: {
		label: 'client version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	listenAddresses: {
		label: 'listen addresses',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	port: {
		label: 'port',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	downloadRate: {
		label: 'download rate',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	uploadRate: {
		label: 'upload rate',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	downloadedBytes: {
		label: 'downloaded bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	uploadedBytes: {
		label: 'uploaded bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	activeTorrentCount: {
		label: 'active torrent count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lastSyncedAt: {
		label: 'last synced AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ClientStateTimestampMsSource: [
			'$clientState',
			'timestampMs',
			'source',
		],
	},
})

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BitTorrentMetainfoSelector {
	InfoHashHashVersion = 'InfoHashHashVersion',
}
export default {
	entityType: EntityType.BitTorrentMetainfo,
	label: 'bit torrent metainfo',
	labelPlural: 'bit torrent metainfos',
	selectors: [
		{
			name: BitTorrentMetainfoSelector.InfoHashHashVersion,
			fields: [
				'infoHash',
				'hashVersion',
			],
		},
	],
	fields: [
		{
			name: 'infoHash',
			label: 'info hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hashVersion',
			label: 'hash version',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'infoHashV1',
			label: 'info hash v1',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'infoHashV2',
			label: 'info hash v2',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'metainfoHash',
			label: 'metainfo hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'bencodedInfoHash',
			label: 'bencoded info hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'pieceLength',
			label: 'piece length',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'totalLength',
			label: 'total length',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'private',
			label: 'private',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$files',
			label: 'files',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BitTorrentFile,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$fileTreeEntries',
			label: 'file tree entries',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BitTorrentFileTreeEntry,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$pieces',
			label: 'pieces',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BitTorrentPiece,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$trackers',
			label: 'trackers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BitTorrentTracker,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$magnets',
			label: 'magnets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MagnetLink,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$swarmTimestamps',
			label: 'swarm timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BitTorrentSwarmObservation_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$clientTransfers',
			label: 'client transfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadBitTorrentTransfer_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

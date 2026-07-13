// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BitTorrentMetainfoSelector {
	InfoHashHashVersion = 'InfoHashHashVersion',
}
export const BitTorrentMetainfo = entity({
	entityType: EntityType.BitTorrentMetainfo,
	labels: {
		singular: 'bit torrent metainfo',
		plural: 'bit torrent metainfos',
	},
})({
	infoHash: {
		label: 'info hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	hashVersion: {
		label: 'hash version',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	infoHashV1: {
		label: 'info hash v1',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	infoHashV2: {
		label: 'info hash v2',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metainfoHash: {
		label: 'metainfo hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bencodedInfoHash: {
		label: 'bencoded info hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pieceLength: {
		label: 'piece length',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalLength: {
		label: 'total length',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	private: {
		label: 'private',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$files: {
		label: 'files',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BitTorrentFile,
		cardinality: EntityFieldCardinality.Many,
	},
	$$fileTreeEntries: {
		label: 'file tree entries',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BitTorrentFileTreeEntry,
		cardinality: EntityFieldCardinality.Many,
	},
	$$pieces: {
		label: 'pieces',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BitTorrentPiece,
		cardinality: EntityFieldCardinality.Many,
	},
	$$trackers: {
		label: 'trackers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BitTorrentTracker,
		cardinality: EntityFieldCardinality.Many,
	},
	$$magnets: {
		label: 'magnets',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.MagnetLink,
		cardinality: EntityFieldCardinality.Many,
	},
	$$swarmTimestamps: {
		label: 'swarm timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BitTorrentSwarmObservation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$clientTransfers: {
		label: 'client transfers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadBitTorrentTransfer_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		InfoHashHashVersion: [
			'infoHash',
			'hashVersion',
		],
	},
})

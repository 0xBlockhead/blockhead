// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BitTorrentMetainfo,
	labels: {
		singular: 'bit torrent metainfo',
		plural: 'bit torrent metainfos',
	},
})({
	infoHash: {
		label: 'info hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	hashVersion: {
		label: 'hash version',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	infoHashV1: {
		label: 'info hash v1',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	infoHashV2: {
		label: 'info hash v2',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metainfoHash: {
		label: 'metainfo hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bencodedInfoHash: {
		label: 'bencoded info hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pieceLength: {
		label: 'piece length',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalLength: {
		label: 'total length',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	private: {
		label: 'private',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$files: {
		label: 'files',
		entityType: EntityType.BitTorrentFile,
		cardinality: EntityFieldCardinality.Many,
	},
	$$fileTreeEntries: {
		label: 'file tree entries',
		entityType: EntityType.BitTorrentFileTreeEntry,
		cardinality: EntityFieldCardinality.Many,
	},
	$$pieces: {
		label: 'pieces',
		entityType: EntityType.BitTorrentPiece,
		cardinality: EntityFieldCardinality.Many,
	},
	$$trackers: {
		label: 'trackers',
		entityType: EntityType.BitTorrentTracker,
		cardinality: EntityFieldCardinality.Many,
	},
	$$magnets: {
		label: 'magnets',
		entityType: EntityType.MagnetLink,
		cardinality: EntityFieldCardinality.Many,
	},
	$$swarmTimestamps: {
		label: 'swarm timestamps',
		entityType: EntityType.BitTorrentSwarmObservation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$clientTransfers: {
		label: 'client transfers',
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

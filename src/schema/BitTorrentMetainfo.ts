// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BitTorrentMetainfo,
	labels: {
		singular: 'bit torrent metainfo',
		plural: 'bit torrent metainfos',
	},
})({
	infoHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	hashVersion: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	infoHashV1: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	infoHashV2: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metainfoHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bencodedInfoHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.qBittorrentWebUi_Rest,
		],
	},
	pieceLength: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.qBittorrentWebUi_Rest,
		],
	},
	totalLength: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.qBittorrentWebUi_Rest,
		],
	},
	private: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$files: {
		entityType: EntityType.BitTorrentFile,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.qBittorrentWebUi_Rest,
		],
	},
	$$fileTreeEntries: {
		entityType: EntityType.BitTorrentFileTreeEntry,
		cardinality: EntityFieldCardinality.Many,
	},
	$$pieces: {
		entityType: EntityType.BitTorrentPiece,
		cardinality: EntityFieldCardinality.Many,
	},
	$$trackers: {
		entityType: EntityType.BitTorrentTracker,
		cardinality: EntityFieldCardinality.Many,
	},
	$$magnets: {
		entityType: EntityType.MagnetLink,
		cardinality: EntityFieldCardinality.Many,
	},
	$$swarmTimestamps: {
		entityType: EntityType.BitTorrentSwarmObservation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$clientTransfers: {
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

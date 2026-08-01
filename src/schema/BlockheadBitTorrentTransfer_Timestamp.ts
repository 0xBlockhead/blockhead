// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadBitTorrentTransfer_Timestamp,
	labels: {
		singular: 'blockhead bit torrent transfer timestamp',
		plural: 'blockhead bit torrent transfer observations',
	},
})({
	$client: {
		label: 'client',
		entityType: EntityType.BlockheadBitTorrentClientState,
		cardinality: EntityFieldCardinality.One,
	},
	$torrent: {
		label: 'torrent',
		entityType: EntityType.BitTorrentMetainfo,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	status: {
		label: 'status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	savePath: {
		label: 'save path',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	selectedFileIndexes: {
		label: 'selected file indexes',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.Many,
	},
	downloadedBytes: {
		label: 'downloaded bytes',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	uploadedBytes: {
		label: 'uploaded bytes',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	downloadRate: {
		label: 'download rate',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	uploadRate: {
		label: 'upload rate',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verifiedPieces: {
		label: 'verified pieces',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	failedPieces: {
		label: 'failed pieces',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	connectedPeerCount: {
		label: 'connected peer count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'error',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ClientTorrentTimestampMs: [
			'$client',
			'$torrent',
			'timestampMs',
		],
	},
})

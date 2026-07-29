// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadBitTorrentClientState,
		cardinality: EntityFieldCardinality.One,
	},
	$torrent: {
		label: 'torrent',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BitTorrentMetainfo,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	status: {
		label: 'status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	savePath: {
		label: 'save path',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	selectedFileIndexes: {
		label: 'selected file indexes',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.Many,
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
	verifiedPieces: {
		label: 'verified pieces',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	failedPieces: {
		label: 'failed pieces',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	connectedPeerCount: {
		label: 'connected peer count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'error',
		type: EntityFieldType.Primitive,
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

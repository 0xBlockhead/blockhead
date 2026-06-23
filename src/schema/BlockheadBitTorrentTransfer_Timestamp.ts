import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadBitTorrentTransfer_TimestampSelector {
	ClientTorrentTimestampMs = '$client+$torrent+timestampMs',
}
export default {
	entityType: EntityType.BlockheadBitTorrentTransfer_Timestamp,
	label: 'blockhead bit torrent transfer timestamp',
	labelPlural: 'blockhead bit torrent transfer observations',
	selectors: [
		{
			name: BlockheadBitTorrentTransfer_TimestampSelector.ClientTorrentTimestampMs,
			fields: [
				'$client',
				'$torrent',
				'timestampMs',
			],
		},
	],
	fields: [
		{
			name: '$client',
			label: 'client',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadBitTorrentClientState,
			cardinality: EntityFieldCardinality.One,
		},
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
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'status',
			label: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'savePath',
			label: 'save path',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'selectedFileIndexes',
			label: 'selected file indexes',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'downloadedBytes',
			label: 'downloaded bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'uploadedBytes',
			label: 'uploaded bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'downloadRate',
			label: 'download rate',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'uploadRate',
			label: 'upload rate',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'verifiedPieces',
			label: 'verified pieces',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'failedPieces',
			label: 'failed pieces',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'connectedPeerCount',
			label: 'connected peer count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'error',
			label: 'error',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

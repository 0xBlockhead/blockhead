// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BitTorrentFileSelector {
	TorrentFileIndex = 'TorrentFileIndex',
}
export default {
	entityType: EntityType.BitTorrentFile,
	label: 'bit torrent file',
	labelPlural: 'bit torrent files',
	selectors: [
		{
			name: BitTorrentFileSelector.TorrentFileIndex,
			fields: [
				'$torrent',
				'fileIndex',
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
			name: 'fileIndex',
			label: 'file index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'path',
			label: 'path',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'pathSegments',
			label: 'path segments',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'length',
			label: 'length',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'piecesRoot',
			label: 'pieces root',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'fileHash',
			label: 'file hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

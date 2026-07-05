// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BitTorrentFileTreeEntrySelector {
	TorrentPath = 'TorrentPath',
}
export default {
	entityType: EntityType.BitTorrentFileTreeEntry,
	label: 'bit torrent file tree entry',
	labelPlural: 'bit torrent file tree entries',
	selectors: [
		{
			name: BitTorrentFileTreeEntrySelector.TorrentPath,
			fields: [
				'$torrent',
				'path',
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
				name: 'entryKind',
				label: 'entry kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'length',
				label: 'length',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'piecesRoot',
				label: 'pieces root',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$file',
				label: 'file',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BitTorrentFile,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

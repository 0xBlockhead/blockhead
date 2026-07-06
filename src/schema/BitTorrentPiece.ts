// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BitTorrentPieceSelector {
	TorrentPieceIndex = 'TorrentPieceIndex',
}
export default {
	entityType: EntityType.BitTorrentPiece,
	label: 'bit torrent piece',
	labelPlural: 'bit torrent pieces',
	selectors: [
		{
			name: BitTorrentPieceSelector.TorrentPieceIndex,
			fields: [
				'$torrent',
				'pieceIndex',
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
			name: 'pieceIndex',
			label: 'piece index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'pieceHashV1',
			label: 'piece hash v1',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'pieceRootV2',
			label: 'piece root v2',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'pieceLayerHash',
			label: 'piece layer hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'length',
			label: 'length',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'offset',
			label: 'offset',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

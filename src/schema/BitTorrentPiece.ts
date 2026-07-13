// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BitTorrentPieceSelector {
	TorrentPieceIndex = 'TorrentPieceIndex',
}
export const BitTorrentPiece = entity({
	entityType: EntityType.BitTorrentPiece,
	labels: {
		singular: 'bit torrent piece',
		plural: 'bit torrent pieces',
	},
})({
	$torrent: {
		label: 'torrent',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BitTorrentMetainfo,
		cardinality: EntityFieldCardinality.One,
	},
	pieceIndex: {
		label: 'piece index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	pieceHashV1: {
		label: 'piece hash v1',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pieceRootV2: {
		label: 'piece root v2',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pieceLayerHash: {
		label: 'piece layer hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	length: {
		label: 'length',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	offset: {
		label: 'offset',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TorrentPieceIndex: [
			'$torrent',
			'pieceIndex',
		],
	},
})

// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BitTorrentPiece,
	labels: {
		singular: 'bit torrent piece',
		plural: 'bit torrent pieces',
	},
})({
	$torrent: {
		label: 'torrent',
		entityType: EntityType.BitTorrentMetainfo,
		cardinality: EntityFieldCardinality.One,
	},
	pieceIndex: {
		label: 'piece index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	pieceHashV1: {
		label: 'piece hash v1',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pieceRootV2: {
		label: 'piece root v2',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pieceLayerHash: {
		label: 'piece layer hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	length: {
		label: 'length',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	offset: {
		label: 'offset',
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

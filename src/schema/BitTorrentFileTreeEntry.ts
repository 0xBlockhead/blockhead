// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BitTorrentFileTreeEntry,
	labels: {
		singular: 'bit torrent file tree entry',
		plural: 'bit torrent file tree entries',
	},
})({
	$torrent: {
		entityType: EntityType.BitTorrentMetainfo,
		cardinality: EntityFieldCardinality.One,
	},
	path: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	pathSegments: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	entryKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	length: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	piecesRoot: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$file: {
		entityType: EntityType.BitTorrentFile,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TorrentPath: [
			'$torrent',
			'path',
		],
	},
})

// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BitTorrentFile,
	labels: {
		singular: 'bit torrent file',
		plural: 'bit torrent files',
	},
})({
	$torrent: {
		entityType: EntityType.BitTorrentMetainfo,
		cardinality: EntityFieldCardinality.One,
	},
	fileIndex: {
		primitiveType: type('number'),
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
	length: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	piecesRoot: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fileHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TorrentFileIndex: [
			'$torrent',
			'fileIndex',
		],
	},
})

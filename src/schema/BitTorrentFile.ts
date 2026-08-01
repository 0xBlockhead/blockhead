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
		label: 'torrent',
		entityType: EntityType.BitTorrentMetainfo,
		cardinality: EntityFieldCardinality.One,
	},
	fileIndex: {
		label: 'file index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	path: {
		label: 'path',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	pathSegments: {
		label: 'path segments',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	length: {
		label: 'length',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	piecesRoot: {
		label: 'pieces root',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fileHash: {
		label: 'file hash',
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

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
		label: 'torrent',
		entityType: EntityType.BitTorrentMetainfo,
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
	entryKind: {
		label: 'entry kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	length: {
		label: 'length',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	piecesRoot: {
		label: 'pieces root',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$file: {
		label: 'file',
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

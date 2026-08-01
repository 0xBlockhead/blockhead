// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CodexDataset,
	labels: {
		singular: 'codex dataset',
		plural: 'codex datasets',
	},
})({
	cid: {
		label: 'CID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	treeCid: {
		label: 'tree CID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	datasetSizeBytes: {
		label: 'dataset size bytes',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blockSizeBytes: {
		label: 'block size bytes',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	filename: {
		label: 'filename',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mimetype: {
		label: 'mimetype',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$localCopies: {
		label: 'local copies',
		entityType: EntityType.BlockheadCodexStoredData,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Cid: [
			'cid',
		],
	},
})

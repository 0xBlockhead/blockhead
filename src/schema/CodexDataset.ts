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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	treeCid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	datasetSizeBytes: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blockSizeBytes: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	filename: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mimetype: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$localCopies: {
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

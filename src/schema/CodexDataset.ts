// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	treeCid: {
		label: 'tree CID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	datasetSizeBytes: {
		label: 'dataset size bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blockSizeBytes: {
		label: 'block size bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	filename: {
		label: 'filename',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mimetype: {
		label: 'mimetype',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$localCopies: {
		label: 'local copies',
		type: EntityFieldType.EntitiesReference,
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

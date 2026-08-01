// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadCodexStoredData,
	labels: {
		singular: 'blockhead codex stored data',
		plural: 'blockhead codex stored data entries',
	},
})({
	$nodeState: {
		label: 'node state',
		entityType: EntityType.BlockheadCodexStorageNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	cid: {
		label: 'CID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$dataset: {
		label: 'dataset',
		entityType: EntityType.CodexDataset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	firstSeenAt: {
		label: 'first seen AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BlockheadCodexStoredData_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NodeStateCid: [
			'$nodeState',
			'cid',
		],
	},
})

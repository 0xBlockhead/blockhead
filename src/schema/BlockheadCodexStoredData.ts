// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadCodexStorageNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	cid: {
		label: 'CID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$dataset: {
		label: 'dataset',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CodexDataset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	firstSeenAt: {
		label: 'first seen AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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

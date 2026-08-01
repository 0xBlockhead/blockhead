// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadPanel,
	labels: {
		singular: 'panel',
		plural: 'panels',
	},
})({
	treeId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	panelId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$panelTree: {
		entityType: EntityType.BlockheadPanelTree,
		cardinality: EntityFieldCardinality.One,
	},
	parentPanelId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	indexInParent: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	kind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	entityType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	selector: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TreeIdPanelId: [
			'treeId',
			'panelId',
		],
	},
})

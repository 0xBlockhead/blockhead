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
		label: 'tree ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	panelId: {
		label: 'panel ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$panelTree: {
		label: 'panel tree',
		entityType: EntityType.BlockheadPanelTree,
		cardinality: EntityFieldCardinality.One,
	},
	parentPanelId: {
		label: 'parent panel ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	indexInParent: {
		label: 'index in parent',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	kind: {
		label: 'kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	entityType: {
		label: 'entity type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	selector: {
		label: 'selector',
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

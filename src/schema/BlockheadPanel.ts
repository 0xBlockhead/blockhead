// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadPanelSelector {
	TreeIdPanelId = 'TreeIdPanelId',
}
export const BlockheadPanel = entity({
	entityType: EntityType.BlockheadPanel,
	labels: {
		singular: 'panel',
		plural: 'panels',
	},
})({
	treeId: {
		label: 'tree ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	panelId: {
		label: 'panel ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$panelTree: {
		label: 'panel tree',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadPanelTree,
		cardinality: EntityFieldCardinality.One,
	},
	parentPanelId: {
		label: 'parent panel ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	indexInParent: {
		label: 'index in parent',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	kind: {
		label: 'kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	entityType: {
		label: 'entity type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	selector: {
		label: 'selector',
		type: EntityFieldType.Primitive,
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

// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadWorkspaceSelector {
	Id = 'Id',
}
export const BlockheadWorkspace = entity({
	entityType: EntityType.BlockheadWorkspace,
	labels: {
		singular: 'workspace',
		plural: 'workspaces',
	},
})({
	id: {
		label: 'ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$activePanelTree: {
		label: 'active panel tree',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadPanelTree,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subject was created according to the source.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	updatedAt: {
		label: 'Updated',
		description: 'The time when the subject was last updated according to the source.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})

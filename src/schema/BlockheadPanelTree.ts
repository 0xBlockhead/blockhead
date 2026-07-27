// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadPanelTree,
	labels: {
		singular: 'dashboard',
		plural: 'dashboards',
	},
})({
	id: {
		label: 'ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$workspace: {
		label: 'workspace',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadWorkspace,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$panels: {
		label: 'panels',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadPanel,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})

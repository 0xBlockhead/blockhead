// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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

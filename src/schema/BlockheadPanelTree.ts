// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$workspace: {
		entityType: EntityType.BlockheadWorkspace,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$panels: {
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

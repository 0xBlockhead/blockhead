// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SuiObject,
	labels: {
		singular: 'sui object',
		plural: 'sui objects',
	},
})({
	$network: {
		entityType: EntityType.SuiNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	objectId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$versions: {
		entityType: EntityType.SuiObjectVersion,
		cardinality: EntityFieldCardinality.Many,
	},
	$$dynamicFields: {
		entityType: EntityType.SuiDynamicFieldEdge,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkObjectId: [
			'$network',
			'objectId',
		],
	},
})

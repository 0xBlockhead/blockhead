// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SuiNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	objectId: {
		label: 'object ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$versions: {
		label: 'versions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SuiObjectVersion,
		cardinality: EntityFieldCardinality.Many,
	},
	$$dynamicFields: {
		label: 'dynamic fields',
		type: EntityFieldType.EntitiesReference,
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

// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SuiObjectSelector {
	NetworkObjectId = 'NetworkObjectId',
}
export const SuiObject = entity({
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

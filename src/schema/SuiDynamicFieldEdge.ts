// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SuiDynamicFieldEdge,
	labels: {
		singular: 'sui dynamic field edge',
		plural: 'sui dynamic field edges',
	},
})({
	$parentObject: {
		entityType: EntityType.SuiObject,
		cardinality: EntityFieldCardinality.One,
	},
	fieldNameHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	childObjectId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fieldName: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.SuiDynamicFieldEdge_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ParentObjectFieldNameHashChildObjectId: [
			'$parentObject',
			'fieldNameHash',
			'childObjectId',
		],
	},
})

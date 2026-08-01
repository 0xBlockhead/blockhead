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
		label: 'parent object',
		entityType: EntityType.SuiObject,
		cardinality: EntityFieldCardinality.One,
	},
	fieldNameHash: {
		label: 'field name hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	childObjectId: {
		label: 'child object ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fieldName: {
		label: 'field name',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
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

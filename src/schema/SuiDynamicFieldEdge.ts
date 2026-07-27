// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SuiObject,
		cardinality: EntityFieldCardinality.One,
	},
	fieldNameHash: {
		label: 'field name hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	childObjectId: {
		label: 'child object ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fieldName: {
		label: 'field name',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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

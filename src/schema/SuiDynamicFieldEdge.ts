// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SuiDynamicFieldEdgeSelector {
	ParentObjectFieldNameHashChildObjectId = 'ParentObjectFieldNameHashChildObjectId',
}
export default {
	entityType: EntityType.SuiDynamicFieldEdge,
	label: 'sui dynamic field edge',
	labelPlural: 'sui dynamic field edges',
	selectors: [
		{
			name: SuiDynamicFieldEdgeSelector.ParentObjectFieldNameHashChildObjectId,
			fields: [
				'$parentObject',
				'fieldNameHash',
				'childObjectId',
			],
		},
	],
	fields: [
		{
				name: '$parentObject',
				label: 'parent object',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.SuiObject,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'fieldNameHash',
				label: 'field name hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'childObjectId',
				label: 'child object ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'fieldName',
				label: 'field name',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SuiDynamicFieldEdge_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

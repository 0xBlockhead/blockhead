// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SuiObjectSelector {
	NetworkObjectId = 'NetworkObjectId',
}
export default {
	entityType: EntityType.SuiObject,
	label: 'sui object',
	labelPlural: 'sui objects',
	selectors: [
		{
			name: SuiObjectSelector.NetworkObjectId,
			fields: [
				'$network',
				'objectId',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.SuiNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'objectId',
				label: 'object ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$versions',
				label: 'versions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SuiObjectVersion,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$dynamicFields',
				label: 'dynamic fields',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SuiDynamicFieldEdge,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

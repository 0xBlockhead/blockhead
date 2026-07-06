// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AptosAccountResourceSelector {
	AccountResourceType = 'AccountResourceType',
}
export default {
	entityType: EntityType.AptosAccountResource,
	label: 'aptos account resource',
	labelPlural: 'aptos account resources',
	selectors: [
		{
			name: AptosAccountResourceSelector.AccountResourceType,
			fields: [
				'$account',
				'resourceType',
			],
		},
	],
	fields: [
		{
			name: '$account',
			label: 'account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AptosAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'resourceType',
			label: 'resource type',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AptosAccountResource_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

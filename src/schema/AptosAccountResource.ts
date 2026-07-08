// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AptosAccountResourceSelector {
	AccountResourceType = 'AccountResourceType',
}
export const AptosAccountResource = entity({
	entityType: EntityType.AptosAccountResource,
	label: 'aptos account resource',
	labelPlural: 'aptos account resources',
})({
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AptosAccount,
		cardinality: EntityFieldCardinality.One,
	},
	resourceType: {
		label: 'resource type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AptosAccountResource_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		AccountResourceType: [
			'$account',
			'resourceType',
		],
	},
})

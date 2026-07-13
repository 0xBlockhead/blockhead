// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IcpCanisterMethodSelector {
	CanisterMethodNameMethodKind = 'CanisterMethodNameMethodKind',
}
export const IcpCanisterMethod = entity({
	entityType: EntityType.IcpCanisterMethod,
	labels: {
		singular: 'icp canister method',
		plural: 'icp canister methods',
	},
})({
	$canister: {
		label: 'canister',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.IcpCanister,
		cardinality: EntityFieldCardinality.One,
	},
	methodName: {
		label: 'method name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	methodKind: {
		label: 'method kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.IcpCanisterMethod_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		CanisterMethodNameMethodKind: [
			'$canister',
			'methodName',
			'methodKind',
		],
	},
})

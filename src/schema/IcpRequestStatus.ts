// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IcpRequestStatusSelector {
	NetworkRequestId = 'NetworkRequestId',
}
export const IcpRequestStatus = entity({
	entityType: EntityType.IcpRequestStatus,
	labels: {
		singular: 'icp request status',
		plural: 'icp request statuses',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.IcpNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	requestId: {
		label: 'request ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$canister: {
		label: 'canister',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.IcpCanister,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	methodName: {
		label: 'method name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestKind: {
		label: 'request kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	callerPrincipal: {
		label: 'caller principal',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ingressExpiryNs: {
		label: 'ingress expiry ns',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.IcpRequestStatus_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkRequestId: [
			'$network',
			'requestId',
		],
	},
})

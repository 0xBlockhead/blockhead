// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IcpRequestStatus,
	labels: {
		singular: 'icp request status',
		plural: 'icp request statuses',
	},
})({
	$network: {
		entityType: EntityType.IcpNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	requestId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$canister: {
		entityType: EntityType.IcpCanister,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	methodName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	callerPrincipal: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ingressExpiryNs: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
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

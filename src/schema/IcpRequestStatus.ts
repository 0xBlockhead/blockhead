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
		label: 'network',
		entityType: EntityType.IcpNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	requestId: {
		label: 'request ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$canister: {
		label: 'canister',
		entityType: EntityType.IcpCanister,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	methodName: {
		label: 'method name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestKind: {
		label: 'request kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	callerPrincipal: {
		label: 'caller principal',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ingressExpiryNs: {
		label: 'ingress expiry ns',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
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

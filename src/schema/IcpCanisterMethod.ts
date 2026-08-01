// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IcpCanisterMethod,
	labels: {
		singular: 'icp canister method',
		plural: 'icp canister methods',
	},
})({
	$canister: {
		entityType: EntityType.IcpCanister,
		cardinality: EntityFieldCardinality.One,
	},
	methodName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	methodKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
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

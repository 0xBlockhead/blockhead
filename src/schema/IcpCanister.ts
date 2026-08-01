// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IcpCanister,
	labels: {
		singular: 'icp canister',
		plural: 'icp canisters',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.IcpNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	canisterId: {
		label: 'canister ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$methods: {
		label: 'methods',
		entityType: EntityType.IcpCanisterMethod,
		cardinality: EntityFieldCardinality.Many,
	},
	$$metadata: {
		entityType: EntityType.IcpCanisterMetadata,
		cardinality: EntityFieldCardinality.Many,
	},
	$$logs: {
		label: 'logs',
		entityType: EntityType.IcpCanisterLog_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$certifiedStates: {
		label: 'certified states',
		entityType: EntityType.IcpCertifiedState,
		cardinality: EntityFieldCardinality.Many,
	},
	$$requestStatuses: {
		label: 'request statuses',
		entityType: EntityType.IcpRequestStatus,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.IcpCanister_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkCanisterId: [
			'$network',
			'canisterId',
		],
	},
})

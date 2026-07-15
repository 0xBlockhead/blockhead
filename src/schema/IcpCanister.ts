// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IcpCanisterSelector {
	NetworkCanisterId = 'NetworkCanisterId',
}
export const IcpCanister = entity({
	entityType: EntityType.IcpCanister,
	labels: {
		singular: 'icp canister',
		plural: 'icp canisters',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.IcpNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	canisterId: {
		label: 'canister ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$methods: {
		label: 'methods',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.IcpCanisterMethod,
		cardinality: EntityFieldCardinality.Many,
	},
	$$metadata: {
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.IcpCanisterMetadata,
		cardinality: EntityFieldCardinality.Many,
	},
	$$logs: {
		label: 'logs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.IcpCanisterLog_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$certifiedStates: {
		label: 'certified states',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.IcpCertifiedState,
		cardinality: EntityFieldCardinality.Many,
	},
	$$requestStatuses: {
		label: 'request statuses',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.IcpRequestStatus,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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

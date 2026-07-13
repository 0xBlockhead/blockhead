// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IcpNetworkSelector {
	Network = 'Network',
}
export const IcpNetwork = entity({
	entityType: EntityType.IcpNetwork,
	labels: {
		singular: 'icp network',
		plural: 'icp networks',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$subnets: {
		label: 'subnets',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.IcpSubnet,
		cardinality: EntityFieldCardinality.Many,
	},
	$$canisters: {
		label: 'canisters',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.IcpCanister,
		cardinality: EntityFieldCardinality.Many,
	},
	$$ledgerCanisters: {
		label: 'ledger canisters',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.IcpLedgerCanister,
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
		entityType: EntityType.IcpNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})

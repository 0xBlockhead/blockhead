// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
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

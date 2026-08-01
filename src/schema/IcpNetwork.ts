// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$subnets: {
		label: 'subnets',
		entityType: EntityType.IcpSubnet,
		cardinality: EntityFieldCardinality.Many,
	},
	$$canisters: {
		label: 'canisters',
		entityType: EntityType.IcpCanister,
		cardinality: EntityFieldCardinality.Many,
	},
	$$ledgerCanisters: {
		label: 'ledger canisters',
		entityType: EntityType.IcpLedgerCanister,
		cardinality: EntityFieldCardinality.Many,
	},
	$$requestStatuses: {
		label: 'request statuses',
		entityType: EntityType.IcpRequestStatus,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
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

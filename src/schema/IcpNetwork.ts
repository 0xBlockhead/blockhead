// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'

export default entity({
	entityType: EntityType.IcpNetwork,
	labels: {
		singular: 'icp network',
		plural: 'icp networks',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$subnets: {
		entityType: EntityType.IcpSubnet,
		cardinality: EntityFieldCardinality.Many,
	},
	$$canisters: {
		entityType: EntityType.IcpCanister,
		cardinality: EntityFieldCardinality.Many,
	},
	$$ledgerCanisters: {
		entityType: EntityType.IcpLedgerCanister,
		cardinality: EntityFieldCardinality.Many,
	},
	$$requestStatuses: {
		entityType: EntityType.IcpRequestStatus,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
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

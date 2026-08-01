// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IcpSubnet,
	labels: {
		singular: 'icp subnet',
		plural: 'icp subnets',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.IcpNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	subnetId: {
		label: 'subnet ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$canisterRanges: {
		label: 'canister ranges',
		entityType: EntityType.IcpSubnetCanisterRange_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$canisters: {
		label: 'canisters',
		entityType: EntityType.IcpCanister,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.IcpSubnet_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkSubnetId: [
			'$network',
			'subnetId',
		],
	},
})

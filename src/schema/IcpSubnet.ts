// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.IcpNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	subnetId: {
		label: 'subnet ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$canisterRanges: {
		label: 'canister ranges',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.IcpSubnetCanisterRange_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$canisters: {
		label: 'canisters',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.IcpCanister,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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

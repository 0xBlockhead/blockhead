// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IcpSubnetSelector {
	NetworkSubnetId = 'NetworkSubnetId',
}
export const IcpSubnet = entity({
	entityType: EntityType.IcpSubnet,
	label: 'icp subnet',
	labelPlural: 'icp subnets',
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

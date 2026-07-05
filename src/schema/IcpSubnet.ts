// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IcpSubnetSelector {
	NetworkSubnetId = 'NetworkSubnetId',
}
export default {
	entityType: EntityType.IcpSubnet,
	label: 'icp subnet',
	labelPlural: 'icp subnets',
	selectors: [
		{
			name: IcpSubnetSelector.NetworkSubnetId,
			fields: [
				'$network',
				'subnetId',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.IcpNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'subnetId',
				label: 'subnet ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$canisterRanges',
				label: 'canister ranges',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.IcpSubnetCanisterRange_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$canisters',
				label: 'canisters',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.IcpCanister,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.IcpSubnet_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

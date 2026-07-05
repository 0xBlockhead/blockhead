// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IcpNetworkSelector {
	Network = 'Network',
}
export default {
	entityType: EntityType.IcpNetwork,
	label: 'icp network',
	labelPlural: 'icp networks',
	selectors: [
		{
			name: IcpNetworkSelector.Network,
			fields: [
				'$network',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$subnets',
				label: 'subnets',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.IcpSubnet,
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
				name: '$ledgerCanisters',
				label: 'ledger canisters',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.IcpLedgerCanister,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$requestStatuses',
				label: 'request statuses',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.IcpRequestStatus,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.IcpNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

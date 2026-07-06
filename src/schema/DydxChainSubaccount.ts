// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum DydxChainSubaccountSelector {
	NetworkAccountSubaccountNumber = 'NetworkAccountSubaccountNumber',
}
export default {
	entityType: EntityType.DydxChainSubaccount,
	label: 'dydx chain subaccount',
	labelPlural: 'dydx chain subaccounts',
	selectors: [
		{
			name: DydxChainSubaccountSelector.NetworkAccountSubaccountNumber,
			fields: [
				'$network',
				'$account',
				'subaccountNumber',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.DydxChainNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$account',
			label: 'account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'subaccountNumber',
			label: 'subaccount number',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$positions',
			label: 'positions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.DydxChainPerpetualPosition_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$orders',
			label: 'orders',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.DydxChainOrder,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.DydxChainSubaccount_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

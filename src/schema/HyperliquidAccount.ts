// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HyperliquidAccountSelector {
	NetworkAddress = 'NetworkAddress',
}
export default {
	entityType: EntityType.HyperliquidAccount,
	label: 'hyperliquid account',
	labelPlural: 'hyperliquid accounts',
	selectors: [
		{
			name: HyperliquidAccountSelector.NetworkAddress,
			fields: [
				'$network',
				'address',
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
				name: 'address',
				label: 'Address',
				description: 'The address or account identifier used by the source protocol.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'accountRole',
				label: 'account role',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$masterAccount',
				label: 'master account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HyperliquidAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$agentAccount',
				label: 'agent account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HyperliquidAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidAccount_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$orders',
				label: 'orders',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidOrder,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$fills',
				label: 'fills',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidFill,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$vaultEquities',
				label: 'vault equities',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidVaultEquity_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

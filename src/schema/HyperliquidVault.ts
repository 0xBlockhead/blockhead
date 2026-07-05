// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HyperliquidVaultSelector {
	NetworkVaultAddress = 'NetworkVaultAddress',
}
export default {
	entityType: EntityType.HyperliquidVault,
	label: 'hyperliquid vault',
	labelPlural: 'hyperliquid vaults',
	selectors: [
		{
			name: HyperliquidVaultSelector.NetworkVaultAddress,
			fields: [
				'$network',
				'vaultAddress',
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
				name: 'vaultAddress',
				label: 'vault address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$leader',
				label: 'leader',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.HyperliquidAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$equities',
				label: 'equities',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidVaultEquity_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidVault_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

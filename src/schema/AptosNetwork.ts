// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AptosNetworkSelector {
	Network = 'Network',
}
export default {
	entityType: EntityType.AptosNetwork,
	label: 'aptos network',
	labelPlural: 'aptos networks',
	selectors: [
		{
			name: AptosNetworkSelector.Network,
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
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AptosNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$blocks',
			label: 'blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AptosBlock,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AptosTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$accounts',
			label: 'accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AptosAccount,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$modules',
			label: 'modules',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MoveModule,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$events',
			label: 'events',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AptosEvent,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$coinBalanceTimestamps',
			label: 'coin balance timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AptosCoinBalance_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

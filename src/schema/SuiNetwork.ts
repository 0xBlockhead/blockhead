// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SuiNetworkSelector {
	Network = 'Network',
}
export default {
	entityType: EntityType.SuiNetwork,
	label: 'sui network',
	labelPlural: 'sui networks',
	selectors: [
		{
			name: SuiNetworkSelector.Network,
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
				name: '$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SuiNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$checkpoints',
				label: 'checkpoints',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SuiCheckpoint,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$transactions',
				label: 'transactions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SuiTransaction,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$accounts',
				label: 'accounts',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SuiAccount,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$objects',
				label: 'objects',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SuiObject,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$packages',
				label: 'packages',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SuiPackage,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$coinTypes',
				label: 'coin types',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SuiCoinType,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$coinBalanceTimestamps',
				label: 'coin balance timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.SuiCoinBalance_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

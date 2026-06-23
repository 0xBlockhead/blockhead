import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum StellarNetworkSelector {
	Network = '$network',
}
export default {
	entityType: EntityType.StellarNetwork,
	label: 'stellar network',
	labelPlural: 'stellar networks',
	selectors: [
		{
			name: StellarNetworkSelector.Network,
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
			name: 'passphrase',
			label: 'passphrase',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$ledgers',
			label: 'ledgers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StellarLedger,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StellarTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$operations',
			label: 'operations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StellarOperation,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$accounts',
			label: 'accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StellarAccount,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$assets',
			label: 'assets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StellarAsset,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$claimableBalances',
			label: 'claimable balances',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StellarClaimableBalance,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$contracts',
			label: 'contracts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SorobanContract,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$liquidityPools',
			label: 'liquidity pools',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StellarLiquidityPool,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$offers',
			label: 'offers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StellarOffer,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$trades',
			label: 'trades',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StellarTrade,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StellarNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

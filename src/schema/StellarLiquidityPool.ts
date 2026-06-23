import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum StellarLiquidityPoolSelector {
	NetworkLiquidityPoolId = '$network+liquidityPoolId',
}
export default {
	entityType: EntityType.StellarLiquidityPool,
	label: 'stellar liquidity pool',
	labelPlural: 'stellar liquidity pools',
	selectors: [
		{
			name: StellarLiquidityPoolSelector.NetworkLiquidityPoolId,
			fields: [
				'$network',
				'liquidityPoolId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'liquidityPoolId',
			label: 'liquidity pool ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'poolType',
			label: 'pool type',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$assetA',
			label: 'asset a',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarAsset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$assetB',
			label: 'asset b',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StellarAsset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'feeBps',
			label: 'fee bps',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StellarLiquidityPool_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

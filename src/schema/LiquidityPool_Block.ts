import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum LiquidityPool_BlockSelector {
	LiquidityPoolBlockNumber = 'liquidityPoolBlockNumber',
}
export default {
	entityType: EntityType.LiquidityPool_Block,
	label: 'liquidity pool block',
	labelPlural: 'liquidity pool blocks',
	selectors: [
		{
			name: LiquidityPool_BlockSelector.LiquidityPoolBlockNumber,
			fields: [
				'$liquidityPool',
				'blockNumber',
			],
		},
	],
	fields: [
		{
			name: '$liquidityPool',
			label: 'liquidity pool',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LiquidityPool,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'blockNumber',
			label: 'Block number',
			description: 'The block height or number in its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$parentLiquidityPool',
			label: 'parent liquidity pool',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LiquidityPool,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'sqrtPriceX96',
			label: 'sqrt price x96',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'liquidity',
			label: 'liquidity',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tick',
			label: 'tick',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'observationIndex',
			label: 'observation index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'observationCardinality',
			label: 'observation cardinality',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'observationCardinalityNext',
			label: 'observation cardinality next',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'feeProtocol',
			label: 'fee protocol',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'unlocked',
			label: 'unlocked',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

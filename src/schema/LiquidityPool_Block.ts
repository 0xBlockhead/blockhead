// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum LiquidityPool_BlockSelector {
	LiquidityPoolBlockNumber = 'LiquidityPoolBlockNumber',
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
			label: 'Liquidity pool',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LiquidityPool,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'blockNumber',
			label: 'Block number',
			description: 'The block height or number in its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$parentLiquidityPool',
			label: 'Parent liquidity pool',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LiquidityPool,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
		{
			name: 'sqrtPriceX96',
			label: 'Sqrt price X96',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'liquidity',
			label: 'Liquidity',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tick',
			label: 'Tick',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'observationIndex',
			label: 'Observation index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'observationCardinality',
			label: 'Observation cardinality',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'observationCardinalityNext',
			label: 'Observation cardinality next',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'feeProtocol',
			label: 'Fee protocol',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'unlocked',
			label: 'Unlocked',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
